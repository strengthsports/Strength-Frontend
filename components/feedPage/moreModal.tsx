import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-elements";

const MoreModal = memo(
  ({
    firstName,
    followingStatus,
    isOwnPost,
  }: {
    firstName: string;
    followingStatus: boolean;
    isOwnPost: boolean;
  }) => {
    return (
      <View className="h-80 w-[104%] bg-neutral-900 self-center rounded-t-[40px] border-t border-x  border-neutral-700 p-4">
        {/* <View className="h-3/4 w-[104%] self-center bg-neutral-900 rounded-t-[40px] p-4 border-t border-x  border-neutral-700		 "> */}

        <Divider
          className="w-16 self-center rounded-full bg-neutral-700 my-1"
          width={4}
        />
        <View className="flex-1 justify-evenly">
          <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
            <MaterialIcons name="bookmark-border" size={24} color="white" />
            <Text className="text-white ml-4">Bookmark</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
            <FontAwesome name="share" size={20} color="white" />
            <Text className="text-white ml-4">Share</Text>
          </TouchableOpacity>
          {!isOwnPost && (
            <>
              <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
                <MaterialIcons name="report-problem" size={22} color="white" />
                <Text className="text-white ml-4">Report</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
                <FontAwesome name="user-plus" size={19} color="white" />
                <Text className="text-white ml-4">
                  {followingStatus
                    ? `Unfollow ${firstName}`
                    : `Follow ${firstName}`}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {isOwnPost && (
            <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
              <MaterialIcons name="delete" size={22} color="white" />
              <Text className="text-white ml-4">Delete Post</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

export default MoreModal;
