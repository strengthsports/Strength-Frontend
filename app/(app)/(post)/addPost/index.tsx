import React, { useState, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { useRouter } from "expo-router";
import AddPostHeader from "~/components/feedPage/addPostHeader";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "~/constants/Colors";
import { Divider } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { useAddPostMutation } from "~/reduxStore/api/feed/features/feedApi.addPost";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomImageSlider from "~/components/Cards/imageSlideContainer";

// Memoized sub-components for better performance
const Figure = React.memo(
  ({
    width,
    height,
    text,
    onPress,
  }: {
    width: number;
    height: number;
    text: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity className="flex flex-row items-center" onPress={onPress}>
      <View
        style={{ height, width }}
        className="bg-neutral-500 border border-neutral-100 rounded"
      />
      <TextScallingFalse className="text-white text-4xl ml-4">
        {text}
      </TextScallingFalse>
    </TouchableOpacity>
  )
);

const ImageRatioModal = React.memo(
  ({ pickImage }: { pickImage: (ratio: [number, number]) => void }) => (
    <View className="h-1/3 w-[104%] bg-neutral-900 self-center rounded-t-[40px] p-4 border-t border-x border-neutral-700">
      <Divider
        className="w-16 self-center rounded-full bg-neutral-700 my-1"
        width={4}
      />
      <TextScallingFalse className="text-white self-center text-4xl my-4">
        Select Aspect Ratio
      </TextScallingFalse>
      <View className="flex flex-row items-center">
        <View className="flex w-full gap-4 pr-8 mx-4">
          <Figure
            width={36}
            height={36}
            text="1:1"
            onPress={() => pickImage([1, 1])}
          />
          <Figure
            width={36}
            height={24}
            text="3:2"
            onPress={() => pickImage([3, 2])}
          />
          <Figure
            width={36}
            height={45}
            text="4:5"
            onPress={() => pickImage([4, 5])}
          />
        </View>
      </View>
    </View>
  )
);

export default function AddPostContainer() {
  const router = useRouter();
  const [postText, setPostText] = useState("");
  const [isImageRatioModalVisible, setIsImageRatioModalVisible] =
    useState(false);
  const [pickedImageUris, setPickedImageUris] = useState<string[]>([]);
  const [addPost, { isLoading }] = useAddPostMutation();
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<
    [number, number]
  >([3, 2]);

  // Memoize derived values
  const isPostButtonEnabled = useMemo(
    () => postText.trim() || pickedImageUris.length > 0,
    [postText, pickedImageUris.length]
  );

  // Use callbacks for event handlers to prevent unnecessary re-renders
  const handlePostSubmit = useCallback(async () => {
    if (!isPostButtonEnabled) return;

    try {
      const formData = new FormData();
      formData.append("caption", postText.trim());

      // Optimize image appending
      pickedImageUris.forEach((uri, index) => {
        const file = {
          uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        };
        formData.append(`assets${index + 1}`, file);
      });

      formData.append("aspectRatio", JSON.stringify(selectedAspectRatio));

      await addPost(formData).unwrap();
      setPostText("");
      setPickedImageUris([]);
      router.push("/(app)/(tabs)/home");
    } catch (error) {
      console.error("Failed to add post:", error);
      alert("Failed to add post. Please try again.");
    }
  }, [
    addPost,
    isPostButtonEnabled,
    pickedImageUris,
    postText,
    router,
    selectedAspectRatio,
  ]);

  // For selecting the first image with aspect ratio
  const selectFirstImage = useCallback(async (ratio: [number, number]) => {
    setSelectedAspectRatio(ratio);

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        aspect: ratio,
        quality: 0.8,
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setPickedImageUris([uri]);
        setIsImageRatioModalVisible(false);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image. Please try again.");
    }
  }, []);

  // For adding more images (using same aspect ratio)
  const addMoreImages = useCallback(async () => {
    if (pickedImageUris.length === 0) {
      setIsImageRatioModalVisible(true);
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        aspect: selectedAspectRatio,
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setPickedImageUris((prevUris) => [...prevUris, uri]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image. Please try again.");
    }
  }, [pickedImageUris.length, selectedAspectRatio]);

  // Optimize image removal
  const removeImage = useCallback((index: number) => {
    setPickedImageUris((prevUris) => prevUris.filter((_, i) => i !== index));
  }, []);

  // Smart handler for image button
  const handlePickImageOrAddMore = useCallback(() => {
    if (pickedImageUris.length === 0) {
      setIsImageRatioModalVisible(true);
    } else {
      addMoreImages();
    }
  }, [addMoreImages, pickedImageUris.length]);

  // Close modal handler
  const closeRatioModal = useCallback(() => {
    setIsImageRatioModalVisible(false);
  }, []);

  // Navigate back handler
  const navigateBack = useCallback(() => {
    router.push("..");
  }, [router]);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        // backgroundColor: "black",
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
    >
      <View className="h-full">
        <View className="flex flex-row items-center justify-between p-4">
          <AddPostHeader onBackPress={navigateBack} />
          <TouchableOpacity
            className={`px-5 py-1 rounded-full ${
              isPostButtonEnabled ? "bg-theme" : "bg-neutral-600"
            }`}
            onPress={handlePostSubmit}
            disabled={!isPostButtonEnabled}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <TextScallingFalse className="text-white text-3xl">
                Post
              </TextScallingFalse>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          className="px-0"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={true}
        >
          <TextInput
            autoFocus
            multiline
            placeholderTextColor="grey"
            placeholder="What is on your mind..."
            value={postText}
            onChangeText={setPostText}
            className="min-h-24 mx-6 h-auto align-top text-white text-4xl mb-2"
          />

          {/* Only render CustomImageSlider when there are images */}
          {pickedImageUris.length > 0 && (
            <CustomImageSlider
              images={pickedImageUris}
              aspectRatio={selectedAspectRatio}
              onRemoveImage={removeImage}
            />
          )}
        </ScrollView>
        <View className="flex flex-row justify-between items-center p-5">
          <TouchableOpacity className="flex flex-row gap-2 items-center pl-2 py-1 border border-theme rounded-md">
            <MaterialCommunityIcons
              name="earth"
              size={20}
              color={Colors.themeColor}
            />
            <TextScallingFalse className="text-theme text-3xl">
              Public
            </TextScallingFalse>
            <MaterialCommunityIcons
              name="menu-down"
              size={24}
              color={Colors.themeColor}
            />
          </TouchableOpacity>

          <View className="flex flex-row justify-between gap-2 ">
            <TouchableOpacity onPress={handlePickImageOrAddMore}>
              <MaterialCommunityIcons
                name="image-outline"
                size={24}
                color={Colors.themeColor}
              />
              {pickedImageUris.length > 0 && (
                <View className="absolute -right-[0.5px] top-0 bg-black size-3 p-[0.5px]">
                  <FontAwesome6 name="add" size={12} color="#12956B" />
                </View>
              )}
            </TouchableOpacity>
            <Modal
              visible={isImageRatioModalVisible}
              transparent
              animationType="slide"
              onRequestClose={closeRatioModal}
            >
              <TouchableOpacity
                className="flex-1 justify-end bg-black/50"
                activeOpacity={1}
                onPress={closeRatioModal}
              >
                <ImageRatioModal pickImage={selectFirstImage} />
              </TouchableOpacity>
            </Modal>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color={Colors.themeColor}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
