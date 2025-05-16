import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Modal,StyleSheet} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { NavigationProp } from "@react-navigation/native";
import AddMembersModal from "@/components/teamPage/AddMembersModal";
import { router, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MemberCard from "@/components/teamPage/Member";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { sendInvitations } from "~/reduxStore/slices/team/teamSlice";
import LocationModal from "./LocationModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "~/reduxStore";
import { createTeam } from "~/reduxStore/slices/team/teamSlice";
import { fetchUserSuggestions } from "~/reduxStore/slices/team/userSuggestionSlice";
import { fetchSports } from "~/reduxStore/slices/team/sportSlice";
import TextScallingFalse from "~/components/CentralText";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";
// import * as ImagePicker from 'expo-image-picker';

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

interface LocationData {
  city: string;
  state: string;
  country: string;
  coordinates: [number, number];
  formattedAddress?: string;
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

interface LocationData {
  city: string;
  state: string;
  country: string;
  coordinates: [number, number];
  formattedAddress?: string;
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
const [formattedDate, setFormattedDate] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  // const [selectedDate, setSelectedDate] = useState("");
  const [locationModal, setLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

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
      city: "",
      state: "",
      country: "",
      location: { type: "Point", coordinates: [0, 0] },
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

  // New useEffect to update UI when selected location changes
  useEffect(() => {
    if (selectedLocation) {
      setFormData((prev) => ({
        ...prev,
        address: {
          city: selectedLocation.city,
          state: selectedLocation.state,
          country: selectedLocation.country,
          location: {
            type: "Point",
            coordinates: selectedLocation.coordinates,
          },
        },
      }));
    }
  }, [selectedLocation]);
  
  const isFormComplete = () => {
    return (
      formData.name &&
      formData.sport &&
      formData.sport !== "123" && 
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

  // Modified handleSaveLocation to work with our enhanced location components
  const handleSaveLocation = (locationData: LocationData) => {
    setSelectedLocation(locationData);
    
    // For backward compatibility, also update formData directly
    setFormData((prev) => ({
      ...prev,
      address: {
        city: locationData.city,
        state: locationData.state,
        country: locationData.country,
        location: {
          type: "Point",
          coordinates: locationData.coordinates,
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
    setTimeout(() => setShow(false), 2000);
  };

  // const selectImage = async () => {
  //   const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (!permissionResult.granted) return;

  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 0.5,
  //   });

  //   if (!result.canceled) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       logo: {
  //         uri: result.assets[0].uri,
  //         name: "logo.jpg",
  //         type: "image/jpeg",
  //       },
  //     }));
  //   }
  // };

  const removeMember = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member._id !== memberId),
    }));
  };


const selectImage = async () => {
  try {
    // // 1. Request permissions
    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (status !== 'granted') {
    //   Alert.alert('Permission denied', 'We need access to your photos to select a team logo');
    //   return;
    // }

    // 2. Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      // Correct way to specify media types
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    // 3. Handle the result
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        name: asset.fileName || `image-${Date.now()}.jpg`,
        type: asset.mimeType || 'image/jpeg',
      };
    }
    return null;
  } catch (error) {
    console.error('Image picker error:', error);
    Alert.alert('Error', 'Failed to select image');
    return null;
  }
};

const handleImageSelect = async () => {
  const image = await selectImage();
  if (image) {
    setFormData(prev => ({
      ...prev,
      logo: image
    }));
  }
};

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

      console.log("Result-->");
      // Create the team
      const result = await dispatch(createTeam(formData)).unwrap();

      
      
      if (!result.success || !result.data?._id) {
        throw new Error('Team creation failed - no ID returned');
      }

      const teamId = result.data._id;
      const len = result.data.sport.playerTypes.length-1;
      const UserRole = result.data.sport.playerTypes[len].name;
      
      // Send invitations if there are members
      if (formData.members.length > 0) {
        try {
          const memberIds = formData.members.map(m => m._id);
          const invitationResult = await dispatch(
            sendInvitations({
              teamId,
              receiverIds: memberIds,
              role: UserRole,
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
            <TouchableOpacity onPress={() => router.back()} className="mb-4 mt-2">
             <BackIcon/>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="px-4 py-2 lg:px-20">
              <TextScallingFalse className="text-white text-7xl font-bold mb-2">
                Create New Team
              </TextScallingFalse>
              <TextScallingFalse className="text-gray-400 text-md mb-8">
                Forge Unbreakable Bonds, Play Strong, and Conquer Together –
                Create Your Team Now.
              </TextScallingFalse>
{/* Logo Upload */}
             {/* Logo Upload */}
<View className="mb-6 h-48">
  <TextScallingFalse className="text-white text-2xl mb-2">Logo*</TextScallingFalse>
  <TouchableOpacity
    onPress={handleImageSelect}
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
        <TextScallingFalse className="text-gray-400 text-xl">Upload Logo</TextScallingFalse>
      </View>
    )}
    {formData.logo && (
      <TouchableOpacity
        onPress={() => setFormData({ ...formData, logo: null })}
        className="absolute right-2 top-2 bg-gray-800 rounded-full w-6 h-6 items-center justify-center"
      >
        <TextScallingFalse className="text-white text-sm">✕</TextScallingFalse>
      </TouchableOpacity>
    )}
  </TouchableOpacity>
</View>
              {/* Form Fields */}
              <View className="space-y-6">
                {/* Name */}
                <View className="mt-2">
                  <TextScallingFalse className="text-white text-2xl mb-1">Name*</TextScallingFalse>
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
                  <TextScallingFalse className="text-white text-2xl mt-2 mb-1">Sport*</TextScallingFalse>
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
                      <TextScallingFalse
                        className={`${
                          selectedGame.name === "Select Sports"
                            ? "text-gray-400"
                            : "text-white"
                        }`}
                      >
                        {selectedGame.name}
                      </TextScallingFalse>
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
                          key={sport?._id}
                          onPress={() => handleSelectGame(sport)}
                          className="py-2 border-b border-[#515151]"
                        >
                          <View className="flex-row items-center">
                            <Image
                              source={{ uri: sport?.logo }}
                              className="w-8 h-8 mr-2 "
                            />
                            <TextScallingFalse className="text-white ml-2">{sport.name}</TextScallingFalse>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Location - Enhanced Section */}
                <View className="mt-4">
                  <TextScallingFalse className="text-white text-2xl mt-2 mb-1">
                    Location*
                  </TextScallingFalse>
                  <TouchableOpacity
                    className="border border-[#515151] rounded-lg flex-row items-center p-4"
                    onPress={() => setLocationModal(true)}
                  >
                    <TextScallingFalse
                      className={`flex-1 ${
                        formData.address.city ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {selectedLocation?.formattedAddress || 
                       (formData.address.city ? 
                        `${formData.address.city}, ${formData.address.state}, ${formData.address.country}` : 
                        "Add location")}
                    </TextScallingFalse>
                    <EntypoIcon name="location-pin" size={20} color="#b0b0b0" />
                  </TouchableOpacity>
                </View>

                {/* Location Modal - Enhanced */}
                <LocationModal
                  visible={locationModal}
                  onClose={() => setLocationModal(false)}
                  onSave={handleSaveLocation}
                />

              {/* Established On Field */}
                <View className="mt-4">
  <TextScallingFalse className="text-white text-2xl mt-2 mb-1">
    Established On*
  </TextScallingFalse>
  <TouchableOpacity
    className="border border-[#515151] rounded-lg flex-row items-center justify-between p-4"
    onPress={() => setIsDatePickerVisible(true)}
  >
    <TextScallingFalse className={`${formattedDate ? "text-white" : "text-gray-400"}`}>
      {formattedDate || "Select date"}
    </TextScallingFalse>
    <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#b0b0b0" />
  </TouchableOpacity>

  {/* Platform-specific date picker */}
  {Platform.OS === 'ios' ? (
    <Modal
      visible={isDatePickerVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsDatePickerVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsDatePickerVisible(false)}
      >
        <View style={styles.datePickerContainer}>
          <View style={styles.datePickerHeader}>
            <TouchableOpacity onPress={() => setIsDatePickerVisible(false)}>
              <TextScallingFalse style={styles.datePickerHeaderButton}>Cancel</TextScallingFalse>
            </TouchableOpacity>
            
            <TextScallingFalse style={styles.datePickerHeaderTitle}>Established Date</TextScallingFalse>
            
            <TouchableOpacity onPress={() => {
              const formatted = selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              });
              setFormattedDate(formatted);
              setFormData(prev => ({
                ...prev,
                establishedOn: selectedDate.toISOString()
              }));
              setIsDatePickerVisible(false);
            }}>
              <TextScallingFalse style={styles.datePickerHeaderButtonDone}>Done</TextScallingFalse>
            </TouchableOpacity>
          </View>

          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={(event, date) => {
              if (date) {
                setSelectedDate(date);
              }
            }}
            themeVariant="dark"
            maximumDate={new Date()}
            style={styles.iosDatePicker}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  ) : (
    isDatePickerVisible && (
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        onChange={(event, date) => {
          setIsDatePickerVisible(false);
          if (date) {
            setSelectedDate(date);
            const formatted = date.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            });
            setFormattedDate(formatted);
            setFormData(prev => ({
              ...prev,
              establishedOn: date.toISOString()
            }));
          }
        }}
        maximumDate={new Date()}
      />
    )
  )}
                </View>

                {/* Gender Selection */}
                <View className="mt-4">
                  <TextScallingFalse style={{ color: "white", fontSize: 14, marginTop: 8 }}>
                    Gender*
                  </TextScallingFalse>
                  <View className="flex-row mt-1">
                    <TouchableOpacity
                      onPress={() =>
                        setFormData({ ...formData, gender: "female" })
                      }
                      className="flex-1 border rounded-lg flex-row items-center justify-center border-[#515151] p-4 mr-4"
                    >
                      <TextScallingFalse className="text-white">Female</TextScallingFalse>
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
                      <TextScallingFalse className="text-white">Male</TextScallingFalse>
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
                  <TextScallingFalse className="text-white text-2xl mt-2 mb-1">
                    Description
                  </TextScallingFalse>
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
                  <TextScallingFalse className="text-white text-2xl mt-4 mb-4">
                    Add members
                  </TextScallingFalse>
      
                  {/* Existing Members */}
                  <View className="flex-row flex-wrap -mx-1">
                    {Array.from(new Map(formData.members.map(member => [member._id, member])).values())
                      .map((member) => (
                        <MemberCard
                          key={member._id}
                          imageUrl={member.profilePic || ''}
                          name={`${member.firstName} ${member.lastName || ''}`}
                          description={member.headline || ''}
                          isAdmin={true} 
                          onRemove={() => removeMember(member._id)}
                          onPress={() => {}}
                        />
                      ))}
                    
                    {/* Add Member Button */}
                    <TouchableOpacity
                      onPress={() => setShowMembersModal(true)}
                      className="bg-black p-4 h-[200px] mt-2 rounded-lg items-center justify-center shadow-lg border border-[#515151]"
                      style={{
                        width: 170,
                        marginHorizontal: 6,
                        marginBottom: 6,
                      }}
                    >
                      <View className="border-2 border-[#515151] rounded-full w-10 h-10 items-center justify-center mb-2">
                        <TextScallingFalse className="text-gray-400 text-2xl">+</TextScallingFalse>
                      </View>
                      <TextScallingFalse className="text-gray-400">Add Member</TextScallingFalse>
                    </TouchableOpacity>
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
                className={`rounded-lg p-3 mx-6 my-2 bg-[#12956B]`}
                onPress={handleCreateTeam}
              >
                <TextScallingFalse className={`text-center text-3xl text-bold ${
                  isFormComplete() ? "text-white" : "text-white"
                }`}>
                  Create team
                </TextScallingFalse>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  datePickerHeaderButton: {
    color: 'white',
    fontSize: 16,
  },
  datePickerHeaderButtonDone: {
    color: '#12956B',
    fontSize: 16,
    fontWeight: '500',
  },
  datePickerHeaderTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  iosDatePicker: {
    height: 200,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#515151',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#12956B',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E1E1E',
  },
});

export default CreateTeam;