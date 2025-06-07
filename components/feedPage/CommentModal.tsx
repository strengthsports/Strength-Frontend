import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Keyboard,
  FlatList,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";
import { Colors } from "~/constants/Colors";
import { showFeedback } from "~/utils/feedbackToast";
import { CommenterCard } from "~/components/comment/CommenterCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import CommentNotFound from "../notfound/commentNotFound";
import CommentInput from "../comment/CommentInput";
import {
  deleteComment,
  postComment,
} from "~/reduxStore/slices/post/postActions";
import ReplySection from "../comment/ReplySection";
import { ReplyPaginationState } from "~/app/(app)/post-details/[postId]";
import { fetchComments, fetchReplies } from "~/api/comment/fetchComments";
import { Comment } from "~/types/post";

const CommentModal = ({
  targetId,
  onClose,
  autoFocusKeyboard = false,
}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.profile);
  const didLoadOnce = useRef(false);

  // Comment state management
  const [comments, setComments] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [replyStates, setReplyStates] = useState<ReplyPaginationState>({});
  const [loadingComments, setLoadingComments] = useState(false);

  // Animated progress bar
  const progress = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const textInputRef = useRef(null);

  // State for comment input and reply context
  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [rootCommentId, setRootCommentId] = useState("");

  // Add keyboard height state
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Focus input on mount if autoFocusKeyboard is true
  useEffect(() => {
    const timer = setTimeout(() => {
      if (autoFocusKeyboard && textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [autoFocusKeyboard]);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Load comments on mount
  useEffect(() => {
    console.log("useEffect running");
    if (!didLoadOnce.current) {
      didLoadOnce.current = true;
      loadComments();
    }
  }, []);

  // Initial comments load
  const loadComments = async (refresh = false) => {
    console.log("Load comments called");
    if ((loadingComments || !hasMoreComments) && !refresh) return;

    setLoadingComments(true);
    try {
      const response = await fetchComments({
        postId: targetId,
        limit: 4,
        cursor: refresh ? null : cursor,
      });

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
  };

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
          cursor: currentState.cursor as string,
        });

        if (response?.data) {
          const newReplies = response.data.replies || [];
          const updatedReplies = [...currentState.replies, ...newReplies];

          setReplyStates((prev) => ({
            ...prev,
            [commentId]: {
              replies: updatedReplies || [],
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
    };

    initializeReplyStates();
  }, [comments]);

  // Handle Reply button tap
  const handleReply = useCallback((comment: Comment) => {
    const replyTag = `${
      comment.postedBy.firstName + " " + comment.postedBy.lastName
    }`;
    setReplyingTo({
      commentId: comment._id,
      name: replyTag,
      username: comment.postedBy.username,
    });
    textInputRef.current?.focus();
    setRootCommentId(comment.rootCommentId || comment._id);
  }, []);

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
        // Scroll to top
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

        if (isReply) {
          // Add the new reply to its parent comment's replies
          setReplyStates((prev) => {
            const current = prev[rootCommentId] ?? {
              replies: [],
              cursor: null,
              hasNextPage: false,
              loading: false,
            };

            return {
              ...prev,
              [rootCommentId]: {
                ...current,
                replies: [newComment, ...current.replies],
                replyCount: current.replyCount + 1,
              },
            };
          });
          // incrementReplyCount(rootCommentId as string);
        } else {
          // Add the new comment to the top of the comments list
          setComments((prev) => [newComment, ...prev]);
          setReplyStates((prev) => {
            return {
              ...prev,
              [newComment._id]: {
                replies: [],
                replyCount: 0,
              },
            };
          });
        }
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsPosting(false);
    }
  }, [commentText, dispatch, targetId, replyingTo, isPosting, user]);

  // Handle delete a comment
  const handleDeleteComment = useCallback(
    (comment) => {
      dispatch(deleteComment({ postId: targetId, commentId: comment._id }));
      setComments((prevComments) =>
        prevComments.filter((c) => c._id !== comment._id)
      );
      showFeedback(`Comment deleted`, "success");
    },
    [targetId, dispatch]
  );

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
    ({ item }: { item: Comment }) => {
      const baseState = replyStates[item._id] ?? {};
      const replyState = {
        replies: baseState.replies ?? [],
        cursor: baseState.cursor ?? null,
        hasNextPage: baseState.hasNextPage ?? item.commentsCount > 2,
        loading: baseState.loading ?? false,
        replyCount: item.commentsCount,
      };

      return (
        <View className="px-2 mb-4">
          <CommenterCard
            comment={item}
            commentCount={replyState.replyCount}
            targetId={targetId}
            targetType="Post"
            onReply={handleReply}
            isOwnComment={user?._id === item.postedBy._id}
            onDelete={handleDeleteComment}
          />

          {replyState.replies.length > 0 && (
            <ReplySection
              commentId={item._id}
              replies={replyState.replies}
              hasNextPage={replyState.hasNextPage}
              loading={replyState.loading}
              loadMoreReplies={loadMoreReplies}
              handleReply={handleReply}
              onDelete={handleDeleteComment}
            />
          )}
        </View>
      );
    },
    [replyStates, handleReply, loadMoreReplies, targetId]
  );

  // Memoize keyExtractor to avoid re-renders
  const keyExtractor = useCallback((item: any) => item._id, []);

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
        <CommentNotFound />
      </View>
    );
  }, [loadingComments]);

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={comments}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps="handled"
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: keyboardHeight > 0 ? keyboardHeight + 50 : 80,
          paddingHorizontal: 8,
        }}
        onEndReached={() => {
          if (!loadingComments && hasMoreComments && comments.length > 0) {
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

      <View
        style={{
          position: "absolute",
          bottom: keyboardHeight,
          left: 0,
          right: 0,
          backgroundColor: "black",
          zIndex: 9999,
          elevation: 10,
        }}
        pointerEvents="auto"
      >
        {isPosting && (
          <Animated.View
            style={{
              height: 4,
              width: widthInterpolated,
              backgroundColor: "#12956B",
            }}
          />
        )}
        <CommentInput
          handlePostComment={handlePostComment}
          isPosting={isPosting}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          user={user}
          textInputRef={textInputRef}
          commentText={commentText}
          setCommentText={setCommentText}
        />
      </View>
    </>
  );
};

export default CommentModal;
