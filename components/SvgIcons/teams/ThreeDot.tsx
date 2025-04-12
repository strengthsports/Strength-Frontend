import React from "react"
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Rect } from "react-native-svg";

const Supporters = () => {
  return (
    <View className="">
    <Svg width="23" height="5" viewBox="0 0 23 5" fill="none">
      <Rect width="5" height="5" fill="#D9D9D9" />
      <Rect x="9" width="5" height="5" fill="#D9D9D9" />
      <Rect x="18" width="5" height="5" fill="#D9D9D9" />
    </Svg>
    </View>
  );
};

export default Supporters;
