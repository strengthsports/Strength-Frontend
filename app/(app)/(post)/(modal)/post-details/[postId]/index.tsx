import React, { useCallback, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "~/components/TopBar";
import { useRouter } from "expo-router";
import PostContainer from "~/components/Cards/postContainer";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import {
  useFetchCommentsQuery,
  usePostCommentMutation,
} from "~/reduxStore/api/feed/features/feedApi.comment";
import { CommenterCard } from "~/components/feedPage/CommentModal";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import { Image } from "react-native";
import nopic from "@/assets/images/nopic.jpg";
import { Colors } from "~/constants/Colors";

const PostDetailsPage = () => {
  const { currentPost: postDetails, user } = useSelector(
    (state: RootState) => state.profile
  );
  const router = useRouter();

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
  } = useFetchCommentsQuery({ targetId: postDetails._id, targetType: "Post" });

  const [postComment, { isLoading: isPosting }] = usePostCommentMutation();

  // const handlePostComment = async () => {
  //   if (!commentText.trim()) return;
  //   const commentData = {
  //     targetId,
  //     targetType: "Post",
  //     text: commentText,
  //   };
  //   setCommentCount((prevCount) => prevCount + 1);
  //   try {
  //     await postComment(commentData).unwrap(); // Post the comment
  //     setCommentText("");
  //     refetchComments(); // Refetch comments to update the list
  //   } catch (error) {
  //     setCommentCount((prevCount) => prevCount - 1);
  //     console.log("Failed to post comment:", error);
  //   }
  // };

  useEffect(() => {
    if (fetchError) {
      console.error("Failed to fetch comments:", fetchError);
    }
  }, [fetchError]);

  const renderItem = useCallback(
    ({ item }: { item: Comment }) => (
      <CommenterCard
        comment={item}
        targetId={postDetails._id}
        targetType="Post"
      />
    ),
    [postDetails._id]
  );

  // ListHeaderComponent combining the TopBar, PostContainer and "Comments" title
  const ListHeader = () => (
    <View>
      <TopBar heading="" backHandler={() => router.push("/")} />
      <PostContainer item={postDetails} isFeedPage={false} />
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

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          ref={flatListRef}
          data={comments?.data}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => (
            <View className="px-4">{renderItem({ item })}</View>
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
            <Divider
              className="w-full rounded-full bg-neutral-700 mb-[1px]"
              width={0.3}
            />
            <View className="bg-black p-2">
              <View className="w-full flex-row items-center justify-around rounded-full bg-neutral-900 px-4 py-1.5">
                <Image
                  source={user.profilePic ? { uri: user.profilePic } : nopic}
                  className="w-10 h-10 rounded-full"
                  resizeMode="cover"
                />
                <TextInput
                  autoFocus={true}
                  placeholder="Type your comment here"
                  className="flex-1 px-4 bg-neutral-900 text-white"
                  placeholderTextColor="grey"
                  cursorColor={Colors.themeColor}
                />
                <TouchableOpacity disabled={isPosting}>
                  <MaterialIcons name="send" size={22} color="grey" />
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
