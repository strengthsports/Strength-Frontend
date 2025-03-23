import React from "react";
import { View, StyleSheet, PixelRatio } from "react-native";

// Calculate a consistent thickness value.
const consistentThickness = PixelRatio.roundToNearestPixel(1);

const Divider = ({
  style = {},
  color = "#e1e8ee",
  thickness = consistentThickness,
  orientation = "horizontal",
  marginVertical = 10,
  marginHorizontal = 10,
}) => {
  if (orientation === "vertical") {
    return (
      <View
        style={[
          styles.vertical,
          {
            backgroundColor: color,
            width: thickness,
            marginHorizontal,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        {
          backgroundColor: color,
          height: thickness,
          marginVertical,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: "100%",
  },
  vertical: {
    height: "100%",
  },
});

export default Divider;
