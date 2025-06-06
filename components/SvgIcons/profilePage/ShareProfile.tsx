import React from "react";
import Svg, { Path, } from "react-native-svg";

const ShareProfile = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M21 12L14 5V9C7 10 4 15 3 20C5.5 16.5 9 14.9 14 14.9V19L21 12Z" fill="white" />
        </Svg>
    );
};

export default ShareProfile;



