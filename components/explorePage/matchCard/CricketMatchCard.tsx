import React, { useEffect, useRef, useState } from "react";
import { View, Image, TouchableOpacity, Animated } from "react-native";
import TextScallingFalse from "~/components/CentralText";
import NameFlagSubCard from "../nameFlagSubCard";
import { countryCodes } from "~/constants/countryCodes";

// interface MatchCardProps {
//   match: {
//     id: number; // from: match_id
//     series: string; // from: series
//     matchType: string; // from: match_type
//     status: string; // from: match_status
//     venue: string; // from: venue
//     inning: string; // from: current_inning
//     matchNumber: string; // from: matchs (e.g. "34th Match")

//     t1: string; // from: team_a
//     t1s: string; // from: team_a_scores or team_a_scores_over[0].score
//     t1Img: string; // from: team_a_img

//     t2: string; // from: team_b
//     t2s: string; // from: team_b_scores or team_b_scores_over[0].score
//     t2Img: string; // from: team_b_img

//     toss?: string; // from: toss
//     result?: string; // from: result (optional for completed matches)
//     date?: string; // from: match_date (e.g. "18-Apr")
//     time?: string; // from: match_time
//     target?: string; // from: need_run_ball (optional, for chases)
//   };
//   isLive?: boolean;
// }

interface MatchCardProps {
  match: {
    match_id: number;
    series: string;
    match_type: string;
    match_status: string;
    venue: string;
    current_inning?: number;
    matchs: string;

    team_a: string;
    team_a_short: string;
    team_a_scores: string;
    team_a_over: string;
    team_a_img: string;
    team_a_id: number;

    team_b: string;
    team_b_short: string;
    team_b_scores: string;
    team_b_over: string;
    team_b_img: string;
    team_b_id: number;

    balling_team?: string;
    toss?: string;
    result?: string;
    match_date: string;
    match_time: string;
    need_run_ball?: string;
  };
  isLive?: boolean;
}

const CricketMatchCard = ({ match, isLive }: MatchCardProps) => {
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

  const determineScore = ({
    teamScore,
    teamOver,
  }: {
    teamScore: string;
    teamOver: string;
  }) => {
    if (teamScore === "" && teamOver === "") return "Yet to bat";
    return `${teamScore} (${teamOver})`;
  };

  const determineBattingTeam = ({
    teamId,
    ballingTeamId,
  }: {
    teamId: Number;
    ballingTeamId: string;
  }) => {
    const ballingTeamIdNum = ballingTeamId ? parseInt(ballingTeamId) : 0;
    return teamId === ballingTeamIdNum ? "transparent" : "green";
  };

  const filterTossData = (tossData: string): string | null => {
    const filteredData = tossData
      .replace("have won the toss and have ", "")
      .trim();
    return filteredData;
  };
  return (
    <>
      {/* Title Section */}
      <View className="px-4 pt-3 pb-1">
        <TouchableOpacity
          className="flex-row items-center w-4/5 gap-2"
          onPress={toggleNumberOfLines}
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
            {match.series}
          </TextScallingFalse>
        </TouchableOpacity>

        {/* Game Type and Round */}
        <View className="flex-row items-center py-1">
          <TextScallingFalse className="text-theme text-base font-bold">
            {"\u25B6"} Cricket
          </TextScallingFalse>
          <TextScallingFalse className="text-[#919191] text-base">
            {" \u2022 "} {match.match_type}
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
      <View className="h-[0.8] bg-[#252525] my-1" />

      {/* Teams Section */}
      <View className="px-4 mt-1">
        {/* Team 1 */}
        <View className="flex-row items-center justify-between mt-2 mb-1">
          <NameFlagSubCard
            flag={match.team_a_img}
            teamName={match.team_a_short}
          />
          <TextScallingFalse
            className="ml-2"
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
            style={{
              fontSize: 12,
              color: match.team_a_scores === "" ? "#464646" : "white",
            }}
          >
            {determineScore({
              teamScore: match.team_a_scores,
              teamOver: match.team_a_over,
            })}
            <TextScallingFalse
              style={{
                fontSize: 9,
                color:
                  match.team_a_scores === ""
                    ? "transparent"
                    : match?.balling_team &&
                      determineBattingTeam({
                        teamId: match.team_a_id,
                        ballingTeamId: match?.balling_team,
                      }),
              }}
            >
              {" "}
              &#9664;
            </TextScallingFalse>
          </TextScallingFalse>
        </View>

        {/* Team 2 */}
        <View className="flex-row items-center justify-between mt-1 mb-2">
          <NameFlagSubCard
            flag={match.team_b_img}
            teamName={match.team_b_short}
          />
          <TextScallingFalse
            className="ml-2"
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
            style={{
              fontSize: 12,
              color: match.team_b_scores === "" ? "#464646" : "white",
            }}
          >
            {determineScore({
              teamScore: match.team_b_scores,
              teamOver: match.team_b_over,
            })}
            <TextScallingFalse
              style={{
                fontSize: 9,
                color:
                  match.team_a_scores === ""
                    ? "transparent"
                    : match?.balling_team &&
                      determineBattingTeam({
                        teamId: match.team_b_id,
                        ballingTeamId: match?.balling_team,
                      }),
              }}
            >
              {" "}
              &#9664;
            </TextScallingFalse>
          </TextScallingFalse>
        </View>
      </View>
      {/* Match Status */}
      <View className="px-4 pb-2">
        {isLive
          ? match.current_inning === 1
            ? match.toss && (
                <TextScallingFalse className="text-yellow-300 text-xs">
                  {filterTossData(match.toss)}
                </TextScallingFalse>
              )
            : match.need_run_ball && (
                <TextScallingFalse className="text-green-400 text-xs">
                  {match.need_run_ball}
                </TextScallingFalse>
              )
          : match.result && (
              <TextScallingFalse className="text-green-400 text-xs">
                {match.result}
              </TextScallingFalse>
            )}
      </View>
    </>
  );
};

export default CricketMatchCard;
