import React, { useState } from "react";
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
import { useLocalSearchParams } from "expo-router";
import TextScallingFalse from "@/components/CentralText";
import * as FileSystem from "expo-file-system";
import Logo from "@/components/logo";

interface ProfilePictureScreenProps {
  onImageSelected?: (uri: string) => void;
  onSkip?: () => void;
  containerStyle?: string;
}

const ProfilePictureScreen: React.FC<ProfilePictureScreenProps> = ({
  onImageSelected,
  onSkip,
  containerStyle,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const params = useLocalSearchParams();
  const selectedSports = params?.selectedSports;
  // console.log(selectedSports);

  const pickImage = async (): Promise<void> => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const originalUri = result.assets[0].uri;

        // Create a permanent path for the image
        const fileName = `profile_${Date.now()}.jpg`;
        const newUri = `${FileSystem.documentDirectory}${fileName}`;

        try {
          // Copy the image to permanent storage
          await FileSystem.copyAsync({
            from: originalUri,
            to: newUri,
          });

          // Update state and call callback with the new permanent URI
          setImage(newUri);
          onImageSelected?.(newUri);
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
    router.push("/onboarding/SetHeadline");
  };

  const handleContinue = (): void => {
    if (image) {
      console.log("Selected profile picture: " + image);
      router.push({
        pathname: "/onboarding/SetHeadline",
        params: { profileImage: image, selectedSports },
      });
    }
  };

  const handleRemovePic = (): void => {
    setImage(null);
  };

  return (
    <SafeAreaView
      className={`flex-1 bg-black px-8 mt-8 pt-${
        Platform.OS === "android" ? StatusBar.currentHeight : 0
      } ${containerStyle}`}
    >
      <StatusBar barStyle="light-content" />

      <Logo />

      <TextScallingFalse className="text-gray-400 text-lg mt-10">Step 1 of 3</TextScallingFalse>

      <TextScallingFalse className="text-white text-2xl font-bold mt-2">
        Pick a profile picture
      </TextScallingFalse>
      <TextScallingFalse className="text-gray-400 text-base mt-2">
        Adding a photo helps people recognize you.
      </TextScallingFalse>

      <View className="items-center mt-10">
        <View className="w-40 h-40 rounded-full bg-gray-700 justify-center items-center relative">
          {image ? (
            <Image
              source={{ uri: image }}
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
            <TextScallingFalse className="text-white text-xl font-bold">+</TextScallingFalse>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        className="bg-[#00A67E] rounded-full h-12 justify-center items-center mt-10"
        onPress={image ? handleContinue : pickImage} // Conditional function based on image state
        activeOpacity={0.8}
      >
        <TextScallingFalse className="text-white text-base font-semibold">
          {image ? "Continue" : "Add a photo"}{" "}
          {/* Change text based on image state */}
        </TextScallingFalse>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-5 py-2 items-center"
        onPress={image ? handleRemovePic : handleSkip}
        activeOpacity={0.6}>
        <TextScallingFalse className="text-gray-400 text-base">
          {image ? "Remove Pic" : "Skip for now"}
        </TextScallingFalse>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfilePictureScreen;
