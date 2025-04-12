import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { useRouter } from "expo-router";
import AddPostHeader from "~/components/feedPage/AddPostHeader";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "~/constants/Colors";
import { Divider } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { useAddPostMutation } from "~/reduxStore/api/feed/features/feedApi.addPost";
import CustomImageSlider from "~/components/Cards/imageSlideContainer";
import AlertModal from "~/components/modals/AlertModal";
import PageThemeView from "~/components/PageThemeView";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import {
  setAddPostContainerOpen,
  setPostProgressOn,
} from "~/reduxStore/slices/post/postSlice";
import PollsIcon from "../SvgIcons/addpost/PollsIcon";
import PollsContainer from "../Cards/PollsContainer";
import { showFeedback } from "~/utils/feedbackToast";
import AddImageIcon from "../SvgIcons/addpost/AddImageIcon";
import FeatureUnderDev from "./FeatureUnderDev";
import ClipsIcon from "../SvgIcons/addpost/ClipsIcon";
import { ResizeMode, Video } from "expo-av";
import Slider from "@react-native-community/slider";

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

interface VideoTrimmerModalProps {
  videoUri: string;
  onTrimComplete: (trimmedUri: string) => void;
  onCancel: () => void;
}

const VideoTrimmerModal: React.FC<VideoTrimmerModalProps> = ({
  videoUri,
  onTrimComplete,
  onCancel,
}) => {
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isTrimming, setIsTrimming] = useState(false);

  // When video loads, set duration and default endTime
  const handleVideoLoad = (status: any) => {
    if (status.durationMillis) {
      const dur = status.durationMillis / 1000;
      setDuration(dur);
      if (endTime === 0) setEndTime(dur);
    }
  };

  // Simulated trim function. In a real app you might use an FFmpeg library or a dedicated package.
  const trimVideo = async () => {
    setIsTrimming(true);
    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // For demo purposes we return the original URI.
      // You can replace this with a call to a video trimming library that returns a new video file URI.
      onTrimComplete(videoUri);
    } catch (error) {
      console.error("Video trimming failed:", error);
      Alert.alert("Error", "Failed to trim video. Please try again.");
    } finally {
      setIsTrimming(false);
    }
  };

  return (
    <Modal visible={true} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-neutral-900 rounded-t-[20px] p-4">
          <TextScallingFalse className="text-white text-4xl text-center mb-4">
            Trim Video
          </TextScallingFalse>
          <Video
            source={{ uri: videoUri }}
            style={{ width: "100%", height: 200, backgroundColor: "#000" }}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={false}
            onLoad={({ naturalSize, durationMillis }) =>
              handleVideoLoad({ durationMillis })
            }
            useNativeControls
          />
          <View className="mt-4">
            <TextScallingFalse className="text-white mb-2">
              Start Time: {startTime.toFixed(1)} sec
            </TextScallingFalse>
            <Slider
              minimumValue={0}
              maximumValue={duration}
              value={startTime}
              onValueChange={(val) => {
                // Prevent startTime from exceeding endTime
                if (val < endTime) {
                  setStartTime(val);
                }
              }}
              minimumTrackTintColor={Colors.themeColor}
              maximumTrackTintColor="#FFFFFF"
            />
          </View>
          <View className="mt-4">
            <TextScallingFalse className="text-white mb-2">
              End Time: {endTime.toFixed(1)} sec
            </TextScallingFalse>
            <Slider
              minimumValue={startTime}
              maximumValue={duration}
              value={endTime}
              onValueChange={(val) => {
                // Prevent endTime from being less than startTime
                if (val > startTime) {
                  setEndTime(val);
                }
              }}
              minimumTrackTintColor={Colors.themeColor}
              maximumTrackTintColor="#FFFFFF"
            />
          </View>
          <View className="flex-row justify-around mt-6">
            <TouchableOpacity
              onPress={onCancel}
              className="px-4 py-2 border border-white rounded"
            >
              <TextScallingFalse className="text-white text-3xl">
                Cancel
              </TextScallingFalse>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={trimVideo}
              className="px-4 py-2 bg-theme rounded"
              disabled={isTrimming}
            >
              {isTrimming ? (
                <ActivityIndicator color="white" />
              ) : (
                <TextScallingFalse className="text-white text-3xl">
                  Trim Video
                </TextScallingFalse>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function AddPostContainer({
  text,
  isAddPostContainerOpen,
}: {
  text: string;
  isAddPostContainerOpen: boolean;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  // const { text } = useLocalSearchParams();
  const placeholderText = text.toString();
  const [postText, setPostText] = useState("");
  const [isImageRatioModalVisible, setIsImageRatioModalVisible] =
    useState(false);
  const [pickedImageUris, setPickedImageUris] = useState<string[]>([]);
  const [addPost, { isLoading }] = useAddPostMutation();
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<
    [number, number]
  >([3, 2]);

  // New state for video upload
  const [pickedVideoUri, setPickedVideoUri] = useState<string | null>(null);
  const [isVideoTrimmerVisible, setIsVideoTrimmerVisible] = useState(false);

  const [activeIndex, setActiveIndex] = useState<any>(0);
  const [isAlertModalOpen, setAlertModalOpen] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);
  const [inputHeight, setInputHeight] = useState(40);
  const [showPollInput, setShowPollInput] = useState(false);
  const [newPollOptions, setNewPollOptions] = useState<string[]>(["", ""]);
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  const [isTypeVideo, setTypeVideo] = useState<boolean>(false);

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

  // Conditions for posting content
  const isPostButtonEnabled = useMemo(() => {
    // Count non-empty poll options
    const validOptionsCount = newPollOptions.filter(
      (opt) => opt.trim() !== ""
    ).length;

    // Always require valid poll when poll input is shown
    const pollValidation =
      !showPollInput || (showPollInput && validOptionsCount >= 2);

    // If video mode, require a video; otherwise check caption/images
    if (isTypeVideo) {
      return pickedVideoUri !== null && pollValidation;
    }

    // Enable button if:
    // 1. There's either caption OR images
    // AND
    // 2. If poll is shown, it must be valid
    return (postText.trim() || pickedImageUris.length > 0) && pollValidation;
  }, [
    postText,
    pickedImageUris.length,
    showPollInput,
    newPollOptions,
    isTypeVideo,
    pickedVideoUri,
  ]);

  // Use callbacks for event handlers to prevent unnecessary re-renders
  const handlePostSubmit = useCallback(() => {
    if (!isPostButtonEnabled) return;
    dispatch(setAddPostContainerOpen(false));
    router.push("/(app)/(tabs)/home");
    dispatch(setPostProgressOn(true));

    try {
      const formData = new FormData();
      formData.append("caption", postText.trim());

      // Optimize image appending
      if (isTypeVideo && pickedVideoUri) {
        const file = {
          uri: pickedVideoUri,
          name: "video.mp4",
          type: "video/mp4",
        };
        formData.append("assets1", file);
        formData.append("isVideo", "true");
      } else {
        pickedImageUris.forEach((uri, index) => {
          const file = {
            uri,
            name: `image_${index}.jpg`,
            type: isTypeVideo ? "video/mp4" : "image/jpeg",
          };
          formData.append(`assets${index + 1}`, file);
        });
      }

      formData.append("aspectRatio", JSON.stringify(selectedAspectRatio));
      formData.append("taggedUsers", JSON.stringify([]));
      // For poll
      const validOptions = newPollOptions.filter((opt) => opt.trim() !== "");
      console.log("Valid Options : ", validOptions);
      validOptions.forEach((option) => {
        formData.append("options", JSON.stringify(option));
      });

      setPostText("");
      setPickedImageUris([]);

      // Reset video states if needed
      if (isTypeVideo) {
        setPickedVideoUri(null);
        setTypeVideo(false);
      }

      addPost(formData)
        .unwrap()
        .finally(() => {
          dispatch(setPostProgressOn(false));
        })
        .catch((error) => {
          console.error("Failed to add post:", error);
          showFeedback("Failed to add post. Please try again.");
        });
    } catch (error) {
      console.error("Failed to add post:", error);
    }
  }, [
    addPost,
    isPostButtonEnabled,
    pickedImageUris,
    postText,
    newPollOptions,
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
        mediaTypes: ["images"],
        aspect: Platform.OS === "ios" ? ratio : ratio,
        quality: 0.8,
        allowsEditing: true,
        // mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    // If video mode is not active, proceed with image picking
    if (!isTypeVideo) {
      if (pickedImageUris.length === 0) {
        setIsImageRatioModalVisible(true);
      } else {
        addMoreImages();
      }
    }
  }, [addMoreImages, pickedImageUris.length, isTypeVideo]);

  // Close modal handler
  const closeRatioModal = useCallback(() => {
    setIsImageRatioModalVisible(false);
  }, []);

  // ---------------------
  // New video selection and trimmer support
  // ---------------------
  const selectVideo = useCallback(async () => {
    // Activate video mode explicitly
    setTypeVideo(true);
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required.");
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setPickedVideoUri(uri);
        // Open the video trimmer modal
        setIsVideoTrimmerVisible(true);
      }
    } catch (error) {
      console.error("Error picking video:", error);
      alert("Failed to pick video. Please try again.");
    }
  }, []);

  // Callback when video trimming is complete
  const handleTrimComplete = (trimmedUri: string) => {
    setPickedVideoUri(trimmedUri);
    setIsVideoTrimmerVisible(false);
  };

  const handleOptionsChange = (updatedOptions: string[]) => {
    setNewPollOptions(updatedOptions);
  };

  // Handle close poll
  const handleClosePoll = () => {
    setShowPollInput(false);
    setNewPollOptions(["", ""]);
  };

  const handleCloseAddPostContainer = () => {
    if ((isPostButtonEnabled || showPollInput) && !isAlertModalOpen) {
      setAlertModalOpen(true);
    } else if (isAlertModalOpen) {
      setPostText("");
      setAlertModalOpen(false);
      dispatch(setAddPostContainerOpen(false));
    } else {
      dispatch(setAddPostContainerOpen(false));
    }
  };

  const handleDiscard = () => {
    setShowPollInput(false);
    setTypeVideo(false);
    setAlertModalOpen(false);
    handleCloseAddPostContainer();
    console.log("Discard pressed. isAlertModalOpen will become false.");
  };

  return (
    <Modal
      visible={isAddPostContainerOpen}
      animationType="slide"
      onRequestClose={handleCloseAddPostContainer}
      transparent={true}
    >
      <PageThemeView>
        <View className="h-full">
          {/* Header */}
          <View className="flex flex-row items-center justify-between p-4">
            <AddPostHeader onBackPress={handleCloseAddPostContainer} />
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
              <PollsContainer
                onClose={handleClosePoll}
                mode="create"
                options={newPollOptions}
                onOptionsChange={handleOptionsChange}
              />
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

          {/* only render when any feature which is under development is clicked */}
          {showFeatureModal && (
            <FeatureUnderDev
              isVisible={showFeatureModal}
              onClose={() => setShowFeatureModal(false)}
            />
          )}

          {/* Footer */}
          <View className="flex flex-row justify-between items-center p-3">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowFeatureModal(true)}
              className="flex flex-row gap-2 items-center pl-2 py-1 border border-theme rounded-lg"
            >
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

            <View className="flex flex-row justify-between items-center gap-2">
              {/* Video button - calls selectVideo */}
              <TouchableOpacity
                activeOpacity={0.5}
                className="p-[5px] w-[35px]"
                onPress={selectVideo}
                disabled={
                  showPollInput ||
                  pickedImageUris.length > 0 ||
                  (isTypeVideo && pickedVideoUri !== null)
                }
              >
                <ClipsIcon
                  color={
                    showPollInput ||
                    pickedImageUris.length > 0 ||
                    (isTypeVideo && pickedVideoUri !== null)
                      ? "#737373"
                      : Colors.themeColor
                  }
                />
              </TouchableOpacity>
              {/* Image button */}
              <TouchableOpacity
                onPress={handlePickImageOrAddMore}
                disabled={showPollInput || isTypeVideo}
                activeOpacity={0.7}
              >
                <AddImageIcon
                  color={
                    showPollInput || (isTypeVideo && pickedVideoUri !== null)
                      ? "#737373"
                      : Colors.themeColor
                  }
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
              <TouchableOpacity
                onPress={() => setShowPollInput(true)}
                className="p-[5px]"
                activeOpacity={0.7}
                disabled={
                  showPollInput ||
                  pickedImageUris.length > 0 ||
                  (isTypeVideo && pickedVideoUri !== null)
                }
              >
                <PollsIcon
                  color={
                    showPollInput ||
                    pickedImageUris.length > 0 ||
                    (isTypeVideo && pickedVideoUri !== null)
                      ? "#737373"
                      : Colors.themeColor
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* alert modal */}
        {isAlertModalOpen && (
          <AlertModal
            isVisible={isAlertModalOpen}
            alertConfig={{
              title: "Discard Post ?",
              message: "All your changes will be deleted",
              cancelMessage: "Cancel",
              confirmMessage: "Discard",
              confirmAction: handleDiscard,
              discardAction: () => setAlertModalOpen(false),
            }}
          />
        )}
      </PageThemeView>
      {/* Render the video trimmer modal when needed */}
      {isVideoTrimmerVisible && pickedVideoUri && (
        <VideoTrimmerModal
          videoUri={pickedVideoUri}
          onTrimComplete={handleTrimComplete}
          onCancel={() => {
            // If cancel is pressed in the trimmer, reset video selection and video mode.
            setIsVideoTrimmerVisible(false);
            setPickedVideoUri(null);
            setTypeVideo(false);
          }}
        />
      )}
    </Modal>
  );
}
