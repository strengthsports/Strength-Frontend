import React, { useEffect, useRef, useState } from "react";
import { View, Image, TouchableOpacity, Animated } from "react-native";
import TextScallingFalse from "~/components/CentralText";
import NameFlagSubCard from "../nameFlagSubCard";
import { countryCodes } from "~/constants/countryCodes";

interface BasketballMatchCardProps {
  match: {
    id: string;
    series: string;
    round: string;
    t1: string;
    t1s: string[]; // Array of scores for team 1
    t2: string;
    t2s: string[]; // Array of scores for team 2
    status: string;
    tournamentImg?: string;
  };
  isLive?: boolean;
}

const extractShortName = (teamName: string) => {
  const match = teamName.match(/\[(.*?)\]/);
  return match ? match[1] : teamName;
};

const BasketballMatchCard = ({ match, isLive }: any) => {
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

  const getCountryCode = (teamName: string) =>
    countryCodes[teamName as keyof typeof countryCodes] || "Unknown";

  return (
    <>
      {/* Top Section - Tournament, Sport, Round */}
      <View className="px-4 pt-3 pb-1">
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
            className="text-[#EAEAEA] text-3xl w-4/5"
            numberOfLines={numberOfLinesTitle}
          >
            BWF WT - JAPAN OPEN: MEN
          </TextScallingFalse>
        </TouchableOpacity>

        {/* Sport Name and Round */}
        <View className="flex-row items-center py-1">
          <TextScallingFalse className="text-theme text-base font-bold">
            {"\u25B6"} Basketball
          </TextScallingFalse>
          <TextScallingFalse className="text-[#919191] text-base uppercase">
            {" \u2022 "} Round 4
          </TextScallingFalse>
        </View>
      </View>

      {/* Live Indicator */}
      {isLive && (
        <View className="rounded-full absolute right-5 top-5 bg-[#BC3D40] px-[9px] flex-row items-center justify-center">
          <Animated.Text
            className="text-lg text-white font-bold"
            style={[
              { opacity: opacityValue },
              { fontSize: 19, textAlign: "center", paddingTop: 6 },
            ]}
          >
            &bull;{" "}
          </Animated.Text>
          <TextScallingFalse className="text-[11px] text-white font-bold">
            LIVE
          </TextScallingFalse>
        </View>
      )}

      {/* Border */}
      <View className="h-[0.8] bg-[#252525] my-1" />

      {/* Teams & Scores Section */}
      <View className="px-4 mt-1">
        {/* Team 1 */}
        <View className="flex-row items-center justify-between mt-2 mb-1">
          <NameFlagSubCard
            flag={getCountryCode(match.t1)}
            teamName={"Lanier A."}
          />
          <View className="flex-row gap-4">
            {/* {match.t1s.map((score, index) => (
              <TextScallingFalse key={index} className="text-white">
                {score}
              </TextScallingFalse>
            ))} */}
            <TextScallingFalse className="text-white">2</TextScallingFalse>{" "}
            <TextScallingFalse className="text-white">21</TextScallingFalse>{" "}
            <TextScallingFalse className="text-white">22</TextScallingFalse>
          </View>
        </View>

        {/* Team 2 */}
        <View className="flex-row items-center justify-between mt-2 mb-1">
          <NameFlagSubCard
            flag={getCountryCode(match.t2)}
            teamName={"Chou T. Ch."}
          />
          <View className="flex-row gap-4">
            {/* {match.t2s.map((score, index) => (
              <TextScallingFalse key={index} className="text-white">
                {score}
              </TextScallingFalse>
            ))} */}
            <TextScallingFalse className="text-white">2</TextScallingFalse>{" "}
            <TextScallingFalse className="text-white">21</TextScallingFalse>{" "}
            <TextScallingFalse className="text-white">22</TextScallingFalse>
          </View>
        </View>
      </View>

      {/* Match Status */}
      <TextScallingFalse className="absolute bottom-4 left-4 text-neutral-400 text-base mt-2">
        {/* {match.status} */}
        yo you wassup wassup
      </TextScallingFalse>
    </>
  );
};

export default BasketballMatchCard;
