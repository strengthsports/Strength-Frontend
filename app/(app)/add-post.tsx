import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { useNavigation, useRouter } from "expo-router";
import AddPostHeader from "~/components/feedPage/AddPostHeader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "~/constants/Colors";
import { Divider } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import CustomImageSlider from "~/components/Cards/imageSlideContainer";
import AlertModal from "~/components/modals/AlertModal";
import PageThemeView from "~/components/PageThemeView";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import {
  setUploadLoading,
  uploadPost,
  setUploadPreviewData,
  UploadPreviewData,
} from "~/reduxStore/slices/post/postSlice";
import PollsIcon from "@/components/SvgIcons/addpost/PollsIcon";
import PollsContainer from "@/components/Cards/PollsContainer";
import { showFeedback } from "~/utils/feedbackToast";
import AddImageIcon from "@/components/SvgIcons/addpost/AddImageIcon";
import FeatureUnderDev from "@/components/modals/FeatureUnderDev";
import ClipsIcon from "@/components/SvgIcons/addpost/ClipsIcon";
import MentionHashtagInput2 from "@/components/MentionHashtagInput2";
import VideoPlayer from "@/components/PostContainer/VideoPlayer";
import AddImagePlusIcon from "~/components/SvgIcons/addpost/AddImagePlusIcon";
import * as VideoThumbnails from "expo-video-thumbnails";

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

// New: Modal for selecting video aspect ratio
const VideoRatioModal = React.memo(
  ({ pickVideo }: { pickVideo: (ratio: [number, number]) => void }) => (
    <View className="h-1/3 w-[104%] bg-neutral-900 self-center rounded-t-[40px] p-4 border-t border-x border-neutral-700">
      <Divider
        className="w-16 self-center rounded-full bg-neutral-700 my-1"
        width={4}
      />
      <TextScallingFalse className="text-white self-center text-4xl my-4">
        Select Video Aspect Ratio
      </TextScallingFalse>
      <View className="flex flex-row items-center">
        <View className="flex w-full gap-4 pr-8 mx-4">
          <Figure
            width={36}
            height={36}
            text="1:1"
            onPress={() => pickVideo([1, 1])}
          />
          <Figure
            width={36}
            height={24}
            text="3:2"
            onPress={() => pickVideo([3, 2])}
          />
          <Figure
            width={36}
            height={45}
            text="4:5"
            onPress={() => pickVideo([4, 5])}
          />
        </View>
      </View>
    </View>
  )
);

