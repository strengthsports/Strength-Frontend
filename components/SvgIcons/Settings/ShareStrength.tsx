import React from "react";
import Svg, { Path, } from "react-native-svg";

const ShareStrength = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
        <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <Path stroke="white" strokeWidth={2.5} stroke-linecap="round" stroke-linejoin="round"  d="M21.25 10C23.3211 10 25 8.32107 25 6.25C25 4.17893 23.3211 2.5 21.25 2.5C19.1789 2.5 17.5 4.17893 17.5 6.25C17.5 8.32107 19.1789 10 21.25 10Z"/>
            <Path stroke="white" strokeWidth={2.5} stroke-linecap="round" stroke-linejoin="round" d="M6.25 18.75C8.32107 18.75 10 17.0711 10 15C10 12.9289 8.32107 11.25 6.25 11.25C4.17893 11.25 2.5 12.9289 2.5 15C2.5 17.0711 4.17893 18.75 6.25 18.75Z" />
            <Path stroke="white" strokeWidth={2.5} stroke-linecap="round" stroke-linejoin="round" d="M21.25 27.5C23.3211 27.5 25 25.8211 25 23.75C25 21.6789 23.3211 20 21.25 20C19.1789 20 17.5 21.6789 17.5 23.75C17.5 25.8211 19.1789 27.5 21.25 27.5Z"/>
            <Path stroke="white" strokeWidth={2.5} stroke-linecap="round" stroke-linejoin="round" d="M9.375 16.875L18.125 21.875M18.125 8.125L9.375 13.125"/>
        </Svg>
    );
};

export default ShareStrength;



