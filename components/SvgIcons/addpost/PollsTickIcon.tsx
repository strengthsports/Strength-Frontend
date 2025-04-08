import React from "react";
import Svg, { Path, } from "react-native-svg";

const PollsTickIcon = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
      <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Path d="M6.80339 1.45776C3.82422 1.45776 1.38672 3.89526 1.38672 6.87443C1.38672 9.8536 3.82422 12.2911 6.80339 12.2911C9.78255 12.2911 12.2201 9.8536 12.2201 6.87443C12.2201 3.89526 9.78255 1.45776 6.80339 1.45776ZM5.72005 9.58276L3.01172 6.87443L3.77547 6.11068L5.72005 8.04985L9.8313 3.9386L10.5951 4.70776L5.72005 9.58276Z" fill="#F5F5F5"/>
      </Svg>
    );
};

export default PollsTickIcon;



