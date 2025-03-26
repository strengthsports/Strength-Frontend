import React from "react";
import Svg, { Path, G, Defs, ClipPath } from "react-native-svg";

const PollsIcon = ({ color }: { color?: string }) => {
    return (
        <Svg width="23" height="23" viewBox="0 0 682.667 682.667">
            <Defs>
                <ClipPath id="a">
                    <Path d="M0 512h512V0H0Z" fill="#12956B" />
                </ClipPath>
            </Defs>
            <G>
                <Path
                    d="m0 0 60 60"
                    transform="matrix(1.33333 0 0 -1.33333 100 221.333)"
                    stroke="#12956B"
                    strokeWidth={30}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="m0 0 60-60"
                    transform="matrix(1.33333 0 0 -1.33333 100 141.333)"
                    stroke="#12956B"
                    strokeWidth={30}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="m0 0 24.999-25.002L75 24.999"
                    transform="matrix(1.33333 0 0 -1.33333 90 504.665)"
                    stroke="#12956B"
                    strokeWidth={30}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <G clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
                    <Path
                        d="M0 0v-180"
                        transform="translate(195 466)"
                        stroke="#12956B"
                        strokeWidth={30}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <Path
                        d="M0 0v-180"
                        transform="translate(195 226)"
                        stroke="#12956B"
                        strokeWidth={30}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <Path
                        d="M377 46H15v180h362zM497 286H15v180h482z"
                        stroke="#12956B"
                        strokeWidth={30}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </G>
            </G>
        </Svg>
    );
};

export default PollsIcon;
