import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  SetStateAction,
  useRef,
} from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { Divider } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "~/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import TextScallingFalse from "../CentralText";
import {
  useDeleteCommentMutation,
  useFetchCommentsQuery,
  usePostCommentMutation,
} from "~/reduxStore/api/feed/features/feedApi.comment";
import nopic from "@/assets/images/nopic.jpg";
import { Comment } from "~/types/post";
import { KeyboardAvoidingView } from "react-native";
import { Animated } from "react-native";
import { postComment } from "~/reduxStore/slices/feed/feedSlice";
import { User } from "~/types/user";

interface ReportModalProps {
  commentId: string;
  targetId: string;
  targetType: string;
  showDelete: boolean;
}

// Memoized CommenterCard component
const ReportModal = memo(
  ({ commentId, targetId, targetType, showDelete }: ReportModalProps) => {
    const [deleteComment, { isLoading: isDeleting }] =
      useDeleteCommentMutation();
    const { refetch: refetchComments } = useFetchCommentsQuery({
      targetId,
      targetType: "Post",
    });

    const handleDeleteComment = async () => {
      try {
        // console.log('Deleting comment with ID:', commentId);
        // console.log('Target ID:', targetId);
        // console.log('Target Type:', targetType);
        // console.log('Deletion in progress:', isDeleting);

        const response = await deleteComment({
          commentId,
          targetId,
          targetType,
        }).unwrap();
        refetchComments(); //refresh page after deletion
        console.log("Deletion successful:", response);
      } catch (error) {
        console.error("Deletion failed:", error);
      }
    };
    return (
      <>
        <View className="h-28 w-[104%] bg-neutral-900 self-center rounded-t-[40px] p-4 border-t border-x border-neutral-700">
          <Divider
            className="w-16 self-center rounded-full bg-neutral-700 my-1"
            width={4}
          />
          <View className="flex-1 justify-evenly">
            {/* <Text className="text-neutral-500 text-xxs text-center mt-1">Comment ID: {commentId}</Text> */}

            {showDelete ? (
              //comment options for my comments
              <TouchableOpacity
                className="flex-row items-center py-2 px-2 active:bg-neutral-800 rounded-lg"
                onPress={handleDeleteComment}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color={Colors.themeColor} />
                ) : (
                  <MaterialIcons name="delete" size={20} color="red" />
                )}
                <TextScallingFalse className="text-red-600 ml-4">
                  Delete
                </TextScallingFalse>
              </TouchableOpacity>
            ) : (
              //comment options for others comment
              <TouchableOpacity className="flex-row items-center py-2 px-2 active:bg-neutral-800 rounded-lg">
                <MaterialIcons name="report-problem" size={18} color="white" />
                <TextScallingFalse className="text-white ml-4">
                  Report
                </TextScallingFalse>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </>
    );
  }
);

interface CommenterCardProps {
  comment: Comment;
  targetId: string;
  targetType: string;
  onReply?: (comment: Comment) => void;
  parent?: Comment;
}

