import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import FootballNextMatchCard from "../matchCard/FootballNextMatchCard";
import { Colors } from "~/constants/Colors";

interface NextFootballMatchProps {
  nextMatches: any[];
  isFetching: boolean;
}

const FootballNextMatch: React.FC<NextFootballMatchProps> = ({
  nextMatches,
  isFetching,
}) => {
  return (
    <View className="mt-7">
      <FlatList
        data={nextMatches}
        keyExtractor={(item, index) => `${item.league}_${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View className="min-h-56 w-full rounded-2xl bg-[#0B0B0B] mr-5 border border-[#454545] mb-10">
            {isFetching ? (
              <View className="h-full flex justify-center self-center items-center">
                <ActivityIndicator size="large" color={Colors.themeColor} />
              </View>
            ) : (
              <FootballNextMatchCard
                league={item.league}
                groupedMatches={item.matches}
              />
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="w-screen justify-center mt-10">
            <TextScallingFalse className="text-white self-center text-center pr-7">
              No upcoming matches available
            </TextScallingFalse>
          </View>
        }
      />
    </View>
  );
};

export default FootballNextMatch;

const styles = StyleSheet.create({});
