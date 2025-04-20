import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import BasketballMatchCard from "../matchCard/BasketballMatchCard";
import { Colors } from "~/constants/Colors";

interface LiveBasketballMatchProps {
  liveMatches: any[];
  isFetching: boolean;
  onRefetch: () => void;
}

const BasketballLiveMatch: React.FC<LiveBasketballMatchProps> = ({
  liveMatches,
  isFetching,
  onRefetch,
}) => {
  return (
    <View className="mt-4">
      <FlatList
        data={liveMatches}
        keyExtractor={(item) => item?.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View className="h-[164px] w-[280px] bg-transparent rounded-2xl mr-5 border border-[#454545]">
            {isFetching ? (
              <View className="h-full flex justify-center self-center items-center">
                <ActivityIndicator size="large" color={Colors.themeColor} />
              </View>
            ) : (
              <BasketballMatchCard match={item} isLive={true} />
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="w-screen justify-center mt-10">
            <TextScallingFalse className="text-white self-center text-center pr-7">
              No live matches available
            </TextScallingFalse>
          </View>
        }
      />
    </View>
  );
};

export default BasketballLiveMatch;

const styles = StyleSheet.create({});
