import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
  ActivityIndicator, ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
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
import useGetAddress from "@/hooks/useGetAddress"; // Add this import
import { Vibration, ToastAndroid, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { vibrationPattern } from "~/constants/vibrationPattern";

const signupEnterLocation4 = () => {
  const [addressPickup, setAddressPickup] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Use the hook
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
  // Sync address with local state and Redux
  useEffect(() => {
    if (address) {
      setAddressPickup(address.formattedAddress);
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

  const [isLoading, setIsLoading] = useState(false)
  const handleNext = () => {
    setIsLoading(true);
  
    if (!addressPickup) {
      feedback("Please enter a location or use the current location.", "error");
      setIsLoading(false); // 👈 Important! Stop loading when error happens
      return;
    }
  
    feedback("Address Successfully Set", "success");
    setIsLoading(false); // 👈 Important! Stop loading when success happens
    router.push("/Signup/signupSetPassword5");
  };
  

  return (
    <PageThemeView>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
      <View style={{ marginTop: 80 }}>
        <Logo />
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View style={{ gap: 25}}>
        <View style={{ marginTop: 55}}>
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
        <View>
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
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={getAddress} // handler function from useGetAddress hook
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
          {
            isLoading ? 
            <ActivityIndicator size={'small'}/>
            :
            <SignupButton onPress={handleNext}>
            <TextScallingFalse
              style={{ color: "white", fontSize: 15, fontWeight: "500" }}
            >
              Next
            </TextScallingFalse>
          </SignupButton>
          }
        </View>
      </View>
      </ScrollView>
    </PageThemeView>
  );
};

export default signupEnterLocation4;
