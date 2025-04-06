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
  PanResponder,
  Dimensions,
} from "react-native";
import { Divider } from "react-native-elements";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
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
import { postComment, toggleLike } from "~/reduxStore/slices/feed/feedSlice";
import { User } from "~/types/user";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import StickyInput from "../ui/StickyInput";

interface ReportModalProps {
  commentId: string;
  targetId: string;
  targetType: string;
  showDelete: boolean;
}

// Memoized ReportModal component
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

// Memoized CommenterCard component
export const CommenterCard = memo(
  ({ comment, targetId, targetType, onReply, parent }: CommenterCardProps) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [isCommentLiked, setIsCommentLiked] = useState(false);
    const [commentLikesCount, setCommentLikesCount] = useState(
      comment.likesCount
    );
    const serializedUser = encodeURIComponent(
      JSON.stringify({
        id: comment?.postedBy?._id,
        type: comment?.postedBy?.type,
      })
    );

    // Handle like on comment
    const toggleLikeOnComment = async () => {
      try {
        if (isCommentLiked) {
          setIsCommentLiked(false);
          setCommentLikesCount((prev) => prev - 1);
          await dispatch(
            toggleLike({ targetId: comment._id, targetType: "Comment" })
          );
        } else {
          setIsCommentLiked(true);
          setCommentLikesCount((prev) => prev + 1);
          await dispatch(
            toggleLike({ targetId: comment._id, targetType: "Comment" })
          );
        }
      } catch (err) {
        console.log(err);
        if (isCommentLiked) {
          setIsCommentLiked(true);
          setCommentLikesCount((prev) => prev + 1);
        } else {
          setIsCommentLiked(false);
          setCommentLikesCount((prev) => prev - 1);
        }
      }
    };

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

          <TextScallingFalse
            className="text-[#12956B] font-medium mt-2"
            onPress={() =>
              router.push(`/(app)/(profile)/profile/${serializedUser}`)
            }
          >
            {targetType === "Comment" && "@" + parent?.postedBy?.username + " "}
            <TextScallingFalse className="text-xl font-normal text-white mt-4 mb-3">
              {comment?.text}
            </TextScallingFalse>
          </TextScallingFalse>
        </View>
        <View className="flex-row gap-2 items-center ml-10 mt-1">
          <TouchableOpacity onPress={toggleLikeOnComment}>
            <TextScallingFalse
              className={`${
                isCommentLiked ? "text-amber-400" : "text-white"
              } text-lg font-medium`}
            >
              {isCommentLiked ? "Liked" : "Like"}
            </TextScallingFalse>
          </TouchableOpacity>
          {commentLikesCount > 0 && (
            <TextScallingFalse className="text-[#939393] text-lg font-normal">
              {`• `} <AntDesign name="like1" size={12} color="#FABE25" />{" "}
              {` ${commentLikesCount}`}
            </TextScallingFalse>
          )}
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

interface CommentItemProps {
  item: Comment;
  targetId: string;
  handleReply: (comment: Comment) => void;
}

export const CommentItem = ({
  item,
  targetId,
  handleReply,
}: CommentItemProps) => {
  const [expanded, setExpanded] = useState(false);

  // Filter out invalid replies
  const validReplies = item.replies?.filter(
    (reply: any) => reply.text && reply.text.trim() !== ""
  );

  console.log("Replies : ", validReplies.length);

  return (
    <View style={{ paddingHorizontal: 8 }}>
      <CommenterCard
        comment={item}
        targetId={targetId}
        targetType="Post"
        onReply={handleReply}
      />
      {validReplies && validReplies.length > 0 && (
        <View style={{ marginLeft: 32, marginTop: 8 }}>
          {validReplies
            .slice(0, expanded ? validReplies.length : 1)
            .map((reply: any) => (
              <CommenterCard
                key={reply._id}
                parent={item}
                comment={reply}
                targetId={item._id} // reply's parent id
                targetType="Comment"
                onReply={handleReply}
              />
            ))}
          {!expanded && validReplies.length > 1 && (
            <TouchableOpacity onPress={() => setExpanded(true)}>
              <TextScallingFalse style={{ color: "#12956B", marginTop: 5 }}>
                Load more replies...
              </TextScallingFalse>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

interface CommentModalProps {
  autoFocusKeyboard?: boolean;
  targetId: string;
  onClose?: () => void;
}

const CommentModal = memo(
  ({ autoFocusKeyboard = false, targetId, onClose }: CommentModalProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state?.profile);
    const screenHeight = Dimensions.get("window").height;
    const bottomSheetHeight = screenHeight * 0.8;
    const snapThreshold = bottomSheetHeight / 3;
    const expandedHeight = screenHeight * 1;
    // The additional offset needed to reach the expanded state.
    const expandedOffset = expandedHeight - bottomSheetHeight;

    // Define thresholds for upward and downward gestures
    const upwardThreshold = 50; // User must drag up at least 50 px
    const downwardThreshold = 50; // User must drag down at least 50 px

    // Fetch comments for the target
    const {
      data: comments,
      error: fetchError,
      isLoading: isFetching,
      refetch: refetchComments,
    } = useFetchCommentsQuery({ targetId, targetType: "Post" });

    useEffect(() => {
      if (fetchError) {
        console.error("Failed to fetch comments:", fetchError);
      }
    }, [fetchError]);

    // Function to handle reply context from nested comment components
    const handleReply = (comment: Comment) => {
      const replyTag = `@${comment.postedBy.username}`;
      setReplyingTo({
        commentId: comment._id,
        name: replyTag,
      });
    };

    // Render each comment and its possible replies.
    const renderItem = useCallback(
      ({ item }: { item: Comment & { replies?: Comment[] } }) => (
        <CommentItem
          item={item}
          targetId={targetId}
          handleReply={handleReply}
        />
      ),
      [targetId, handleReply]
    );

    // Animated value for vertical translation
    const translateY = useRef(new Animated.Value(0)).current;
    // Keep track of the current offset (snap state): 0 = half, -expandedOffset = expanded
    // Closed state is handled via onClose.
    const baseOffset = useRef(0);

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          // Calculate the new position based on the gesture
          let newVal = baseOffset.current + gestureState.dy;
          // Clamp newVal between expanded state and closed state.
          newVal = Math.max(
            -expandedOffset,
            Math.min(bottomSheetHeight, newVal)
          );
          translateY.setValue(newVal);
        },
        onPanResponderRelease: (_, gestureState) => {
          const finalOffset = baseOffset.current + gestureState.dy;

          // If starting from the half state
          if (baseOffset.current === 0) {
            if (gestureState.dy < -upwardThreshold) {
              // Dragged up enough: snap to expanded
              Animated.spring(translateY, {
                toValue: -expandedOffset,
                useNativeDriver: true,
              }).start(() => {
                baseOffset.current = -expandedOffset;
              });
            } else if (gestureState.dy > downwardThreshold) {
              // Dragged down enough: snap to closed
              Animated.spring(translateY, {
                toValue: bottomSheetHeight,
                useNativeDriver: true,
              }).start(() => {
                onClose && onClose();
              });
            } else {
              // Not enough drag: return to half state
              Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            }
          }
          // If starting from the expanded state
          else if (baseOffset.current === -expandedOffset) {
            if (gestureState.dy > downwardThreshold) {
              // Dragged down enough: snap to half state
              Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
              }).start(() => {
                baseOffset.current = 0;
              });
            } else {
              // Not enough drag: remain expanded
              Animated.spring(translateY, {
                toValue: -expandedOffset,
                useNativeDriver: true,
              }).start();
            }
          }
        },
      })
    ).current;

    const [commentText, setCommentText] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<{
      commentId: string;
      name: string;
    } | null>(null);
    const progress = useRef(new Animated.Value(0)).current;

    const handleTextChange = (text: string) => {
      setCommentText(text);
      if (text === "" && replyingTo) {
        setReplyingTo(null);
      }
    };

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
      setCommentText("");
      setIsPosting(false);
    };

    return (
      <View style={styles.overlay} onStartShouldSetResponder={(event) => true}>
        <BlurView intensity={0} style={styles.blurBackground}>
          <TouchableOpacity style={styles.overlay} onPress={onClose} />
        </BlurView>
        {/* Bottom Sheet */}
        <Animated.View
          style={{
            // flex: 1,
            backgroundColor: "#000",
            height: bottomSheetHeight,
            transform: [{ translateY }],
          }}
          {...panResponder.panHandlers}
          className="w-[104%] self-center bg-black rounded-t-[40px] p-4 border-t border-x border-neutral-700"
        >
          <Divider
            className="w-16 self-center rounded-full bg-neutral-700 my-1"
            width={4}
          />
          <TextScallingFalse className="my-4 text-white text-5xl self-center">
            Comments
          </TextScallingFalse>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
          >
            <View style={{ flex: 1 }}>
              {isFetching ? (
                <ActivityIndicator size="large" color={Colors.themeColor} />
              ) : (
                <FlatList
                  data={[...(comments?.data || [])].sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )}
                  keyExtractor={(item) => item._id}
                  renderItem={renderItem}
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
                      ios: 100,
                      android: 120,
                    }),
                  }}
                />
              )}
            </View>
            <StickyInput
              user={user}
              value={commentText}
              onChangeText={handleTextChange}
              onSubmit={handlePostComment}
              isPosting={isPosting}
              replyingTo={replyingTo}
              progress={progress}
              placeholder="Type your comment here"
              autoFocus={true}
            />
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default CommentModal;
