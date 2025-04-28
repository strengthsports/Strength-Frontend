import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import Logo from "@/components/logo";
import TextScallingFalse from "@/components/CentralText";
import { RootState } from "@/reduxStore";
import {
  setProfilePic,
  clearProfilePic,
} from "~/reduxStore/slices/user/onboardingSlice";

const ProfilePictureScreen: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { profilePic } = useSelector((state: RootState) => state.onboarding);
  const defaultUser = require("../../assets/images/onboarding/nopic.jpg");

  const pickImage = async (): Promise<void> => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access the camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        const fileName = file.uri.split("/").pop();
        const mimeType = file.mimeType || "image/jpeg";

        // React Native requires this format for file uploads
        const fileObject = {
          uri: file.uri,
          name: fileName,
          type: mimeType,
        };

        const newUri = file.uri;

        try {
          // Dispatch action to save the profile image in Redux
          dispatch(setProfilePic({ newUri, fileObject }));
        } catch (copyError) {
          console.error("Error copying image:", copyError);
          alert("Failed to save image. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image. Please try again.");
    }
  };

  const handleSkip = (): void => {
    router.push({
      pathname: "/onboarding/SuggestedFollowers",
      params: {},
    });
  };

  const handleContinue = (): void => {
    if (profilePic) {
      console.log("Selected profile picture: " + profilePic);
      router.push({
        pathname: "/onboarding/SuggestedFollowers",
      });
    }
  };

  const handleRemovePic = (): void => {
    dispatch(clearProfilePic()); // Clear profile image from Redux store
  };

  return (
    <SafeAreaView
      className={`flex-1 bg-black py-12 pt-${
        Platform.OS === "android" ? StatusBar.currentHeight : 0
      }`}
    >
      <StatusBar barStyle="light-content" />

      <View style={{paddingHorizontal: 30, paddingTop: 20}}>
      <Logo />
      <TextScallingFalse className="text-gray-400 text-[1rem] mt-10">
        Step 1 of 2
      </TextScallingFalse>

      <TextScallingFalse className="text-white text-[1.8rem] font-bold mt-2">
        Pick a profile picture
      </TextScallingFalse>
      <TextScallingFalse className="text-gray-400 text-[1rem] mt-1">
        Adding a photo helps people recognize you.
      </TextScallingFalse>

      <View className="items-center mt-16">
        <View className="w-40 h-40 rounded-full bg-gray-700 justify-center items-center relative">
          <TouchableOpacity activeOpacity={0.8} onPress={pickImage}>
          {profilePic ? (
            <Image
              source={{ uri: profilePic?.newUri as string }}
              className="w-40 h-40 rounded-full"
              resizeMode="cover"
            />
          ) : (
            // <View className="w-20 h-20 rounded-full bg-gray-600 justify-center items-center">
            //   <View className="w-10 h-10 bg-gray-400 rounded-full" />
            // </View>
            <Image
              source={defaultUser}
              className="w-40 h-40 rounded-full"
              resizeMode="cover"
            />
          )}
          </TouchableOpacity>
          <TouchableOpacity
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#00A67E] justify-center items-center"
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <TextScallingFalse className="text-white text-xl font-bold">
              +
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        className="bg-[#00A67E] rounded-full h-12 justify-center items-center mt-14"
        onPress={profilePic ? handleContinue : pickImage}
        activeOpacity={0.8}
      >
        <TextScallingFalse className="text-white text-[1rem] font-semibold">
          {profilePic ? "Continue" : "Add a photo"}
        </TextScallingFalse>
      </TouchableOpacity>

      {profilePic ? (
          null
      ) : (
        <TouchableOpacity
          className="mt-4"
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <TextScallingFalse className="text-[#B4B4B4] text-center text-[1rem] font-semibold">
            Skip for now
          </TextScallingFalse>
        </TouchableOpacity>
      )}
      </View>
    </SafeAreaView>
  );
};

export default ProfilePictureScreen;
