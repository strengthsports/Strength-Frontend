import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "~/components/TopBar";
import { useRouter } from "expo-router";
import PostContainer from "~/components/Cards/postContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  View,
  Animated,
  Platform,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import {
  useLazyFetchCommentsQuery,
  useLazyFetchRepliesQuery,
} from "~/reduxStore/api/feed/features/feedApi.comment";
import { Divider } from "react-native-elements";
import { AppDispatch, RootState } from "~/reduxStore";
import { Comment, Post } from "~/types/post";
import { useLocalSearchParams } from "expo-router";
import {
  postComment,
  selectPostById,
} from "~/reduxStore/slices/feed/feedSlice";
import { Colors } from "~/constants/Colors";
import nopic from "@/assets/images/nopic.jpg";
import { MaterialIcons } from "@expo/vector-icons";
import PageThemeView from "~/components/PageThemeView";
import { CommenterCard } from "~/components/comment/CommenterCard";
import { showFeedback } from "~/utils/feedbackToast";
import CommentInput from "~/components/comment/CommentInput";

const MAX_HEIGHT = 80;

type ReplyPaginationState = {
  [commentId: string]: {
    replies: Comment[];
    cursor: string | null;
    hasNextPage: boolean;
    loading: boolean;
    replyCount: number;
  };
};

// Extracted and memoized ListHeader component
const ListHeader = memo(
  ({ post, router }: { post: Post; router: ReturnType<typeof useRouter> }) => {
    return (
      <View>
        <TopBar heading="" backHandler={() => router.back()} />
        <PostContainer item={post} isFeedPage={false} />
        <View className="px-4 py-4">
          <View className="relative">
            <TextScallingFalse className="text-white text-5xl mb-2">
              Comments
            </TextScallingFalse>
            <Divider
              className="absolute top-4 right-0 w-[70%] rounded-full bg-neutral-700 opacity-25"
              width={0.3}
            />
          </View>
        </View>
      </View>
    );
  }
);

// Memoized Reply section to prevent unnecessary re-renders
const ReplySection = memo(
  ({
    commentId,
    replies,
    hasNextPage,
    loading,
    loadMoreReplies,
    handleReply,
    parentComment,
  }: {
    commentId: string;
    replies: Comment[];
    hasNextPage: boolean;
    loading: boolean;
    loadMoreReplies: (commentId: string) => void;
    handleReply: (comment: Comment) => void;
    parentComment: Comment;
  }) => {
    if (replies.length === 0 && !loading) return null;

    console.log(hasNextPage);

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

const PostDetailsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams();
  const postId = params?.postId as string;
  const { user } = useSelector((state: RootState) => state.profile);
  const post = useSelector((state: RootState) => selectPostById(state, postId));

  // Comment state management
  const [comments, setComments] = useState<Comment[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [replyStates, setReplyStates] = useState<ReplyPaginationState>({});
  const [loadingComments, setLoadingComments] = useState<boolean>(false);

  // Animated progress bar
  const progress = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const textInputRef = useRef<TextInput>(null);

  // State for comment input and reply context
  const [commentText, setCommentText] = useState<string>("");
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [inputHeight, setInputHeight] = useState(40);
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    name: string;
  } | null>(null);

  // RTK Query hooks
  const [fetchComments] = useLazyFetchCommentsQuery();
  const [fetchReplies] = useLazyFetchRepliesQuery();

  // Handle error if post not found
  if (!post) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-black">
        <TextScallingFalse className="text-white text-lg">
          Post not found
        </TextScallingFalse>
      </SafeAreaView>
    );
  }

  // Initial comments load
  const loadComments = useCallback(
    async (refresh = false) => {
      if ((loadingComments || !hasMoreComments) && !refresh) return;

      setLoadingComments(true);
      try {
        const response = await fetchComments({
          postId,
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
    [fetchComments, postId, cursor, loadingComments, hasMoreComments]
  );

  // Handle refreshing comments
  const handleRefresh = useCallback(() => {
    setCursor(null);
    setHasMoreComments(true);
    loadComments(true);
  }, [loadComments]);

  // Initial fetch on mount
  useEffect(() => {
    loadComments(true);
  }, []);

  // Load more replies for a specific comment
  const loadMoreReplies = useCallback(
    async (commentId: string) => {
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

        console.log(response);

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
  const handleReply = useCallback((comment: Comment) => {
    const replyTag = `@${comment.postedBy.username}`;
    setReplyingTo({ commentId: comment._id, name: replyTag });
    textInputRef.current?.focus();
  }, []);

  // Handle text change in comment input
  const handleTextChange = useCallback(
    (text: string) => {
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
    const targetId = isReply ? replyingTo!.commentId : undefined;

    // Clear input and reply context immediately for better UX
    setCommentText("");
    if (isReply) setReplyingTo(null);

    try {
      const result = await dispatch(
        postComment({
          postId: post._id,
          parentCommentId: targetId,
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
            const currentReplies = prev[targetId as string]?.replies || [];
            const currentCount = prev[targetId as string]?.replyCount || 0;

            return {
              ...prev,
              [targetId as string]: {
                ...prev[targetId as string],
                replies: [newComment, ...currentReplies],
                replyCount: currentCount + 1,
                hasNextPage: true,
              },
            };
          });
        } else {
          // Add the new comment to the top of the comments list
          setComments((prev) => [newComment, ...prev]);
        }
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsPosting(false);
    }
  }, [commentText, dispatch, post._id, replyingTo, isPosting]);

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
            targetId={post._id}
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
    [replyStates, handleReply, loadMoreReplies, post._id]
  );

  // Memoize keyExtractor to avoid re-renders
  const keyExtractor = useCallback((item: Comment) => item._id, []);

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

  return (
    <PageThemeView>
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
          ListHeaderComponent={<ListHeader post={post} router={router} />}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 120,
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
        </View>
      </KeyboardAvoidingView>
    </PageThemeView>
  );
};

export default PostDetailsPage;