export default function AddPostContainer() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  // Caption
  const [postText, setPostText] = useState("");
  const [placeholderText, setPlaceholderText] = useState("What's on your mind");
  // Image
  const [isImageRatioModalVisible, setIsImageRatioModalVisible] =
    useState(false);
  const [pickedImageUris, setPickedImageUris] = useState<string[]>([]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<
    [number, number]
  >([3, 2]);

  // Video
  const [pickedVideoUri, setPickedVideoUri] = useState<string | null>(null);
  const [isTypeVideo, setTypeVideo] = useState<boolean>(false);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  // New: State for video aspect ratio modal
  const [isVideoRatioModalVisible, setIsVideoRatioModalVisible] =
    useState(false);

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
  const isSubmitting = React.useRef(false);

  useLayoutEffect(() => {
    const tabParent = navigation.getParent();
    tabParent?.setOptions({
      tabBarStyle: { display: "none" },
    });
    return () => {
      tabParent?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

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

  const isPostButtonEnabled = useMemo(() => {
    const validOptionsCount = newPollOptions.filter(
      (opt) => opt.trim() !== ""
    ).length;
    const pollValidation =
      !showPollInput || (showPollInput && validOptionsCount >= 2);
    if (isTypeVideo) {
      return pickedVideoUri !== null && pollValidation;
    }
    return (postText.trim() || pickedImageUris.length > 0) && pollValidation;
  }, [
    postText,
    pickedImageUris.length,
    showPollInput,
    newPollOptions,
    isTypeVideo,
    pickedVideoUri,
  ]);

  const hasUnsavedChanges = useMemo(() => {
    if (postText.trim().length > 0) return true;
    if (pickedImageUris.length > 0) return true;
    if (pickedVideoUri) return true;
    if (showPollInput) {
      return true;
    }
    return false;
  }, [postText, pickedImageUris, pickedVideoUri, showPollInput]);

  const handleAttemptGoBack = () => {
    if (hasUnsavedChanges) {
      setAlertModalOpen(true);
    } else {
      router.back();
    }
  };

  const handlePostSubmit = useCallback(async () => {
    if (!isPostButtonEnabled) return;
    isSubmitting.current = true;

    let previewData: UploadPreviewData | null = null;
    if (isTypeVideo && pickedVideoUri) {
      previewData = { type: "video", uri: pickedVideoUri };
    } else if (pickedImageUris.length > 0) {
      previewData = { type: "image", uri: pickedImageUris[0] };
    } else if (showPollInput) {
      previewData = { type: "poll" };
    } else if (postText.trim()) {
      previewData = { type: "text" };
    }

    dispatch(setUploadPreviewData(previewData));
    dispatch(setUploadLoading(true));
    router.back();

    try {
      const formData = new FormData();
      formData.append("caption", postText.trim());

      if (isTypeVideo && pickedVideoUri && thumbnailUri) {
        const file = {
          uri: pickedVideoUri,
          name: `video_${Date.now()}.mp4`,
          type: "video/mp4",
        };
        formData.append("assets1", file as any);

        const thumbnailFile = {
          uri: thumbnailUri,
          name: `thumbnail_${Date.now()}.jpg`,
          type: "image/jpeg",
        };
        formData.append("thumbnail", thumbnailFile as any);
        formData.append("isVideo", "true");
      } else {
        pickedImageUris.forEach((uri, index) => {
          const file = {
            uri,
            name: `image_${index}_${Date.now()}.jpg`,
            type: "image/jpeg",
          };
          formData.append(`assets${index + 1}`, file as any);
        });
      }

      formData.append("aspectRatio", JSON.stringify(selectedAspectRatio));
      formData.append("taggedUsers", JSON.stringify(taggedUsers));
      const validOptions = newPollOptions.filter((opt) => opt.trim() !== "");
      validOptions.forEach((option) => {
        formData.append("options", option);
      });

      setPostText("");
      setPickedImageUris([]);
      if (isTypeVideo) {
        setPickedVideoUri(null);
        setThumbnailUri(null);
        setTypeVideo(false);
      }
      setNewPollOptions(["", ""]);
      setShowPollInput(false);
      setPlaceholderText("What's on your mind");
      setTaggedUsers([]);

      await dispatch(uploadPost(formData)).unwrap();
    } catch (error) {
      console.error("Failed to add post:", error);
      showFeedback("Failed to add post. Please try again.");
    }
  }, [
    isPostButtonEnabled,
    dispatch,
    router,
    postText,
    isTypeVideo,
    pickedVideoUri,
    thumbnailUri,
    pickedImageUris,
    selectedAspectRatio,
    taggedUsers,
    newPollOptions,
    showPollInput,
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (isSubmitting.current || isAlertModalOpen || !hasUnsavedChanges) {
        if (isSubmitting.current) {
          isSubmitting.current = false;
        }
        return;
      }
      e.preventDefault();
      setAlertModalOpen(true);
    });
    return () => {
      unsubscribe();
      isSubmitting.current = false;
    };
  }, [navigation, isAlertModalOpen, hasUnsavedChanges]);

  const selectFirstImage = useCallback(async (ratio: [number, number]) => {
    setSelectedAspectRatio(ratio);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: ratio,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setPickedImageUris([uri]);
        setIsImageRatioModalVisible(false);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image. Please try again.");
    } finally {
      setIsImageRatioModalVisible(false);
    }
  }, []);

  const addMoreImages = useCallback(async () => {
    if (pickedImageUris.length === 0) {
      if (Platform.OS === "ios") {
        selectFirstImage([1, 1]);
      } else {
        setIsImageRatioModalVisible(true);
      }
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        aspect: selectedAspectRatio,
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
  }, [pickedImageUris.length, selectedAspectRatio, selectFirstImage]);

  const removeImage = useCallback((index: number) => {
    setPickedImageUris((prevUris) => prevUris.filter((_, i) => i !== index));
  }, []);

  const handlePickImageOrAddMore = useCallback(() => {
    if (pickedImageUris.length === 0) {
      if (Platform.OS === "ios") {
        selectFirstImage([1, 1]);
      } else {
        setIsImageRatioModalVisible(true);
      }
    } else {
      addMoreImages();
    }
  }, [addMoreImages, pickedImageUris.length, selectFirstImage]);

  const closeRatioModal = useCallback(() => {
    setIsImageRatioModalVisible(false);
  }, []);

  const handleSelectVideo = useCallback(() => {
    setIsVideoRatioModalVisible(true);
  }, []);

  const closeVideoRatioModal = useCallback(() => {
    setIsVideoRatioModalVisible(false);
  }, []);

  const pickVideoWithRatio = useCallback(async (ratio: [number, number]) => {
    setSelectedAspectRatio(ratio);
    setTypeVideo(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        videoMaxDuration: 10 * 60,
        allowsEditing: true, // Required to enforce aspect ratio
        aspect: ratio, // Apply the selected aspect ratio
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setPickedVideoUri(uri);

        try {
          const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(
            uri,
            { time: 1000 }
          );
          setThumbnailUri(thumbUri);
        } catch (error) {
          console.error("Error generating thumbnail:", error);
        }
      }
    } catch (error) {
      console.error("Error picking video:", error);
      alert("Failed to pick video. Please try again.");
    } finally {
      setIsVideoRatioModalVisible(false); // Close modal regardless of outcome
    }
  }, []);

  const handleOptionsChange = (updatedOptions: string[]) => {
    setNewPollOptions(updatedOptions);
  };

  const handleOpenPoll = () => {
    setPlaceholderText("Add your question...");
    setShowPollInput(true);
  };

  const handleClosePoll = () => {
    setShowPollInput(false);
    setPlaceholderText("What's on your mind");
    setNewPollOptions(["", ""]);
  };

  const handleDiscard = () => {
    setPostText("");
    setPickedImageUris([]);
    setPickedVideoUri(null);
    setThumbnailUri(null);
    setTypeVideo(false);
    setNewPollOptions(["", ""]);
    setShowPollInput(false);
    setTaggedUsers([]);
    setPlaceholderText("What's on your mind");
    setAlertModalOpen(false);
    router.back();
  };

  const handleCancelDiscard = () => {
    setAlertModalOpen(false);
  };

  const isAndroid = Platform.OS === "android";

  return (
    <PageThemeView>
      <View className="h-full">
        {/* Header */}
        <View
          className="flex flex-row items-center justify-between p-4"
          // style={{ maxHeight: 100 }}
        >
          <AddPostHeader onBackPress={handleAttemptGoBack} />
          <TouchableOpacity
            className={`px-6 py-1 rounded-full ${
              isPostButtonEnabled ? "bg-theme" : "bg-neutral-800"
            }`}
            onPress={handlePostSubmit}
            disabled={!isPostButtonEnabled}
          >
            <TextScallingFalse
              className={`${
                isPostButtonEnabled ? "text-white" : "text-neutral-500"
              } text-3xl font-semibold`}
            >
              Post
            </TextScallingFalse>
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

          {showPollInput && (
            <PollsContainer
              onClose={handleClosePoll}
              mode="create"
              options={newPollOptions}
              onOptionsChange={handleOptionsChange}
            />
          )}

          {pickedImageUris.length > 0 && (
            <CustomImageSlider
              images={pickedImageUris}
              aspectRatio={selectedAspectRatio}
              onRemoveImage={removeImage}
              setIndex={handleSetActiveIndex}
            />
          )}

          {isTypeVideo && pickedVideoUri && (
            <VideoPlayer
              videoSource={pickedVideoUri as string}
              onRemove={() => {
                setTypeVideo(false);
                setPickedVideoUri("");
              }}
              editable={true}
              aspectRatio={selectedAspectRatio}
            />
          )}
        </ScrollView>

        {showFeatureModal && (
          <FeatureUnderDev
            isVisible={showFeatureModal}
            onClose={() => setShowFeatureModal(false)}
          />
        )}

        {/* Footer */}
        <View style={{ paddingBottom: !isAndroid ? 10 : 0 }}>
          {postText.length >= 2990 && (
            <View
              style={{
                width: "93%",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#404040",
                paddingVertical: 4,
                borderRadius: 10,
                alignSelf: "center",
              }}
            >
              <TextScallingFalse
                style={{ color: "#909090", fontSize: 13, fontWeight: "400" }}
              >
                You are almost at the 3000 characters limit{postText.length}
                /3000
              </TextScallingFalse>
            </View>
          )}
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
              <TouchableOpacity
                activeOpacity={0.5}
                className="p-[5px] w-[35px]"
                onPress={handleSelectVideo}
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
                {pickedImageUris.length === 0 && (
                  <AddImageIcon
                    color={
                      showPollInput || (isTypeVideo && pickedVideoUri !== null)
                        ? "#737373"
                        : Colors.themeColor
                    }
                  />
                )}
                {pickedImageUris.length > 0 && (
                  <AddImagePlusIcon color={Colors.themeColor} />
                )}
              </TouchableOpacity>

              {/* Image Ratio Modal */}
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

              {/* New: Video Ratio Modal */}
              <Modal
                visible={isVideoRatioModalVisible}
                transparent
                animationType="slide"
                onRequestClose={closeVideoRatioModal}
              >
                <TouchableOpacity
                  className="flex-1 justify-end bg-black/50"
                  activeOpacity={1}
                  onPress={closeVideoRatioModal}
                >
                  <VideoRatioModal pickVideo={pickVideoWithRatio} />
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
      </View>

      {/* Alert Modal */}
      {isAlertModalOpen && (
        <AlertModal
          isVisible={isAlertModalOpen}
          alertConfig={{
            title: "Discard Post ?",
            message: "All your changes will be deleted",
            cancelMessage: "Cancel",
            confirmMessage: "Discard",
            confirmAction: handleDiscard,
            discardAction: handleCancelDiscard,
          }}
        />
      )}
    </PageThemeView>
  );
}
