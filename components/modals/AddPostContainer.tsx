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
  Platform,
  Alert,
  Dimensions,
  Keyboard,
  LayoutChangeEvent,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { useRouter } from "expo-router";
import AddPostHeader from "~/components/feedPage/AddPostHeader";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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
  resetUploadProgress,
  setAddPostContainerOpen,
  setUploadLoading,
  uploadPost,
} from "~/reduxStore/slices/post/postSlice";
import PollsIcon from "../SvgIcons/addpost/PollsIcon";
import PollsContainer from "../Cards/PollsContainer";
import { showFeedback } from "~/utils/feedbackToast";
import AddImageIcon from "../SvgIcons/addpost/AddImageIcon";
import FeatureUnderDev from "./FeatureUnderDev";
import ClipsIcon from "../SvgIcons/addpost/ClipsIcon";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { Image } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { Animated } from "react-native";
import * as VideoThumbnails from "expo-video-thumbnails";
import CustomHashtagMentionInput from "../ui/CustomHashtagMentionInput";
import CustomVideoPlayer from "../PostContainer/VideoPlayer";
import {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";
import MentionHashtagInput2 from "../MentionHashtagInput2";
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
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isTrimming, setIsTrimming] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  const videoRef = useRef<Video>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const maxTrimDuration = 60;
  const minTrimDuration = 1;
  const selectionWidth = 120; // Fixed width for the selection area

  // Animated values
  const trimAreaLeft = useSharedValue(0);
  const trimAreaWidth = useSharedValue(Dimensions.get("window").width - 48);
  const selectionPosition = useSharedValue(0); // Position of the selection area

  useEffect(() => {
    const generateThumbnails = async () => {
      try {
        const numThumbnails = Math.min(
          Math.ceil(trimAreaWidth.value / 60),
          Math.ceil(duration)
        );

        const thumbnailPromises = Array(numThumbnails)
          .fill(0)
          .map(async (_, i) => {
            const time = (duration * i) / numThumbnails;
            try {
              const { uri } = await VideoThumbnails.getThumbnailAsync(
                videoUri,
                {
                  time: time * 1000,
                  quality: 0.8,
                }
              );
              return uri;
            } catch (error) {
              console.warn(`Failed to generate thumbnail at ${time}s:`, error);
              return null;
            }
          });

        const thumbnails = (await Promise.all(thumbnailPromises)).filter(
          Boolean
        );
        setThumbnails(thumbnails as string[]);
      } catch (error) {
        console.error("Error generating thumbnails:", error);
      }
    };

    if (duration > 0) {
      generateThumbnails();
      // Initialize end time
      setEndTime(
        Math.min(duration, maxTrimDuration) *
          (selectionWidth / trimAreaWidth.value)
      );
    }
  }, [duration, videoUri]);

  const handleVideoLoad = (status: AVPlaybackStatus) => {
    console.log("Video load status:", status);
    if (status.isLoaded && status.durationMillis) {
      const dur = status.durationMillis / 1000;
      setDuration(dur);
    } else {
      console.warn("Could not get video duration, using default");
      setDuration(30); // Default fallback
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);

      if (status.positionMillis / 1000 >= endTime) {
        videoRef.current?.setPositionAsync(startTime * 1000);
      }
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playFromPositionAsync(startTime * 1000);
    }
    setIsPlaying(!isPlaying);
  };

  const positionToTime = (position: number) => {
    return (
      (position / trimAreaWidth.value) * Math.min(duration, maxTrimDuration)
    );
  };

  const handleTrimAreaLayout = (event: LayoutChangeEvent) => {
    trimAreaLeft.value = event.nativeEvent.layout.x;
    trimAreaWidth.value = event.nativeEvent.layout.width;

    // Initialize selection area to show first 3-5 seconds of video
    const initialSelectionWidth = selectionWidth;

    // Update times based on initial position
    const newStartTime = positionToTime(0);
    const newEndTime = positionToTime(initialSelectionWidth);

    setStartTime(newStartTime);
    setEndTime(newEndTime);
  };

  // Gesture handler for the selection area
  const selectionGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startPosition = selectionPosition.value;
    },
    onActive: (event, ctx: any) => {
      // Calculate new position with boundaries
      const newPosition = Math.max(
        0,
        Math.min(
          ctx.startPosition + event.translationX,
          trimAreaWidth.value - selectionWidth
        )
      );

      selectionPosition.value = newPosition;

      // Update time values
      const newStartTime = positionToTime(newPosition);
      const newEndTime = positionToTime(newPosition + selectionWidth);

      runOnJS(setStartTime)(newStartTime);
      runOnJS(setEndTime)(newEndTime);
    },
  });

  // Animated style for the selection area
  const selectionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: selectionPosition.value }],
    width: selectionWidth,
  }));

  const trimVideo = async () => {
    setIsTrimming(true);
    try {
      if (isPlaying) {
        videoRef.current?.pauseAsync();
        setIsPlaying(false);
      }

      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onTrimComplete(videoUri);
    } catch (error) {
      console.error("Trimming failed:", error);
      Alert.alert("Error", "Failed to trim video");
    } finally {
      setIsTrimming(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  return (
    <Modal visible transparent animationType="slide">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                <TextScallingFalse className="text-white font-medium">
                  Cancel
                </TextScallingFalse>
              </TouchableOpacity>
              <TextScallingFalse className="text-white text-xl font-semibold">
                Trim Video
              </TextScallingFalse>
              <TouchableOpacity
                onPress={trimVideo}
                disabled={isTrimming}
                style={styles.doneButton}
              >
                {isTrimming ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <TextScallingFalse className="text-white font-medium">
                    Done
                  </TextScallingFalse>
                )}
              </TouchableOpacity>
            </View>

            {/* Video Preview */}
            <View style={styles.videoContainer}>
              <Video
                ref={videoRef}
                source={{ uri: videoUri }}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                onLoad={(status) => handleVideoLoad(status)}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              />

              <TouchableOpacity
                onPress={togglePlayback}
                style={styles.playButtonContainer}
              >
                <View style={styles.playButton}>
                  <Ionicons
                    name={!isPlaying ? "play" : "pause"}
                    size={16}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.timeIndicator}>
                <TextScallingFalse className="text-white text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </TextScallingFalse>
              </View>
            </View>

            {/* Trim Controls */}
            <View
              style={styles.trimControlsContainer}
              onLayout={handleTrimAreaLayout}
            >
              <View style={styles.timeLabels}>
                <TextScallingFalse className="text-white">
                  {formatTime(startTime)}
                </TextScallingFalse>
                <TextScallingFalse className="text-white">
                  {formatTime(endTime)}
                </TextScallingFalse>
              </View>

              <View style={styles.thumbnailContainerWrapper}>
                <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.thumbnailsContainer}
                >
                  <View style={styles.thumbnailsRow}>
                    {thumbnails.map((thumbnail, index) => (
                      <Image
                        key={index}
                        source={{ uri: thumbnail }}
                        style={styles.thumbnail}
                      />
                    ))}
                  </View>
                </ScrollView>

                <View style={styles.overlayContainer} pointerEvents="box-none">
                  {/* Dark overlay across entire area */}
                  <View style={styles.fullOverlay} />

                  {/* Draggable selection window */}
                  <PanGestureHandler onGestureEvent={selectionGestureHandler}>
                    <Animated.View
                      style={[styles.selectionWindow, selectionStyle]}
                    >
                      {/* Current position indicator */}
                      <View
                        style={[
                          styles.positionIndicator,
                          {
                            left: Math.max(
                              0,
                              ((currentTime - startTime) /
                                (endTime - startTime)) *
                                selectionWidth
                            ),
                            display:
                              currentTime >= startTime && currentTime <= endTime
                                ? "flex"
                                : "none",
                          },
                        ]}
                      />
                    </Animated.View>
                  </PanGestureHandler>
                </View>
              </View>
            </View>

            <View style={styles.durationIndicator}>
              <TextScallingFalse className="text-white text-center">
                Selected: {formatTime(endTime - startTime)}
              </TextScallingFalse>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#171717", // neutral-900
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 16,
    marginTop: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 9999,
  },
  doneButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#6366f1", // theme color
    borderWidth: 1,
    borderColor: "#6366f1", // theme color
    borderRadius: 9999,
  },
  videoContainer: {
    position: "relative",
    justifyContent: "center",
    flex: 1,
  },
  video: {
    width: "100%",
    height: 240,
    backgroundColor: "#000",
  },
  playButtonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  timeIndicator: {
    position: "absolute",
    top: "25%",
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  trimControlsContainer: {
    position: "relative",
    height: 80,
    marginBottom: 24,
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  thumbnailContainerWrapper: {
    position: "relative",
    height: 64,
  },
  thumbnailsContainer: {
    height: 64,
    backgroundColor: "#262626", // neutral-800
    borderRadius: 4,
  },
  thumbnailsRow: {
    flexDirection: "row",
    height: 64,
  },
  thumbnail: {
    width: 64,
    height: 64,
    opacity: 0.6,
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fullOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  selectionWindow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    borderWidth: 2,
    borderColor: "#6366f1", // theme color
    backgroundColor: "transparent",
  },
  positionIndicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#6366f1", // theme color
  },
  durationIndicator: {
    backgroundColor: "#262626", // neutral-800
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
});

