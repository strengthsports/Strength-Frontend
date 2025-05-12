import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated, Easing } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { setAddPostContainerOpen } from "~/reduxStore/slices/post/postSlice";
import TextScallingFalse from "../CentralText";
import { useRouter } from "expo-router";

const AnimatedAddPostBar = ({
  suggestionText = "What's on your mind...",
}: {
  suggestionText: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleOpenAddPostContainer = () => {
    // dispatch(setAddPostContainerOpen(true));
    router.push("/home/add-post");
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          // width: containerWidthAnim,
          width: "95%",
        }}
      >
        <TouchableOpacity
          style={{
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#141414",
            padding: 6,
            borderRadius: 12,
            height: 37,
            justifyContent: "space-between",
            paddingHorizontal: 6,
          }}
          onPress={handleOpenAddPostContainer}
        >
          <TextScallingFalse
            style={{
              color: "grey",
              fontSize: 14,
              fontWeight: "400",
              marginLeft: 6,
              flex: 1,
              // opacity: textOpacityAnim,
            }}
          >
            {suggestionText}
          </TextScallingFalse>
          <View
            style={{
              width: 25,
              height: 25,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "grey",
              borderRadius: 7,
            }}
          >
            <Feather name="plus" size={15} color="grey" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AnimatedAddPostBar;
