import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React, { memo, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  Platform,
  ToastAndroid,
} from "react-native";
import { Divider } from "react-native-elements";
import { useDeletePostMutation } from "~/reduxStore/api/feed/features/feedApi.DeletePost";
import { showFeedback } from "~/utils/feedbackToast";
import TextScallingFalse from "../CentralText";
import Toast from "react-native-toast-message";

const MoreModal = memo(
  ({
    firstName,
    followingStatus,
    isReported,
    isOwnPost,
    postId,
    onDelete, // Callback to handle post deletion
    handleFollow,
    handleUnfollow,
    handleReport,
  }: {
    firstName: string;
    followingStatus: boolean;
    isReported: boolean;
    isOwnPost: boolean;
    postId: string; // Pass the postId to delete
    onDelete: () => void; // Callback to notify parent component after deletion
    handleFollow: () => void;
    handleUnfollow: () => void;
    handleReport: (reason: string) => void;
  }) => {
    const isAndroid = Platform.OS === "android";
    const [deletePost, { isLoading }] = useDeletePostMutation(); // Use the delete mutation
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [isOptionsVisible, setOptionsVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

    const handleDeletePost = async () => {
      try {
        setIsDeleting(true);
        await deletePost(postId).unwrap(); // Trigger the delete mutation
        onDelete();
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

    const postReport = () => {
      handleReport(selectedOption);
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
      <View
        className={` w-[104%] bg-neutral-900 self-center rounded-t-[40px] border-t border-x border-neutral-700 p-4 ${
          isOwnPost ? "h-44" : "h-64"
        }`}
        onStartShouldSetResponder={() => true}
      >
        <View className="w-16 h-1 self-center rounded-full bg-neutral-200 my-1" />

        <View className="flex-1 justify-evenly">
          <TouchableOpacity
            className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg"
            onPress={() => showFeedback("Checking Share Post!", "success")}
          >
            <FontAwesome name="share" size={20} color="white" />
            <Text className="text-white ml-4">Share</Text>
          </TouchableOpacity>
          {!isOwnPost && (
            <>
              <TouchableOpacity
                className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg"
                onPress={() => isReported || setReportModalOpen(true)}
                disabled={isReported}
              >
                <MaterialIcons
                  name="report-problem"
                  size={22}
                  color={isReported ? "#808080" : "white"}
                />
                <Text
                  className={`${
                    isReported ? "text-[#808080]" : "text-white"
                  } ml-4`}
                >
                  {isReported ? "Reported" : "Report"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg"
                onPress={followingStatus ? handleUnfollow : handleFollow}
              >
                <FontAwesome name="user-plus" size={19} color="white" />
                <Text className="text-white ml-4">
                  {followingStatus
                    ? `Unfollow ${firstName}`
                    : `Follow ${firstName}`}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {isOwnPost && (
            <TouchableOpacity
              className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg"
              onPress={handleDeletePost}
              disabled={isLoading || isDeleting}
            >
              {isLoading || isDeleting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialIcons name="delete" size={22} color="white" />
                  <Text className="text-white ml-4">Delete Post</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/**Report Modal */}
        <Modal
          visible={isReportModalOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setReportModalOpen(false)}
        >
          <TouchableOpacity
            className="flex-1 justify-start bg-black p-6"
            activeOpacity={1}
          >
            <View>
              <TextScallingFalse className="text-white text-6xl mb-4">
                Report Post
              </TextScallingFalse>
              <TextScallingFalse className="text-white font-light">
                Select the reason to help protect and uphold your priorities and
                the integrity of the sports community as a whole
              </TextScallingFalse>
            </View>
            <View className="flex-1">
              <View className="mt-4 flex-row justify-between items-center border-b border-[#808080]">
                <TextInput editable={false}>
                  <Text className="text-white">
                    {selectedOption || "Choose"}
                  </Text>
                </TextInput>
                <TouchableOpacity
                  onPress={() =>
                    isOptionsVisible
                      ? setOptionsVisible(false)
                      : setOptionsVisible(true)
                  }
                  className="border border-[#808080] px-2.5 py-[0.10rem] rounded-lg"
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
                        <Text className="text-2xl text-white">{item}</Text>
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
                <TextScallingFalse className="text-4xl text-[#303030]">
                  Cancel
                </TextScallingFalse>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={postReport}
                disabled={!selectedOption}
              >
                <TextScallingFalse
                  className={`text-4xl ${
                    selectedOption ? "text-[#808080]" : "text-[#303030]"
                  }`}
                >
                  Report
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