export default function AddPostContainer({
  text,
  isAddPostContainerOpen,
}: {
  text: string;
  isAddPostContainerOpen: boolean;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  // Caption
  const [postText, setPostText] = useState("");
  const [placeholderText, setPlaceholderText] = useState(text.toString());
  // Image
  const [isImageRatioModalVisible, setIsImageRatioModalVisible] =
    useState(false);
  const [pickedImageUris, setPickedImageUris] = useState<string[]>([]);
  const [addPost, { isLoading }] = useAddPostMutation();
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<
    [number, number]
  >([3, 2]);

  // Video
  const [pickedVideoUri, setPickedVideoUri] = useState<string | null>(null);
  const [isVideoTrimmerVisible, setIsVideoTrimmerVisible] = useState(false);
  const [isTypeVideo, setTypeVideo] = useState<boolean>(false);
  const [isVideoTrimmed, setIsVideoTrimmed] = useState<boolean>(false);

  // Poll
  const [showPollInput, setShowPollInput] = useState(false);
  const [newPollOptions, setNewPollOptions] = useState<string[]>(["", ""]);
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  // Tagged Users
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);

  // Others
  const [activeIndex, setActiveIndex] = useState<any>(0);
  const [isAlertModalOpen, setAlertModalOpen] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
  const handlePostSubmit = useCallback(async () => {
    if (!isPostButtonEnabled) return;
    dispatch(resetUploadProgress());
    dispatch(setUploadLoading(true));
    dispatch(setAddPostContainerOpen(false));

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
        formData.append("assets1", file as any);
        formData.append("isVideo", "true");
      } else {
        pickedImageUris.forEach((uri, index) => {
          const file = {
            uri,
            name: `image_${index}.jpg`,
            type: isTypeVideo ? "video/mp4" : "image/jpeg",
          };
          formData.append(`assets${index + 1}`, file as any);
        });
      }

      formData.append("aspectRatio", JSON.stringify(selectedAspectRatio));
      formData.append("taggedUsers", JSON.stringify(taggedUsers));
      console.log("tagged Users : ", taggedUsers);
      // For poll
      const validOptions = newPollOptions.filter((opt) => opt.trim() !== "");
      console.log("Valid Options : ", validOptions);
      validOptions.forEach((option) => {
        formData.append("options", option);
      });

      setPostText("");
      setPickedImageUris([]);

      // Reset video states if needed
      if (isTypeVideo) {
        setPickedVideoUri(null);
        setTypeVideo(false);
      }

      await dispatch(uploadPost(formData)).unwrap();
    } catch (error) {
      console.error("Failed to add post:", error);
      showFeedback("Failed to add post. Please try again.");
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
    if (pickedImageUris.length === 0) {
      setIsImageRatioModalVisible(true);
    } else {
      addMoreImages();
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
        videoMaxDuration: 10 * 60,
        // allowsEditing: Platform.OS === "ios" && true,
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
    setIsVideoTrimmed(true);
    setIsVideoTrimmerVisible(false);
  };

  const handleOptionsChange = (updatedOptions: string[]) => {
    setNewPollOptions(updatedOptions);
  };

  // Handle open poll
  const handleOpenPoll = () => {
    setPlaceholderText("Add your question...");
    setShowPollInput(true);
  };

  // Handle close poll
  const handleClosePoll = () => {
    setShowPollInput(false);
    setPlaceholderText(text.toString());
    setNewPollOptions(["", ""]);
  };

  // Handle close trimmer
  const handleCloseTrimmer = () => {
    setIsVideoTrimmerVisible(false);
    setPickedVideoUri(null);
    setTypeVideo(false);
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
    setPickedVideoUri("");
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
      className="flex-1"
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
              <MentionHashtagInput2
                setPostText={setPostText}
                text={postText}
                setTaggedUsers={setTaggedUsers}
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

            {/* Only render VideoPlayer when there is a video */}
            {isTypeVideo && isVideoTrimmed && (
              <CustomVideoPlayer
                autoPlay={true}
                videoUri={pickedVideoUri as string}
              />
            )}

            {/* Pagination */}
            {/* {pickedImageUris.length > 1 && (
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
            )} */}
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
                disabled={
                  showPollInput || (isTypeVideo && pickedVideoUri !== null)
                }
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
                onPress={handleOpenPoll}
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
          onCancel={handleCloseTrimmer}
        />
      )}
    </Modal>
  );
}
