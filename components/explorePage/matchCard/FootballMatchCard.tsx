import TextScallingFalse from "../../CentralText";
import CountryFlag from "react-native-country-flag";
import { Image, TouchableOpacity, View, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
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

const FootballMatchCard = ({ match, isLive }: MatchCardProps) => {
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
      {/* <View className="w-full h-full rounded-t-2xl bg-neutral-700" > */}

      {/* Title Section */}
      <View className="px-4 pt-4 pb-2">
        <TouchableOpacity
          className="flex-row items-center w-4/5 gap-2"
          onPress={toggleNumberOfLines}
        >
          {match?.tournamentImg && (
            <View className="p-1 rounded-md">
              <Image
                source={{ uri: match?.competition?.emblem }}
                className="w-8 h-8 rounded-md self-center"
              />
            </View>
          )}
          <View className="w-4/5 flex-row items-center ">
            <TextScallingFalse className="text-white text-3xl uppercase">
              {match.area.name} -{" "}
            </TextScallingFalse>
            <TextScallingFalse
              className="text-white text-3xl w-4/5"
              numberOfLines={numberOfLinesTitle}
              ellipsizeMode="tail"
            >
              {match.competition.name}{" "}
            </TextScallingFalse>
          </View>
        </TouchableOpacity>

        {/* Game Type and Round */}
        <View className="flex-row items-center px-1 py-0.5">
          <TextScallingFalse className="text-theme text-base font-bold">
            {"\u25B6"} Football{" "}
          </TextScallingFalse>
          <TextScallingFalse className="text-[#9E9E9E] text-base uppercase">
            {" \u2022 "} {match.competition.type}
          </TextScallingFalse>
        </View>
      </View>

      {/* Live Indicator */}
      {isLive && (
        <View className="rounded-full absolute right-5 top-5 bg-[#BC3D40] px-2 py-0.5 flex-row items-center justify-center">
          <Animated.Text
            className="text-lg text-white font-bold"
            style={{ opacity: opacityValue }}
          >
            &bull;{" "}
          </Animated.Text>
          <TextScallingFalse className="text-lg text-white font-bold">
            LIVE
          </TextScallingFalse>
        </View>
      )}

      {/* Border */}
      <View className="h-[0.8] bg-[#454545]" />

      <View className=" h-28 flex-row justify-center items-center pb-4">
        {/* view 1 */}
        <View className="items-center justify-center flex-1">
          <Image
            source={{ uri: match.homeTeam.crest }}
            style={{ width: 32, height: 32, marginBottom: 8 }}
          />
          <TextScallingFalse className="text-white w-24 text-center text-base">
            {match.homeTeam.name}
          </TextScallingFalse>
          {/* <TextScallingFalse className="text-white text-center text-base">{match?.t1}</TextScallingFalse> */}
        </View>

        {/* view 2 */}
        <View className="items-center flex-1 mt-[-32]">
          <TextScallingFalse className="text-white font-bold text-7xl">
            VS
          </TextScallingFalse>
          <TextScallingFalse className="absolute top-[48px]  text-neutral-300 text-center self-center text-base">
            {match.score?.fullTime?.home !== null &&
            match.score?.fullTime?.away !== null
              ? "FULL TIME"
              : match.score?.halfTime?.home !== null &&
                match.score?.halfTime?.away !== null
              ? "1ST HALF"
              : "NO SCORE"}
          </TextScallingFalse>
        </View>

        {/* view 3 */}
        <View className="items-center flex-1">
          <Image
            source={{ uri: match.awayTeam.crest }}
            style={{ width: 32, height: 32, marginBottom: 8 }}
          />
          <TextScallingFalse className="text-white w-24 text-center text-base">
            {match.awayTeam.name}
          </TextScallingFalse>
        </View>
      </View>

      {/* <TextScallingFalse className="text-white text-center text-base mb-2">{match?.t1}</TextScallingFalse> */}
    </>
  );
};
export default FootballMatchCard;
