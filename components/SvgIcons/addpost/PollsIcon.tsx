import React from "react";
import Svg, { Path, Mask, Rect } from "react-native-svg";

const PollsIcon = ({ color = "#12956B" }: { color?: string }) => {
  return (
    <Svg width="25" height="20" viewBox="0 0 20 20">
      <Mask id="path-1-inside-1_2523_1217" fill="white">
        <Rect width="25" height="9.09091" rx="0.865849" />
      </Mask>
      <Rect
        width="22"
        height="9.09091"
        rx="0.865849"
        stroke={color || "#12956B"}
        strokeWidth={2.5}
        mask="url(#path-1-inside-1_2523_1217)"
      />

      <Mask id="path-2-inside-2_2523_1217" fill="white">
        <Rect width="8.18182" height="9.09091" rx="0.865849" />
      </Mask>
      <Rect
        width="8.18182"
        height="9.09091"
        rx="0.865849"
        stroke={color || "#12956B"}
        strokeWidth={2.5}
        mask="url(#path-2-inside-2_2523_1217)"
      />

      <Path d="M5.40332 2.37109L2.38805 5.84773" stroke={color || "#12956B"} />
      <Path d="M5.41699 5.83984L2.37348 2.3879" stroke={color || "#12956B"} />

      <Mask id="path-5-inside-3_2523_1217" fill="white">
        <Rect y="10.9102" width="18" height="9.09091" rx="0.865849" />
      </Mask>
      <Rect
        y="10.9102"
        width="17"
        height="9.09091"
        rx="0.865849"
        stroke={color || "#12956B"}
        strokeWidth={2.5}
        mask="url(#path-5-inside-3_2523_1217)"
      />

      <Mask id="path-6-inside-4_2523_1217" fill="white">
        <Rect y="10.9102" width="8.18182" height="9.09091" rx="0.865849" />
      </Mask>
      <Rect
        y="10.9102"
        width="8.18182"
        height="9.09091"
        rx="0.865849"
        stroke={color || "#12956B"}
        strokeWidth={2.5}
        mask="url(#path-6-inside-4_2523_1217)"
      />

      <Path d="M5.51367 14.2148L3.53225 16.9813" stroke={color || "#12956B"} />
      <Path d="M3.88184 16.6992L2.2516 15.4309" stroke={color || "#12956B"} />
    </Svg>
  );
};

export default PollsIcon;
