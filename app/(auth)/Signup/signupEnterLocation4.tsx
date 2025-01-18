import { StyleSheet, TouchableOpacity, View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import { setAddress } from "~/reduxStore/slices/user/onboardingSlice";
import * as Location from "expo-location";
import locationApiResponse from "./test";

// Google API Key
const GOOGLE_API_KEY = process.env.GOOGLE_API;

const signupEnterLocation4 = () => {
  const [addressPickup, setAddressPickup] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Request location permission
  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
    }

    getCurrentLocation();
  }, []);
  const hardCodedAddress = {
    location: {
      coordinates: [" 22.5769", "88.4265"],
    },
  };
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API;
  const getLocationAndAddress = async () => {
    try {
      setLoading(true);

      // Get the current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Fetch address from Google API
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      // console.log('Google API Response:', data);

      const city = data.results[0]?.address_components.find((component: any) =>
        component.types.includes("administrative_area_level_3")
      );
      const state = data.results[0]?.address_components.find((component: any) =>
        component.types.includes("administrative_area_level_1")
      );
      const country = data.results[0]?.address_components.find(
        (component: any) => component.types.includes("country")
      );

      const addressFormat = `${city?.long_name}, ${state?.long_name}, ${country?.long_name}`;
      setAddressPickup(addressFormat);

      const addressPayload = {
        city: city?.long_name,
        state: state?.long_name,
        country: country?.long_name,
        location: {
          coordinates: [latitude, longitude],
        },
      };
      dispatch(setAddress(addressPayload)); // Ensure useDispatch is properly set up
      // console.log('Payload:', addressPayload);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!addressPickup) {
      Alert.alert(
        "Validation",
        "Please enter a location or use the current location."
      );
      return;
    }
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
        <View style={{ marginTop: 20 }}>
          <TextScallingFalse
            style={{ color: "white", fontSize: 14, fontWeight: "400" }}
          >
            Location
          </TextScallingFalse>
          <TextInputSection
            placeholder="Enter location"
            value={addressPickup}
            onChangeText={(value) => setAddressPickup(value)}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={getLocationAndAddress}
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
          <TextScallingFalse
            style={{ color: "grey", fontSize: 12, fontWeight: "400" }}
          >
            {loading ? "Fetching location..." : "Use my current location"}
          </TextScallingFalse>
          <MaterialIcons name="location-pin" size={17} color="grey" />
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
