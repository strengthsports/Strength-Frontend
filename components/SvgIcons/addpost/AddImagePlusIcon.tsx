import React from "react";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";

const AddImagePlusIcon = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <G clip-path="url(#clip0_3341_8120)">
                <Path stroke={color} strokeWidth={2} d="M17 4H19H23M20 0.5V4V7M21 11.5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H12.5" stroke-linecap="round" stroke-linejoin="round" />
                <Path stroke={color} strokeWidth={2} d="M21 15L17.914 11.914C17.5389 11.5391 17.0303 11.3284 16.5 11.3284C15.9697 11.3284 15.4611 11.5391 15.086 11.914L6 21" stroke-linecap="round" stroke-linejoin="round" />
                <Path stroke={color} strokeWidth={2} d="M9 11C10.1046 11 11 10.1046 11 9C11 7.89543 10.1046 7 9 7C7.89543 7 7 7.89543 7 9C7 10.1046 7.89543 11 9 11Z" stroke-linecap="round" stroke-linejoin="round" />
            </G>
            <Defs>
                <ClipPath id="clip0_3341_8120">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
};

export default AddImagePlusIcon;



