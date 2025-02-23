import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React, { memo, useState } from "react";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Divider } from "react-native-elements";
import { useDeletePostMutation } from "~/reduxStore/api/feed/features/feedApi.DeletePost";
import { showFeedback } from "~/utils/feedbackToast";

const MoreModal = memo(
  ({
    firstName,
    followingStatus,
    isOwnPost,
    postId,
    onDelete, // Callback to handle post deletion
  }: {
    firstName: string;
    followingStatus: boolean;
    isOwnPost: boolean;
    postId: string; // Pass the postId to delete
    onDelete: () => void; // Callback to notify parent component after deletion
  }) => {
    const [deletePost, { isLoading }] = useDeletePostMutation(); // Use the delete mutation
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeletePost = async () => {
      try {
        setIsDeleting(true);
        await deletePost(postId).unwrap(); // Trigger the delete mutation
        onDelete()
        showFeedback("Post deleted successfully!", "success");

      } catch (error) {
        console.error("Failed to delete post:", error);
        showFeedback("Failed to delete post.");
      } finally {
        setIsDeleting(false);
      }
    };

    return (
      <View
        className={`min-h-64 w-[104%] bg-neutral-900 self-center rounded-t-[40px] border-t border-x border-neutral-700 p-4 ${
          isOwnPost ? "h-64" : "h-80"
        }`}
      >
        <Divider
          className="w-16 self-center rounded-full bg-neutral-700 my-1"
          width={4}
        />
        <View className="flex-1 justify-evenly">
          <TouchableOpacity className="flex-row items-center py-3 px-2 rounded-lg">
            <MaterialIcons name="bookmark-border" size={24} color="white" />
            <Text className="text-white ml-4">Bookmark</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg" 
          onPress={() => showFeedback("Checking Share Post!", "success")}>
            <FontAwesome name="share" size={20} color="white" />
            <Text className="text-white ml-4">Share</Text>
          </TouchableOpacity>
          {!isOwnPost && (
            <>
              <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
                <MaterialIcons name="report-problem" size={22} color="white" />
                <Text className="text-white ml-4">Report</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
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
      </View>
    );
  }
);

export default MoreModal;