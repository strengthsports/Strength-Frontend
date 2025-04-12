import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import PageThemeView from "~/components/PageThemeView";
import Icon from "react-native-vector-icons/AntDesign";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Divider, Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import {
  fetchTeamDetails,
  updateTeam,
} from "~/reduxStore/slices/team/teamSlice";
import TextScallingFalse from "~/components/CentralText";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type TeamMember = {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  role: string;
};

const Settings = () => {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { team, loading } = useSelector((state: RootState) => state.team);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    location: "",
    established: "",
    description: "",
    logo: "",
  });

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isEdited, setIsEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [picModalVisible, setPicModalVisible] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (!team) return;
    
    const addressString = team.address 
      ? `${team.address.city}, ${team.address.state}, ${team.address.country}`
      : "";
      
    const establishedDate = team.establishedOn
      ? new Date(team.establishedOn).toLocaleDateString()
      : "";

    setFormData({
      name: team.name || "",
      sport: team.sport?.name || "",
      location: addressString,
      established: establishedDate,
      description: team.description || "",
      logo: team.logo?.url || "",
    });

    setMembers(team.members || []);
  }, [team]);

  // Fetch team details
  useEffect(() => {
    if (teamId) dispatch(fetchTeamDetails(teamId));
  }, [dispatch, teamId]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsEdited(true);
  };

  // Image handling
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      handleChange("logo", result.assets[0].uri);
    }
  };

  // Save team data
  const handleSave = async () => {
    if (!teamId) return;
    setIsSaving(true);
    
    try {
      const [city = "", state = "", country = ""] = formData.location
        .split(",")
        .map(s => s.trim());

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("sport", formData.sport);
      payload.append("description", formData.description);
      payload.append("address[city]", city);
      payload.append("address[state]", state);
      payload.append("address[country]", country);

      if (formData.established) {
        const date = new Date(formData.established);
        if (!isNaN(date.getTime())) {
          payload.append("establishedOn", date.toISOString());
        }
      }

      if (formData.logo && formData.logo !== team?.logo?.url) {
        const localUri = formData.logo;
        const filename = localUri.split("/").pop() || "team-logo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpg";

        payload.append("logo", {
          uri: localUri,
          name: filename,
          type,
        } as any);
      }

      await dispatch(updateTeam({ teamId, formData: payload })).unwrap();
      await dispatch(fetchTeamDetails(teamId));
      
      Alert.alert("Success", "Team updated successfully");
      setIsEdited(false);
    } catch (error: any) {
      console.error("Update error:", error);
      Alert.alert("Error", error.message || "Failed to update team");
    } finally {
      setIsSaving(false);
    }
  };

  // Render member item
  const renderMember = ({ item }: { item: TeamMember }) => (
    <View className="flex-row items-center p-4">
      <Avatar.Image
        size={50}
        source={{ uri: item.user.profilePic || "https://via.placeholder.com/50" }}
      />
      <View className="ml-4">
        <Text className="text-white text-lg font-medium">
          {item.user.firstName} {item.user.lastName}
        </Text>
        <Text className="text-gray-400 text-sm">{item.role}</Text>
      </View>
    </View>
  );

  // Form fields configuration
  const formFields = [
    { key: "name", label: "Team Name", icon: null },
    { key: "sport", label: "Sport", icon: null },
    { 
      key: "location", 
      label: "Location", 
      icon: <MaterialCommunityIcons name="map-marker" size={24} color="grey" />
    },
    { 
      key: "established", 
      label: "Established", 
      icon: <MaterialCommunityIcons name="calendar" size={24} color="grey" />
    },
    { 
      key: "description", 
      label: "Description", 
      icon: <MaterialCommunityIcons name="pencil" size={24} color="grey" />
    },
  ];

  if (loading || isSaving) {
    return (
      <PageThemeView>
        <ActivityIndicator animating={true} color="white" size="large" />
      </PageThemeView>
    );
  }

  return (
    <SafeAreaView>
      <PageThemeView>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="h-12 w-full flex-row justify-between items-center px-5">
            <TouchableOpacity
              onPress={() => router.back()}
              className="basis-[20%]"
            >
              <TextScallingFalse className="text-[#808080] text-4xl font-normal">
                Back
              </TextScallingFalse>
            </TouchableOpacity>
            
            <TextScallingFalse className="flex-grow text-center text-white font-bold font-light text-5xl">
              Team Settings
            </TextScallingFalse>
            
            {isSaving ? (
              <View className="basis-[20%] items-end">
                <ActivityIndicator size="small" color="#12956B" />
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleSave}
                className="basis-[20%] items-end"
                disabled={!isEdited}
              >
                <TextScallingFalse
                  className={`${isEdited ? "text-[#12956B]" : "text-[#808080]"} text-4xl font-medium`}
                >
                  Save
                </TextScallingFalse>
                 <Divider className="bg-gray-600" />
              </TouchableOpacity>
             
            )}
          </View>
           <Divider  className="border-[0.2] bg-[#0A0A0A] " />

          {/* Team Logo */}
          <View className="relative w-full items-center mt-6 mb-8">
            <TouchableOpacity
              onPress={() => setPicModalVisible(true)}
              activeOpacity={0.9}
              className="w-32 h-32 rounded-full border-2 border-gray-600"
            >
              {formData.logo ? (
                <Image
                  source={{ uri: formData.logo }}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <View className="w-full h-full rounded-full bg-gray-700 items-center justify-center">
                  <MaterialCommunityIcons
                    name="account-group"
                    size={48}
                    color="white"
                  />
                </View>
              )}
              <View className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2">
                <MaterialCommunityIcons
                  name="camera-plus-outline"
                  size={20}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View className="px-5">
            {formFields.map((field, index) => (
              <View key={field.key} className="mb-4">
                <Text className="text-gray-400 text-lg mb-1 flex flex-row">{field.label}</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (field.key === "description") {
                      router.push({
                        pathname: "/teams/[teamId]/settings/EditDescription",
                        params: { description: formData.description },
                      });
                    } else {
                      setModalVisible(true);
                    }
                  }}
                  className="flex-row items-center justify-between border-b border-gray-700 pb-2"
                >
                  <Text
                    className={`text-xl ${formData[field.key as keyof typeof formData] ? "text-white" : "text-gray-500"}`}
                    numberOfLines={1}
                  >
                    {formData[field.key as keyof typeof formData] || `Add ${field.label.toLowerCase()}`}
                  </Text>
                  {field.icon || (
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color="gray"
                    />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Members Section */}
          <View className="mt-8 px-5">
            <Text className="text-white text-xl font-bold mb-4">
              Members ({members.length})
            </Text>
            <FlatList
              data={members}
              renderItem={renderMember}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <Divider className="bg-gray-700 my-2" />
              )}
            />
          </View>
        </ScrollView>

        {/* Logo Picker Modal */}
        <Modal
        
          visible={picModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setPicModalVisible(false)}
        >
          <TouchableOpacity
            className="flex-1 justify-end bg-black/50"
            activeOpacity={1}
            onPress={() => setPicModalVisible(false)}
          >
            <View className="bg-gray-800 rounded-t-2xl p-8">
              <View className="items-center mb-4">
                <Text className="text-white text-lg font-medium">
                  Change Team Logo
                </Text>
                <View className="h-0.5 bg-gray-600 w-1/4 mt-1" />
              </View>
              
              <TouchableOpacity
                className="flex-row items-center py-3 px-4"
                onPress={pickImage}
              >
                <FontAwesome5 name="images" size={20} color="white" />
                <Text className="text-white ml-4 text-lg">Choose from Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-row items-center py-3 px-4 border-t border-gray-700"
                onPress={() => {
                  setFormData(prev => ({ ...prev, logo: "" }));
                  setIsEdited(true);
                  setPicModalVisible(false);
                }}
              >
                <MaterialCommunityIcons name="delete" size={20} color="red" />
                <Text className="text-red-500 ml-4 text-lg">Remove Logo</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Edit Field Modal */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            className="flex-1 bg-black/50"
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View className="mt-auto bg-gray-800 p-5 rounded-t-2xl">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-xl font-bold">Edit Field</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
              
              <TextInput
                className="bg-gray-700 text-white p-3 rounded-lg mb-4"
                placeholder="Enter value..."
                placeholderTextColor="#999"
                value={formData.name} // You'd need to track which field is being edited
                onChangeText={(text) => handleChange("name", text)}
              />
              
              <TouchableOpacity
                className="bg-blue-500 py-3 rounded-lg items-center"
                onPress={() => {
                  // Handle save for the specific field
                  setModalVisible(false);
                }}
              >
                <Text className="text-white font-medium">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </PageThemeView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#444',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 4,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  inputContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  inputLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  inputValue: {
    color: 'white',
    fontSize: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalContainer: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});