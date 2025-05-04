import { useState } from 'react';
import * as Location from 'expo-location';

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API;

const useGetAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<any>(null);

  const getAddress = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = location.coords;

      // Reverse geocode the coordinates to get address details
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const addressResult = data.results[0];
        const addressComponents = addressResult.address_components;
        
        // Extract city, state, and country from address components
        const getComponent = (type: string) => {
          return addressComponents.find((c: any) => c.types.includes(type))?.long_name || '';
        };

        const city = 
          getComponent('locality') || 
          getComponent('administrative_area_level_2') || 
          getComponent('postal_town') || 
          'Unknown City';
          
        const state = getComponent('administrative_area_level_1') || 'Unknown State';
        const country = getComponent('country') || 'Unknown Country';

        // Create formatted address object
        const addressData = {
          city,
          state,
          country,
          coordinates: [longitude, latitude] as [number, number],
          formattedAddress: addressResult.formatted_address,
        };

        setAddress(addressData);
      } else {
        setError('Could not determine your address');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
      console.error('Error getting location:', err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, address, getAddress };
};

export default useGetAddress;