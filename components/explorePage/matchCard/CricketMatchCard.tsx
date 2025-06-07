import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import NameFlagSubCard from "../nameFlagSubCard";
import { countryCodes } from "~/constants/countryCodes";
import { getCountryFlag } from "~/utils/getCountryFlag";

interface MatchCardProps {
  match: {
    matchInfo: {
      matchId: number;
      seriesId: number;
      seriesName: string;
      matchDesc: string;
      matchFormat: string;
      startDate: string; // Epoch string
      endDate: string; // Epoch string
      state: string; // "In Progress", "Complete"
      status: string; // "Day 1: 1st Session" or "Cook Islands won by 3 wkts"
      stateTitle: string; // "In Progress" or "CIS Won"

      team1: {
        teamId: number;
        teamName: string;
        teamSName: string;
        imageId: number;
      };
      team2: {
        teamId: number;
        teamName: string;
        teamSName: string;
        imageId: number;
      };

      venueInfo: {
        id: number;
        ground: string;
        city: string;
        timezone: string;
        latitude: string;
        longitude: string;
      };

      currBatTeamId?: number;
      seriesStartDt: string;
      seriesEndDt: string;
      isTimeAnnounced: boolean;
    };

    matchScore: {
      team1Score?: {
        inngs1?: {
          inningsId: number;
          runs: number;
          wickets: number;
          overs: number; // may appear as 7.6 or 19.6
        };
        inngs2?: {
          inningsId: number;
          runs: number;
          wickets: number;
          overs: number; // may appear as 7.6 or 19.6
        };
      };
      team2Score?: {
        inngs1?: {
          inningsId: number;
          runs: number;
          wickets: number;
          overs: number;
        };
        inngs2?: {
          inningsId: number;
          runs: number;
          wickets: number;
          overs: number;
        };
      };
    };
  };

  isLive?: boolean;
  onCardPress?: () => void;
}

