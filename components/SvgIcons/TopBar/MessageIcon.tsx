import React from "react";
import Svg, { Path, } from "react-native-svg";

const MessageIcon = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
        <Svg width="27" height="27" viewBox="0 0 24 24" fill="none">
            <Path fill="white" d="M4 2C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4L2 16C2 16.5304 2.21071 17.0391 2.58579 17.4142C2.96086 17.7893 3.46957 18 4 18L18 18L22 22L22 4C22 3.46957 21.7893 2.96086 21.4142 2.58579C21.0391 2.21071 20.5304 2 20 2L4 2ZM20 4L20 17.17L18.83 16L4 16L4 4L20 4ZM18 7L6 7V9L18 9V7ZM18 11L9 11L9 13L18 13L18 11Z" />
        </Svg>
    );
};

export default MessageIcon;



