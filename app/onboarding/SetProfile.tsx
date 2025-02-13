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
      pathname: "/onboarding/SetHeadline",
      params: {},
    });
  };

  const handleContinue = (): void => {
    if (profilePic) {
      console.log("Selected profile picture: " + profilePic);
      router.push({
        pathname: "/onboarding/SetHeadline",
      });
    }
  };

  const handleRemovePic = (): void => {
    dispatch(clearProfilePic()); // Clear profile image from Redux store
  };

  return (
    <SafeAreaView
      className={`flex-1 bg-black px-8 py-12 pt-${
        Platform.OS === "android" ? StatusBar.currentHeight : 0
      }`}
    >
      <StatusBar barStyle="light-content" />

      <Logo />

      <TextScallingFalse className="text-gray-400 text-lg mt-10">
        Step 1 of 3
      </TextScallingFalse>

      <TextScallingFalse className="text-white text-2xl font-bold mt-2">
        Pick a profile picture
      </TextScallingFalse>
      <TextScallingFalse className="text-gray-400 text-base mt-2">
        Adding a photo helps people recognize you.
      </TextScallingFalse>

      <View className="items-center mt-10">
        <View className="w-40 h-40 rounded-full bg-gray-700 justify-center items-center relative">
          {profilePic ? (
            <Image
              source={{ uri: profilePic?.newUri as string }}
              className="w-40 h-40 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-gray-600 justify-center items-center">
              <View className="w-10 h-10 bg-gray-400 rounded-full" />
            </View>
          )}
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
        className="bg-[#00A67E] rounded-full h-12 justify-center items-center mt-10"
        onPress={profilePic ? handleContinue : pickImage}
        activeOpacity={0.8}
      >
        <TextScallingFalse className="text-white text-base font-semibold">
          {profilePic ? "Continue" : "Add a photo"}
        </TextScallingFalse>
      </TouchableOpacity>

      {profilePic ? (
        <TouchableOpacity
          className="mt-4"
          onPress={handleRemovePic}
          activeOpacity={0.8}
        >
          <TextScallingFalse className="text-[#00A67E] text-center text-base font-semibold">
            Remove Picture
          </TextScallingFalse>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="mt-2"
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <TextScallingFalse className="text-[#B4B4B4] text-center text-base font-semibold">
            Skip for now
          </TextScallingFalse>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ProfilePictureScreen;
