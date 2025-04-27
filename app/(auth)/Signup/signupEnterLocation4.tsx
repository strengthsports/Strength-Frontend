import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { setAddress } from "~/reduxStore/slices/user/onboardingSlice";
import useGetAddress from "@/hooks/useGetAddress";
import { Vibration, ToastAndroid, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { vibrationPattern } from "~/constants/vibrationPattern";
import debounce from "lodash";

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API;

const signupEnterLocation4 = () => {
  const [addressPickup, setAddressPickup] = useState("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, address, getAddress } = useGetAddress();

  const isAndroid = Platform.OS === "android";

  const feedback = (message: string, type: "error" | "success" = "error") => {
    if (type === "error") {
      Vibration.vibrate(vibrationPattern);
      isAndroid
        ? ToastAndroid.show(message, ToastAndroid.SHORT)
        : Toast.show({
            type,
            text1: message,
            visibilityTime: 3000,
            autoHide: true,
          });
    } else {
      Toast.show({
        type,
        text1: message,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  // Debounced function for getting place predictions
  const getPlacePredictions = useRef(
    debounce(async (text: string) => {
      if (!text) {
        setPredictions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            text
          )}&key=${apiKey}&components=country:in`
        );
        const data = await response.json();
        if (data.status === "OK") {
          setPredictions(data.predictions);
        } else {
          setPredictions([]);
        }
      } catch (error) {
        console.error("Error fetching place predictions:", error);
        setPredictions([]);
      }
    }, 300)
  );

  // Handle text input changes
  const handleAddressChange = (text: string) => {
    setAddressPickup(text);
    setShowSuggestions(true);
    getPlacePredictions.current(text);
  };

  // Handle place selection from suggestions
  const handlePlaceSelect = async (place: any) => {
    try {
      setShowSuggestions(false);
      setAddressPickup(place.description);
      setPredictions([]);

      // Get place details
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const result = data.result;
        const location = result.geometry.location;
        const addressComponents = result.address_components || [];

        const getComponent = (type: string) => {
          return (
            addressComponents.find((c: any) => c.types.includes(type))
              ?.long_name || ""
          );
        };

        const city =
          getComponent("locality") ||
          getComponent("administrative_area_level_2") ||
          getComponent("postal_town") ||
          "Unknown City";
        const state =
          getComponent("administrative_area_level_1") || "Unknown State";
        const country = getComponent("country") || "Unknown Country";

        const addressData = {
          city,
          state,
          country,
          coordinates: [location.lng, location.lat] as [number, number],
          formattedAddress: place.description,
        };

        setSelectedPlace(addressData);
        dispatch(
          setAddress({
            city,
            state,
            country,
            location: {
              coordinates: [location.lng, location.lat],
            },
          })
        );
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      feedback("Failed to get place details", "error");
    }
  };

  // Sync address with local state and Redux when using current location
  useEffect(() => {
    if (address) {
      setAddressPickup(address.formattedAddress);
      setSelectedPlace(address);
      dispatch(
        setAddress({
          city: address.city,
          state: address.state,
          country: address.country,
          location: {
            coordinates: address.coordinates,
          },
        })
      );
    }
  }, [address]);

  // Handle error changes
  useEffect(() => {
    if (error) {
      feedback(error);
    }
  }, [error]);

  const handleNext = () => {
    if (!selectedPlace && !address) {
      feedback(
        "Please enter a valid location or use the current location.",
        "error"
      );
      return;
    }
    feedback("Address Successfully Set", "success");
    router.push("/Signup/signupSetPassword5");
  };

  return (
    <PageThemeView>
      <View style={{ marginTop: 80 }}>
        <Logo />
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View style={{ marginTop: 55 }}>
          <TextScallingFalse
            style={{ color: "white", fontSize: 23, fontWeight: "500" }}
          >
            What's your location?
          </TextScallingFalse>
          <View style={{ width: "83%" }}>
            <TextScallingFalse
              style={{ color: "white", fontSize: 12, fontWeight: "400" }}
            >
              See sports players, events, tournaments, clubs, and news as per
              your location.
            </TextScallingFalse>
          </View>
        </View>
        <View style={{ marginTop: 20, width: "80%", zIndex: 2 }}>
          <TextScallingFalse
            style={{ color: "white", fontSize: 14, fontWeight: "400" }}
          >
            Location
          </TextScallingFalse>
          <TextInputSection
            placeholder="Enter location"
            value={addressPickup}
            onChangeText={handleAddressChange}
            autoCapitalize="none"
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && predictions.length > 0 && (
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                width: "107%",
                maxHeight: 100,
                marginTop: 5,
              }}
            >
              <FlatList
                data={predictions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handlePlaceSelect(item)}
                    style={{
                      padding: 10,

                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                  >
                    <Text>{item.description}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setShowSuggestions(false);
            getAddress();
          }}
          style={{
            width: 200,
            borderWidth: 0.5,
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            borderColor: "grey",
            height: 35,
            borderRadius: 20,
            marginTop: 35,
            flexDirection: "row",
          }}
        >
          {loading ? (
            <>
              <TextScallingFalse
                style={{ color: "grey", fontSize: 12, fontWeight: "400" }}
              >
                Fetching location...
              </TextScallingFalse>
              <ActivityIndicator size="small" color="grey" />
            </>
          ) : (
            <>
              <TextScallingFalse
                style={{ color: "grey", fontSize: 12, fontWeight: "400" }}
              >
                Use my current location
              </TextScallingFalse>
              <MaterialIcons name="location-pin" size={17} color="grey" />
            </>
          )}
        </TouchableOpacity>
        <View style={{ marginTop: 45 }}>
          <SignupButton onPress={handleNext}>
            <TextScallingFalse
              style={{ color: "white", fontSize: 15, fontWeight: "500" }}
            >
              Next
            </TextScallingFalse>
          </SignupButton>
        </View>
      </View>
    </PageThemeView>
  );
};

export default signupEnterLocation4;