export const CommenterCard = memo(
  ({ comment, targetId, targetType, onReply, parent }: CommenterCardProps) => {
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);

    return (
      <View className="pl-12 pr-1 py-2 my-2 relative">
        <TouchableOpacity
          className={`${
            targetType === "Comment" ? "size-12 top-2" : "size-14 top-0"
          } absolute left-4 z-10 aspect-square rounded-full bg-slate-400`}
        >
          <Image
            className="w-full h-full rounded-full"
            source={
              comment?.postedBy?.profilePic
                ? { uri: comment.postedBy.profilePic }
                : nopic
            }
          />
        </TouchableOpacity>
        <View
          className={`relative ${
            targetType === "Comment"
              ? "ml-6 rounded-xl rounded-tl-none px-5"
              : "w-full rounded-xl px-10"
          } bg-neutral-900 py-2`}
        >
          <View className="absolute right-3 top-2 flex flex-row items-center gap-2">
            <TextScallingFalse className="text-xs text-neutral-300">
              1w
            </TextScallingFalse>
            <TouchableOpacity onPress={() => setIsReportModalVisible(true)}>
              <MaterialIcons name="more-horiz" size={16} color="white" />
              {isReportModalVisible && (
                <Modal
                  visible={isReportModalVisible}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setIsReportModalVisible(false)}
                >
                  {/* Report modal code here */}
                </Modal>
              )}
            </TouchableOpacity>
          </View>
          <View>
            <TextScallingFalse className="font-bold text-white text-lg">
              {comment?.postedBy?.firstName} {comment?.postedBy?.lastName}
            </TextScallingFalse>
            <TextScallingFalse
              className="text-xs w-4/5 text-[#EAEAEA]"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              @{comment?.postedBy?.username} | {comment?.postedBy?.headline}
            </TextScallingFalse>
          </View>
          <TextScallingFalse className="text-xl text-white mt-4 mb-3">
            <TextScallingFalse className="text-[#12956B] font-medium">
              {targetType === "Comment" &&
                "@" + parent?.postedBy?.username + " "}
            </TextScallingFalse>
            {comment?.text}
          </TextScallingFalse>
        </View>
        <View className="flex-row gap-2 items-center ml-10 mt-1">
          <TouchableOpacity>
            <TextScallingFalse className="text-white text-lg font-medium">
              Like
            </TextScallingFalse>
          </TouchableOpacity>
          <TextScallingFalse className="text-2xl text-[#939393]">
            |
          </TextScallingFalse>
          <TouchableOpacity onPress={() => onReply && onReply(comment)}>
            <TextScallingFalse className="text-white text-lg font-medium">
              Reply{" "}
            </TextScallingFalse>
          </TouchableOpacity>
          <TextScallingFalse className="mt-1 text-xl text-[#939393] font-normal">
            {comment.commentsCount > 0 && `• ${comment.commentsCount} replies`}
          </TextScallingFalse>
        </View>
      </View>
    );
  }
);

interface CommentModalProps {
  autoFocusKeyboard?: boolean;
  targetId: string;
  setCommentCount?: React.Dispatch<React.SetStateAction<number>>;
  containerHeight?: number;
}

