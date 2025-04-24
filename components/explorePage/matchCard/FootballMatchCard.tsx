import TextScallingFalse from "../../CentralText";
import CountryFlag from "react-native-country-flag";
import { Image, TouchableOpacity, View, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import { countryCodes } from "~/constants/countryCodes";

interface MatchCardProps {
  match: {
    fixture: {
      id: number;
      referee: string | null;
      timezone: string;
      date: string;
      timestamp: number;
      periods: {
        first: number | null;
        second: number | null;
      };
      venue: {
        id: number;
        name: string;
        city: string;
      };
      status: {
        long: string;
        short: string;
        elapsed: number | null;
        extra: number | null;
      };
    };
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string;
      season: number;
      round: string;
      standings: boolean;
    };
    teams: {
      home: {
        id: number;
        name: string;
        logo: string;
        winner: boolean | null;
      };
      away: {
        id: number;
        name: string;
        logo: string;
        winner: boolean | null;
      };
    };
    goals: {
      home: number;
      away: number;
    };
    score: {
      halftime: {
        home: number;
        away: number;
      };
      fulltime: {
        home: number | null;
        away: number | null;
      };
      extratime: {
        home: number | null;
        away: number | null;
      };
      penalty: {
        home: number | null;
        away: number | null;
      };
    };
    events?: {
      time: {
        elapsed: number;
        extra: number | null;
      };
      team: {
        id: number;
        name: string;
        logo: string;
      };
      player: {
        id: number | null;
        name: string | null;
      };
      assist: {
        id: number | null;
        name: string | null;
      };
      type: string;
      detail: string;
      comments: string | null;
    }[];
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
  // const getCountryCode = (teamName: string) =>
  //   countryCodes[teamName as keyof typeof countryCodes] || "Unknown";

  const extractRoundNum = (round: string): number | null => {
    const match = round.match(/\d+/);
    return match ? Number(match[0]) : null;
  };

  const determineTimeElapsed = (status: string): string | null => {
    switch (status) {
      case "1H":
        return "1st Half";
      case "HT":
        return "Halftime";
      case "2H":
        return "2nd Half";
      case "ET":
        return "Extra Time";
      case "BT":
        return "Break in Extra Time";
      case "P":
        return "Penalties";
      case "SUSP":
        return "Match Suspended";
      case "INT":
        return "Match Interrupted";
      case "FT":
        return "Match Finished";
      default:
        return "In Progress";
    }
  };

  return (
    <>
      {/* <View className="w-full h-full rounded-t-2xl bg-neutral-700" > */}

      {/* Title Section */}
      <View className="px-4 pt-3 pb-2">
        <TouchableOpacity
          className="flex-row items-center w-4/5 gap-2"
          onPress={toggleNumberOfLines}
        >
          {/* {match?.tournamentImg && (
            <View className="p-1 rounded-md">
              <Image
                source={{ uri: match?.competition?.emblem }}
                className="w-8 h-8 rounded-md self-center"
              />
            </View>
          )} */}
          <View className="w-4/5 flex-row items-center">
            <TextScallingFalse className="text-white text-2xl">
              {match.league.country} -{" "}
            </TextScallingFalse>
            <TextScallingFalse
              className="text-white text-2xl w-4/5"
              numberOfLines={numberOfLinesTitle}
              ellipsizeMode="tail"
            >
              {match.league.name}{" "}
            </TextScallingFalse>
          </View>
        </TouchableOpacity>

        {/* Game Type and Round */}
        <View className="flex-row items-center py-1">
          <TextScallingFalse className="text-theme text-base font-bold">
            {"\u25B6"} Football{" "}
          </TextScallingFalse>
          <TextScallingFalse className="text-[#9E9E9E] text-base">
            {" \u2022 "} Round {extractRoundNum(match.league.round)}
          </TextScallingFalse>
        </View>
      </View>

      {/* Live Indicator */}
      {isLive && (
        <View className="rounded-full absolute right-5 top-4 bg-[#BC3D40] px-[7px] flex-row items-center justify-center">
          <Animated.Text
            className="text-xs text-white font-bold"
            style={[
              { opacity: opacityValue },
              { fontSize: 14, lineHeight: 20 }, // Adjust to match LIVE text height
            ]}
          >
            &bull;
          </Animated.Text>
          <TextScallingFalse className="ml-1 text-[11px] text-white font-semibold">
            LIVE
          </TextScallingFalse>
        </View>
      )}

      {/* Border */}
      <View className="h-[0.8] bg-[#252525]" />

      <View className=" h-28 flex-row justify-center items-center pb-2">
        {/* view 1 */}
        <View className="items-center justify-center flex-1">
          <Image
            source={{ uri: match.teams.home.logo }}
            style={{ width: 32, height: 32, marginBottom: 8 }}
          />
          <TextScallingFalse className="text-white w-24 text-center text-base">
            {match.teams.home.name}
          </TextScallingFalse>
          {/* <TextScallingFalse className="text-white text-center text-base">{match?.t1}</TextScallingFalse> */}
        </View>

        {/* view 2 */}
        <View className="items-center flex-1">
          <TextScallingFalse className="text-[#F2F2F2] font-semibold text-7xl font-turret-road">
            {match.goals.away} - {match.goals.away}
          </TextScallingFalse>
          <TextScallingFalse className="text-[#8F8F8F] text-center self-center text-base font-monster-bold">
            {determineTimeElapsed(match.fixture.status.short)}
          </TextScallingFalse>
          <TextScallingFalse className="text-[#8F8F8F] text-center self-center text-base mt-0.5">
            {match.fixture.status.elapsed}'
          </TextScallingFalse>
        </View>

        {/* view 3 */}
        <View className="items-center flex-1">
          <Image
            source={{ uri: match.teams.away.logo }}
            style={{ width: 32, height: 32, marginBottom: 8 }}
          />
          <TextScallingFalse className="text-white w-24 text-center text-base">
            {match.teams.away.name}
          </TextScallingFalse>
        </View>
      </View>

      {/* <TextScallingFalse className="text-white text-center text-base mb-2">{match?.t1}</TextScallingFalse> */}
    </>
  );
};
export default FootballMatchCard;
