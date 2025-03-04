import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NavigationProp } from "@react-navigation/native";
import AddMembersModal from "./addMembersModal";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { useLocalSearchParams } from "expo-router";
import MemberCard from "./components/member";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import TeamCreatedPage from "./components/teamCreationDone";
import LocationModal from "./components/locationModal";

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
  established: string;
  location: string;
  gender: "male" | "female";
  description: string;
  members: Member[];
}
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

const CreateTeam: React.FC<CreateTeamProps> = ({ navigation }) => {
  const params = useLocalSearchParams();
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState("Select Game");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [locationModal, setLocationModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    logo: null,
    name: "",
    sport: "Cricket",
    location: "",
    established: "",
    gender: "male",
    description: "",
    members: [],
  });

  // Update location when params.country changes
  // useEffect(() => {
  //   const country = params?.country;
  //   if (country) {
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       location: `${country}`,
  //     }));
  //   }
  // }, [router]);

  const games = ["Cricket", "Kabaddi", "Basketball", "Hockey", "Volleyball"];

  const getGameIcon = (game: string) => {
    switch (game) {
      case "Cricket":
        return require("../../../../assets/images/Sports Icons/okcricket.png");
      case "Kabaddi":
        return require("../../../../assets/images/Sports Icons/okkabaddi.png");
      case "Basketball":
        return require("../../../../assets/images/Sports Icons/okbasketball.png");
      case "Hockey":
        return require("../../../../assets/images/Sports Icons/okhockey.png");
      case "Volleyball":
        return require("../../../../assets/images/Sports Icons/okvollyball.png");
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelectGame = (game: string) => {
    setSelectedGame(game);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const handleSaveLocation = (data: any) => {
    const country = data.country;
    if (country) {
      console.log("Country:", country);
      setFormData((prevFormData) => ({
        ...prevFormData,
        location: data.country,
      }));
    }
  };

  const onChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShow(Platform.OS === "ios"); // Hide picker after selection on Android
    if (selected) {
      const formattedDate = `${
        selected.getMonth() + 1
      }/${selected.getFullYear()}`; // MM/YYYY format
      setSelectedDate(formattedDate);
      setDate(selected);
      setFormData((prevFormData) => ({
        ...prevFormData,
        established: formattedDate,
      }));
    }
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

  const handleCreateTeam = () => {
    if (
      !formData.name ||
      !formData.sport ||
      !formData.location ||
      !formData.established ||
      !formData.description
    ) {
      alert("Please fill all required fields.");
      return;
    }
    console.log("Create team", formData);
    router.push("./components/teamCreationDone");
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-2">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1">
          {/* Scrollable Form Content */}
          <View className="position-absolute px-4 py-1 right-0 z-10">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <Icon name="arrowleft" size={30} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">
            <View className="px-4 py-2 lg:px-20">
              <Text className="text-white text-7xl font-bold mb-2">
                Create New Team
              </Text>
              <Text className="text-gray-400 text-md mb-8">
                Forge Unbreakable Bonds, Play Strong, and Conquer Together –
                Create Your Team Now.
              </Text>

              {/* Logo Upload */}
              <View className="mb-6 h-48">
                <Text className="text-white text-2xl mb-2">Logo*</Text>
                <TouchableOpacity
                  onPress={selectImage}
                  className="border border-[#515151] h-40 rounded-lg px-4 flex-row items-center"
                  accessibilityLabel="Upload team logo"
                >
                  {formData.logo ? (
                    <View className="flex-row items-center justify-center w-full">
                      {/* Left side: Image */}
                      <View className="relative">
                        <Image
                          source={{ uri: formData.logo }}
                          className="w-32 h-28 rounded"
                        />
                      </View>

                      {/* Right side: Name + Size */}
                      {/* <View className="ml-4 flex-1">
                        <Text className="text-white truncate" numberOfLines={1}>
                          {formData.logo.split("/").pop()}
                        </Text>
                        <Text className="text-gray-400 text-sm">
                          {formData.logo
                            ? `${(formData.logo.length / 1024).toFixed(2)} KB`
                            : ""}
                        </Text>
                      </View> */}

                      {/* Close button on the right */}
                    </View>
                  ) : (
                    <View className="w-32 h-28 flex-row items-center justify-between mx-[30%]">
                      <Icon name="upload" size={30} color="gray" />
                      <Text className="text-gray-400 text-xl">Upload Logo</Text>
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
                  <Text className="text-white text-2xl mb-1">Name*</Text>
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
                  <Text className="text-white text-2xl mt-2 mb-1">Sport*</Text>
                  <TouchableOpacity
                    onPress={toggleDropdown}
                    className="border border-[#515151] rounded-lg p-4 flex-row justify-between items-center"
                  >
                    <View className="flex-row items-center">
                      <Image
                        source={getGameIcon(selectedGame)}
                        className="w-6 h-6 mr-2"
                      />
                      <Text
                        className={`${
                          selectedGame === "Select Game"
                            ? "text-gray-400"
                            : "text-white"
                        }`}
                      >
                        {selectedGame}
                      </Text>
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
                          className="py-2 border-b border-[#515151]"
                        >
                          <View className="flex-row items-center">
                            <Image
                              source={getGameIcon(game)}
                              className="w-8 h-8 mr-2"
                            />
                            <Text className="text-white ml-2">{game}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Location */}
                <View>
                  <Text className="text-white text-2xl mt-2 mb-1">
                    Location*
                  </Text>
                  <TouchableOpacity
                    className="border border-[#515151] rounded-lg flex-row items-center p-4"
                    onPress={() => setLocationModal(true)}
                  >
                    {/* <Text className="flex-1 text-white">
                      {params.country || "Add location"}
                    </Text> */}
                    <Text
                      className={`flex-1 ${
                        formData.location ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {formData.location || "Add location"}
                    </Text>
                    <EntypoIcon name="location-pin" size={20} color="#b0b0b0" />
                  </TouchableOpacity>
                </View>
                <LocationModal
                  visible={locationModal}
                  onClose={() => setLocationModal(false)}
                  onSave={handleSaveLocation}
                />

                {/*Established */}
                <View>
                  <Text className="text-white text-2xl mt-2 mb-1">
                    Established On*
                  </Text>
                  <TouchableOpacity
                    className="border border-[#515151] rounded-lg flex-row items-center p-4"
                    onPress={() => setShow(true)} // Show date picker
                  >
                    <Text
                      className={`flex-1 ${
                        selectedDate ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {selectedDate || "MM/YYYY"}
                    </Text>
                    <Icon name="calendar" size={20} color="#b0b0b0" />
                  </TouchableOpacity>

                  {/* Date Picker */}
                  {show && (
                    <DateTimePicker
                      value={date}
                      mode="date" // No direct month-year mode, so using "date"
                      display="spinner"
                      onChange={onChange}
                      themeVariant="dark"
                    />
                  )}
                </View>

                {/* Gender Selection */}
                <Text style={{ color: "white", fontSize: 14, marginTop: 8 }}>
                  Gender*
                </Text>
                <View className="flex-row mt-1">
                  <TouchableOpacity
                    onPress={() =>
                      setFormData({ ...formData, gender: "female" })
                    }
                    className="flex-1 border rounded-lg flex-row items-center justify-center border-[#515151] p-4 mr-4"
                  >
                    <Text className="text-white">Female</Text>
                    <View
                      className={`w-4 h-4 rounded-full border-2 ml-6 ${
                        formData.gender === "female"
                          ? "bg-[#12956B]"
                          : "border-white"
                      }`}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setFormData({ ...formData, gender: "male" })}
                    className="flex-1 border rounded-lg flex-row items-center justify-center border-[#515151] p-4"
                  >
                    <Text className="text-white">Male</Text>
                    <View
                      className={`w-4 h-4 rounded-full border-2 ml-6 ${
                        formData.gender === "male"
                          ? "bg-[#12956B]"
                          : "border-white"
                      }`}
                    />
                  </TouchableOpacity>
                </View>
                {/* Description */}
                <View>
                  <Text className="text-white text-2xl mt-2 mb-1">
                    Description*
                  </Text>
                  <TextInput
                    value={formData.description}
                    onChangeText={(text) =>
                      setFormData({ ...formData, description: text })
                    }
                    placeholder="Provide a brief description of the team's goals, ethos, etc..."
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={4}
                    className="bg-transparent border border-[#515151] rounded-lg p-4 text-white"
                  />
                </View>
              </View>

              {/* Members Section */}
              <View className="">
                <Text className="text-white text-2xl mt-4 mb-4">
                  Add members
                </Text>

                <View className="flex-row flex-wrap -mx-2 mb-4">
                  {/* Add Members Card */}

                  {formData.members.map((member) => (
                    <MemberCard
                      key={member.id}
                      imageUrl={member.image}
                      name={member.name}
                      description={member.role}
                      isAdmin={true}
                      onRemove={() => removeMember(member.id)}
                      onPress={() => console.log("Member card clicked")}
                    />
                  ))}

                  <View className="w-1/2 px-2 h-44 flex-shrink-0 mb-4">
                    <TouchableOpacity
                      className="bg-black border border-[#515151] w-48 rounded-lg p-4 items-center justify-center h-52"
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
              onPress={handleCreateTeam}
            >
              <Text className="text-white text-center text-2xl">
                Create team
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateTeam;
