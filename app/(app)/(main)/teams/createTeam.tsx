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
import Icon from "react-native-vector-icons/AntDesign";
import EntypoIcon from "react-native-vector-icons/Entypo";

interface CreateTeamProps {
  navigation: NavigationProp<any>;
}

interface Member {
  id: string;
  name: string;
  role: string;
  image: string;
}
interface PotentialMember {
  id: string;
  name: string;
  role: string;
  image: string;
  selected?: boolean;
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState("Cricket");
  const [formData, setFormData] = useState<FormData>({
    logo: null,
    name: "",
    sport: "Cricket",
    location: "",
    gender: "male",
    description: "",
    members: [],
  });

  const games = [
    "Cricket",
    "Kabaddi",
    "Basketball",
    "Rugby",
    "Hockey",
    "Baseball",
    "Volleyball",
  ];
  function getGameIcon(game: string) {
    switch (game) {
      case "Cricket":
        return "🏏";
      case "Kabaddi":
        return "🤾‍♂️";
      case "Basketball":
        return "🏀";
      case "Rugby":
        return "🏉";
      case "Hockey":
        return "🏒";
      case "Baseball":
        return "⚾";
      case "Volleyball":
        return "🏐";
      default:
        return "🎮";
    }
  }
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const dummyMembers: PotentialMember[] = [
    {
      id: "1",
      name: "Prathik Jha",
      role: "Cricketer | Ranji Trophy Player",
      image: "https://picsum.photos/id/1/100/100",
      selected: false,
    },
    {
      id: "2",
      name: "Rohan Deb Nath",
      role: "Cricketer | Right-Hand Batsman",
      image: "https://picsum.photos/id/2/100/100",
      selected: false,
    },
    {
      id: "3",
      name: "Aditi Mehra",
      role: "Cricketer | Left-Hand Batsman",
      image: "https://picsum.photos/id/3/100/100",
      selected: false,
    },
    {
      id: "4",
      name: "Arjun Kapoor",
      role: "All-Rounder | State Team Player",
      image: "https://picsum.photos/id/4/100/100",
      selected: false,
    },
    {
      id: "5",
      name: "Sneha Roy",
      role: "Cricketer | Wicket-Keeper",
      image: "https://picsum.photos/id/5/100/100",
      selected: false,
    },
    {
      id: "6",
      name: "Rajesh Kumar",
      role: "Bowler | Swing Specialist",
      image: "https://picsum.photos/id/6/100/100",
      selected: false,
    },
    {
      id: "7",
      name: "Priya Singh",
      role: "All-Rounder | District Team Player",
      image: "https://picsum.photos/id/7/100/100",
      selected: false,
    },
    {
      id: "8",
      name: "Vikram Joshi",
      role: "Cricketer | Opening Batsman",
      image: "https://picsum.photos/id/8/100/100",
      selected: false,
    },
    {
      id: "9",
      name: "Tanya Sharma",
      role: "Cricketer | Spin Bowler",
      image: "https://picsum.photos/id/9/100/100",
      selected: false,
    },
    {
      id: "10",
      name: "Karan Patel",
      role: "Bowler | Fast Bowling Specialist",
      image: "https://picsum.photos/id/10/100/100",
      selected: false,
    },
  ];
  

