import React, { useState, useEffect, useRef, useCallback } from "react";
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import PageThemeView from "~/components/PageThemeView";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Divider, Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import {
  fetchTeamDetails,
  updateTeam,
} from "~/reduxStore/slices/team/teamSlice";
import InviteModal from "~/components/teamPage/InviteModel";
import { Modalize } from "react-native-modalize";
import TextScallingFalse from "~/components/CentralText";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import InviteMem from "~/assets/images/InviteMem.png";
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AddMember from "~/components/SvgIcons/teams/AddMember";
import RightArrow from "~/components/SvgIcons/teams/RightArrow";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";
import Calendar from "~/components/SvgIcons/teams/Calendar";

const DEFAULT_PROFILE_PIC = "https://via.placeholder.com/50";

type TeamMember = {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
    headline?: string;
  };
  role: string;
  position?: string;
};

type FormData = {
  name: string;
  sport: string;
  location: string;
  established: string;
  description: string;
  logo: string;
};

const Settings = () => {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { team, loading } = useSelector((state: RootState) => state.team);
  const { user } = useSelector((state: RootState) => state.profile);
  
  // Refs
  const inviteModalRef = useRef<Modalize>(null);
  const nameInputRef = useRef<TextInput>(null);
  
  // State
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDownwardDrawer, setShowDownwardDrawer] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isEdited, setIsEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [picModalVisible, setPicModalVisible] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [originalData, setOriginalData] = useState<FormData>({
    name: "",
    sport: "",
    location: "",
    established: "",
    description: "",
    logo: "",
  });
  const [formData, setFormData] = useState<FormData>({
    name: "",
    sport: "",
    location: "",
    established: "",
    description: "",
    logo: "",
  });

  const params = useLocalSearchParams();
  const currentDescription = useSelector((state: RootState) => state.team.currentTeamDescription);
  const updatedDescription = params?.updatedDescription as string;

  // Memoized functions
  const getMemberPosition = useCallback((member: TeamMember) => {
    if (member.position?.toLowerCase() === "captain") {
      return "Captain";
    } else if (member.position?.toLowerCase() === "vicecaptain") {
      return "Vice Captain";
    }
    return member.role.charAt(0).toUpperCase() + member.role.slice(1);
  }, []);

  // Effects
  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamDetails(teamId));
    }
  }, [dispatch, teamId]);

  useEffect(() => {
    if (updatedDescription) {
      setFormData(prev => ({ ...prev, description: updatedDescription }));
      router.setParams({ updatedDescription: undefined });
    }
  }, [updatedDescription, router]);

  useEffect(() => {
    if (currentDescription) {
      setFormData(prev => ({
        ...prev,
        description: currentDescription
      }));
    }
  }, [currentDescription]);

  useEffect(() => {
    if (!team) return;
    
    const addressString = team.address 
      ? `${team.address.city}${team.address.state ? `, ${team.address.state}` : ""}${team.address.country ? `, ${team.address.country}` : ""}`
      : "";
      
    let establishedDate = "";
    let parsedDate = new Date();
    
    if (team.establishedOn) {
      parsedDate = new Date(team.establishedOn);
      // Format as "Month Year" (e.g., "January 2023")
      establishedDate = parsedDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
      setSelectedDate(parsedDate);
    }
    const newFormData = {
      name: team.name || "",
      sport: team.sport?.name || "",
      location: addressString,
      established: establishedDate,
      description: team.description || "",
      logo: team.logo?.url || "", 
    };
  
    setFormData(newFormData);
    setOriginalData(newFormData); // Set initial original data
    setMembers(team.members || []);
    setIsUserAdmin(team.admin?.some((admin: any) => admin._id === user?._id));
  }, [team, user]);

  const hasChanges = useCallback(() => {
    return (
      formData.name !== originalData.name ||
      formData.location !== originalData.location ||
      formData.established !== originalData.established ||
      formData.description !== originalData.description ||
      formData.logo !== originalData.logo
    );
  }, [formData, originalData]);
  // Handlers
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsEdited(true);
  };

  const pickImage = async () => {
    console.log('yes pickImage function is called')
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleChange("logo", result.assets[0].uri);
        setPicModalVisible(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };
  
  // Fix: Date handler that works for both iOS and Android
  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setIsDatePickerVisible(false);
    }
    
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
      handleChange("established", formattedDate);
    }
  };

  // Fix: Handler for iOS date picker done button
  const handleDatePickerDone = () => {
    setIsDatePickerVisible(false);
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
    handleChange("established", formattedDate);
  };

  const handleSave = async () => {
    if (!teamId || !isUserAdmin) return;
    setIsSaving(true);
    
    try {
      let city = "", state = "", country = "";
      if (formData.location) {
        const parts = formData.location.split(",").map(s => s.trim());
        [city = "", state = "", country = ""] = parts.length >= 3 
          ? parts 
          : [...parts, ...Array(3 - parts.length).fill("")];
      }
  
      const payload = new FormData();
      if (formData.name) payload.append("name", formData.name);
      
      if (formData.description) payload.append("description", formData.description);
      if (city) payload.append("address[city]", city);
      if (state) payload.append("address[state]", state);
      if (country) payload.append("address[country]", country);
  
      if (formData.established) {
        // Fix: Ensure date is properly formatted when saving
        payload.append("establishedOn", selectedDate.toISOString());
      }
  
      if (formData.logo && formData.logo !== team?.logo?.url) {
        if (formData.logo.startsWith("file:")) {
          const localUri = formData.logo;
          const filename = localUri.split("/").pop() || "team-logo.jpg";
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : "image/jpeg";
  
          payload.append("logo", {
            uri: localUri,
            name: filename,
            type,
          } as any);
        }
      }
  
      await dispatch(updateTeam({ teamId, formData: payload })).unwrap();
      router.back();
      await dispatch(fetchTeamDetails(teamId));
      setOriginalData(formData);
      Alert.alert("Success", "Team updated successfully");
      setIsEdited(false);
    } catch (error: any) {
      console.error("Update error:", error);
      Alert.alert("Error", error.message || "Failed to update team");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInvitePress = (role: string) => {
    inviteModalRef.current?.close();
    router.push(`/(app)/(team)/teams/${teamId}/InviteMembers?role=${role.toLowerCase()}`);
  };

  const handleFieldPress = (field: keyof FormData) => {
    if (!isUserAdmin) return;
    
    switch (field) {
      case "name":
        setIsEditingName(true);
        setTimeout(() => nameInputRef.current?.focus(), 100);
        break;
      case "location":
        setShowLocationPicker(true);
        break;
      case "established":
        setIsDatePickerVisible(true);
        break;
      case "description":
        router.push({
          pathname: `/(app)/(team)/teams/${teamId}/settings/EditDescription`,
          params: { description: formData.description },
        });
        break;
    }
  };

  const renderMember = ({ item: member }: { item: TeamMember }) => (
    <View style={styles.memberItem}>
     
     
        <TouchableOpacity 
          style={styles.memberAction}
          onPress={() => {
            if (isUserAdmin && team?._id && member?.user?._id) {
              router.push({
                pathname: `/(app)/(team)/teams/${team._id}/members/${member.user._id}`,
                params: {
                  memberId: member.user._id,
                  member: JSON.stringify(member.user),
                  role: JSON.stringify(member.role),
                },
              });
            } else {
              setSelectedMember(member);
              setShowDownwardDrawer(true);
            }
          }}
        >
           <Avatar.Image
        size={40}
        source={{ uri: member?.user?.profilePic || DEFAULT_PROFILE_PIC }}
        style={styles.memberAvatar}
      />
      <View style={styles.memberInfo}>
        <TextScallingFalse style={styles.memberName}>
          {member?.user?.firstName} {member?.user?.lastName}
        </TextScallingFalse>
        <TextScallingFalse style={styles.memberRole}>
         @{member?.user?.username} | {member?.user?.headline || "No headline"}
        </TextScallingFalse>
      </View>
          <TextScallingFalse style={styles.memberPositionText}>
            {member.position }
          </TextScallingFalse>
         <RightArrow/>
        </TouchableOpacity>
    
    </View>
  );

  // Fix: Improved iOS date picker modal
  const renderIOSDatePicker = () => (
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
            
            <TouchableOpacity onPress={handleDatePickerDone}>
              <TextScallingFalse style={styles.datePickerHeaderButtonDone}>Done</TextScallingFalse>
            </TouchableOpacity>
          </View>

          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            themeVariant="dark"
            maximumDate={new Date()}
            style={styles.iosDatePicker}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (loading) {
    return (
      <PageThemeView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <TextScallingFalse style={styles.loadingText}>Loading team details...</TextScallingFalse>
        </View>
      </PageThemeView>
    );
  }

  const roles = team?.sport?.playerTypes?.map((playerType: any) => playerType.name) || [];

  return (
    <PageThemeView>
      <PageThemeView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <BackIcon/>
            </TouchableOpacity>
            
            <TextScallingFalse style={styles.headerTitle}>Team Settings</TextScallingFalse>
            
            {isUserAdmin && (
  isSaving ? (
    <View style={styles.saveButton}>
      <ActivityIndicator size="small" color="#12956B" />
    </View>
  ) : hasChanges() ? (
    <TouchableOpacity
      onPress={handleSave}
      style={styles.saveButton}
    >
      <TextScallingFalse style={styles.saveText}>
        Save
      </TextScallingFalse>
    </TouchableOpacity>
  ) : null
             )}
          </View>
          <Divider style={styles.divider} />

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Team Logo */}
            <View style={styles.logoContainer}>
              <TouchableOpacity
                onPress={() => isUserAdmin && setPicModalVisible(true)}
                activeOpacity={0.9}
                style={styles.logoWrapper}
              >
                {formData.logo ? (
                  <Image source={{ uri: formData.logo }} style={styles.logo} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <MaterialCommunityIcons name="camera" size={48} color="white" />
                  </View>
                )}
                {isUserAdmin && (
                  <View style={styles.cameraIcon}>
                    <MaterialCommunityIcons name="camera-plus-outline" size={20} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Team Name */}
              <View style={styles.formField}>
                <TextScallingFalse style={styles.fieldLabel}>Team Name</TextScallingFalse>
                {isEditingName ? (
                  <View style={styles.inlineEditContainer}>
                    <TextInput
                      ref={nameInputRef}
                      style={styles.inlineEditInput}
                      value={formData.name}
                      onChangeText={(text) => handleChange("name", text)}
                      autoFocus
                      onBlur={() => setIsEditingName(false)}
                      onSubmitEditing={() => setIsEditingName(false)}
                      selectTextOnFocus
                    />
                    <TouchableOpacity onPress={() => setIsEditingName(false)}>
                      {/* <MaterialCommunityIcons name="check" size={24} color="#12956B" /> */}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleFieldPress("name")}
                    style={styles.fieldValue}
                  >
                    <TextScallingFalse style={styles.fieldText} numberOfLines={1}>
                      {formData.name || "Add team name"}
                    </TextScallingFalse>
                    {/* {isUserAdmin && (
                      // <MaterialCommunityIcons name="pencil-outline" size={20} color="#999" />
                    )} */}
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Sport */}
              <View style={styles.formField}>
                <TextScallingFalse style={styles.fieldLabel}>Sport</TextScallingFalse>
                <View style={styles.fieldValue}>
                  <Image
                    source={{ uri: team?.sport.logo || "https://via.placeholder.com/150" }}
                    className="h-6 w-6 mr-2"
                    />
                  <TextScallingFalse style={styles.fieldText} numberOfLines={1}>
                    {formData.sport || "Not specified"}
                  </TextScallingFalse>
                </View>
              </View>
              
              {/* Location */}
              <View style={styles.formField}>
                <TextScallingFalse style={styles.fieldLabel}>Location</TextScallingFalse>
                <TouchableOpacity
                  onPress={() => handleFieldPress("location")}
                  style={styles.fieldValue}
                >
                  <TextScallingFalse style={styles.fieldText} numberOfLines={1}>
                    {formData.location || "Add location"}
                  </TextScallingFalse>
                  {isUserAdmin && (
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#999" />
                  )}
                </TouchableOpacity>
              </View>
              
              {/* Established Date */}
              <View style={styles.formField}>
                <TextScallingFalse style={styles.fieldLabel}>Established On</TextScallingFalse>
                <TouchableOpacity
                  onPress={() => handleFieldPress("established")}
                  style={styles.fieldValue}
                >
                  <TextScallingFalse style={styles.fieldText} numberOfLines={1}>
                    {formData.established || "Add established date"}
                  </TextScallingFalse>
                  {isUserAdmin && (
                    <View className="mr-1">
                   <Calendar/>
                   </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Description */}
              <TouchableOpacity
                  onPress={() => handleFieldPress("description")}
                 
                >
              <View className=" justify-between border-b-[1px] border-[#202020] mb-7 pb-4">
                <View  className="flex-row justify-between  border-[#626262]">
                <TextScallingFalse className="text-white mt-3 " style={styles.fieldLabel}>Description</TextScallingFalse>
                
                   
                
                 
               
                </View>
                <TextScallingFalse className="mt-3 text-white" numberOfLines={1}>
                    {formData.description || "Add established date"}
                  </TextScallingFalse>
              </View>
            
              </TouchableOpacity>







            </View>

            {/* Members Section */}
            <View style={styles.membersHeader}>
              <TextScallingFalse style={styles.sectionTitle}>Members ({members.length})</TextScallingFalse>
            </View>
            
            {isUserAdmin && (
              <TouchableOpacity
                onPress={() => inviteModalRef.current?.open()}
                style={styles.inviteButton}
              >
                <View className="bg-[#363636] w-12 h-12 rounded-full flex items-center justify-center">
                 <View className="w-6 h-6"> 
                <AddMember />
               </View>
               </View>
                
                <TextScallingFalse style={styles.inviteText}>Invite Members</TextScallingFalse>
              </TouchableOpacity>
            )}
            
            <View style={styles.memberDividerContainer}>
              <Divider style={styles.memberDivider} />
            </View>

            <View style={styles.membersContainer}>
              {members.length > 0 ? (
                <FlatList
                  data={members}
                  renderItem={renderMember}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <Divider style={styles.memberDivider} />}
                  key={`members-${members.length}`}
                />
              ) : (
                <View style={styles.noMembers}>
                  <TextScallingFalse style={styles.noMembersText}>No members yet</TextScallingFalse>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Location Picker Modal */}
          <Modal
            visible={showLocationPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowLocationPicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.locationModalContainer}>
                <View style={styles.locationModalHeader}>
                  <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
                    <Ionicons name="close-outline" size={24} color="#999" />
                  </TouchableOpacity>
                  <TextScallingFalse style={styles.locationModalTitle}>Select Location</TextScallingFalse>
                  <View style={{ width: 24 }} />
                </View>
                
                <GooglePlacesAutocomplete
                  placeholder="Search for location"
                  onPress={(data, details = null) => {
                    if (details) {
                      const city = details.address_components?.find(
                        c => c.types.includes('locality')
                      )?.long_name || '';
                      
                      const state = details.address_components?.find(
                        c => c.types.includes('administrative_area_level_1')
                      )?.long_name || '';
                      
                      const country = details.address_components?.find(
                        c => c.types.includes('country')
                      )?.long_name || '';
                      
                      handleChange("location", [city, state, country].filter(Boolean).join(', '));
                      setShowLocationPicker(false);
                    }
                  }}
                  query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_API,
                    language: 'en',
                  }}
                  styles={googlePlacesStyles}
                />
              </View>
            </View>
          </Modal>

          {/* Logo Picker Modal */}
          <Modal
            visible={picModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setPicModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalBackground}
              activeOpacity={1}
              onPress={() => setPicModalVisible(false)}
            >
              <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <TextScallingFalse style={styles.pickerTitle}>Change Team Logo</TextScallingFalse>
                  <View style={styles.pickerDivider} />
                </View>
                
                <TouchableOpacity style={styles.pickerOption} onPress={pickImage}>
                  <FontAwesome5 name="images" size={20} color="white" />
                  <TextScallingFalse style={styles.pickerOptionText}>Choose from Gallery</TextScallingFalse>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.pickerOption, styles.pickerOptionBorder]}
                  onPress={() => {
                    handleChange("logo", "");
                    setPicModalVisible(false);
                  }}
                >
                  <MaterialCommunityIcons name="delete" size={20} color="#FF5252" />
                  <TextScallingFalse style={styles.pickerOptionTextDanger}>Remove Logo</TextScallingFalse>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Date Pickers - Platform specific rendering */}
          {Platform.OS === 'ios' ? renderIOSDatePicker() : (
            isDatePickerVisible && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )
          )}

          <InviteModal
            modalRef={inviteModalRef}
            roles={roles}
            isAdmin={isUserAdmin}
            onInvitePress={handleInvitePress}
          />
        </KeyboardAvoidingView>
      </PageThemeView>
    </PageThemeView>
  );
};

