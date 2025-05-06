import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import nopic from "@/assets/images/nopic.jpg";
import TextScallingFalse from "../CentralText";
import { Colors } from "~/constants/Colors";

const CommentInput = ({
  user,
  replyingTo,
  setReplyingTo,
  handlePostComment,
  isPosting,
  textInputRef,
  commentText,
  setCommentText,
}: any) => {
  const [inputHeight, setInputHeight] = useState(40);
  const MAX_HEIGHT = 120;

  // Handle text change with or without reply tag
  const handleTextChange = useCallback(
    (text: string) => {
      setCommentText(text);
      if (text === "" && replyingTo) {
        setReplyingTo(null);
      }
    },
    [replyingTo]
  );

  return (
    <View className="bg-black p-2">
      <View className={`w-full flex bg-[#181818] rounded-3xl`}>
        {replyingTo && (
          <View className="border border-[#181818] bg-black flex-row justify-between items-center px-4 py-2 rounded-t-3xl">
            <TextScallingFalse className="text-[#808080] font-light">
              Replying to{" "}
              <TextScallingFalse className="font-medium">
                {replyingTo.name}
              </TextScallingFalse>
            </TextScallingFalse>
            <MaterialIcons
              name="close"
              size={14}
              color={Colors.greyText}
              onPress={() => setReplyingTo(null)}
            />
          </View>
        )}
        <View
          className={`flex-row px-3 py-1.5 ${
            inputHeight <= 40 ? "items-center" : "items-end"
          }`}
        >
          <Image
            source={user?.profilePic ? { uri: user.profilePic } : nopic}
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
          />
          {/* {replyingTo && (
            <TouchableOpacity
              onPress={() => setReplyingTo(null)}
              className="flex-row items-center rounded-lg ml-2"
            >
              <TextScallingFalse className="text-theme mr-1">
                @{replyingTo.username}
              </TextScallingFalse>
            </TouchableOpacity>
          )} */}
          <TextInput
            ref={textInputRef}
            placeholder="Type your comment here"
            className="flex-1 px-4 bg-[#181818] text-white"
            style={{
              height: Math.min(Math.max(40, inputHeight), MAX_HEIGHT),
              maxHeight: MAX_HEIGHT,
            }}
            multiline={true}
            textAlignVertical="top"
            onContentSizeChange={(event) =>
              setInputHeight(
                Math.min(event.nativeEvent.contentSize.height, MAX_HEIGHT)
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
            disabled={isPosting || !commentText?.trim()}
            className="p-1"
          >
            <MaterialIcons
              name="send"
              size={22}
              color={
                isPosting || !commentText?.trim()
                  ? "#565656"
                  : Colors.themeColor
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CommentInput;
