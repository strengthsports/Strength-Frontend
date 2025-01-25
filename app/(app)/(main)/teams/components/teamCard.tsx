import React from "react";
import { View, Text, Image } from "react-native";
import { ThemedText } from "~/components/ThemedText";

type TeamCardProps = {
  sportCategory: string;
  captain: string;
  viceCapt: string;
  location: string;
};
const TeamCard: React.FC<TeamCardProps> = ({
  sportCategory,
  captain,
  viceCapt,
  location,
}) => {
  return (
    <>
      <View className="h-[140px] rounded-lg">
        <View className="flex flex-row items-center p-4">
          <Image
            source={{ uri: "https://picsum.photos/200/300" }}
            className="w-20 h-28 ml-8"
          />
          <View className="flex flex-row items-center pl-28">
            <Image
              source={require("../../../../../assets/images/teams/Vector 64.png")}
              className="mr-2"
            />
            <View className="flex flex-col pl-4">
              <Text className="text-white font-bold text-3xl">
                {sportCategory}
              </Text>
              <Text className="text-white text-xl">{location}</Text>
            </View>
          </View>
        </View>
        {/* Team Details */}
        <View className="px-2">
          <View className="flex flex-row items-center justify-between h-16 bg-[#191919] text-white px-8 mt-1 rounded-[10px]">
            <View className="flex-1">
              <ThemedText className="text-white text-xl font-bold">
                Category
              </ThemedText>
            </View>
            <View className="flex-1 justify-center items-center">
              <ThemedText className="text-white text-xl">-</ThemedText>
            </View>
            <View className="flex-1 justify-end items-center">
              <ThemedText className="text-white text-xl">
                {sportCategory}
              </ThemedText>
            </View>
          </View>
          {/* Captain */}
          <View className="flex flex-row items-center justify-between h-16 bg-[#191919] rounded-[10px] text-white px-8 mt-1">
            <View className="flex-1">
              <ThemedText className="text-white text-xl font-bold">
                Captain
              </ThemedText>
            </View>
            <View className="flex-1 justify-center items-center">
              <ThemedText className="text-white text-xl">-</ThemedText>
            </View>
            <View className="flex-1 justify-end items-center">
              <ThemedText className="text-white text-xl">{captain}</ThemedText>
            </View>
          </View>

          {/* Vice Captain */}
          <View className="flex flex-row items-center justify-between h-16 bg-[#191919] text-white px-8 mt-1 rounded-[10px]">
            <View className="flex-1">
              <ThemedText className="text-white text-xl font-bold">
                Vice Captain
              </ThemedText>
            </View>
            <View className="flex-1 justify-center items-center">
              <ThemedText className="text-white text-xl">-</ThemedText>
            </View>
            <View className="flex-1 justify-end items-center">
              <ThemedText className="text-white text-xl">{viceCapt}</ThemedText>
            </View>
          </View>

          {/* Location */}
          <View className="flex flex-row items-center justify-between h-16 bg-[#191919] text-white px-8 mt-1 rounded-[10px]">
            <View className="flex-1">
              <ThemedText className="text-white text-xl font-bold">
                Location
              </ThemedText>
            </View>
            <View className="flex-1 justify-center items-center">
              <ThemedText className="text-white text-xl">-</ThemedText>
            </View>
            <View className="flex-1 justify-end items-center">
              <ThemedText className="text-white text-xl">{location}</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default TeamCard;
