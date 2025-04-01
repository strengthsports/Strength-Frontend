import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const SearchIcon = ({color, fw}:{color?:string, fw?:string}) => {
  return (
<Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
<Path stroke={color || "white"} strokeWidth={0.7} d="M7.3908 14.7816C3.29743 14.7816 0 11.4842 0 7.3908C0 3.29743 3.29743 0 7.3908 0C11.4842 0 14.7816 3.29743 14.7816 7.3908C14.7816 11.4842 11.4842 14.7816 7.3908 14.7816ZM7.3908 1.13705C3.92281 1.13705 1.13705 3.92281 1.13705 7.3908C1.13705 10.8588 3.92281 13.6445 7.3908 13.6445C10.8588 13.6445 13.6445 10.8588 13.6445 7.3908C13.6445 3.92281 10.8588 1.13705 7.3908 1.13705Z" fill={color || "white"}/>
<Path stroke={color || "white"} strokeWidth={0.7} d="M12.8952 12.0908L18.0005 17.1962L17.1966 18L12.0913 12.8947L12.8952 12.0908Z" fill={color || "white"}/>
</Svg>
  );
};

export default SearchIcon;



