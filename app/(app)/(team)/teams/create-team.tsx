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
import { router, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MemberCard from "@/components/teamPage/Member";
import DateTimePicker, {
  DateTimePickerEvent,

} from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { sendInvitations } from "~/reduxStore/slices/team/teamSlice";
import LocationModal from "@/components/teamPage/LocationModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "~/reduxStore";
import { createTeam } from "~/reduxStore/slices/team/teamSlice";
// import { fetchMemberSuggestions } from "~/reduxStore/slices/team/teamSlice";
import { fetchUserSuggestions } from "~/reduxStore/slices/team/userSuggestionSlice";
import { fetchSports } from "~/reduxStore/slices/team/sportSlice";

interface CreateTeamProps {
  navigation: NavigationProp<any>;
}

interface Member {
  _id: string;
  firstName: string;
  lastName?: string;
  profilePic?: string;
  headline?: string;
  role?: string;
  status?: "pending" | "accepted" | "rejected";
}

interface FormData {
  logo: any;
  name: string;
  sport: string;
  establishedOn: string;
  address: {
    city: string;
    state: string;
    country: string;
    location: {
      type: string;
      coordinates: number[];
    };
  };
  gender: "male" | "female";
  description: string;
  members: Member[];
  admin: string[];
  createdBy: string;
}

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

  const { sports, loading: sportsLoading } = useSelector(
    (state: RootState) => state.sports
  );
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state?.profile);
  const { data: fetchedUsers, loading, error, pagination } = useSelector(
    (state: RootState) => state.userSuggestions
  );
  const teamLoading = useSelector((state: RootState) => state.team.loading);
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

  useEffect(() => {
    dispatch(fetchSports());
  }, [dispatch]);

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
    if (formData.sport) {
      dispatch(
        fetchUserSuggestions({
          sportId: formData.sport, 
          page: 1,
          limit: 50,
        })
      );
    }
  }, [dispatch, formData?.sport]);
  
  const isFormComplete = () => {
    return (
      formData.name &&
      formData.sport &&
      formData.sport !== "123" && // Not the default "Select Sports" ID
      formData.establishedOn &&
      formData.address.city &&
      formData.description
    );
  };
  
  


  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelectGame = (game: { name: string; _id: string; logo: string }) => {
    setSelectedGame(game);
    setFormData((prev) => ({ ...prev, sport: game._id }));
    setIsDropdownOpen(false);
  };

  const handleSaveLocation = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city: data.city,
        state: data.state,
        country: data.country,
        location: {
          ...prev.address.location,
          coordinates: data.coordinates,
        },
      },
    }));
  };

  const onChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      const formattedDate = `${selected.getMonth() + 1}/${selected.getFullYear()}`;
      setSelectedDate(formattedDate);
      setDate(selected);
      setFormData((prev) => ({ ...prev, establishedOn: formattedDate }));
    }
    setTimeout(() => setShow(false), 3000);
  };

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        logo: {
          uri: result.assets[0].uri,
          name: "logo.jpg",
          type: "image/jpeg",
        },
      }));
    }
  };

  const removeMember = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member._id !== memberId),
    }));
  };

  // const handleInviteMembers = async (selectedUsers: any[]) => {
  //   if (!formData.sport || !user?.id) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Error",
  //       text2: "Please select a sport first",
  //     });
  //     return;
  //   }
  
  //   try {
  //     const newMembers = selectedUsers.map((user) => ({
  //       _id: user._id,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       profilePic: user.profilePic,
  //       headline: user.headline,
  //       status: "pending",
  //     }));
  
  //     // Optimistically update UI
  //     setFormData((prev) => ({
  //       ...prev,
  //       members: [...prev.members, ...newMembers],
  //     }));
  
  //     // Dispatch invitations
  //     const result = await dispatch(
  //       sendInvitations({
  //         teamId: "new-team", // Special flag for new team
  //         receiverIds: selectedUsers.map(u => u._id),
  //         createdBy: user.id,
  //         sportId: formData.sport
  //       })
  //     ).unwrap();
  
  //     // Handle failed invitations
  //     const failed = result?.data?.failedInvitations || [];
  //     const alreadyInTeam = failed.filter(
  //       (f: any) => f.error === "User is already a team member"
  //     );
  
  //     if (alreadyInTeam.length > 0) {
  //       Toast.show({
  //         type: "error",
  //         text1: "Invite Failed",
  //         text2: `${alreadyInTeam.length} user(s) already in the team.`,
  //       });
        
  //       // Remove failed invites from UI
  //       setFormData(prev => ({
  //         ...prev,
  //         members: prev.members.filter(m => 
  //           !failed.some((f: any) => f.userId === m._id)
  //         )
  //       }));
  //     }
  
  //     const successCount = selectedUsers.length - failed.length;
  //     if (successCount > 0) {
  //       Toast.show({
  //         type: "success",
  //         text1: "Invitations Sent!",
  //         text2: `Successfully invited ${successCount} user(s).`,
  //       });
  //     }
  
  //     setShowMembersModal(false);
  //   } catch (error: any) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Failed to Send Invites",
  //       text2: error?.message || "Something went wrong.",
  //     });
      
  //     // Rollback UI changes if invitation fails
  //     setFormData(prev => ({
  //       ...prev,
  //       members: prev.members.filter(m => 
  //         !selectedUsers.some(u => u._id === m._id)
  //       )
  //     }));
  //   }
  // };

 // Update the handleInviteMembers function in CreateTeam component
