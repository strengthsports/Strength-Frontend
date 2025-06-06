import React from "react";
import Svg, { Path, } from "react-native-svg";

const ShareIconBottomMenu = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 16 16" fill="none">
            <Path fill="white" d="M12.8363 1.68714C13.4713 1.46526 14.0813 2.07526 13.8594 2.71026L10.1563 13.2915C9.91566 13.9778 8.9594 14.0165 8.6644 13.3521L6.87753 9.33214L9.39253 6.81651C9.47533 6.72765 9.52041 6.61012 9.51826 6.48868C9.51612 6.36725 9.46693 6.25138 9.38104 6.1655C9.29516 6.07961 9.17929 6.03042 9.05786 6.02828C8.93642 6.02613 8.81889 6.07121 8.73003 6.15401L6.2144 8.66901L2.19441 6.88214C1.53003 6.58651 1.5694 5.63089 2.25503 5.39026L12.8363 1.68714Z"/>
        </Svg>
    );
};

export default ShareIconBottomMenu;



