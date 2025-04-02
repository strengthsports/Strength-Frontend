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
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { useFetchCommentsQuery } from "~/reduxStore/api/feed/features/feedApi.comment";
import { CommenterCard } from "~/components/feedPage/CommentModal";
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

const MAX_HEIGHT = 80;

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

const PostDetailsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams();
  const postId = params?.postId as string;
  const { user } = useSelector((state: RootState) => state.profile);
  const post = useSelector((state: RootState) => selectPostById(state, postId));

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

  if (!post) {
    return <TextScallingFalse>Post not found</TextScallingFalse>;
  }

  // Scroll to end on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  // Fetch comments for the post.
  const {
    data: comments,
    error: fetchError,
    isLoading: isFetching,
    refetch: refetchComments,
  } = useFetchCommentsQuery({ targetId: post._id, targetType: "Post" });

  useEffect(() => {
    if (fetchError) {
      console.error("Failed to fetch comments:", fetchError);
    }
  }, [fetchError]);

  // Memoized sorted comments array
  const sortedComments = useMemo(() => {
    return [...(comments?.data || [])].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [comments?.data]);

  // Handle Reply button tap
  const handleReply = useCallback((comment: Comment) => {
    const replyTag = `@${comment.postedBy.username}`;
    setReplyingTo({ commentId: comment._id, name: replyTag });
    textInputRef.current?.focus();
  }, []);

  // Memoize text change handler
  const handleTextChange = useCallback(
    (text: string) => {
      setCommentText(text);
      if (text === "" && replyingTo) {
        setReplyingTo(null);
      }
    },
    [replyingTo]
  );

  // Handle posting a new comment or reply.
  const handlePostComment = useCallback(async () => {
    if (!commentText.trim()) return;
    setIsPosting(true);
    const isReply = replyingTo !== null;
    const textToPost = commentText;
    setCommentText("");
    if (isReply) setReplyingTo(null);
    try {
      await dispatch(
        postComment({
          targetId: isReply ? replyingTo!.commentId : post._id,
          targetType: isReply ? "Comment" : "Post",
          text: textToPost,
        })
      ).unwrap();
      await refetchComments();
    } catch (error) {
      console.log("Failed to post comment:", error);
    } finally {
      setIsPosting(false);
    }
  }, [commentText, dispatch, post._id, refetchComments, replyingTo]);

  // Animate the progress bar while posting.
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
    ({ item }: { item: Comment & { replies?: Comment[] } }) => {
      const validReplies = item.replies?.filter(
        (reply) => reply.text && reply.text.trim() !== ""
      );
      return (
        <View className="px-2">
          <CommenterCard
            comment={item}
            targetId={post._id}
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
                  targetId={item._id}
                  targetType="Comment"
                  onReply={handleReply}
                />
              ))}
            </View>
          )}
        </View>
      );
    },
    [handleReply, post._id]
  );

  const widthInterpolated = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
      }),
    [progress]
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          ref={flatListRef}
          data={sortedComments}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={<ListHeader post={post} router={router} />}
          renderItem={({ item }) => renderItem({ item })}
          inverted={false}
          ListEmptyComponent={
            isFetching ? (
              <ActivityIndicator size="large" color={Colors.themeColor} />
            ) : (
              <TextScallingFalse
                style={{
                  color: "grey",
                  textAlign: "center",
                  paddingTop: 20,
                }}
              >
                Hey! Be the first one to comment here!
              </TextScallingFalse>
            )
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
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
                <TextInput
                  ref={textInputRef}
                  autoFocus={true}
                  placeholder="Type your comment here"
                  className="flex-1 px-4 bg-neutral-900 text-white"
                  style={{ height: Math.max(40, inputHeight) }}
                  multiline={true}
                  textAlignVertical="top"
                  onContentSizeChange={(event) =>
                    setInputHeight(event.nativeEvent.contentSize.height)
                  }
                  scrollEnabled={inputHeight >= MAX_HEIGHT}
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
    </SafeAreaView>
  );
};

export default PostDetailsPage;
