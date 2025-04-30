import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { ThemedText } from "~/components/ThemedText";
import img from "@/assets/images/teams/Vector 64.png";
import PageThemeView from "../PageThemeView";
import TextScallingFalse from "../CentralText";
import Captain from "../SvgIcons/teams/Captain";
import Pending from "../SvgIcons/teams/Pending";

type TeamCardProps = {
  teamName: string;
  sportCategory: string;
  captain: string;
  viceCapt: string;
  location: string;
  teamLogo: string;
  sportLogo: string;
  showJoinButton?: boolean;
  onJoinPress?: () => void;
  joining?: boolean;
  requestSent?: boolean; 
};

const TeamCard: React.FC<TeamCardProps> = ({
  teamName,
  sportCategory,
  captain,
  viceCapt,
  location,
  teamLogo,
  sportLogo,
  showJoinButton = false,
  onJoinPress,
  joining = false,
  requestSent = false,
}) => {
  return (
    <>
      <View className="rounded-lg max-width-[500] mb-3 p-3 pt-[-8]">
        <View className="flex flex-row py-4 w-64 max-w-84">
          <Image source={{ uri: teamLogo }} className="w-32 h-32 mt-1 rounded ml-8" />
          <View className="flex flex-row items-center pl-10">
            <Image source={img} className="mr-3 ml-[-6px] h-[120px] fill-red-500" />
            <View className="flex flex-col pl-4">
              <Text className="text-white font-bold items-center text-5xl">
                {(teamName).toUpperCase()}
              </Text>
              
              {/* Join Team Button */}
              {showJoinButton && (
  <TouchableOpacity
    className={`mt-3 py-2 px-4 rounded-lg items-center justify-center ${
      joining || requestSent
        ? "bg-black border-[0.5px] border-[#6F6F6F]"
        : "bg-black border-[0.5px] border-[#6F6F6F]"
    }`}
    onPress={onJoinPress}
    disabled={joining || requestSent}
  >
    {joining || requestSent ? (
      <View className="flex-row items-center">
        <Pending />
        <TextScallingFalse className="text-white ml-2 text-lg font-bold">Pending</TextScallingFalse>
      </View>
    ) : (
      <TextScallingFalse className="text-white text-lg font-bold">Join Team</TextScallingFalse>
    )}
  </TouchableOpacity>
)}
            </View>
          </View>
        </View>
        
        {/* Team Details */}
        <View>
          <View className="flex flex-row items-center h-12 bg-[#191919] TextScallingFalse-white px-1 mt-1 rounded-t-[10px]">
            <View className="flex-1">
              <TextScallingFalse className="text-left ml-4 text-white font-bold text-2xl w-[200px]">
                SPORT CATEGORY
              </TextScallingFalse>
            </View>
            <View className="flex-1 justify-center items-center">
              <View className="w-[14px] border-t-2 border-white"></View>
            </View>
            <View className="flex-1  flex-row items-center justify-center">
              <Image
                source={{ uri: sportLogo || "https://via.placeholder.com/150" }}
                className="h-6 w-6 mr-6"
              />
              <TextScallingFalse className="text-white ml-[-14px] text-right  text-2xl">
                {sportCategory}
              </TextScallingFalse>
            </View>
          </View>

          {/* Captain */}
          <View className="flex flex-row items-center justify-between h-12 bg-[#191919] px-1 mt-1 text-white">
            <View className="flex-1">
              <TextScallingFalse className="text-left ml-4 text-white font-bold text-2xl w-[200px]">
                CAPTAIN
              </TextScallingFalse>
            </View>
            <View className="flex-1 justify-center items-center">
              <View className="w-[14px] border-t-2 border-white"></View>
            </View>
            <View className="flex-1">
              <TextScallingFalse className="text-white text-right mr-4 text-3xl">{captain}</TextScallingFalse>
            </View>
          </View>

          {/* Vice Captain */}
          <View className="flex flex-row items-center justify-between h-12 bg-[#191919] text-white px-1 mt-1">
            <View className="flex-1">
              <TextScallingFalse className="text-left ml-4 text-white font-bold text-2xl w-[200px]">
                VICE CAPTAIN
              </TextScallingFalse>
            </View>
            <View className="flex-1 justify-center items-center">
              <View className="w-[14px] border-t-2 border-white"></View>
            </View>
            <View className="flex-1">
              <TextScallingFalse className="text-white text-right mr-4 text-3xl">{viceCapt}</TextScallingFalse>
            </View>
          </View>

          {/* Location */}
          <View className="flex flex-row items-center justify-between h-12 bg-[#191919] text-white px-1 mt-1 rounded-b-[10px]">
            <View className="flex-1">
              <TextScallingFalse className="text-left ml-4 text-white font-bold text-2xl w-[200px]">
                LOCATION
              </TextScallingFalse>
            </View>
            <View className="flex-1 justify-center items-center">
              <View className="w-[14px] border-t-2 border-white"></View>
            </View>
            <View className="flex-1">
              <TextScallingFalse className="text-white text-right mr-4 text-3xl">{location}</TextScallingFalse>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default TeamCard;