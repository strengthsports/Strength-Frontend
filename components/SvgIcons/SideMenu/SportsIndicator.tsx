import React from "react";
import Svg, { Path, } from "react-native-svg";

const SportsIndicator = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
        <Svg width="5" height="8" viewBox="0 0 3 6" fill="none">
        <Path d="M3 3L0 5.59808L0 0.401924L3 3Z" fill="#12956B"/>
        </Svg>        
    );
};

export default SportsIndicator;



