import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const PauseIcon = ({
  color = "#CECECE",
  size = 49,
}: {
  color?: string;
  size?: number;
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 49 49" fill="none">
      <Path
        d="M24.5 1.40039C37.2578 1.40039 47.5996 11.7422 47.5996 24.5C47.5996 37.2578 37.2578 47.5996 24.5 47.5996C11.7422 47.5996 1.40039 37.2578 1.40039 24.5C1.40039 11.7422 11.7422 1.40039 24.5 1.40039Z"
        fill="rgba(0,0,0,0.3)"
        stroke={color}
        strokeWidth="1.2"
      />
      <Rect
        x="17"
        y="17"
        width="5"
        height="15"
        rx="1"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="27"
        y="17"
        width="5"
        height="15"
        rx="1"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PauseIcon;
