import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "~/components/TopBar";
import { useNavigation, useRouter } from "expo-router";
import PostContainer from "~/components/Cards/postContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  View,
  Animated,
  Platform,
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
import { Colors } from "~/constants/Colors";
import PageThemeView from "~/components/PageThemeView";
import { CommenterCard } from "~/components/comment/CommenterCard";
import { showFeedback } from "~/utils/feedbackToast";
import CommentInput from "~/components/comment/CommentInput";
import { addPost, selectPostById } from "~/reduxStore/slices/post/postsSlice";
import {
  deleteComment,
  postComment,
} from "~/reduxStore/slices/post/postActions";
import { fetchPostById } from "~/api/post/fetchPostById";
import ReplySection from "~/components/comment/ReplySection";

export type ReplyPaginationState = {
  [commentId: string]: {
    replies: Comment[];
    cursor: string | null;
    hasNextPage: boolean;
    loading: boolean;
    [key: string]: any;
  };
};

// Extracted and memoized ListHeader component
const ListHeader = memo(
  ({ post, router }: { post: Post; router: ReturnType<typeof useRouter> }) => {
    return (
      <View>
        <TopBar heading="" backHandler={() => router.back()} />
        <PostContainer
          item={post}
          isFeedPage={false}
          isPostDetailsPage={true}
        />
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

const PostDetailsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const postId = params?.postId as string;
  const { user } = useSelector((state: RootState) => state.profile);
  let post = useSelector((state: RootState) => selectPostById(state, postId));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    name: string;
  } | null>(null);
  const [rootCommentId, setRootCommentId] = useState("");

  // RTK Query hooks
  const [fetchComments] = useLazyFetchCommentsQuery();
  const [fetchReplies] = useLazyFetchRepliesQuery();

  // Fallback to db for post fetching
  useEffect(() => {
    const loadPost = async () => {
      if (!postId || post) return; // Skip if post exists or no postId

      setIsLoading(true);
      setError(null);

      try {
        // Dispatch the async thunk and unwrap the result to handle errors
        post = await fetchPostById({ postId });
        dispatch(addPost(post));
      } catch (err: any) {
        setError(err.message || "Failed to fetch post");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId, dispatch, post]);

  useLayoutEffect(() => {
    const tabParent = navigation.getParent();

    tabParent?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      tabParent?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  // Initial comments load
  const loadComments = useCallback(
    async (refresh = false) => {
      if ((loadingComments || !hasMoreComments) && !refresh) return;

      setLoadingComments(true);
      try {
        const response = await fetchComments({
          postId,
          limit: 10,
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
          limit: 3,
          cursor: currentState.cursor,
        }).unwrap();

        // console.log(response.data.replies);

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
    const replyTag = `${comment.postedBy.firstName} ${comment.postedBy.lastName}`;
    setReplyingTo({ commentId: comment._id, name: replyTag });
    textInputRef.current?.focus();

    // console.log("Comment", comment);
    // console.log("Root : ", comment.rootCommentId || comment._id);
    setRootCommentId(comment.rootCommentId || comment._id);
  }, []);

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
          postId: postId,
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
          // console.log("\n\nIs reply : ", isReply);
          // console.log("\nNew Comment : ", newComment);
          // Add the new reply to its parent comment's replies
          setReplyStates((prev) => {
            const current = prev[rootCommentId] ?? {
              replies: [],
              cursor: null,
              hasNextPage: false,
              loading: false,
            };

            // console.log("Target Id : ", targetId);
            // console.log("Rootcomment Id : ", rootCommentId);
            // console.log("State to be set : ", {
            //   ...prev,
            //   [rootCommentId]: {
            //     ...current,
            //     replies: [newComment, ...current.replies],
            //     replyCount: current.replyCount,
            //   },
            // });

            return {
              ...prev,
              [rootCommentId]: {
                ...current,
                replies: [newComment, ...current.replies],
                replyCount: current.replyCount + 1,
              },
            };
          });
          incrementReplyCount(rootCommentId as string);
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
  }, [commentText, dispatch, postId, replyingTo, isPosting]);

  // Handle delete a comment
  const handleDeleteComment = useCallback(
    (comment) => {
      dispatch(deleteComment({ postId, commentId: comment._id }));
      setComments((prevComments) =>
        prevComments.filter((c) => c._id !== comment._id)
      );
      showFeedback(`Comment deleted`, "success");
    },
    [postId, dispatch]
  );

  const incrementReplyCount = (commentId: string) =>
    setReplyStates((prev) => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        replyCount: (prev[commentId]?.replyCount || 0) + 1,
      },
    }));

  const decrementReplyCount = (commentId: string) =>
    setReplyStates((prev) => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        replyCount: Math.max(0, (prev[commentId]?.replyCount || 0) - 1),
      },
    }));

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
        replyCount: item.commentsCount, // Explicitly use item.commentsCount here
      };

      return (
        <View className="px-2 mb-4">
          <CommenterCard
            comment={item}
            commentCount={replyState.replyCount}
            targetId={postId}
            targetType="Post"
            onReply={handleReply}
            isOwnComment={user?._id === item.postedBy._id}
            onDelete={handleDeleteComment}
          />

          {(item.commentsCount > 0 || replyState.replyCount > 0) && (
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
    [replyStates, handleReply, loadMoreReplies, postId]
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

  if (isLoading) {
    return (
      <PageThemeView>
        <ActivityIndicator size="large" color="white" />
      </PageThemeView>
    );
  }

  if (error) {
    return (
      <PageThemeView>
        <TextScallingFalse className="text-white">{error}</TextScallingFalse>
      </PageThemeView>
    );
  }

  // Handle error if post not found
  if (!post) {
    return (
      <PageThemeView>
        <TextScallingFalse className="text-white text-lg">
          Post not found
        </TextScallingFalse>
      </PageThemeView>
    );
  }

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
          showsVerticalScrollIndicator={false}
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
