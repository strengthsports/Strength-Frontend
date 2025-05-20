import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import TextScallingFalse from "~/components/CentralText";
import NameFlagSubCard from "../nameFlagSubCard";

interface MatchCardProps {
  match: {
    id: number;
    date: string;
    time: string;
    venue: string;
    status: {
      long: string;
      short: string;
      timer: string;
    };
    league: {
      id: number;
      name: string;
      type: string;
      season: number;
      logo: string;
    };
    country: {
      id: number;
      name: string;
      code: string;
      flag: string;
    };
    teams: {
      home: {
        id: number;
        name: string;
        logo: string;
      };
      away: {
        id: number;
        name: string;
        logo: string;
      };
    };
    scores: {
      home: {
        quarter_1: number;
        quarter_2: number;
        quarter_3: number;
        quarter_4: number;
        over_time: number | null;
        total: number;
      };
      away: {
        quarter_1: number;
        quarter_2: number;
        quarter_3: number;
        quarter_4: number;
        over_time: number | null;
        total: number;
      };
    };
  };
  isLive?: boolean;
}

interface GroupedMatchProps {
  league: string;
  groupedMatches: MatchCardProps["match"][];
}

const BasketballNextMatchCard = ({
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
      <View className="px-4 pt-3 pb-2 w-full rounded-t-xl bg-[#262626]">
        <TouchableOpacity
          className="flex-row items-center w-4/5 gap-2"
          onPress={toggleNumberOfLines}
        >
          <View className="py-1">
            <Image
              source={{ uri: groupedMatches[0].league.logo }}
              className="w-[24px] h-[16px] rounded-[2px] self-center"
            />
          </View>
          <TextScallingFalse
            className="text-white text-3xl w-[88%]"
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
          >
            {groupedMatches[0].country.name} - {league}
          </TextScallingFalse>
        </TouchableOpacity>

        {/* Game Type and Round */}
        <View className="flex-row items-center mt-2">
          <TextScallingFalse className="text-theme text-base font-semibold">
            {"\u25B6"}  Basketball{" "}
          </TextScallingFalse>
        </View>
      </View>
      {groupedMatches.map((match) => (
        <View key={match.id}>
          <View className="h-[1px] bg-[#262626]" />

          <View className="pl-6 pt-5">
            <TextScallingFalse className="text-[#9E9E9E] text-base">
              {" \u2022 "}
              {match.country.name}
            </TextScallingFalse>
          </View>
          <View className="flex-row items-center justify-between p-6">
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
            <View className="w-[1px] h-12 bg-neutral-700 absolute right-[124px] top-[26px]" />
            {/* Match Date and time */}
            <View className="items-center w-[84px]">
              <TextScallingFalse className="text-[#C7C7C7] text-center text-[11.5px]">
                {formatFixtureDateTime(match.date).dayString}
                {/* Day here */}
              </TextScallingFalse>
              <TextScallingFalse className="text-[#C7C7C7] text-center text-[11.5px]">
                {formatFixtureDateTime(match.date).timeString}
                {/* Time here */}
              </TextScallingFalse>
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

export default BasketballNextMatchCard;

const styles = StyleSheet.create({});
