import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import TextScallingFalse from "~/components/CentralText";
import NameFlagSubCard from "../nameFlagSubCard";

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
      home: number | null;
      away: number | null;
    };
    score: {
      halftime: {
        home: number | null;
        away: number | null;
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
}

interface GroupedMatchProps {
  league: string;
  groupedMatches: MatchCardProps["match"][];
}

const FootballNextMatchCard = ({
  league,
  groupedMatches,
}: GroupedMatchProps) => {
  const [numberOfLinesTitle, setNumberOfLinesTitle] = useState(1);
  const toggleNumberOfLines = () => {
    setNumberOfLinesTitle((prev) => (prev === 1 ? 2 : 1));
  };

  function formatFixtureDateTime(isoDateString: string) {
    const fixtureDate = new Date(isoDateString);
    const now = new Date();

    // Create dates only (removing time for comparison)
    const fixtureDay = new Date(
      fixtureDate.getFullYear(),
      fixtureDate.getMonth(),
      fixtureDate.getDate()
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Determine day string
    let dayString = fixtureDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

    if (fixtureDay.getTime() === today.getTime()) {
      dayString = "Today,";
    } else if (fixtureDay.getTime() === tomorrow.getTime()) {
      dayString = "Tomorrow,";
    }

    // Format time
    const timeString = fixtureDate
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase(); // to get 'am/pm' in small letters

    return { dayString, timeString };
  }

  return (
    <>
      {/* Title Section */}
      <View className="px-6 pt-3 mt-[0.7] pb-2 w-full h-16 rounded-t-2xl bg-[#262626]">
        <TouchableOpacity
          className="flex-row items-center w-4/5 gap-2"
          onPress={toggleNumberOfLines}
        >
          <View className="py-1 pl-1">
            <Image
              source={{ uri: groupedMatches[0].league.logo }}
              className="w-[24px] h-[14px] rounded-[2px] self-center"
            />
          </View>
          <TextScallingFalse
            className="text-white text-3xl w-4/5"
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
          >
            {league}
          </TextScallingFalse>
        </TouchableOpacity>

        {/* Game Type and Round */}
        <View className="flex-row items-center p-1">
          <TextScallingFalse className="text-theme text-base font-bold">
            {"\u25B6"} Football{" "}
          </TextScallingFalse>
        </View>
      </View>
      {groupedMatches.map((match) => (
        <View key={match.league.id}>
          <View className="h-[0.8] bg-neutral-700" />

          <View className="pl-10 pt-5">
            <TextScallingFalse className="text-[#9E9E9E] text-base">
              {" \u2022 "}
              {match.league.round}
            </TextScallingFalse>
          </View>
          <View className="flex-row items-center justify-between px-10 p-7">
            <View className="flex-column gap-y-3">
              {/* Team 1 */}
              <NameFlagSubCard
                flag={match.teams.home.logo}
                teamName={match.teams.home.name}
              />

              {/* Team 2 */}
              <NameFlagSubCard
                flag={match.teams.away.logo}
                teamName={match.teams.away.name}
              />
            </View>
            <View className="w-[1px] h-12 bg-neutral-700 ml-28" />
            {/* Match Date and time */}
            <View className="items-center">
              <TextScallingFalse className="text-neutral-300 text-center text-base">
                {formatFixtureDateTime(match.fixture.date).dayString}
                {/* Day here */}
              </TextScallingFalse>
              <TextScallingFalse className="text-neutral-300 text-center text-base">
                {formatFixtureDateTime(match.fixture.date).timeString}
                {/* Time here */}
              </TextScallingFalse>
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

export default FootballNextMatchCard;

const styles = StyleSheet.create({});
