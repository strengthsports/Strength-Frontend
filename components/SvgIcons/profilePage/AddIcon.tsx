import React from "react";
import Svg, { Path, } from "react-native-svg";

const AddIcon = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
      <Svg width="20" height="20" viewBox="0 0 17 17" fill="#717171">
      <Path d="M2.83398 8.50004H8.50065M8.50065 8.50004H14.1673M8.50065 8.50004V2.83337M8.50065 8.50004V14.1667" stroke="#717171" stroke-width="1.0625" stroke-linecap="round" stroke-linejoin="round"/>
      </Svg>
    );
};

export default AddIcon;