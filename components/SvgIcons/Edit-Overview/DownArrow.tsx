import React from "react";
import Svg, { Path } from "react-native-svg";

const DownArrow = ({ color }: { color?: string }) => {
    return (
        <Svg width="14" height="8" viewBox="0 0 14 8" fill="none">
            <Path d="M1 1L7.13954 7L13 1" stroke="#808080" />
        </Svg>
    );
};

export default DownArrow;
