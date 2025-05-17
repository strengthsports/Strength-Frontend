import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { setAddPostContainerOpen } from "~/reduxStore/slices/post/postSlice";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const AddPostFTU = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const handleOpenAddPostContainer = () => {
    router.push("/add-post");
  };

  return (
    <View
      className="w-full items-center mt-10 gap-y-2"
      style={styles.mainContainer}
    >
      <TextScallingFalse className="text-[#808080] font-normal text-4xl mb-3">
        Fuel the Feed with Your Sports Vibe!
      </TextScallingFalse>

      <TouchableOpacity
        onPress={handleOpenAddPostContainer}
        className="w-auto bg-[#262626] rounded-full py-3 px-4 flex-row items-center justify-center mb-2"
        style={{ borderColor: "#313131", borderWidth: 1 }}
      >
        <TextScallingFalse
          className="font-normal text-2xl"
          style={{ color: "#c0c0c0" }}
        >
          Create your first post
        </TextScallingFalse>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "black",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginLeft: 12,
    marginRight: 12,
    marginTop: 5,
    width: "auto",
    borderColor: "#333",
    borderStyle: "dashed",
    borderWidth: 0.5,
  },
});

export default AddPostFTU;