// Google Places Autocomplete styles
const googlePlacesStyles = {
  container: {
    flex: 0,
  },
  textInputContainer: {
    width: '100%',
    backgroundColor: '#2A2B31',
    borderRadius: 8,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    height: 40,
    color: 'white',
    fontSize: 16,
    backgroundColor: '#2A2B31',
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  listView: {
    backgroundColor: '#1D1D1D',
  },
  row: {
    backgroundColor: '#1D1D1D',
    padding: 13,
    height: 50,
    flexDirection: 'row',
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
  },
  description: {
    color: 'white',
  },
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: '#121212',
  },
  image: {
    width: 48,  
    height: 48, 
    tintColor: '#999', 
    borderRadius:"100%",
    backgroundColor:"#363636",
    padding:10,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 0,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 11,
    // backgroundColor: '#121212',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: 5,
    minWidth: 50,
    alignItems: 'flex-end',
  },
  saveText: {
    color: '#12956B',
    fontSize: 16,
    fontWeight: '500',
  },
  saveDisabled: {
    color: '#808080',
  },
  divider: {
    backgroundColor: '#383838',
    height: 1,
    marginBottom: 5,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 25,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#131313',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2B31',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    // bottom: 0,
    right: 0,
    // backgroundColor: '#333',
    borderRadius: 15,
    padding: 8,
   top:0
  },
  teamName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#202020',
    paddingVertical: 10,
  },
  fieldText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  inlineEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#202020',
    paddingVertical: 10,
  },
  inlineEditInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 0,
  },
  membersHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  inviteImage: {
    width: 24,
    height: 24,
    tintColor: '#999',
  },
  inviteText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
  memberDividerContainer: {
    paddingHorizontal: 20,
  },
  memberDivider: {
    backgroundColor: '#333',
    height: 1,
  },
  membersContainer: {
    paddingHorizontal: 15,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  memberAvatar: {
    backgroundColor: '#333',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 15,
  },
  memberName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  memberRole: {
    color: '#999',
    fontSize: 10,
    marginTop: 3,
    width:180,
  },
  memberAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberPositionText: {
    color: '#7A7A7A',
    fontSize: 10,
    marginRight: 14,
    textTransform: 'uppercase',
  },
  noMembers: {
    padding: 20,
    alignItems: 'center',
  },
  noMembersText: {
    color: '#999',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  locationModalContainer: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
  },
  locationModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationModalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#1C1D23',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  pickerHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerDivider: {
    height: 4,
    width: 40,
    backgroundColor: '#444',
    borderRadius: 2,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  pickerOptionBorder: {
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  pickerOptionText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 16,
  },
  pickerOptionTextDanger: {
    color: '#FF5252',
    fontSize: 16,
    marginLeft: 16,
  },
});

export default Settings;