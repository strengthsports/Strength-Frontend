import React from "react";
import Svg, { Path, Circle, Line } from "react-native-svg";

const Cross = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
        <Svg width="12" height="12" viewBox="0 0 11 11" fill="none">
            <Path stroke="white" stroke-opacity="0.8" stroke-width="0.819663" d="M1 1L10.0163 10.0163"/>
            <Path stroke="white" stroke-opacity="0.8" stroke-width="0.819663"  d="M10.0176 1L1.07593 10.0903"/>
        </Svg>

    );
};

export default Cross;