const CricketMatchCard = ({ match, isLive, onCardPress }: MatchCardProps) => {
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

  const isMatchComplete = match.matchInfo?.state === "Complete";
  const [numberOfLinesTitle, setNumberOfLinesTitle] = useState(1);
  const toggleNumberOfLinesTitle = () => {
    setNumberOfLinesTitle((prev) => (prev === 1 ? 2 : 1));
  };
  const determineScore = ({
    teamRun,
    teamWicket,
    teamOver,
  }: {
    teamRun: number;
    teamWicket: number;
    teamOver: number;
  }) => {
    return teamRun && teamWicket && teamOver
      ? `${teamRun}-${teamWicket} (${teamOver})`
      : "yet to bat";
  };

  const filterResultData = ({
    result,
    teamA,
    teamB,
    teamA_short,
    teamB_short,
  }: {
    result: string;
    teamA: string;
    teamB: string;
    teamA_short: string;
    teamB_short: string;
  }): string | null => {
    return result.includes(teamA)
      ? result.replace(teamA, teamA_short).trim()
      : result.replace(teamB, teamB_short).trim();
  };

  const inngs1Exist = match.matchScore?.team1Score?.inngs2;
  const inngs2Exist = match.matchScore?.team2Score?.inngs2;

  return (
    <>
      {/* Title Section */}
      <View className="px-4 pt-3 pb-1">
        <TouchableOpacity
          className="flex-row items-center w-[220px] gap-2"
          onPress={toggleNumberOfLinesTitle}
        >
          {/* {match?.tournamentImg && (
            <View className="p-1 rounded-md">
              <Image
                source={{ uri: match?.tournamentImg }}
                className="w-8 h-8 rounded-md self-center"
              />
            </View>
          )} */}
          <TextScallingFalse
            className="text-[#EAEAEA] text-2xl w-4/5"
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
          >
            {match.matchInfo?.seriesName}
          </TextScallingFalse>
        </TouchableOpacity>

        {/* Game Type and Round */}
        <View className="flex-row items-center py-1">
          <TextScallingFalse className="text-theme text-base font-bold">
            {"\u25B6"} Cricket
          </TextScallingFalse>
          <TextScallingFalse className="text-[#919191] text-base">
            {" \u2022 "} {match.matchInfo?.matchFormat}
          </TextScallingFalse>
        </View>
      </View>

      {/* Live Indicator */}
      {isLive && (
        <View className="rounded-full absolute right-5 top-3 bg-[#BC3D40] px-[7px] flex-row items-center justify-center">
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
      <View className="h-[0.8] bg-[#252525] my-1" />

      {/* Teams Section */}
      <Pressable onPress={onCardPress}>
        <View className="px-4 mt-1">
          {/* Team 1 */}
          <View className="flex-row items-center justify-between mt-2 mb-1">
            <NameFlagSubCard
              flag={
                getCountryFlag(match.matchInfo?.team1?.teamName) ||
                match.matchInfo?.team1?.teamSName
              }
              teamName={match.matchInfo?.team1?.teamSName}
            />
            <TextScallingFalse
              className="ml-2"
              numberOfLines={numberOfLinesTitle}
              ellipsizeMode="tail"
              style={{
                fontSize: 12,
                color: match.matchScore?.team1Score ? "white" : "#464646",
              }}
            >
              {determineScore({
                teamRun: match.matchScore?.team1Score?.inngs1?.runs ?? 0,
                teamWicket: match.matchScore?.team1Score?.inngs1?.wickets ?? 0,
                teamOver: match.matchScore?.team1Score?.inngs1?.overs ?? 0,
              })}{" "}
              {inngs1Exist &&
                Object.keys(inngs1Exist).length > 0 &&
                determineScore({
                  teamRun: match.matchScore?.team1Score?.inngs2?.runs ?? 0,
                  teamWicket:
                    match.matchScore?.team1Score?.inngs2?.wickets ?? 0,
                  teamOver: match.matchScore?.team1Score?.inngs2?.overs ?? 0,
                })}
              {!isMatchComplete && (
                <TextScallingFalse
                  style={{
                    fontSize: 9,
                    color:
                      match.matchInfo?.currBatTeamId ===
                      match.matchInfo?.team1?.teamId
                        ? "green"
                        : "transparent",
                  }}
                >
                  {" "}
                  &#9664;
                </TextScallingFalse>
              )}
            </TextScallingFalse>
          </View>

          {/* Team 2 */}
          <View className="flex-row items-center justify-between mt-1 mb-2">
            <NameFlagSubCard
              flag={
                getCountryFlag(match.matchInfo?.team2?.teamName) ||
                match.matchInfo?.team2?.teamSName
              }
              teamName={match.matchInfo?.team2?.teamSName}
            />
            <TextScallingFalse
              className="ml-2"
              numberOfLines={numberOfLinesTitle}
              ellipsizeMode="tail"
              style={{
                fontSize: 12,
                color: match.matchScore?.team2Score ? "white" : "#464646",
              }}
            >
              {determineScore({
                teamRun: match.matchScore?.team2Score?.inngs1?.runs ?? 0,
                teamWicket: match.matchScore?.team2Score?.inngs1?.wickets ?? 0,
                teamOver: match.matchScore?.team2Score?.inngs1?.overs ?? 0,
              })}{" "}
              {inngs2Exist &&
                Object.keys(inngs2Exist).length > 0 &&
                determineScore({
                  teamRun: match.matchScore?.team2Score?.inngs2?.runs ?? 0,
                  teamWicket:
                    match.matchScore?.team2Score?.inngs2?.wickets ?? 0,
                  teamOver: match.matchScore?.team2Score?.inngs2?.overs ?? 0,
                })}
              {!isMatchComplete && (
                <TextScallingFalse
                  style={{
                    fontSize: 9,
                    color:
                      match.matchInfo?.currBatTeamId ===
                      match.matchInfo?.team2?.teamId
                        ? "green"
                        : "transparent",
                  }}
                >
                  {" "}
                  &#9664;
                </TextScallingFalse>
              )}
            </TextScallingFalse>
          </View>
        </View>

        {/* Match Status */}
        <View className="px-5 pt-2">
          {match.matchInfo?.status && (
            <TextScallingFalse
              className="text-[#C2C2C2] text-[10px]"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {filterResultData({
                result: match.matchInfo?.status,
                teamA: match.matchInfo.team1.teamName,
                teamB: match.matchInfo.team2.teamName,
                teamA_short: match.matchInfo.team1.teamSName,
                teamB_short: match.matchInfo.team2.teamSName,
              })}
            </TextScallingFalse>
          )}
        </View>
      </Pressable>
    </>
  );
};

export default CricketMatchCard;
