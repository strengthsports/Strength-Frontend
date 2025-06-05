import React from "react";
import Svg, { Path, } from "react-native-svg";

const BlockedUsers = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
        <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <Path fill="white" d="M15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM5 15C5 9.475 9.475 5 15 5C17.3125 5 19.4375 5.7875 21.125 7.1125L7.1125 21.125C5.73954 19.379 4.99529 17.2211 5 15ZM15 25C12.6875 25 10.5625 24.2125 8.875 22.8875L22.8875 8.875C24.2605 10.621 25.0047 12.7789 25 15C25 20.525 20.525 25 15 25Z" />
        </Svg>
    );
};

export default BlockedUsers;



