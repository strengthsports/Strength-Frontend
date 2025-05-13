import React from "react";
import Svg, { Path, Circle, Line } from "react-native-svg";

const TickIcon = ({ color, fw }: { color?: string; fw?: string }) => {
  return (
    <Svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <Path
        d="M3.95898 11.0835L6.72982 13.8543L15.0423 5.146"
        stroke="#E6E6E6"
        stroke-width="1.67647"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default TickIcon;
