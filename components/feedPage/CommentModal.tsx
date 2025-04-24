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
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "~/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import TextScallingFalse from "../CentralText";
import { useLazyFetchCommentsQuery } from "~/reduxStore/api/feed/features/feedApi.comment";
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
import emptyLike from "@/assets/images/emptyLike.jpg";
import { CommenterCard } from "../comment/CommenterCard";

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
  return (
    <View style={{ paddingHorizontal: 8 }}>
      <CommenterCard
        comment={item}
        targetId={targetId}
        targetType="Post"
        onReply={handleReply}
      />
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
    const [comments, setComments] = useState([]);
    const [cursor, setCursor] = useState(null);
    const screenHeight = Dimensions.get("window").height;
    const bottomSheetHeight = screenHeight * 0.8;
    const snapThreshold = bottomSheetHeight / 3;
    const expandedHeight = screenHeight * 1;
    // The additional offset needed to reach the expanded state.
    const expandedOffset = expandedHeight - bottomSheetHeight;

    // Define thresholds for upward and downward gestures
    const upwardThreshold = 50; // User must drag up at least 50 px
    const downwardThreshold = 50; // User must drag down at least 50 px

    const [fetchComments, { data, isFetching }] = useLazyFetchCommentsQuery();

    const loadMoreComments = async () => {
      const response = await fetchComments({
        postId: targetId,
        limit: 10,
        cursor,
      });
      console.log("Comments : ", response);
      if (response?.data?.data?.comments?.length) {
        setComments((prev) => [...prev, ...response.data.data.comments]);
        const lastComment = response.data.comments.at(-1);
        setCursor(lastComment.createdAt); // Update cursor for next call
      }
    };

    useEffect(() => {
      loadMoreComments(); // initial fetch
    }, []);

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
                  data={[...(comments || [])].sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )}
                  keyExtractor={(item) => item._id}
                  renderItem={renderItem}
                  ListEmptyComponent={
                    <View
                      className="justify-center items-center"
                      style={{
                        paddingTop: bottomSheetHeight / 4,
                        rowGap: 10,
                      }}
                    >
                      <Image
                        source={emptyLike}
                        style={{
                          borderRadius: 100,
                          width: 70,
                          height: 70,
                        }}
                      />
                      <TextScallingFalse className="text-2xl text-[#808080] text-center">
                        Drop the first comment and start the chant!
                      </TextScallingFalse>
                      <TouchableOpacity className="rounded-full px-5 py-1.5 border border-white flex-row gap-x-3 items-center">
                        <Feather
                          name="message-square"
                          size={16}
                          color="white"
                        />
                        <TextScallingFalse className="text-white">
                          Leave a comment
                        </TextScallingFalse>
                      </TouchableOpacity>
                    </View>
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
