import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NavigationProp } from "@react-navigation/native";
import AddMembersModal from "./addMembersModal";
import { ThemedText } from "~/components/ThemedText";
import { router } from "expo-router";

interface CreateTeamProps {
  navigation: NavigationProp<any>;
}

interface Member {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface FormData {
  logo: string | null;
  name: string;
  sport: string;
  location: string;
  gender: "male" | "female";
  description: string;
  members: Member[];
}

const CreateTeam: React.FC<CreateTeamProps> = ({ navigation }) => {
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    logo: null,
    name: "",
    sport: "Cricket",
    location: "",
    gender: "male",
    description: "",
    members: [],
  });

  const selectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, logo: result.assets[0].uri });
    }
  };

  const removeMember = (memberId: string) => {
    setFormData({
      ...formData,
      members: formData.members.filter((member) => member.id !== memberId),
    });
  };

  const handleInviteMembers = (selectedMembers: Member[]) => {
    setFormData({
      ...formData,
      members: [...formData.members, ...selectedMembers],
    });
  };

  const renderMemberCard = (member: Member) => (
    <View
      key={member.id}
      className="bg-gray-900 rounded-lg p-4 mr-4 mb-4 w-50 h-50" // Fixed width and height
    >
      <TouchableOpacity
        onPress={() => removeMember(member.id)}
        className="absolute right-2 top-2 z-10"
      >
        <Text className="text-gray-400 text-lg px-2">✕</Text>
      </TouchableOpacity>
      <View className="items-center h-full flex justify-center">
        <Image
          source={{ uri: member.image }}
          className="w-16 h-16 rounded-full mb-2"
        />
        <Text className="text-white text-center font-medium mb-1">
          {member.name}
        </Text>
        <Text className="text-gray-400 text-center text-sm">{member.role}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="px-4 py-2 lg:px-20">
          {/* Header */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-4"
          >
            <Text className="text-white text-2xl">←</Text>
          </TouchableOpacity>

          <Text className="text-white text-3xl font-bold mb-2">
            Create New Team
          </Text>
          <Text className="text-gray-400 text-base mb-8">
            Forge Unbreakable Bonds, Play Strong, and Conquer Together – Create
            Your Team Now.
          </Text>

          {/* Logo Upload */}
          <View className="mb-6">
            <Text className="text-white text-lg mb-2">Logo</Text>
            <TouchableOpacity
              onPress={selectImage}
              className="border border-gray-700 rounded-lg p-4 flex-row items-center"
            >
              {formData.logo ? (
                <View className="relative">
                  <Image
                    source={{ uri: formData.logo }}
                    className="w-16 h-16 rounded"
                  />
                  <TouchableOpacity
                    onPress={() => setFormData({ ...formData, logo: null })}
                    className="absolute -top-2 -right-2 bg-gray-800 rounded-full w-6 h-6 items-center justify-center"
                  >
                    <Text className="text-white text-sm">✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="w-16 h-16 bg-gray-800 rounded items-center justify-center">
                  <Text className="text-gray-400">Upload</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View className="space-y-6">
            {/* Name */}
            <View>
              <Text className="text-white text-lg mb-2">Name*</Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                placeholder="Add your team's name"
                placeholderTextColor="#666"
                className="bg-transparent border border-gray-700 rounded-lg p-4 text-white"
              />
            </View>

            {/* Sport */}
            <View>
              <Text className="text-white text-lg mb-2">Sport*</Text>
              <TouchableOpacity className="border border-gray-700 rounded-lg p-4 flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Text className="text-white mr-2">🏏</Text>
                  <Text className="text-white">Cricket</Text>
                </View>
                <Text className="text-gray-400 text-lg">⌄</Text>
              </TouchableOpacity>
            </View>

            {/* Location */}
            <View>
              <Text className="text-white text-lg mb-2">Location*</Text>
              <View className="border border-gray-700 rounded-lg flex-row items-center">
                <TextInput
                  value={formData.location}
                  onChangeText={(text) =>
                    setFormData({ ...formData, location: text })
                  }
                  placeholder="Add location"
                  placeholderTextColor="#666"
                  className="flex-1 p-4 text-white"
                />
                <Text className="text-gray-400 text-lg mr-4">📍</Text>
              </View>
            </View>

            {/* Gender Selection */}
            <ThemedText style={{ color: "white", fontSize: 16 }}>
              Gender*
            </ThemedText>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, gender: "female" })}
                className={`flex-1 p-4 border rounded-lg ${
                  formData.gender === "female"
                    ? "border-[#12956B]"
                    : "border-gray-700"
                }`}
              >
                <Text
                  className={`text-center ${
                    formData.gender === "female"
                      ? "text-[#12956B]"
                      : "text-white"
                  }`}
                >
                  Female
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFormData({ ...formData, gender: "male" })}
                className={`flex-1 p-4 border rounded-lg ${
                  formData.gender === "male"
                    ? "border-[#12956B]"
                    : "border-gray-700"
                }`}
              >
                <Text
                  className={`text-center ${
                    formData.gender === "male" ? "text-[#12956B]" : "text-white"
                  }`}
                >
                  Male
                </Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View>
              <Text className="text-white text-lg mb-2">Description</Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                placeholder="Provide a brief description of the team's goals, ethos, etc..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                className="bg-transparent border border-gray-700 rounded-lg p-4 text-white"
              />
            </View>
          </View>

          {/* Members Section */}
          <View className="mt-6">
            <Text className="text-white text-lg mb-4">Add members</Text>
            <View className="flex-row flex-wrap -mx-1">
              {formData.members.map((member) => (
                <View key={member.id} className="w-1/2 px-1 h-44 flex-shrink-0">
                  {renderMemberCard(member)}
                </View>
              ))}
              {/* Add Members Card */}
              <View className="w-1/2 px-1 h-44 flex-shrink-0">
                <TouchableOpacity
                  className="bg-gray-900 rounded-lg p-4 items-center justify-center h-full"
                  onPress={() => setShowMembersModal(true)}
                >
                  <View className="border-2 border-gray-700 rounded-full w-10 h-10 items-center justify-center mb-2">
                    <Text className="text-gray-400 text-2xl">+</Text>
                  </View>
                  <Text className="text-gray-400">Add</Text>
                </TouchableOpacity>
              </View>
            </View>
            <AddMembersModal
              visible={showMembersModal}
              onClose={() => setShowMembersModal(false)}
              onInvite={handleInviteMembers}
            />
          </View>

          {/* Create Team Button */}
          <TouchableOpacity
            className="bg-[#12956B] rounded-lg p-4 mt-8 mb-6"
            onPress={() => {
              // Handle team creation
              router.push("../teams/showTeam");
              console.log("Create team", formData);
            }}
          >
            <Text className="text-white text-center text-lg">Create team</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateTeam;
