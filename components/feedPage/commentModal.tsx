import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  SetStateAction,
} from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { Divider } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "~/constants/Colors";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";
import TextScallingFalse from "../CentralText";
import {
  useDeleteCommentMutation,
  useFetchCommentsQuery,
  usePostCommentMutation,
} from "~/reduxStore/api/feed/features/feedApi.comment";
import nopic from "@/assets/images/nopic.jpg";

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

export const CommenterCard = memo(
  ({
    comment,
    targetId,
    targetType,
  }: {
    comment: Comment;
    targetId: string;
    targetType: string;
  }) => {
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);

    //check id match
    const currentUserId = useSelector(
      (state: RootState) => state.auth.user?._id
    );
    console.log("Comments : ", comment);
    const commenterId = comment?.postedBy?._id;

    return (
      <View className="pl-12 pr-1 py-2 my-2 relative ">
        <TouchableOpacity className="w-14 h-14 absolute left-4 top-0 z-10 aspect-square rounded-full bg-slate-400">
          <Image
            className="w-full h-full rounded-full"
            source={
              comment?.postedBy?.profilePic
                ? {
                    uri: comment.postedBy.profilePic,
                  }
                : nopic
            }
          />
        </TouchableOpacity>
        <View className="relative w-full bg-neutral-900 rounded-xl py-2 px-10">
          <View className="absolute right-3 top-2 flex flex-row items-center gap-2 ">
            <TextScallingFalse className="text-xs text-neutral-300">
              1w{" "}
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
                  <TouchableOpacity
                    className="flex-1 justify-end bg-black/50"
                    activeOpacity={1}
                    onPress={() => setIsReportModalVisible(false)}
                  ></TouchableOpacity>
                  <ReportModal
                    commentId={comment._id}
                    targetId={targetId}
                    targetType={targetType} //='Post'
                    showDelete={commenterId === currentUserId}
                  />
                </Modal>
              )}
            </TouchableOpacity>
          </View>
          <View>
            <TextScallingFalse className="font-bold text-white text-lg">
              {comment?.postedBy?.firstName} {comment?.postedBy?.lastName}
            </TextScallingFalse>
            <TextScallingFalse
              className="text-xs w-4/5 text-neutral-200"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {comment?.postedBy?.headline}
            </TextScallingFalse>
          </View>
          <TextScallingFalse className="text-xl text-white mt-4 mb-3">
            {comment?.text}
          </TextScallingFalse>
        </View>
        <View className="flex-row gap-2 items-center ml-10 mt-1">
          <TouchableOpacity>
            <TextScallingFalse className="text-white text-lg">
              Like
            </TextScallingFalse>
          </TouchableOpacity>
          <TextScallingFalse className="text-xs text-white">
            |
          </TextScallingFalse>
          <TouchableOpacity>
            <TextScallingFalse className="text-white text-lg">
              Reply
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  postedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    headline?: string;
    profilePic?: string;
  };
}
interface CommentModalProps {
  autoFocusKeyboard?: boolean;
  targetId: string;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
}

// Memoized CommentModal component
const CommentModal = memo(
  ({
    autoFocusKeyboard = false,
    targetId,
    setCommentCount,
  }: CommentModalProps) => {
    const [commentText, setCommentText] = useState("");

    // Fetch comments for the target
    const {
      data: comments,
      error: fetchError,
      isLoading: isFetching,
      refetch: refetchComments,
    } = useFetchCommentsQuery({ targetId, targetType: "Post" });

    const [postComment, { isLoading: isPosting }] = usePostCommentMutation();

    const handlePostComment = async () => {
      if (!commentText.trim()) return;
      const commentData = {
        targetId,
        targetType: "Post",
        text: commentText,
      };
      setCommentCount((prevCount) => prevCount + 1);
      try {
        await postComment(commentData).unwrap(); // Post the comment
        setCommentText("");
        refetchComments(); // Refetch comments to update the list
      } catch (error) {
        setCommentCount((prevCount) => prevCount - 1);
        console.log("Failed to post comment:", error);
      }
    };

    useEffect(() => {
      if (fetchError) {
        console.error("Failed to fetch comments:", fetchError);
      }
    }, [fetchError]);
    // const sortedComments = useMemo(() => {
    //     return comments?.data?.slice().sort((a, b) => {
    //         return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    //     });
    // }, [comments]) as Comment[] | undefined;

    const renderItem = useCallback(
      ({ item }: { item: Comment }) => (
        <CommenterCard comment={item} targetId={targetId} targetType="Post" />
      ),
      [targetId]
    );
    return (
      <View
        onStartShouldSetResponder={() => true}
        className="h-3/4 w-[104%] self-center bg-black rounded-t-[40px] p-4 border-t border-x border-neutral-700"
      >
        <Divider
          className="w-16 self-center rounded-full bg-neutral-700 my-1"
          width={4}
        />
        <TextScallingFalse className="text-white self-center text-4xl my-4">
          Comments
        </TextScallingFalse>
        <View className="mb-32">
          {isFetching ? (
            <ActivityIndicator size="large" color={Colors.themeColor} />
          ) : (
            <FlatList
              data={comments?.data}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              inverted={true}
              windowSize={5} // Controls how many items outside the visible area are kept in memory
              ListEmptyComponent={
                <TextScallingFalse className="text-white text-center">
                  No Comments Found!
                </TextScallingFalse>
              }
            />
          )}
        </View>
        <View className="absolute bottom-0 self-center w-full">
          <Divider
            className="w-full self-center rounded-full bg-neutral-900 mb-[1px]"
            width={0.4}
          />
          <View className="bg-black p-2">
            <View className="w-full self-center flex items-center flex-row justify-around rounded-full bg-neutral-900">
              <TextInput
                autoFocus={autoFocusKeyboard}
                placeholder="Add a comment"
                className="w-3/4 px-4 bg-neutral-900 border-0 color-white"
                placeholderTextColor="grey"
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
    );
  }
);

export default CommentModal;
