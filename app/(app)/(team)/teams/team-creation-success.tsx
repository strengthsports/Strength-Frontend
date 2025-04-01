import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RootState } from "~/reduxStore";
import { useSelector } from "react-redux";

interface TeamMember {
  id: string;
  firstName: string;
  profilePic: string;
  headline?: string;
}

interface TeamData {
  _id?: string; 
  logo?: { uri: string };
  name: string;
  sport: string;
  establishedOn: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
  gender: "male" | "female";
  description: string;
  members: TeamMember[];
}

const TeamCreatedPage: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const teamData: TeamData = params.teamData ? JSON.parse(params.teamData as string) : null;
  const team = useSelector((state:RootState)=>state.team.team);
  
  const translateY = new Animated.Value(30);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubmit = () => {
    console.log(team?._id);
    router.push({
      pathname: `/(team)/teams/${team?._id}`,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-black pt-2">
      <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
        {/* Image Section */}
        <View className="flex items-center mt-8 px-16">
          <Image
            source={require("../../../../assets/images/teams/done.png")}
            className="rounded-full h-40 w-40"
          />
        </View>

        <View className="flex items-center mt-4">
          <Text className="text-white text-6xl font-semibold">
            Team Created!
          </Text>
        </View>

        <View className="flex items-center justify-center mt-2">
          <Text className="text-[#A5A5A5] text-3xl text-center px-12">
            Your team is now live! Bring your squad together and start the game.
          </Text>
        </View>
        
        {/* Team Details Section */}
        <View className="flex flex-row items-center py-4 w-full mt-8 pl-6">
          <Image
            source={teamData?.logo ? { uri: teamData.logo.uri } : require("../../../../assets/images/teams/dummyteam.png")}
            className="w-36 h-36"
          />
          <Image
            source={require("../../../../assets/images/teams/Vector 64.png")}
            className="mr-4 ml-7 h-[108px]"
          />
          <View className="flex flex-col ml-2">
            <Text className="text-white text-[25px] font-bold">
              {teamData?.name || "Team Name"}
            </Text>
          </View>
        </View>

        <View className="px-5 py-2">
          <Text className="text-[#9F9F9F] text-5xl font-semibold border-b border-[#36403D] pb-4">
            Invited Team Members
          </Text>
        </View>

        {/* Team Members List */}
        <ScrollView className="flex-1 px-10">
          {teamData?.members?.map((member) => (
            <View key={member.id} className="flex-row items-center py-4">
              <Image
                source={{ uri: member.profilePic || "https://picsum.photos/200/200" }}
                className="w-14 h-14 rounded-full mr-4"
              />
              <View className="flex-1 border-b border-[#5C5C5C] pb-4">
                <Text className="text-white text-3xl font-semibold">
                  {member.firstName}
                </Text>
                <Text className="text-[#9CA3AF] text-2xl">
                  {member.headline || "Team Member"}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Save button at the bottom */}
      <View className="p-6 border-t border-[#363636] bg-black">
        <TouchableOpacity
          className="bg-[#12956B] p-4 rounded-2xl"
          onPress={handleSubmit}
        >
          <Text className="text-white text-3xl font-semibold text-center">
            Go to Teams Page
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TeamCreatedPage;