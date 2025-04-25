import { useRouter } from "expo-router";
import { memo, useState } from "react";
import { Image, Modal, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { toggleLike } from "~/reduxStore/slices/feed/feedSlice";
import TextScallingFalse from "../CentralText";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Comment } from "~/types/post";
import nopic from "@/assets/images/nopic.jpg";
import { formatTimeAgo } from "~/utils/formatTime";

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
            targetType === "Comment" ? "size-10 top-2" : "size-12 top-0"
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
              ? "ml-4 rounded-xl rounded-tl-none px-5"
              : "w-full rounded-xl px-10"
          } bg-neutral-900 py-2`}
        >
          <View className="absolute right-3 top-2 flex flex-row items-center gap-2">
            <TextScallingFalse className="text-xs text-neutral-300">
              {formatTimeAgo(comment?.createdAt)}
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
