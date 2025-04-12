// CustomText.tsx
import React from "react";
import { Text, TextProps } from "react-native";

// Create a custom Text component
const TextScallingFalse: React.FC<TextProps> = (props) => {
  return <Text {...props} allowFontScaling={false} />;
};

export default TextScallingFalse;
