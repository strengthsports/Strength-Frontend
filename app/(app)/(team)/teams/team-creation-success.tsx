import React, { useState, useEffect } from "react";
import { View,  Image, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RootState } from "~/reduxStore";
import { useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";

interface TeamMember {
  _id: string;
  firstName: string;
  lastName:string;
  username:string;
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
  const teamId = params.teamId as string || team?._id;
  // const teamData = params.teamData ? JSON.parse(params.teamData as string) : null;
  console.log(teamId);
  const translateY = new Animated.Value(30);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubmit = () => {
    if (!teamId) {
      console.error("No teamId available for navigation");
      return;
    }
    
    router.replace({
      pathname: `/(team)/teams/${teamId}`,
      params: {
        teamId, // Pass the teamId as param
        teamName: teamData?.name || "Team" // Optional: pass team name
      }
    });
  };
   console.log("User Name------>",teamData.members);

  return (
    <SafeAreaView className="flex-1 bg-black pt-2">
      <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
        {/* Image Section */}
        <View className="flex items-center mt-2 px-16">
          <Image
            source={require("../../../../assets/images/tickmark.gif")}
            className="rounded-full h-40 w-40"
          />
        </View>

        <View className="flex items-center mt-[-12px]">
          <TextScallingFalse className="text-white text-6xl font-bold">
            Team Created!
          </TextScallingFalse>
        </View>

        <View className="flex items-center justify-center mt-2 mb-[-20px]">
          <TextScallingFalse className="text-[#A5A5A5] text-2xl text-center px-16">
            Your team is now live! Bring your squad together and start the game.
          </TextScallingFalse>
        </View>
        
        {/* Team Details Section */}
        <View className="flex flex-row items-center py-4 w-full mt-8 pl-6">
          <Image
            source={teamData?.logo ? { uri: teamData.logo.uri } : require("../../../../assets/images/teams/dummyteam.png")}
            className="w-32 h-32 rounded-sm"
          />
          <Image
            source={require("../../../../assets/images/teams/Vector 64.png")}
            className="mr-4 ml-7 h-[108px]"
          />
           <View className="flex flex-col pl-2 w-[200px] ">
                        <TextScallingFalse className="text-white font-bold  items-center text-5xl">
                          {teamData?.name.toUpperCase()}
                        </TextScallingFalse>
                      </View>
         
        </View>

        <View className="px-5 mt-8 py-0">
          <TextScallingFalse className="text-[#9F9F9F] text-2xl font-semibold border-b border-[#36403D] pb-1">
            Invited Team Members
          </TextScallingFalse>
        </View>

        {/* Team Members List */}
        <ScrollView className="flex-1 px-6 ">


        {Array.from(new Map(teamData?.members?.map(member => [member._id, member])).values()).map((member) => (
  <View key={member._id} className="flex-row items-center py-4">
    <Image
      source={{ uri: member.profilePic || "https://picsum.photos/200/200" }}
      className="w-12 h-12 mb-2 rounded-full mr-4"
    />
    <View className="flex-1  border-b border-[#5C5C5C] pb-4">
      <View className="flex-row">
      <TextScallingFalse className="text-white text-3xl font-semibold">
        {member.firstName + " "}
      </TextScallingFalse>
      <TextScallingFalse className="text-white text-3xl font-semibold">
        {member.lastName}
      </TextScallingFalse>
      </View>
      {/* <TextScallingFalse className="text-[#9CA3AF] text-lg">
        {member.username || ""}
      </TextScallingFalse> */}
      <TextScallingFalse className="text-[#9CA3AF] text-lg">
        {member.headline || "Team Member"}
      </TextScallingFalse>
       
      
    </View>
   
  </View>
))}



        </ScrollView>
      </Animated.View>

      {/* Save button at the bottom */}
      <View className="pt-4 px-6 border-t border-[#363636] bg-black">
        <TouchableOpacity
          className="bg-[#12956B] p-4 rounded-2xl"
          onPress={handleSubmit}
        >
          <TextScallingFalse className="text-white text-3xl font-semibold text-center">
            Go to Teams Page
          </TextScallingFalse>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TeamCreatedPage;