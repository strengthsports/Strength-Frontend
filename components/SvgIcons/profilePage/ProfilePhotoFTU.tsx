import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const ProfilePhotoFTU = ({ color, fw }: { color?: string; fw?: string }) => {
  return (
    <Svg width="57" height="54" viewBox="0 0 57 54" fill="none">
      <Circle cx="25" cy="25" r="25" fill="#121212" />
      <Circle cx="45" cy="42" r="12" fill="#262626" />
      <Path
        d="M15 32.5C15 31.1739 15.5268 29.9021 16.4645 28.9645C17.4021 28.0268 18.6739 27.5 20 27.5H30C31.3261 27.5 32.5979 28.0268 33.5355 28.9645C34.4732 29.9021 35 31.1739 35 32.5C35 33.163 34.7366 33.7989 34.2678 34.2678C33.7989 34.7366 33.163 35 32.5 35H17.5C16.837 35 16.2011 34.7366 15.7322 34.2678C15.2634 33.7989 15 33.163 15 32.5Z"
        stroke="#999999"
        stroke-width="1.25"
        stroke-linejoin="round"
      />
      <Path
        d="M25 22.4998C27.0711 22.4998 28.75 20.8208 28.75 18.7498C28.75 16.6787 27.0711 14.9998 25 14.9998C22.9289 14.9998 21.25 16.6787 21.25 18.7498C21.25 20.8208 22.9289 22.4998 25 22.4998Z"
        stroke="#999999"
        stroke-width="1.25"
      />
      <Path
        d="M41 47H48.5M44.75 44.5V37M44.75 37L46.9375 39.1875M44.75 37L42.5625 39.1875"
        stroke="#999999"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default ProfilePhotoFTU;
