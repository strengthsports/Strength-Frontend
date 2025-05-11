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
    <View className="">
      <FlatList
        data={nextMatches}
        keyExtractor={(item, index) => `${item.league}_${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View className="min-h-56 w-full mr-5 mb-5 px-4">
            {isFetching ? (
              <View className="h-full flex justify-center self-center items-center">
                <ActivityIndicator size="large" color={Colors.themeColor} />
              </View>
            ) : (
              <View className="border border-[#454545] rounded-xl">
                <FootballNextMatchCard
                  league={item.league}
                  groupedMatches={item.matches}
                />
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="w-screen justify-center">
            {/* <TextScallingFalse className="text-white self-center text-center pr-7">
              No upcoming matches available
            </TextScallingFalse> */}
          </View>
        }
      />
    </View>
  );
};

export default FootballNextMatch;

const styles = StyleSheet.create({});
