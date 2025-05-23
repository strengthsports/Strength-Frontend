import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React, { memo, useState } from "react";
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  Platform,
  ToastAndroid,
} from "react-native";
import { showFeedback } from "~/utils/feedbackToast";
import TextScallingFalse from "../CentralText";
import Toast from "react-native-toast-message";
import { ReportPost } from "~/types/post";
import { useReport } from "~/hooks/useReport";
import PageThemeView from "../PageThemeView";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { deletePost } from "~/reduxStore/slices/post/postActions";

const modalText = "text-white ml-4 text-4xl font-[500px]";
const modalOption = "flex-row items-center py-3 px-2 active:bg-neutral-900";

const MoreModal = memo(
  ({
    firstName,
    followingStatus,
    isReported,
    isOwnPost,
    postId,
    handleFollow,
    handleUnfollow,
    handleShare,
  }: {
    firstName: string;
    followingStatus: boolean;
    isReported: boolean;
    isOwnPost: boolean;
    postId: string;
    handleFollow?: () => void;
    handleUnfollow?: () => void;
    handleShare?: () => void;
  }) => {
    const isAndroid = Platform.OS === "android";
    const dispatch = useDispatch<AppDispatch>();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [isOptionsVisible, setOptionsVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

    const { reportPost } = useReport();

    const handleDeletePost = async () => {
      try {
        setIsDeleting(true);
        dispatch(deletePost({ postId })); // Trigger the delete mutation
        // onDelete()
        showFeedback("Post deleted successfully!", "success");
      } catch (error) {
        console.error("Failed to delete post:", error);
        showFeedback("Failed to delete post.");
      } finally {
        setIsDeleting(false);
      }
    };

    const handleSelectOption = (option: string) => {
      setSelectedOption(option);
      setOptionsVisible(false);
    };

    //handle report
    const handleReport = async () => {
      // setIsReported((prev) => !prev);
      const reportData: ReportPost = {
        targetId: postId,
        targetType: "Post",
        reason: selectedOption,
      };

      await reportPost(reportData);
      isAndroid
        ? ToastAndroid.show("Post Reported", ToastAndroid.SHORT)
        : Toast.show({
            type: "success",
            text1: "Post Reported",
            visibilityTime: 3000,
            autoHide: true,
          });
      setReportModalOpen(false);
    };

    return (
      <View className="w-full" onStartShouldSetResponder={() => true}>
        <TouchableOpacity
          className={modalOption}
          onPress={handleShare}
          activeOpacity={0.5}
        >
          <FontAwesome name="share" size={20} color="white" />
          <TextScallingFalse className={modalText}>Share</TextScallingFalse>
        </TouchableOpacity>
        {!isOwnPost && (
          <>
            <TouchableOpacity
              className={modalOption}
              onPress={() => isReported || setReportModalOpen(true)}
              disabled={isReported}
            >
              <MaterialIcons
                name="report-problem"
                size={22}
                color={isReported ? "#808080" : "white"}
              />
              <TextScallingFalse
                className={`${
                  isReported ? "text-[#808080]" : "text-white"
                } ml-4 text-4xl`}
              >
                {isReported ? "Reported" : "Report"}
              </TextScallingFalse>
            </TouchableOpacity>
            <TouchableOpacity
              className={modalOption}
              onPress={followingStatus ? handleUnfollow : handleFollow}
            >
              <FontAwesome name="user-plus" size={19} color="white" />
              <TextScallingFalse className={modalText}>
                {followingStatus
                  ? `Unfollow ${firstName}`
                  : `Follow ${firstName}`}
              </TextScallingFalse>
            </TouchableOpacity>
          </>
        )}
        {isOwnPost && (
          <TouchableOpacity
            className={modalOption}
            onPress={handleDeletePost}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialIcons name="delete" size={22} color="white" />
                <TextScallingFalse className={modalText}>
                  Delete Post
                </TextScallingFalse>
              </>
            )}
          </TouchableOpacity>
        )}

        {/**Report Modal */}
        <Modal
          visible={isReportModalOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setReportModalOpen(false)}
        >
          <PageThemeView>
            <TouchableOpacity
              className="flex-1 justify-start p-6"
              activeOpacity={1}
            >
              <View>
                <TextScallingFalse className="text-white text-6xl mb-4">
                  Report Post
                </TextScallingFalse>
                <TextScallingFalse className="text-white font-light">
                  Select the reason to help protect and uphold your priorities
                  and the integrity of the sports community as a whole
                </TextScallingFalse>
              </View>
              <View className="flex-1">
                <View className="mt-6 flex-row justify-between items-center border-b border-[#fff]">
                  <TextInput editable={false}>
                    <TextScallingFalse className="text-white">
                      {selectedOption || "Choose"}
                    </TextScallingFalse>
                  </TextInput>
                  <TouchableOpacity
                    onPress={() =>
                      isOptionsVisible
                        ? setOptionsVisible(false)
                        : setOptionsVisible(true)
                    }
                    className="border border-[#808080] px-2.5 py-1.5 rounded-lg mb-2"
                  >
                    {isOptionsVisible ? (
                      <AntDesign
                        name="close"
                        onPress={() => setOptionsVisible(false)}
                        size={14}
                        color="white"
                      />
                    ) : (
                      <AntDesign name="down" size={14} color="white" />
                    )}
                  </TouchableOpacity>
                </View>
                {isOptionsVisible && (
                  <FlatList
                    data={options}
                    renderItem={({ item }) => (
                      <View className="py-2.5 border-b border-[#808080]">
                        <TouchableOpacity
                          onPress={() => handleSelectOption(item)} // set selected option
                        >
                          <TextScallingFalse className="text-2xl text-white">
                            {item}
                          </TextScallingFalse>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                )}
              </View>
              <View className="flex-row justify-around items-center">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedOption("");
                    setReportModalOpen(false);
                  }}
                >
                  <TextScallingFalse className="text-4xl text-[#CECECE]">
                    Cancel
                  </TextScallingFalse>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleReport}
                  disabled={!selectedOption}
                >
                  <TextScallingFalse
                    className={`text-4xl ${
                      selectedOption ? "text-[#CF3131]" : "text-[#303030]"
                    }`}
                  >
                    Report
                  </TextScallingFalse>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </PageThemeView>
        </Modal>
      </View>
    );
  }
);

const options = [
  "Misinformation",
  "Hateful speech",
  "Harassment",
  "Sexual content",
  "Fraud or scam",
  "Self-harm",
  "Spam",
  "Fake account",
  "Hacked account",
]; // list of options

export default MoreModal;
