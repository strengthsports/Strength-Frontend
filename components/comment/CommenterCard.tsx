import { useRouter } from "expo-router";
import { memo, useState } from "react";
import { Image, Pressable, TouchableOpacity } from "react-native";
import { View } from "react-native";
import TextScallingFalse from "../CentralText";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Comment } from "~/types/post";
import nopic from "@/assets/images/nopic.jpg";
import { formatShortTimeAgo } from "~/utils/formatTime";
import { toggleLikeComment } from "~/api/comment/like/toggleLikeComment";
import ModalLayout1 from "../modals/layout/ModalLayout1";
import renderCaptionWithTags from "~/utils/renderCaptionWithTags";

interface CommenterCardProps {
  comment: Comment;
  commentCount: number;
  targetId: string;
  targetType: string;
  onReply?: (comment: Comment) => void;
  onDelete?: (comment: Comment) => void;
  parent?: Comment;
  isOwnComment?: boolean;
}

// Memoized CommenterCard component
export const CommenterCard = memo(
  ({
    comment,
    commentCount,
    targetId,
    targetType,
    onReply,
    onDelete,
    parent,
    isOwnComment,
  }: CommenterCardProps) => {
    const router = useRouter();
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [isCommentLiked, setIsCommentLiked] = useState(comment.isLiked);
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
        } else {
          setIsCommentLiked(true);
          setCommentLikesCount((prev) => prev + 1);
        }
        await toggleLikeComment({ commentId: comment._id });
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
            targetType === "Comment" ? "size-10" : "size-12"
          } absolute top-2 left-4 z-10 aspect-square rounded-full bg-[#000]`}
          onPress={() =>
            router.push(`/(app)/(profile)/profile/${serializedUser}`)
          }
        >
          <Image
            className="w-full h-full rounded-full border-[1px] border-[#202020]"
            source={
              comment?.postedBy?.profilePic
                ? { uri: comment.postedBy.profilePic }
                : nopic
            }
          />
        </TouchableOpacity>
        <View
          className={`relative ${
            targetType === "Comment" ? "ml-4" : "ml-6"
          } rounded-xl rounded-tl-none px-5
          bg-neutral-900 py-2`}
        >
          <View className="absolute right-3 top-2 flex flex-row items-center gap-2">
            <TextScallingFalse className="text-xs text-neutral-300 right-8">
              {formatShortTimeAgo(comment?.createdAt)}
            </TextScallingFalse>
            <TouchableOpacity
              onPress={() => setIsReportModalVisible(true)}
              className="p-2 absolute -right-2"
              hitSlop={{ top: 10, bottom: 20, left: 40, right: 10 }}
            >
              <MaterialIcons name="more-horiz" size={16} color="white" />
              {isReportModalVisible && (
                <ModalLayout1
                  visible={isReportModalVisible}
                  onClose={() => setIsReportModalVisible(false)}
                  heightValue={8}
                  bgcolor="#151515"
                >
                  <View className="flex gap-y-4 pt-6">
                    {!isOwnComment ? (
                      <TouchableOpacity
                        className="items-center flex-row gap-x-3"
                        // onPress={handleReport}
                        // disabled={isReported}
                      >
                        <MaterialIcons
                          name="report-problem"
                          size={22}
                          color={"white"}
                          className="basis-[6%]"
                        />
                        <TextScallingFalse
                          className={`${
                            false ? "text-[#808080]" : "text-white"
                          } ml-4 text-4xl font-medium flex-1`}
                        >
                          {false ? "Reported" : "Report"}
                        </TextScallingFalse>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        className="flex-row items-center gap-x-3"
                        onPress={() => onDelete && onDelete(comment)}
                      >
                        <MaterialIcons
                          name="delete"
                          size={22}
                          color={"white"}
                          className="basis-[6%]"
                        />
                        <TextScallingFalse className="text-white ml-4 text-4xl font-medium flex-1">
                          Delete
                        </TextScallingFalse>
                      </TouchableOpacity>
                    )}
                  </View>
                </ModalLayout1>
              )}
            </TouchableOpacity>
          </View>
          <Pressable
            onPress={() =>
              router.push(`/(app)/(profile)/profile/${serializedUser}`)
            }
            className="w-10/12"
          >
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
          </Pressable>

          <TextScallingFalse
            className="text-[#12956B] font-medium mt-2"
            onPress={() =>
              router.push(`/(app)/(profile)/profile/${serializedUser}`)
            }
          >
            {targetType === "Comment" && "@" + parent?.username + " "}
            <TextScallingFalse className="text-xl font-normal text-white mt-4 mb-3">
              {renderCaptionWithTags(comment?.text, "#fff", 12)}
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
              <AntDesign name="like1" size={12} color="#FABE25" />{" "}
              {` ${commentLikesCount}`}
            </TextScallingFalse>
          )}
          <TextScallingFalse className="text-2xl text-[#939393]">
            |
          </TextScallingFalse>
          <TouchableOpacity onPress={() => onReply && onReply(comment)}>
            <TextScallingFalse className="text-white text-lg font-medium">
              Reply
            </TextScallingFalse>
          </TouchableOpacity>
          <TextScallingFalse className="mt-1 text-xl text-[#939393] font-normal">
            {comment.commentsCount > 0 &&
              targetType !== "Comment" &&
              `${commentCount}`}
          </TextScallingFalse>
        </View>
      </View>
    );
  }
);