// Memoized CommentModal component
const CommentModal = memo(
  ({
    autoFocusKeyboard = false,
    targetId,
    setCommentCount,
    containerHeight,
  }: CommentModalProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector(
      (state: RootState) => state.profile.user as User
    );
    // The additional comment text (excludes the fixed reply tag)
    const [commentText, setCommentText] = useState<string>("");
    const [isPosting, setIsPosting] = useState<boolean>(false);

    // Fetch comments for the target
    const {
      data: comments,
      error: fetchError,
      isLoading: isFetching,
      refetch: refetchComments,
    } = useFetchCommentsQuery({ targetId, targetType: "Post" });

    // Animated progress bar
    const progress = useRef(new Animated.Value(0)).current;
    // Reply context: when replying, store the parent comment's id and name.
    const flatListRef = useRef<FlatList>(null);
    const textInputRef = useRef<TextInput>(null);
    const [replyingTo, setReplyingTo] = useState<{
      commentId: string;
      name: string;
    } | null>(null);

    // Handle posting a new comment or reply.
    const handlePostComment = async () => {
      if (!commentText.trim()) return;
      setIsPosting(true);
      const isReply = replyingTo !== null;
      const textToPost = commentText;
      // Clear the input and reply context.
      setCommentText("");
      if (isReply) setReplyingTo(null);
      try {
        await dispatch(
          postComment({
            targetId: isReply ? replyingTo!.commentId : targetId,
            targetType: isReply ? "Comment" : "Post",
            text: textToPost,
          })
        ).unwrap();
        await refetchComments();
      } catch (error) {
        console.log("Failed to post comment:", error);
      }
      setIsPosting(false);
    };

    // When the Reply button is tapped, store the reply context.
    const handleReply = (comment: Comment) => {
      const replyTag = `@${comment.postedBy.username}`;
      setReplyingTo({
        commentId: comment._id,
        name: replyTag,
      });
      // Focus the input so the user can type their reply.
      textInputRef.current?.focus();
    };

    // Update text input state. If user clears the input, remove the reply context.
    const handleTextChange = (text: string) => {
      setCommentText(text);
      if (text === "" && replyingTo) {
        setReplyingTo(null);
      }
    };

    useEffect(() => {
      if (fetchError) {
        console.error("Failed to fetch comments:", fetchError);
      }
    }, [fetchError]);

    // Render top-level comment and its nested replies.
    const renderItem = useCallback(
      ({ item }: { item: Comment & { replies?: Comment[] } }) => {
        // Filter out any replies that do not have valid text
        const validReplies = item.replies?.filter(
          (reply) => reply.text && reply.text.trim() !== ""
        );
        return (
          <View className="px-2">
            <CommenterCard
              comment={item}
              targetId={targetId}
              targetType="Post"
              onReply={handleReply}
            />
            {validReplies && validReplies.length > 0 && (
              <View className="ml-8 mt-2">
                {validReplies.map((reply) => (
                  <CommenterCard
                    key={reply._id}
                    parent={item}
                    comment={reply}
                    targetId={item._id} // reply's parent id
                    targetType="Comment"
                    onReply={handleReply}
                  />
                ))}
              </View>
            )}
          </View>
        );
      },
      [targetId]
    );

    const widthInterpolated = progress.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    });

    return (
      <View className="relative h-full flex-1">
        <TextScallingFalse className="text-white self-center text-5xl my-4">
          Comments
        </TextScallingFalse>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.select({
            ios: 60, // Adjust this value based on your header height
            android: 0,
          })}
        >
          <View className="flex-1">
            {isFetching ? (
              <ActivityIndicator size="large" color={Colors.themeColor} />
            ) : (
              <FlatList
                ref={flatListRef}
                data={[...(comments?.data || [])].sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => renderItem({ item })}
                ListEmptyComponent={
                  <TextScallingFalse
                    style={{
                      color: "grey",
                      textAlign: "center",
                      paddingTop: 20,
                    }}
                  >
                    Hey! Be the first one to comment here!
                  </TextScallingFalse>
                }
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: Platform.select({
                    ios: 100, // Extra padding for iOS keyboard
                    android: 120,
                  }),
                }}
              />
            )}
          </View>

          {/* Sticky comment input bar */}
          <View className="absolute left-0 right-0 bottom-0">
            <View className="bg-black">
              <Divider
                className="w-full rounded-full bg-neutral-700 mb-[1px]"
                width={0.3}
              />
              {isPosting && (
                <Animated.View
                  style={{
                    height: 4,
                    width: widthInterpolated,
                    backgroundColor: "#12956B",
                  }}
                />
              )}
              <View className="bg-black p-2">
                <View className="w-full flex-row items-center rounded-full bg-neutral-900 px-4 py-1.5">
                  <Image
                    source={user?.profilePic ? { uri: user.profilePic } : nopic}
                    className="w-10 h-10 rounded-full"
                    resizeMode="cover"
                  />
                  {/* Fixed reply tag (if replying) */}
                  {replyingTo && (
                    <View
                      style={{
                        backgroundColor: "#333",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        marginLeft: 8,
                      }}
                    >
                      <TextScallingFalse
                        style={{ color: Colors.themeColor, fontWeight: "600" }}
                      >
                        {replyingTo.name}
                      </TextScallingFalse>
                    </View>
                  )}
                  {/* The text input holds only the additional comment text */}
                  <TextInput
                    ref={textInputRef}
                    autoFocus={true}
                    placeholder="Type your comment here"
                    className="flex-1 px-4 bg-neutral-900 text-white"
                    placeholderTextColor="grey"
                    cursorColor={Colors.themeColor}
                    value={commentText}
                    onChangeText={handleTextChange}
                  />
                  <TouchableOpacity
                    onPress={handlePostComment}
                    disabled={isPosting}
                  >
                    <MaterialIcons
                      className="p-2"
                      name="send"
                      size={22}
                      color={
                        isPosting
                          ? "#292A2D"
                          : commentText
                          ? Colors.themeColor
                          : "grey"
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
);

export default CommentModal;
