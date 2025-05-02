import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { useRouter } from "expo-router";
import AddPostHeader from "~/components/feedPage/AddPostHeader";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "~/constants/Colors";
import { Divider } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { useAddPostMutation } from "~/reduxStore/api/feed/features/feedApi.addPost";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomImageSlider from "~/components/Cards/imageSlideContainer";
import AlertModal from "~/components/modals/AlertModal";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import PageThemeView from "~/components/PageThemeView";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { setPostProgressOn } from "~/reduxStore/slices/post/postSlice";
import AddImageIcon from "~/components/SvgIcons/addpost/AddImageIcon";
import TagsIcon from "~/components/SvgIcons/addpost/TagIcon";
import PollsIcon from "~/components/SvgIcons/addpost/PollsIcon";
import PollsContainer from "~/components/Cards/PollsContainer";

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
  const dispatch = useDispatch<AppDispatch>();
  const { text } = useLocalSearchParams();
  const placeholderText = text.toString();
  const [postText, setPostText] = useState("");
  const [isImageRatioModalVisible, setIsImageRatioModalVisible] =
    useState(false);
  const [pickedImageUris, setPickedImageUris] = useState<string[]>([]);
  const [addPost, { isLoading }] = useAddPostMutation();
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<
    [number, number]
  >([3, 2]);

  const [activeIndex, setActiveIndex] = useState<any>(0);
  const [isAlertModalOpen, setAlertModalOpen] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);
  const [inputHeight, setInputHeight] = useState(40);

  // Improved regex pattern for tag detection
  const parseTags = (text: string) => {
    const parts = text.split(/((?:#|@)[a-zA-Z0-9_]+)/g);

    return parts.map((part, index) => {
      if (part.startsWith("#") || part.startsWith("@")) {
        return (
          <TextScallingFalse key={index} style={{ color: "#12956B" }}>
            {part}
          </TextScallingFalse>
        );
      }
      return <TextScallingFalse key={index}>{part}</TextScallingFalse>;
    });
  };

  const handleSetActiveIndex = (index: any) => {
    setActiveIndex(index);
  };

  // Memoize derived values
  const isPostButtonEnabled = useMemo(
    () => postText.trim() || pickedImageUris.length > 0,
    [postText, pickedImageUris.length]
  );

  // Use callbacks for event handlers to prevent unnecessary re-renders
  const handlePostSubmit = useCallback(() => {
    if (!isPostButtonEnabled) return;
    router.push("/(app)/(tabs)/home");
    dispatch(setPostProgressOn(true));

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
      formData.append("taggedUsers", JSON.stringify([]));

      setPostText("");
      setPickedImageUris([]);
      addPost(formData)
        .unwrap()
        .finally(() => {
          dispatch(setPostProgressOn(false));
        })
        .catch((error) => {
          console.error("Failed to add post:", error);
          alert("Failed to add post. Please try again.");
        });
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
    dispatch,
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
        aspect: Platform.OS === "ios" ? ratio : ratio,
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
        aspect:
          Platform.OS === "ios" ? selectedAspectRatio : selectedAspectRatio,
        quality: 0.8,
        allowsEditing: true,
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
  const navigateBack = () => {
    if (postText == "" && pickedImageUris.length === 0) {
      router.push("..");
    } else {
      setAlertModalOpen(true);
    }
  };

  const [showPollInput, setShowPollInput] = useState(false);

  return (
    <PageThemeView>
      <View className="h-full">
        <View className="flex flex-row items-center justify-between p-4">
          <AddPostHeader onBackPress={navigateBack} />
          <TouchableOpacity
            className={`px-6 py-1 rounded-full ${
              isPostButtonEnabled ? "bg-theme" : "bg-neutral-800"
            }`}
            onPress={handlePostSubmit}
            disabled={!isPostButtonEnabled}
          >
            {isLoading ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <TextScallingFalse
                className={`${
                  isPostButtonEnabled ? "text-white" : "text-neutral-500"
                } text-3xl font-semibold`}
              >
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
          <View style={{ minHeight: 100 }}>
            {/* Overlay text with highlighting */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                pointerEvents: "none",
                paddingHorizontal: 16,
                paddingTop: Platform.OS === "ios" ? 8 : 4,
              }}
            >
              <TextScallingFalse
                style={{
                  fontSize: 16,
                  color: "transparent",
                  lineHeight: 24,
                  // Match TextInput's text alignment behavior
                  textAlignVertical: "top",
                  includeFontPadding: false,
                }}
              >
                {parseTags(postText)}
              </TextScallingFalse>
            </View>

            {/* Actual text input */}
            <TextInput
              ref={inputRef}
              multiline
              autoFocus
              placeholder={placeholderText}
              placeholderTextColor="grey"
              value={postText}
              onChangeText={setPostText}
              onContentSizeChange={(e) => {
                setInputHeight(e.nativeEvent.contentSize.height);
              }}
              style={{
                fontSize: 16,
                color: "white",
                paddingHorizontal: 16,
                height: Math.max(40, inputHeight),
                opacity: 0.99, // Needs to be almost opaque to hide overlay
                lineHeight: 24,
                textAlignVertical: "top",
              }}
              textBreakStrategy="highQuality"
              keyboardAppearance="dark"
            />
          </View>

          {/* Only render PollsContainer when polls is selected */}
          {showPollInput && (
            <PollsContainer onClose={() => setShowPollInput(false)} />
          )}

          {/* Only render CustomImageSlider when there are images */}
          {pickedImageUris.length > 0 && (
            <CustomImageSlider
              images={pickedImageUris}
              aspectRatio={selectedAspectRatio}
              onRemoveImage={removeImage}
              setIndex={handleSetActiveIndex}
            />
          )}

          {/* Pagination */}
          {pickedImageUris.length > 1 && (
            <View className="flex-row justify-center mt-2">
              {Array.from({ length: pickedImageUris.length }).map((_, i) => (
                <View
                  key={`dot-${i}`}
                  className={
                    i === activeIndex
                      ? "w-1.5 h-1.5 rounded-full bg-white mx-0.5"
                      : "w-1.5 h-1.5 rounded-full bg-white/50 mx-0.5"
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>

        <View className="flex flex-row justify-between items-center px-3 p-2">
          <TouchableOpacity className="flex flex-row gap-2 items-center pl-3 py-1 border border-theme rounded-lg">
            <MaterialCommunityIcons
              name="earth"
              size={19}
              color={Colors.themeColor}
            />
            <TextScallingFalse className="text-theme text-2xl">
              Public
            </TextScallingFalse>
            <MaterialCommunityIcons
              name="menu-down"
              size={22}
              color={Colors.themeColor}
            />
          </TouchableOpacity>

          {/* component a */}
          <View className="flex flex-row justify-between pt-2">
            <TouchableOpacity activeOpacity={0.5} className="p-[5px] w-[35px]">
              <TagsIcon />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-[5px] w-[36px]"
              activeOpacity={0.5}
              onPress={handlePickImageOrAddMore}
            >
              <AddImageIcon />
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
            <TouchableOpacity
              onPress={() => setShowPollInput(true)}
              className="p-[5px]"
              activeOpacity={0.5}
            >
              <PollsIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* alert modal */}
      <AlertModal
        isVisible={isAlertModalOpen}
        alertConfig={{
          title: "Discard Post ?",
          message: "All your changes will be deleted",
          cancelMessage: "Cancel",
          confirmMessage: "Discard",
          confirmAction: () => router.push(".."),
          discardAction: () => setAlertModalOpen(false),
        }}
      />
    </PageThemeView>
  );
}
