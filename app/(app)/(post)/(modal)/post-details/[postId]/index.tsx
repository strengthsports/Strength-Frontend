import React, { useCallback, useEffect, useRef, useState } from "react";
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
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { useFetchCommentsQuery } from "~/reduxStore/api/feed/features/feedApi.comment";
import { CommenterCard } from "~/components/feedPage/CommentModal";
import { Divider } from "react-native-elements";
import { AppDispatch, RootState } from "~/reduxStore";
import { Post } from "~/types/post";
import { useLocalSearchParams } from "expo-router";
import {
  postComment,
  selectPostById,
} from "~/reduxStore/slices/feed/feedSlice";
import { Platform } from "react-native";
import { Colors } from "~/constants/Colors";
import { Image } from "react-native";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import nopic from "@/assets/images/nopic.jpg";

const PostDetailsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams();
  const postId = params?.postId as string;
  const { user } = useSelector((state: RootState) => state.profile);
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  // Animated value for progress bar
  const progress = useRef(new Animated.Value(0)).current;

  const [commentText, setCommentText] = useState<string>("");
  const [isPosting, setIsPosting] = useState<boolean>(false);

  if (!post) {
    return <TextScallingFalse>Post not found</TextScallingFalse>;
  }

  const flatListRef = useRef<FlatList>(null);

  // On mount, scroll to the end (which, if inverted, scrolls to the top of the list)
  useEffect(() => {
    // Delay to allow layout to settle
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  // Fetch comments for the target
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

  const renderItem = useCallback(
    ({ item }: { item: Comment }) => (
      <CommenterCard
        comment={item}
        targetId={post?._id as string}
        targetType="Post"
      />
    ),
    [post?._id]
  );

  // Handle post comment
  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setIsPosting(true);
    setCommentText("");
    await dispatch(
      postComment({
        targetId: post._id,
        targetType: "Post", // or 'comment' etc.
        text: commentText,
      })
    ).unwrap();
    await refetchComments();
    setIsPosting(false);
  };

  // Loading while posting comment
  useEffect(() => {
    if (isPosting) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    } else {
      progress.setValue(0);
    }
  }, [isPosting, progress]);

  // ListHeaderComponent combining the TopBar, PostContainer and "Comments" title
  const ListHeader = () => (
    <View>
      <TopBar heading="" backHandler={() => router.back()} />
      <PostContainer item={post as Post} isFeedPage={false} />
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

  // Interpolate progress into a width percentage string.
  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          ref={flatListRef}
          data={[...(comments?.data || [])].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => (
            <View className="px-2">{renderItem({ item })}</View>
          )}
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
            {/* Static divider as background */}
            <Divider
              className="w-full rounded-full bg-neutral-700 mb-[1px]"
              width={0.3}
            />
            {/* Progress bar */}
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
              <View className="w-full flex-row items-center justify-around rounded-full bg-neutral-900 px-4 py-1.5">
                <Image
                  source={user?.profilePic ? { uri: user.profilePic } : nopic}
                  className="w-10 h-10 rounded-full"
                  resizeMode="cover"
                />
                <TextInput
                  autoFocus={true}
                  placeholder="Type your comment here"
                  className="flex-1 px-4 bg-neutral-900 text-white"
                  placeholderTextColor="grey"
                  cursorColor={Colors.themeColor}
                  value={commentText}
                  onChangeText={setCommentText}
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
