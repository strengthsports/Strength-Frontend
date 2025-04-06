import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { setAddPostContainerOpen } from "~/reduxStore/slices/post/postSlice";

const AddPostFTU = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleOpenAddPostContainer = () => {
    dispatch(setAddPostContainerOpen(true));
  };

  return (
    <View className="w-full items-center mt-10 gap-y-2">
      <TextScallingFalse className="text-[#808080] font-normal text-4xl">
        Share your sports journey
      </TextScallingFalse>

      <TouchableOpacity
        onPress={handleOpenAddPostContainer}
        className="w-1/3 bg-[#212121] rounded-full py-2.5 flex-row items-center justify-center"
      >
        <TextScallingFalse className="text-[#808080] font-normal text-2xl">
          Add Posts
        </TextScallingFalse>
      </TouchableOpacity>
    </View>
  );
};

export default AddPostFTU;
