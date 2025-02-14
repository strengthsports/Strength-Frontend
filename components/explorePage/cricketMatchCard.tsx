import React, { useEffect, useRef, useState } from "react";
import { View, Image, TouchableOpacity, Animated } from "react-native";
import TextScallingFalse from "~/components/CentralText";
import NameFlagSubCard from "./nameFlagSubCard";
import { countryCodes } from "~/constants/countryCodes";

interface MatchCardProps {
  match: {
    id: string;
    series: string;
    matchType: string;
    t1: string;
    t1s: string;
    t2: string;
    t2s: string;
    status: string;
    tournamentImg?: string;
  };
  isLive?: boolean;
}

const MatchCard = ({ match, isLive }: MatchCardProps) => {
  const opacityValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isLive, opacityValue]);

  const [numberOfLinesTitle, setNumberOfLinesTitle] = useState(1);
  const toggleNumberOfLines = () => {
    setNumberOfLinesTitle((prev) => (prev === 1 ? 2 : 1));
  };
  const getCountryCode = (teamName : string) => countryCodes[teamName] || "Unknown";

  return (
    <View className="h-56 w-96 bg-transparent rounded-2xl mr-5 border border-neutral-600 ">
      {/* Title Section */}
      <View className="px-4 pt-4 pb-2">
        <TouchableOpacity
          className="flex-row items-center w-4/5 gap-2"
          onPress={toggleNumberOfLines}
        >
          {match?.tournamentImg && (
            <View className="p-1 rounded-md">
              <Image
                source={{ uri: match?.tournamentImg }}
                className="w-8 h-8 rounded-md self-center"
              />
            </View>
          )}
          <TextScallingFalse
            className="text-white text-3xl w-4/5"
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
          >
            {match.series}
          </TextScallingFalse>
        </TouchableOpacity>

        {/* Game Type and Round */}
        <View className="flex-row items-center p-1">
          <TextScallingFalse className="text-[#12956B] text-base font-bold">
            {"\u25B6"} Cricket
          </TextScallingFalse>
          <TextScallingFalse className="text-[#9E9E9E] text-base uppercase">
            {" \u2022 "} {match.matchType}
          </TextScallingFalse>
        </View>
      </View>

      {/* Live Indicator */}
      {isLive && (
        <View className="rounded-full absolute right-5 top-5 bg-red-600 px-2 py-0 flex-row items-center justify-center">
          <Animated.Text
            className="text-lg text-white font-bold"
            style={{ opacity: opacityValue }}
          >&bull; </Animated.Text>
          <TextScallingFalse className="text-lg text-white font-bold">
            LIVE
          </TextScallingFalse>
        </View>
      )}

      {/* Border */}
      <View className="h-[1px] bg-neutral-700 my-2" />

      {/* Teams Section */}
      <View className="px-4">
        {/* Team 1 */}
        <View className="flex-row items-center justify-between my-2">
          <NameFlagSubCard flag={getCountryCode(match.t1)} teamName={match.t1} />
          <TextScallingFalse className="text-white ml-2" numberOfLines={numberOfLinesTitle} ellipsizeMode="tail">
            {match.t1s === "" ? "Yet to bat" : match.t1s}
          </TextScallingFalse>
        </View>

        {/* Team 2 */}
        <View className="flex-row items-center justify-between my-2">
          <NameFlagSubCard flag={getCountryCode(match.t2)} teamName={match.t2} />
          <TextScallingFalse className="text-white ml-2" numberOfLines={numberOfLinesTitle} ellipsizeMode="tail">
            {match.t2s === "" ? "Yet to bat" : match.t2s}
          </TextScallingFalse>
        </View>

      </View>
        {/* Match Status */}
        <TextScallingFalse className="absolute bottom-4 left-4 text-neutral-400 text-base mt-2">
          {match.status}
        </TextScallingFalse>
    </View>
  );
};

export default MatchCard;
