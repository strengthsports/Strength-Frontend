import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import BasketballNextMatchCard from "../matchCard/BasketballNextMatchCard";
import { Colors } from "~/constants/Colors";

interface NextBasketballMatchProps {
  nextMatches: any[];
  isFetching: boolean;
}

const BasketballNextMatch: React.FC<NextBasketballMatchProps> = ({
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
                <BasketballNextMatchCard
                  league={item.league}
                  groupedMatches={item.matches}
                />
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="w-screen justify-center mt-10">
            {/* <TextScallingFalse className="text-white self-center text-center pr-7">
              No upcoming matches available
            </TextScallingFalse> */}
          </View>
        }
      />
    </View>
  );
};

export default BasketballNextMatch;

const styles = StyleSheet.create({});
