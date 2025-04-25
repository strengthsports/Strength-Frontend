import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Keyboard,
  FlatList,
  ActivityIndicator,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  PanResponder,
} from "react-native";
import { Divider } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "~/constants/Colors";
import nopic from "@/assets/images/nopic.jpg";
import TextScallingFalse from "~/components/CentralText";
import { showFeedback } from "~/utils/feedbackToast";
import { CommenterCard } from "~/components/comment/CommenterCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import { postComment } from "~/reduxStore/slices/feed/feedSlice";
import {
  useLazyFetchCommentsQuery,
  useLazyFetchRepliesQuery,
} from "~/reduxStore/api/feed/features/feedApi.comment";
import { Comment } from "~/types/post";

const MAX_HEIGHT = 80;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const DRAG_THRESHOLD = 100;

// Modal header component
const ModalHeader = memo(() => {
  return (
    <View className="w-full flex-row items-center justify-between py-2 px-4 bg-black">
      <View className="flex-1">
        <TextScallingFalse className="text-white text-4xl font-semibold text-center">
          Comments
        </TextScallingFalse>
      </View>
    </View>
  );
});

// Reply section component (same as in your original code)
const ReplySection = memo(
  ({
    commentId,
    replies,
    hasNextPage,
    loading,
    loadMoreReplies,
    handleReply,
    parentComment,
  }) => {
    if (replies.length === 0 && !loading) return null;

    return (
      <View className="ml-8 mt-2">
        {replies.map((reply) => (
          <CommenterCard
            key={reply._id}
            parent={parentComment}
            comment={reply}
            targetId={commentId}
            targetType="Comment"
            onReply={handleReply}
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

const CommentModal = ({ targetId, onClose, autoFocusKeyboard = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.profile);

  // Animation values for modal gesture handling
  const translateY = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(1)).current;

  // Comment state management
  const [comments, setComments] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [replyStates, setReplyStates] = useState({});
  const [loadingComments, setLoadingComments] = useState(false);

  // Animated progress bar
  const progress = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const textInputRef = useRef(null);

  // State for comment input and reply context
  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const [replyingTo, setReplyingTo] = useState(null);

  // RTK Query hooks
  const [fetchComments] = useLazyFetchCommentsQuery();
  const [fetchReplies] = useLazyFetchRepliesQuery();

  // Setup pan gesture responder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          const newOpacity = Math.max(
            0,
            1 - gestureState.dy / (SCREEN_HEIGHT / 2)
          );
          modalOpacity.setValue(newOpacity);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DRAG_THRESHOLD) {
          // Swipe down - close the modal
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: SCREEN_HEIGHT,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(modalOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onClose();
          });
        } else {
          // Return to original position
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.timing(modalOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  // Focus input on mount if autoFocusKeyboard is true
  useEffect(() => {
    const timer = setTimeout(() => {
      if (autoFocusKeyboard && textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [autoFocusKeyboard]);

  // Load comments on mount
  useEffect(() => {
    loadComments(true);
  }, []);

  // Initial comments load
  const loadComments = useCallback(
    async (refresh = false) => {
      if ((loadingComments || !hasMoreComments) && !refresh) return;

      setLoadingComments(true);
      try {
        const response = await fetchComments({
          postId: targetId,
          limit: 4,
          cursor: refresh ? null : cursor,
        }).unwrap();

        if (response?.data) {
          const newComments = response.data.comments || [];

          if (refresh) {
            setComments(newComments);
          } else {
            setComments((prev) => [...prev, ...newComments]);
          }

          if (newComments.length > 0) {
            const lastComment = newComments[newComments.length - 1];
            setCursor(lastComment.createdAt);
          }

          setHasMoreComments(response.data.hasNextPage || false);
        } else {
          setHasMoreComments(false);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoadingComments(false);
      }
    },
    [fetchComments, targetId, cursor, loadingComments, hasMoreComments]
  );

  // Handle refreshing comments
  const handleRefresh = useCallback(() => {
    setCursor(null);
    setHasMoreComments(true);
    loadComments(true);
  }, [loadComments]);

  // Load more replies for a specific comment
  const loadMoreReplies = useCallback(
    async (commentId) => {
      // Get current reply state or initialize if it doesn't exist
      const currentState = replyStates[commentId] || {
        replies: [],
        cursor: null,
        hasNextPage: true,
        loading: false,
        replyCount: 0,
      };

      if (currentState.loading || !currentState.hasNextPage) return;

      // Update loading state
      setReplyStates((prev) => ({
        ...prev,
        [commentId]: { ...currentState, loading: true },
      }));

      try {
        const response = await fetchReplies({
          commentId,
          limit: 2,
          cursor: currentState.cursor,
        }).unwrap();

        if (response?.data) {
          const newReplies = response.data.replies || [];
          const updatedReplies = [...currentState.replies, ...newReplies];

          setReplyStates((prev) => ({
            ...prev,
            [commentId]: {
              replies: updatedReplies,
              cursor: response.data.endCursor,
              hasNextPage: response.data.hasNextPage,
              loading: false,
              replyCount:
                currentState.replyCount ||
                response.data.totalCount ||
                updatedReplies.length,
            },
          }));
        }
      } catch (error) {
        console.error(
          `Failed to fetch replies for comment ${commentId}:`,
          error
        );
        setReplyStates((prev) => ({
          ...prev,
          [commentId]: { ...prev[commentId], loading: false },
        }));
      }
    },
    [fetchReplies, replyStates]
  );

  // Initialize reply states for comments with replies
  useEffect(() => {
    const initializeReplyStates = async () => {
      for (const comment of comments) {
        // Only initialize for comments with replies that haven't been initialized yet
        if (
          comment.commentsCount > 0 &&
          (!replyStates[comment._id] ||
            replyStates[comment._id].replies.length === 0)
        ) {
          // Initialize the reply state if it doesn't exist
          if (!replyStates[comment._id]) {
            setReplyStates((prev) => ({
              ...prev,
              [comment._id]: {
                replies: [],
                cursor: null,
                hasNextPage: true,
                loading: false,
                replyCount: comment.commentsCount,
              },
            }));
          }

          // Load initial replies for this comment
          await loadMoreReplies(comment._id);
        }
      }
    };

    initializeReplyStates();
  }, [comments]);

  // Handle Reply button tap
  const handleReply = useCallback((comment) => {
    const replyTag = `@${comment.postedBy.username}`;
    setReplyingTo({ commentId: comment._id, name: replyTag });
    textInputRef.current?.focus();
  }, []);

  // Handle text change in comment input
  const handleTextChange = useCallback(
    (text) => {
      setCommentText(text);
      if (text === "" && replyingTo) {
        setReplyingTo(null);
      }
    },
    [replyingTo]
  );

  // Handle posting a new comment or reply
  const handlePostComment = useCallback(async () => {
    if (!commentText.trim() || isPosting) return;

    setIsPosting(true);
    const isReply = replyingTo !== null;
    const textToPost = commentText;
    const parentCommentId = isReply ? replyingTo.commentId : undefined;

    // Clear input and reply context immediately for better UX
    setCommentText("");
    if (isReply) setReplyingTo(null);

    try {
      const result = await dispatch(
        postComment({
          postId: targetId,
          parentCommentId,
          text: textToPost,
        })
      ).unwrap();

      // Handle the response
      if (result && result.data) {
        const newComment = {
          ...result.data,
          postedBy: {
            _id: user?._id,
            type: user?.type,
            profilePic: user?.profilePic,
            firstName: user?.firstName,
            lastName: user?.lastName,
            headline: user?.headline,
            username: user?.username,
          },
        };

        // Show message
        isReply
          ? showFeedback("Reply sent", "success")
          : showFeedback("Comment posted successfully", "success");
        // Dismiss keyboard
        Keyboard.dismiss();

        if (isReply) {
          // Add the new reply to its parent comment's replies
          setReplyStates((prev) => {
            const currentReplies = prev[parentCommentId]?.replies || [];
            const currentCount = prev[parentCommentId]?.replyCount || 0;

            return {
              ...prev,
              [parentCommentId]: {
                ...prev[parentCommentId],
                replies: [newComment, ...currentReplies],
                replyCount: currentCount + 1,
                hasNextPage: true,
              },
            };
          });
        } else {
          // Add the new comment to the top of the comments list
          setComments((prev) => [newComment, ...prev]);
          // Scroll to top
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsPosting(false);
    }
  }, [commentText, dispatch, targetId, replyingTo, isPosting, user]);

  // Animate the progress bar while posting
  useEffect(() => {
    if (isPosting) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();
    } else {
      progress.setValue(0);
    }
  }, [isPosting, progress]);

  // Memoize renderItem to avoid unnecessary re-renders
  const renderItem = useCallback(
    ({ item }) => {
      const replyState = replyStates[item._id] || {
        replies: [],
        cursor: null,
        hasNextPage: item.commentsCount > 0,
        loading: false,
        replyCount: item.commentsCount,
      };

      return (
        <View className="px-2 mb-4">
          <CommenterCard
            comment={item}
            targetId={targetId}
            targetType="Post"
            onReply={handleReply}
          />

          {item.commentsCount > 0 && (
            <ReplySection
              commentId={item._id}
              replies={replyState.replies}
              hasNextPage={
                replyState.hasNextPage && replyState.replies.length > 2
              }
              loading={replyState.loading}
              loadMoreReplies={loadMoreReplies}
              handleReply={handleReply}
              parentComment={item}
            />
          )}
        </View>
      );
    },
    [replyStates, handleReply, loadMoreReplies, targetId]
  );

  // Memoize keyExtractor to avoid re-renders
  const keyExtractor = useCallback((item) => item._id, []);

  // Memoize progress bar width animation
  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // Memoize empty component
  const ListEmptyComponent = useCallback(() => {
    if (loadingComments) {
      return (
        <View className="flex-1 justify-center items-center py-10">
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      );
    }

    return (
      <View className="flex-1 justify-center items-center py-10">
        <TextScallingFalse className="text-gray-500 text-center">
          Drop the first comment and start the chant!
        </TextScallingFalse>
      </View>
    );
  }, [loadingComments]);

  // Drag indicator at the top for visual cue
  const DragIndicator = () => (
    <View className="w-full items-center pt-5 pb-3">
      <View className="w-14 h-1.5 bg-neutral-700 rounded-full" />
    </View>
  );

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        opacity: modalOpacity,
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          width: "104%",
          alignSelf: "center",
          paddingHorizontal: 10,
          backgroundColor: "black",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          marginTop: 50,
          transform: [{ translateY: translateY }],
          borderTopWidth: 0.7,
          borderLeftWidth: 0.7,
          borderRightWidth: 0.7,
          borderColor: "#656565",
        }}
      >
        <View {...panResponder.panHandlers}>
          <DragIndicator />
          <ModalHeader />
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={comments}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 120,
              paddingHorizontal: 8,
            }}
            onEndReached={() => {
              if (!loadingComments && hasMoreComments) {
                loadComments();
              }
            }}
            onEndReachedThreshold={0.3}
            onRefresh={handleRefresh}
            refreshing={loadingComments && cursor === null}
            removeClippedSubviews={Platform.OS === "android"}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={10}
          />

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
                <View
                  className={`w-full flex-row ${
                    inputHeight <= 40
                      ? "items-center rounded-full"
                      : "items-end rounded-2xl"
                  } bg-neutral-900 px-4 py-1.5`}
                >
                  <Image
                    source={user?.profilePic ? { uri: user.profilePic } : nopic}
                    className="w-10 h-10 rounded-full"
                    resizeMode="cover"
                  />
                  {replyingTo && (
                    <TouchableOpacity
                      onPress={() => setReplyingTo(null)}
                      className="flex-row items-center bg-neutral-800 px-2 py-1 rounded-lg ml-2"
                    >
                      <TextScallingFalse className="text-theme mr-1">
                        {replyingTo.name}
                      </TextScallingFalse>
                      <MaterialIcons
                        name="close"
                        size={14}
                        color={Colors.themeColor}
                      />
                    </TouchableOpacity>
                  )}
                  <TextInput
                    ref={textInputRef}
                    placeholder="Type your comment here"
                    className="flex-1 px-4 bg-neutral-900 text-white"
                    style={{
                      height: Math.min(Math.max(40, inputHeight), MAX_HEIGHT),
                      maxHeight: MAX_HEIGHT,
                    }}
                    multiline={true}
                    textAlignVertical="top"
                    onContentSizeChange={(event) =>
                      setInputHeight(
                        Math.min(
                          event.nativeEvent.contentSize.height,
                          MAX_HEIGHT
                        )
                      )
                    }
                    scrollEnabled={inputHeight >= MAX_HEIGHT}
                    placeholderTextColor="grey"
                    cursorColor={Colors.themeColor}
                    value={commentText}
                    onChangeText={handleTextChange}
                  />
                  <TouchableOpacity
                    onPress={handlePostComment}
                    disabled={isPosting || !commentText.trim()}
                    className="p-1"
                  >
                    <MaterialIcons
                      name="send"
                      size={22}
                      color={
                        isPosting || !commentText.trim()
                          ? "#565656"
                          : Colors.themeColor
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Animated.View>
  );
};

export default CommentModal;
