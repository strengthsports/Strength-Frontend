import React from "react";
import Svg, { Path, Circle, Line } from "react-native-svg";

const TickIcon = ({ color, fw }: { color?: string; fw?: string }) => {
  return (
    <Svg width="13" height="11" viewBox="0 0 13 11" fill="none">
      <Path
        d="M0.958984 7.0835L3.72982 9.85433L12.0423 1.146"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default TickIcon;
