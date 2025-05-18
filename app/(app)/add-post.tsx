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
import { useNavigation, useRouter, useFocusEffect } from "expo-router";
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
import * as MediaLibrary from "expo-media-library";
import {
  resetUploadProgress,
  setUploadLoading,
  uploadPost,
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
import ThisFeatureUnderDev from "~/components/modals/ThisFeatureUnderDev";
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
  const navigation = useNavigation();
  // Caption
  const [postText, setPostText] = useState("");
  const [placeholderText, setPlaceholderText] = useState("What's on your mind");
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
  const [isTypeVideo, setTypeVideo] = useState<boolean>(false);

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

  const hasUnsavedChanges = useMemo(() => {
    if (postText.trim().length > 0) return true;
    if (pickedImageUris.length > 0) return true;
    if (pickedVideoUri) return true;
    if (showPollInput) {
      return true;
    }
    return false;
  }, [postText, pickedImageUris, pickedVideoUri, showPollInput]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (isAlertModalOpen || !hasUnsavedChanges) {
        return;
      }

      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Show the alert modal
      setAlertModalOpen(true);
    });

    return unsubscribe; // Cleanup the listener when the component unmounts
  }, [navigation, isAlertModalOpen, hasUnsavedChanges, router]);

  // Called by the header's back button
  const handleAttemptGoBack = () => {
    if (hasUnsavedChanges) {
      setAlertModalOpen(true);
    } else {
      router.back();
    }
  };

  // Use callbacks for event handlers to prevent unnecessary re-renders
  const handlePostSubmit = useCallback(async () => {
    if (!isPostButtonEnabled) return;
    dispatch(resetUploadProgress());
    dispatch(setUploadLoading(true));
    // dispatch(setAddPostContainerOpen(false));
    router.back();

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
    console.log("yes selectFirstImage is called");
    setSelectedAspectRatio(ratio);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      });
      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setPickedVideoUri(uri);
      }
    } catch (error) {
      console.error("Error picking video:", error);
      alert("Failed to pick video. Please try again.");
    }
  }, []);

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
    setPlaceholderText("What's on your mind");
    setNewPollOptions(["", ""]);
  };

  // const handleCloseAddPostContainer = () => {
  //   if ((isPostButtonEnabled || showPollInput) && !isAlertModalOpen) {
  //     setAlertModalOpen(true);
  //   } else if (isAlertModalOpen) {
  //     setPostText("");
  //     setAlertModalOpen(false);
  //     //   dispatch(setAddPostContainerOpen(false));
  //     router.back();
  //   } else {
  //     //   dispatch(setAddPostContainerOpen(false));
  //     router.back();
  //   }
  // };

  const handleDiscard = () => {
    setPostText("");
    setPickedImageUris([]);
    setPickedVideoUri(null);
    setTypeVideo(false);
    setNewPollOptions(["", ""]); // Reset poll options
    setShowPollInput(false); // Hide poll input
    setTaggedUsers([]); // Reset tagged users
    setPlaceholderText("What's on your mind"); // Reset placeholder

    // dispatch(resetUploadProgress()); // Uncomment if you have this action and it's relevant
    // dispatch(setUploadLoading(false)); // Reset loading state if necessary

    setAlertModalOpen(false); // Close the modal
    console.log("Discard pressed. Navigating back."); // For debugging
    router.back();
  };

  const handleCancelDiscard = () => {
    setAlertModalOpen(false); // Just close the modal, user can continue editing
  };

  return (
    
      <PageThemeView>
        <View className="h-full">
          {/* Header */}
          <View className="flex flex-row items-center justify-between p-4">
            <AddPostHeader onBackPress={handleAttemptGoBack} />
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
            {isTypeVideo && pickedVideoUri && (
              <VideoPlayer
                videoSource={pickedVideoUri as string}
                onRemove={() => {
                  setTypeVideo(false);
                  setPickedVideoUri("");
                }}
                editable={true}
              />
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
              discardAction: handleCancelDiscard,
            }}
          />
        )}
      </PageThemeView>
 
  );
}
