import { useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

const useGetAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<{
    city: string;
    state: string;
    country: string;
    coordinates: [number, number];
    formattedAddress: string;
  } | null>(null);

  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API;

  const getCityComponent = (components: any[]) => {
    const cityTypes = [
      'locality',
      'administrative_area_level_2',
      'administrative_area_level_3',
      'postal_town',
      'neighborhood'
    ];

    for (const type of cityTypes) {
      const component = components.find(c => c.types.includes(type));
      if (component) return component.long_name;
    }
    return 'Unknown City';
  };

  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  };

  const getAddress = async () => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        throw new Error("Location permission denied");
      }
      console.log("started fetching location...")
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        console.log("Got results of location.")
        
        const data = await response.json();
        
        if (data.status !== "OK") {
            throw new Error("Location service unavailable");
        }

      const addressComponents = data.results[0]?.address_components || [];
      const city = getCityComponent(addressComponents);
      const state = addressComponents.find((c :any) => 
        c.types.includes('administrative_area_level_1')
      )?.long_name || 'Unknown State';
      const country = addressComponents.find((c : any) => 
        c.types.includes('country')
      )?.long_name || 'Unknown Country';

      const formattedAddress = `${city}, ${state}, ${country}`;

      const addressData = {
        city,
        state,
        country,
        coordinates: [longitude, latitude] as [number, number],
        formattedAddress
      };

      setAddress(addressData);
      console.log("location set!")
      return addressData;


    } catch (error: any) {
      setError(error?.message || "Failed to get location");
    //   Alert.alert("Location Error", error?.message || "Couldn't determine your location");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    address,
    getAddress
  };
};

export default useGetAddress;