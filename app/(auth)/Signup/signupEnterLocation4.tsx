import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import { setAddress } from "~/reduxStore/slices/profileSlice";

const signupEnterLocation4 = () => {
  const [location, setLocation] = useState(""); // Currently unused, can be used if user manually enters location
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Hardcoded address
  const hardCodedAddress = {
    location: {
      latitude: 22.5769,
      longitude: 88.4265,
    },
  };

  const handleNext = () => {
    // Dispatch the hardcoded address to Redux
    dispatch(setAddress(hardCodedAddress));

    console.log("Hardcoded address set:", hardCodedAddress);
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
            value={location}
            onChangeText={(value) => setLocation(value)}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
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
            Use my current location
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