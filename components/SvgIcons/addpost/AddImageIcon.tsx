import React from "react";
import Svg, { Path, Circle, Line } from "react-native-svg";

const AddImageIcon = ({
  color = "#12956B",
  fw,
}: {
  color?: string;
  fw?: string;
}) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        stroke={color}
        strokeWidth={2}
        d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        stroke={color}
        strokeWidth={1.5}
        d="M8.49902 10.0004C9.32745 10.0004 9.99902 9.32878 9.99902 8.50035C9.99902 7.67192 9.32745 7.00035 8.49902 7.00035C7.6706 7.00035 6.99902 7.67192 6.99902 8.50035C6.99902 9.32878 7.6706 10.0004 8.49902 10.0004Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        stroke={color}
        strokeWidth={2}
        d="M21 14.6883L16.3125 10.0008L6 20.3133"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default AddImageIcon;
