import React from "react";
import Svg, { Path, } from "react-native-svg";

const CommentIcon = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
        <Svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <Path stroke="white" strokeWidth={1.3} d="M13.1864 9.45763C13.1864 9.78728 13.0555 10.1034 12.8224 10.3365C12.5893 10.5696 12.2732 10.7006 11.9435 10.7006H4.48588L2 13.1864V3.24294C2 2.91329 2.13095 2.59714 2.36405 2.36405C2.59714 2.13095 2.91329 2 3.24294 2H11.9435C12.2732 2 12.5893 2.13095 12.8224 2.36405C13.0555 2.59714 13.1864 2.91329 13.1864 3.24294V9.45763Z" stroke-linecap="round" stroke-linejoin="round" />
        </Svg>
    );
};

export default CommentIcon;



