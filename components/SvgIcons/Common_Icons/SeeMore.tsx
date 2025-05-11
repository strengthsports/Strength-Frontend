import React from "react";
import {
  View,
} from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";

const SeeMore = ({ color, fw }: { color?: string, fw?: string }) => {
    return (
        <Svg width="7" height="9" viewBox="0 0 7 9" fill="none">
        <Path fill="white" d="M1.31274 9C1.19874 9 1.08475 8.96366 0.994752 8.8858C0.82076 8.73526 0.82076 8.48608 0.994752 8.33554L4.90659 4.95097C5.19458 4.7018 5.19458 4.2969 4.90659 4.04773L0.994752 0.663158C0.82076 0.512617 0.82076 0.263446 0.994752 0.112906C1.16874 -0.0376352 1.45673 -0.0376352 1.63073 0.112906L5.54256 3.49748C5.84855 3.76222 6.02254 4.1204 6.02254 4.49935C6.02254 4.8783 5.85455 5.23648 5.54256 5.50123L1.63073 8.8858C1.54073 8.95847 1.42673 9 1.31274 9Z"/>
        </Svg>    
    );
};

export default SeeMore;



