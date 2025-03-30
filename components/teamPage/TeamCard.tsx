import React from "react";
import { View, Text, Image } from "react-native";
import { ThemedText } from "~/components/ThemedText";
import img from "@/assets/images/teams/Vector 64.png";

type TeamCardProps = {
  teamName: string;
  sportCategory: string;
  captain: string;
  viceCapt: string;
  location: string;
  teamLogo: string;
  sportLogo: string;
};
const TeamCard: React.FC<TeamCardProps> = ({
  teamName,
  sportCategory,
  captain,
  viceCapt,
  location,
  teamLogo,
  sportLogo,
}) => {
  return (
    <>
      <View className="rounded-lg max-width-[500] mb-1 p-3">
        <View className="flex flex-row py-4 w-64 max-w-84">
          <Image source={{ uri: teamLogo }} className="w-32 h-30 ml-8" />
          <View className="flex flex-row items-center pl-10">
            <Image source={img} className="mr-2 h-[108px]" />
            <View className="flex flex-col pl-4">
              <Text className="text-white font-bold  items-center text-6xl">
                {teamName}
              </Text>
            </View>
          </View>
        </View>
        {/* Team Details */}
        <View className="px-2">
          <View className="flex flex-row items-center justify-between h-12 bg-[#191919] text-white px-8 mt-1 rounded-t-[10px]">
            <View className="flex-1">
              <ThemedText className="text-white text-xl font-bold">
                Category
              </ThemedText>
            </View>
            <View className="flex-1 justify-center items-center">
              <ThemedText className="text-white text-xl">-</ThemedText>
            </View>
            <View className="flex-1 flex-row items-center justify-center space-x-2">
              <Image
                source={{ uri: sportLogo || "https://via.placeholder.com/150" }}
                className="h-7 w-7 mr-2"
              />
              <ThemedText className="text-white text-xl">
                {sportCategory}
              </ThemedText>
            </View>
          </View>
          {/* Captain */}
          <View className="flex flex-row items-center justify-between h-12 bg-[#191919]  text-white px-8 mt-1">
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
          <View className="flex flex-row items-center justify-between h-12 bg-[#191919] text-white px-8 mt-1">
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
          <View className="flex flex-row items-center justify-between h-12 bg-[#191919] text-white px-8 mt-1 rounded-b-[10px]">
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
