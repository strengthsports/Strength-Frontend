import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FootballNextMatchCard from "../matchCard/FootballMatchCard";
import { Colors } from "~/constants/Colors";

interface LiveFootballMatchProps {
  liveMatches: any[];
  isFetching: boolean;
  onRefetch: () => void;
}

const FootballLiveMatch: React.FC<LiveFootballMatchProps> = ({
  liveMatches,
  isFetching,
  onRefetch,
}) => {
  return (
    <View className="mt-4">
      <View className="flex-row items-center justify-between pl-7 pr-10 mb-4">
        <View className="flex-row items-center ">
          <TextScallingFalse className="text-white text-6xl font-bold">
            Matches
          </TextScallingFalse>
          <MaterialCommunityIcons
            name="chevron-double-right"
            size={22}
            color="white"
            className="-mb-1"
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onRefetch}
          style={{
            width: 40,
            height: 20,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <MaterialCommunityIcons
            name="reload"
            size={22}
            color="grey"
            className="-mb-1"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={liveMatches}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View className="h-48 w-96 bg-transparent rounded-2xl mr-5 border border-[#454545] ">
            {isFetching ? (
              <View className="h-full flex justify-center self-center items-center">
                <ActivityIndicator size="large" color={Colors.themeColor} />
              </View>
            ) : (
              <FootballNextMatchCard match={item} isLive={true} />
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

export default FootballLiveMatch;

const styles = StyleSheet.create({});
