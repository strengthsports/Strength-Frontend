import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";
import { CommenterCard } from "./CommenterCard";
import { TouchableOpacity } from "react-native";
import TextScallingFalse from "../CentralText";
import { Colors } from "~/constants/Colors";

// Memoized Reply section to prevent unnecessary re-renders
const ReplySection = memo(
  ({
    commentId,
    replies,
    hasNextPage,
    loading,
    loadMoreReplies,
    handleReply,
    onDelete,
  }: {
    commentId: string;
    replies: Comment[];
    hasNextPage: boolean;
    loading: boolean;
    loadMoreReplies: (commentId: string) => void;
    handleReply: (comment: Comment) => void;
    onDelete: (comment: Comment) => void;
  }) => {
    const { user } = useSelector((state: RootState) => state.profile);
    if (replies.length === 0 && !loading) return <></>;

    return (
      <View className="ml-8 mt-2">
        {replies.map((reply) => (
          <CommenterCard
            key={reply._id}
            parent={reply.parentCommentId}
            comment={reply}
            targetId={commentId}
            targetType="Comment"
            onReply={handleReply}
            isOwnComment={user?._id === reply.postedBy._id}
            onDelete={onDelete}
          />
        ))}

        {hasNextPage && (
          <TouchableOpacity
            className="px-20 py-2"
            onPress={() => loadMoreReplies(commentId)}
          >
            <TextScallingFalse className="font-semibold text-theme">
              Show more replies...
            </TextScallingFalse>
          </TouchableOpacity>
        )}

        {loading && (
          <ActivityIndicator size="small" color={Colors.themeColor} />
        )}
      </View>
    );
  }
);

export default ReplySection;