const handleInviteMembers = async (selectedUsers: any[]) => {
  if (!user?.id || !formData.sport) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "User ID or sport not available",
    });
    return;
  }

  try {
    // Optimistically update UI
    const newMembers = selectedUsers.map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePic: user.profilePic,
      headline: user.headline,
      status: "pending",
    }));

    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, ...newMembers],
    }));

    // For new teams, we'll store the invitations locally
    // and process them after team creation
    Toast.show({
      type: "success",
      text1: "Members Added",
      text2: "Invitations will be sent after team creation",
    });

    setShowMembersModal(false);
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: error.message || "Failed to add members",
    });
  }
};

// Update the handleCreateTeam function to send invitations after team creation
const handleCreateTeam = async () => {
  // Validate required fields
  const validationErrors = [];
  if (!formData.name) validationErrors.push('Team name is required');
  if (!formData.sport || formData.sport === "123") validationErrors.push('Please select a sport');
  if (!formData.establishedOn) validationErrors.push('Establishment date is required');
  if (!formData.address.city) validationErrors.push('Location is required');
  
  if (validationErrors.length > 0) {
    Toast.show({
      type: 'error',
      text1: 'Missing Information',
      text2: validationErrors.join('\n'),
      visibilityTime: 4000
    });
    return;
  }

  try {
    // Show loading indicator
    Toast.show({
      type: 'info',
      text1: 'Creating Team...',
      autoHide: false
    });

    // Create the team
    const result = await dispatch(createTeam(formData)).unwrap();
    
    if (!result.success || !result.data?._id) {
      throw new Error('Team creation failed - no ID returned');
    }

    const teamId = result.data._id;
    
    // Send invitations if there are members
    if (formData.members.length > 0) {
      try {
        const memberIds = formData.members.map(m => m._id);
        const invitationResult = await dispatch(
          sendInvitations({
            teamId,
            receiverIds: memberIds,
            role: "member",
            createdBy: user?.id
          })
        ).unwrap();

        // Handle partial failures
        if (invitationResult.failedInvitations?.length > 0) {
          const successCount = formData.members.length - invitationResult.failedInvitations.length;
          Toast.show({
            type: 'info',
            text1: 'Partial Success',
            text2: `Sent ${successCount} invites (${invitationResult.failedInvitations.length} failed)`,
          });
        }
      } catch (inviteError) {
        console.warn("Invitations failed but team was created:", inviteError);
        // Continue to success page even if invites failed
      }
    }

    // Hide loading indicator
    Toast.hide();

    // Navigate to success page with ALL data as before
    router.push({
      pathname: "./team-creation-success",
      params: { 
        teamId: teamId,
        teamName: formData.name,
        teamData: JSON.stringify({
          logo: formData.logo,
          name: formData.name,
          sport: sports.find((s) => s._id === formData.sport)?.name || formData.sport,
          establishedOn: formData.establishedOn,
          address: formData.address,
          gender: formData.gender,
          description: formData.description,
          members: formData.members,
          id: teamId 
        })
      }
    });

  } catch (error) {
    console.error("Team creation error:", error);
    Toast.hide();
    Toast.show({
      type: 'error',
      text1: 'Creation Failed',
      text2: error.message || 'Could not create team. Please try again.',
      visibilityTime: 5000
    });
  }
};





  return (
    <SafeAreaView className="flex-1 bg-black px-2">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1">
          {/* Header */}
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
                >
                  {formData.logo ? (
                    <View className="flex-row items-center justify-center w-full">
                      <Image
                        source={{ uri: formData.logo.uri }}
                        className="w-32 h-32 rounded"
                      />
                    </View>
                  ) : (
                    <View className="w-32 h-28 flex-row items-center justify-between mx-[30%]">
                      <Icon name="upload" size={30} color="gray" />
                      <Text className="text-gray-400 text-xl">Upload Logo</Text>
                    </View>
                  )}
                  {formData.logo && (
                    <TouchableOpacity
                      onPress={() => setFormData({ ...formData, logo: null })}
                      className="absolute right-2 top-2 bg-gray-800 rounded-full w-6 h-6 items-center justify-center"
                    >
                      <Text className="text-white text-sm">✕</Text>
                    </TouchableOpacity>
                  )}
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
                      {selectedGame.logo && (
                        <Image
                          source={{ uri: selectedGame.logo }}
                          className="w-6 h-6 mr-2"
                        />
                      )}
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

                  {isDropdownOpen && (
                    <View className="mt-2 border border-[#515151] rounded-lg p-4">
                      {sports.map((sport) => (
                        <TouchableOpacity
                          key={sport._id}
                          onPress={() => handleSelectGame(sport)}
                          className="py-2 border-b border-[#515151]"
                        >
                          <View className="flex-row items-center">
                            <Image
                              source={{ uri: sport.logo }}
                              className="w-8 h-8 mr-2"
                            />
                            <Text className="text-white ml-2">{sport.name}</Text>
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
                    <Text
                      className={`flex-1 ${
                        formData.address.city ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {formData.address.city || "Add location"}
                    </Text>
                    <EntypoIcon name="location-pin" size={20} color="#b0b0b0" />
                  </TouchableOpacity>
                </View>

                <LocationModal
                  visible={locationModal}
                  onClose={() => setLocationModal(false)}
                  onSave={handleSaveLocation}
                />

                {/* Established */}
                <View className="mt-4">
                  <Text className="text-white text-2xl mt-2 mb-1">
                    Established On*
                  </Text>
                  <TouchableOpacity
                    className="border border-[#515151] rounded-lg flex-row items-center p-4"
                    onPress={() => setShow(true)}
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

                  {show && (
                    <DateTimePicker
                      value={date}
                      mode="date"
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
                      onPress={() =>
                        setFormData({ ...formData, gender: "male" })
                      }
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
              {selectedGame._id !== "123" && (
  <View className="mt-4">
    <Text className="text-white text-2xl mt-4 mb-4">
      Add members
    </Text>
    
    <View className="flex-row flex-wrap -mx-2 mb-4">
      {/* Existing Members */}
      {formData.members.map((member) => (
        <View key={member._id} className="w-1/2 px-2 mb-4">
          <MemberCard
            imageUrl={member.profilePic}
            name={`${member.firstName} ${member.lastName || ""}`}
            description={member.headline || "No description"}
            isAdmin={true}
            status={member.status}
            onRemove={() => removeMember(member._id)}
          />
        </View>
      ))}

      <View className="w-1/2 px-2 mb-4">
        <TouchableOpacity
          className="border border-[#515151] rounded-lg p-4 items-center justify-center h-44"
          onPress={() => setShowMembersModal(true)}
        >
          <View className="border-2 border-[#515151] rounded-full w-10 h-10 items-center justify-center mb-2">
            <Text className="text-gray-400 text-2xl">+</Text>
          </View>
          <Text className="text-gray-400">Add Member</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    <AddMembersModal
      visible={showMembersModal}
      onClose={() => setShowMembersModal(false)}
      onInvite={handleInviteMembers}
      buttonName="Invite Members"
      multiselect={true}
      player={fetchedUsers}
      loading={loading}
    />
  </View>
)}

            </View>
          </ScrollView>

          {/* Create Team Button */}
          <View className="bg-black border-t border-[#515151] h-20">
            {teamLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <TouchableOpacity
              className={`rounded-lg p-3 mx-6 my-2 ${
                isFormComplete() ? "bg-[#12956B]" : "bg-gray-500"
              }`}
              onPress={isFormComplete() ? handleCreateTeam : null}
              disabled={!isFormComplete()}
            >
              <Text className={`text-center text-2xl ${
                isFormComplete() ? "text-white" : "text-gray-300"
              }`}>
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