  const handleSelectGame = (game: string) => {
    setSelectedGame(game);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

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

  return (
    <SafeAreaView className="flex-1 bg-black px-2">
      <View className="flex-1">
        {/* Scrollable Form Content */}
        <View className="position-absolute px-4 py-1 right-0 z-10">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-4"
          >
            <Icon name="arrowleft" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1">
          <View className="px-4 py-2 lg:px-20">
            <Text className="text-white text-3xl font-bold mb-2">
              Create New Team
            </Text>
            <Text className="text-gray-400 text-base mb-8">
              Forge Unbreakable Bonds, Play Strong, and Conquer Together –
              Create Your Team Now.
            </Text>

            {/* Logo Upload */}
            <View className="mb-6 h-48">
              <Text className="text-white text-lg mb-2">Logo</Text>
              <TouchableOpacity
                onPress={selectImage}
                className="border border-[#515151] h-40 rounded-lg px-4 flex-row items-center"
              >
                {formData.logo ? (
                  <View className="flex-row items-center w-full">
                    {/* Left side: Image */}
                    <View className="relative">
                      <Image
                        source={{ uri: formData.logo }}
                        className="w-32 h-28 rounded"
                      />
                    </View>

                    {/* Right side: Name + Size */}
                    <View className="ml-4 flex-1">
                      <Text className="text-white truncate" numberOfLines={1}>
                        {formData.logo.split("/").pop()}
                      </Text>
                      <Text className="text-gray-400 text-sm">
                        {formData.logo
                          ? `${(formData.logo.length / 1024).toFixed(2)} KB`
                          : ""}
                      </Text>
                    </View>

                    {/* Close button on the right */}
                  </View>
                ) : (
                  <View className="w-32 h-28 flex-row items-center justify-between mx-[30%]">
                    <Icon name="upload" size={30} color="gray" />
                    <Text className="text-gray-400 text-sm">Upload Logo</Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, logo: null })}
                  className="absolute right-2 top-2 bg-gray-800 rounded-full w-6 h-6 items-center justify-center"
                >
                  <Text className="text-white text-sm">✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View className="space-y-6">
              {/* Name */}
              <View>
                <Text className="text-white text-lg">Name*</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholder="Add your team's name"
                  placeholderTextColor="#666"
                  className="bg-transparent border border-[#515151] rounded-lg p-4 text-white"
                />
              </View>

              {/* Sport */}
              <View>
                <Text className="text-white text-lg mt-2">Sport*</Text>
                <TouchableOpacity
                  onPress={toggleDropdown}
                  className="border border-[#515151] rounded-lg p-4 flex-row justify-between items-center"
                >
                  <View className="flex-row items-center">
                    <Text className="text-white mr-2">
                      {getGameIcon(selectedGame)}
                    </Text>
                    <Text className="text-white">{selectedGame}</Text>
                  </View>
                  <Icon
                    name={isDropdownOpen ? "up" : "down"}
                    size={20}
                    color="#b0b0b0"
                  />
                </TouchableOpacity>

                {/* Dropdown Games List */}
                {isDropdownOpen && (
                  <View className="mt-2 border border-[#515151] rounded-lg p-4">
                    {games.map((game, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleSelectGame(game)}
                        className="py-2 border-b border-gray-700"
                      >
                        <View className="flex-row items-center">
                          <Text className="text-white">
                            {getGameIcon(game)}
                          </Text>
                          <Text className="text-white ml-2">{game}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Location */}
              <View>
                <Text className="text-white text-lg mt-2">Location*</Text>
                <View className="border border-[#515151] rounded-lg flex-row items-center">
                  <TextInput
                    value={formData.location}
                    onChangeText={(text) =>
                      setFormData({ ...formData, location: text })
                    }
                    placeholder="Add location"
                    placeholderTextColor="#666"
                    className="flex-1 p-4 text-white"
                  />
                  <EntypoIcon
                    name="location-pin"
                    size={20}
                    color="#b0b0b0"
                    style={{ paddingRight: 10 }}
                  />
                </View>
              </View>

              {/* Gender Selection */}
              <ThemedText
                style={{ color: "white", fontSize: 16, marginTop: 8 }}
              >
                Gender*
              </ThemedText>
              <View className="flex-row space-x-4">
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, gender: "female" })}
                  className={`flex-1 p-4 border rounded-lg mr-2 ${
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
                      formData.gender === "male"
                        ? "text-[#12956B]"
                        : "text-white"
                    }`}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Description */}
              <View>
                <Text className="text-white text-lg mt-2">Description*</Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                  placeholder="Provide a brief description of the team's goals, ethos, etc..."
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={4}
                  className="bg-transparent border border-[#515151] rounded-lg p-4 text-white h-28"
                />
              </View>
            </View>

            {/* Members Section */}
            <View className="">
              <Text className="text-white text-lg mt-4">Add members</Text>
              <View className="flex-row flex-wrap -mx-1">
                {/* Add Members Card */}
                <View className="w-1/2 px-1 h-44 flex-shrink-0">
                  <TouchableOpacity
                    className="bg-black border border-[#515151] w-48 rounded-lg p-4 items-center justify-center h-full"
                    onPress={() => setShowMembersModal(true)}
                  >
                    <View className="border-2 border-[#515151] rounded-full w-10 h-10 items-center justify-center mb-2">
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
                buttonName="Invite"
                multiselect={true}
                player={dummyMembers}
              />
            </View>
          </View>
        </ScrollView>

        {/* Create Team Button */}
        <View
          className="bg-black h-32"
          style={{
            position: "relative",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            className="bg-[#12956B] rounded-lg p-4 mt-8 mb-6 absolute bottom-0 left-0 right-0"
            onPress={() => {
              // Handle team creation
              router.push("../teams/showTeam");
              console.log("Create team", formData);
            }}
          >
            <Text className="text-white text-center text-lg">Create team</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateTeam;
