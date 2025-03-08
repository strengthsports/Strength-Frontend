import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import showTeam from "./[teamId]";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

interface PotentialMember {
  id: number;
  name: string;
  role: string;
  image: string;
  selected?: boolean;
}

const TeamCreatedPage: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Prathik Jha",
      role: "Cricketer | Ranji trophy player",
      image: "https://picsum.photos/200/200",
    },
    {
      id: 2,
      name: "Rohan Deb Nath",
      role: "Cricketer | Right hand Batsman",
      image: "https://picsum.photos/200/200",
    },
    {
      id: 3,
      name: "Prathik Jha",
      role: "Cricketer | Ranji trophy player",
      image: "https://picsum.photos/200/200",
    },
  ];

  const [members, setMembers] = useState<PotentialMember[]>(teamMembers);
  const router = useRouter();

  const translateY = new Animated.Value(30); // Start offscreen

  // Trigger animation when the component mounts
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Toggle the 'selected' state of a member
  const toggleSelectMember = (id: number) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === id ? { ...member, selected: !member.selected } : member,
      ),
    );
  };

  const handleSubmit = () => {
    router.replace("../teams/1/edit/editTeam");
  };
  return (
    <SafeAreaView className="flex-1 bg-black pt-2">
      {/* Main container with animation */}
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY }],
        }}
      >
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
        <View className="flex flex-row items-center py-4 w-72 max-w-84 mt-8 pl-6">
          <Image
            source={require("../../../../assets/images/teams/dummyteam.png")}
            className="w-36 h-36"
          />
          <View className="flex flex-row items-center ml-9">
            <Image
              source={require("../../../../assets/images/teams/Vector 64.png")}
              className="mr-2 h-[108px]"
            />
            <View className="flex flex-col ml-8">
              <Text className="text-white text-[25px] font-bold">
                Kolkata Night Riders
              </Text>
            </View>
          </View>
        </View>

        <View className="px-5 py-2">
          <Text className="text-[#9F9F9F] text-5xl font-semibold border-b border-[#36403D] pb-4">
            Invited Team Members
          </Text>
        </View>

        {/* Team Members List */}
        <ScrollView className="flex-1 px-10">
          {members.map((member) => (
            <TouchableOpacity
              key={member.id}
              onPress={() => toggleSelectMember(member.id)}
              className="flex-row items-center py-4"
            >
              <Image
                source={{ uri: member.image }}
                className="w-14 h-14 rounded-full mr-4"
              />
              <View className="flex-1 border-b border-[#5C5C5C] pb-4">
                <Text className="text-white text-3xl font-semibold">
                  {member.name}
                </Text>
                <Text className="text-[#9CA3AF] text-2xl">{member.role}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Save button at the bottom */}
      <View className="p-6 border-t border-[#363636] bg-black">
        <TouchableOpacity
          className="bg-[#12956B] p-4 rounded-2xl"
          onPress={() => handleSubmit()}
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
