import React from "react";
import Svg, { Path, Circle, Line } from "react-native-svg";

const BackIcon = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 15" fill="none">
            <Path d="M1 7.5H20M1 7.5L9.5 14M1 7.5L9.5 1" stroke="white" strokeWidth={2} />
        </Svg>
    );
};

export default BackIcon;



