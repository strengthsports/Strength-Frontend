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
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NavigationProp } from "@react-navigation/native";
import AddMembersModal from "@/components/teamPage/AddMembersModal";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { useLocalSearchParams } from "expo-router";
import MemberCard from "@/components/teamPage/Member";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import LocationModal from "@/components/teamPage/LocationModal";
import {
  sendInvitations,
  fetchMemberSuggestions,
} from "~/reduxStore/slices/team/teamSlice";
// import { useSelector } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/reduxStore";
import { createTeam } from "~/reduxStore/slices/team/teamSlice";
import { AppDispatch } from "~/reduxStore";
import { fetchUserSuggestions } from "~/reduxStore/slices/user/onboardingSlice";
import { fetchSports } from "~/reduxStore/slices/team/sportSlice";

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
  logo: any;
  name: string;
  sport: string;
  establishedOn: string;
  address: object;
  gender: "male" | "female";
  description: string;
  members: Member[];
  admin: string[];
  createdBy: string;
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
  const [selectedGame, setSelectedGame] = useState({
    name: "Select Sports",
    _id: "123",
    logo: "12345",
  });
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [locationModal, setLocationModal] = useState(false);

  const { sports, loading, error } = useSelector(
    (state: RootState) => state.sports
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchSports());
  }, [dispatch]);

  const { user } = useSelector((state: RootState) => state?.profile);

  const { fetchedUsers } = useSelector((state: RootState) => state.onboarding);




  const load = useSelector((state) => state.team.loading);

  useEffect(() => {
    if (user?.id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        admin: [user.id],
        createdBy: user.id,
      }));
    }
  }, [user]);

  useEffect(() => {
    dispatch(
      fetchUserSuggestions({
        sportsData: ["67cd0bb8970c518cc730d485","6771941c77a19c8141f2f1b7"],
        limit: 50,
        page: 8,
      })
    );
  }, [dispatch, formData?.sport]);

  const [formData, setFormData] = useState<FormData>({
    logo: null,
    name: "",
    sport: selectedGame._id,
    address: {
      city: "Kolkata",
      state: "West Bengal",
      country: "India",
      location: { type: "Point", coordinates: [22.1111, 82.8948] },
    },
    establishedOn: "",
    gender: "male",
    description: "",
    admin: [user?.id as string],
    members: [],
    createdBy: user?.id as string,
  });

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelectGame = ({
    name,
    _id,
    logo,
  }: {
    name: string;
    _id: string;
    logo: string;
  }) => {
    setSelectedGame({ name, _id, logo });
    setFormData((prevFormData) => ({ ...prevFormData, sport: _id }));
    setIsDropdownOpen(false);
  };

  const handleSaveLocation = (data: any) => {
    const country = data.country;
    const city = data.city;
    const state = data.state;
    const coordinates = data.coordinates;

    if (country && city && state) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          city: city,
          state: state,
          country: country,
          location: {
            ...prevFormData.address.location,
            coordinates: coordinates,
          },
        },
      }));
    }
  };

  const onChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      const formattedDate = `${
        selected.getMonth() + 1
      }/${selected.getFullYear()}`; // MM/YYYY format
      setSelectedDate(formattedDate);
      setDate(selected);
      setFormData((prevFormData) => ({
        ...prevFormData,
        establishedOn: formattedDate,
      }));
    }

    setTimeout(() => {
    setShow(false);}, 3000);
  };

  const selectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const file = {
        uri: result.assets[0].uri,
        name: "logo.jpg", // You can customize the filename
        type: "image/jpeg",
      };

      // console.log("File object :", file);
      setFormData((prevData) => ({
        ...prevData,
        logo: file, // Only updating logo
      }));

      // console.log("FormData:", formData._parts); // Debugging
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

  const handleCreateTeam = async () => {
  if (
    !formData.name ||
    !formData.sport ||
    !formData.address ||
    !formData.establishedOn ||
    !formData.description
  ) {
    alert("Please fill all required fields.");
    return;
  }

  // First navigate to the success page with the form data
  router.push({
    pathname: "./team-creation-success",
    params: { 
      teamData: JSON.stringify({
        logo: formData.logo,
        name: formData.name,
        sport: sports.find(s => s._id === formData.sport)?.name || formData.sport,
        establishedOn: formData.establishedOn,
        address: formData.address,
        gender: formData.gender,
        description: formData.description,
        members: formData.members,
      }) 
    }
  });

  // Then submit to your backend
  try {
    const response = await dispatch(createTeam(formData));
    if (!response.payload.success) {
      // Optionally handle error case
      console.error("Team creation failed on backend");
    }
  } catch (error) {
    console.error("Error creating team:", error);
  }
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
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
                          source={{ uri: formData.logo.uri }}
                          className="w-32 h-32 rounded"
                        />
                      </View>
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
                <View className="mt-2">
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
                <View className="mt-4">
                  <Text className="text-white text-2xl mt-2 mb-1">Sport*</Text>
                  <TouchableOpacity
                    onPress={toggleDropdown}
                    className="border border-[#515151] rounded-lg p-4 flex-row justify-between items-center"
                  >
                    <View className="flex-row items-center">
                      <Image
                        source={
                          selectedGame.name === "Select Game"
                            ? " "
                            : { uri: selectedGame.logo }
                        }
                        className="w-6 h-6 mr-2"
                      />
                      <Text
                        className={`${
                          selectedGame.name === "Select Game"
                            ? "text-gray-400"
                            : "text-white"
                        }`}
                      >
                        {selectedGame.name}
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
                      {sports.length > 0 &&
                        sports.map((sport, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() =>
                              handleSelectGame({
                                name: sport.name,
                                _id: sport._id,
                                logo: sport.logo,
                              })
                            }
                            className="py-2 border-b border-[#515151]"
                          >
                            <View className="flex-row items-center">
                              <Image
                                source={{ uri: sport.logo }}
                                className="w-8 h-8 mr-2"
                              />
                              <Text className="text-white ml-2">
                                {sport.name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                    </View>
                  
                  )}
                </View>

                {/* Location */}
                <View className="mt-4">
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
                        formData.address.city ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {formData.address?.city || "Add location"}
                    </Text>
                    <EntypoIcon name="location-pin" size={20} color="#b0b0b0" />
                  </TouchableOpacity>
                </View>
                <SafeAreaView>
                  <LocationModal
                    visible={locationModal}
                    onClose={() => setLocationModal(false)}
                    onSave={handleSaveLocation}
                  />
                </SafeAreaView>
                {/*Established */}
                <View className="mt-4">
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
                <View className="mt-4">
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
                </View>

                {/* Description */}
                <View className="mt-4">
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
              <View className="mt-4">
                <Text className="text-white text-2xl mt-4 mb-4">
                  Add members
                </Text>

                <View className="flex-row flex-wrap -mx-2 mb-4 ">
                  {/* Add Members Card */}

                  {formData.members.map((member) => (
                    <MemberCard
                      key={member?._id}
                      imageUrl={member?.profilePic}
                      name={member.firstName}
                      description={member?.headline}
                      isAdmin={true}
                      onRemove={() => removeMember(member._id)}
                      onPress={() => console.log("Member card clicked")}
                    />
                  ))}

                  <View className="w-1/2 px-2 h-44 flex-shrink-0 mt-2 mb-4">
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
                  player={fetchedUsers}
                />
              </View>
            </View>
          </ScrollView>

          {/* Create Team Button */}
          <View
            className="bg-black border-[#515151] border-t-[0.5px] h-20"
            style={{
              position: "relative",
              // borderColor:"606060",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            {load ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <TouchableOpacity
                className="bg-[#12956B] rounded-lg p-3  mb-2 absolute bottom-0 left-6 right-6"
                onPress={handleCreateTeam}
              >
                <Text className="text-white text-center text-2xl">
                  Create team
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateTeam;
