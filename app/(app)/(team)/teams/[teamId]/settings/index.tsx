import React, { useState, useEffect, useCallback,useRef } from "react";
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
import Icon from "react-native-vector-icons/AntDesign";
import { useRouter, useLocalSearchParams, RelativePathString } from "expo-router";
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
import InviteMem from "~/assets/images/InviteMem.png"

type TeamMember = {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
    headline?:string;
  };
  role: string;
  position?: string;
};

const Settings = () => {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { team, loading } = useSelector((state: RootState) => state.team);
  const { user } = useSelector((state: RootState) => state.profile);
  const inviteModalRef = useRef<Modalize>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
const [showDownwardDrawer, setShowDownwardDrawer] = useState(false);
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
  const [activeField, setActiveField] = useState<keyof typeof formData | null>(null);
  const [picModalVisible, setPicModalVisible] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  //  const { team, loading } = useSelector((state: RootState) => state.team);
  const params = useLocalSearchParams();
  const currentDescription = useSelector((state: RootState) => state.team.currentTeamDescription);
  const updatedDescription = params?.updatedDescription as string;

   const isAdmin = user?._id === team?.admin?.[0]?._id;
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      description: currentDescription
    }));
  }, [currentDescription]);


  useEffect(() => {
    if (updatedDescription) {
      setFormData((prev) => ({ ...prev, description: updatedDescription }));
    }
  }, [updatedDescription]);


  useEffect(() => {
    if (updatedDescription) {
      setFormData((prev) => ({ ...prev, description: updatedDescription }));
      router.setParams({ updatedDescription: undefined }); // clean URL
    }
  }, [updatedDescription]);
    
  // Initialize form data
  useEffect(() => {
    if (!team) return;
    
    const addressString = team.address 
      ? `${team.address.city}${team.address.state ? `, ${team.address.state}` : ""}${team.address.country ? `, ${team.address.country}` : ""}`
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
      logo: team.logo?.url|| "",
    });

    setMembers(team.members || []);

    // Check if current user is an admin
    const isAdmin = team.admin?.some((admin: any) => admin._id === user?._id);
    setIsUserAdmin(isAdmin);
  }, [team, user]);

  // Fetch team details
  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamDetails(teamId));
    }
  }, [dispatch, teamId]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsEdited(true);
  };

  // Image handling
  const pickImage = async () => {
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

  // Save team data
  const handleSave = async () => {
    if (!teamId || !isUserAdmin) return;
    setIsSaving(true);
    
    try {
      // Process location data
      let city = "", state = "", country = "";
      if (formData.location) {
        const parts = formData.location.split(",").map(s => s.trim());
        [city = "", state = "", country = ""] = parts.length >= 3 
          ? parts 
          : [...parts, ...Array(3 - parts.length).fill("")];
      }

      const payload = new FormData();
      payload.append("name", formData.name);
      
      // Only append other fields if they have values
      if (formData.description) payload.append("description", formData.description);
      if (city) payload.append("address[city]", city);
      if (state) payload.append("address[state]", state);
      if (country) payload.append("address[country]", country);

      if (formData.established) {
        try {
          const date = new Date(formData.established);
          if (!isNaN(date.getTime())) {
            payload.append("establishedOn", date.toISOString());
          }
        } catch (error) {
          console.log("Date parsing error:", error);
        }
      }

      // Only append logo if it's changed
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

  // Handle member position
  const getMemberPosition = (member: TeamMember) => {
    if (member.position?.toLowerCase() === "captain") {
      return "Captain";
    } else if (member.position?.toLowerCase() === "vicecaptain") {
      return "Vice Captain";
    }
    return member.role.charAt(0).toUpperCase() + member.role.slice(1);
  };

  const handleInvitePress = (role: string) => {
    inviteModalRef.current?.close();
    router.push(
      `/(app)/(team)/teams/${teamId}/InviteMembers?role=${role.toLowerCase()}` as RelativePathString
    );
  };
  const roles = team?.sport?.playerTypes?.map((playerType: any) => playerType.name) || [];
  // Render member item
  const renderMember = ({ item: member }: { item: TeamMember }) => (
    <View style={styles.memberItem}>
      <Avatar.Image
        size={50}
        source={{ uri: member.user.profilePic || nopic }}
        style={styles.memberAvatar}
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>
          {member.user.firstName} {member.user.lastName}
        </Text>
        <Text style={styles.memberRole}>{getMemberPosition(member)} | {member.user.headline}</Text>
      </View>
      {isUserAdmin && (
        <TouchableOpacity 
          style={styles.memberAction}
          onPress={() => {
            if (isAdmin && team?._id && member?.user?._id) {
              router.push({
                pathname: `/(app)/(team)/teams/${team._id}/members/${member.user._id}` as RelativePathString,
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
          <Text className="text-[#7A7A7A] mt-2 text-sm">{member.position?.toUpperCase()}</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );

  const handleFieldPress = (field: keyof typeof formData) => {
    if (!isUserAdmin) return;
    setActiveField(field);
  };

  if (loading) {
    return (
      <PageThemeView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} color="white" size="large" />
          <Text style={styles.loadingText}>Loading team details...</Text>
        </View>
      </PageThemeView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <PageThemeView>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#808080" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Team Settings</Text>
            
            {isUserAdmin && (
              isSaving ? (
                <View style={styles.saveButton}>
                  <ActivityIndicator size="small" color="#12956B" />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.saveButton}
                  disabled={!isEdited}
                >
                  <Text style={[styles.saveText, !isEdited && styles.saveDisabled]}>
                    Save
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
          <Divider style={styles.divider} />

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Team Logo */}
            <View style={styles.logoContainer}>
              <TouchableOpacity
                onPress={() => isUserAdmin && setPicModalVisible(true)}
                activeOpacity={0.9}
                style={styles.logoWrapper}
              >
                {formData.logo ? (
                  <Image
                    source={{ uri: formData.logo }}
                    style={styles.logo}
                  />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <MaterialCommunityIcons
                      name="account-group"
                      size={48}
                      color="white"
                    />
                  </View>
                )}
                {isUserAdmin && (
                  <View style={styles.cameraIcon}>
                    <MaterialCommunityIcons
                      name="camera-plus-outline"
                      size={20}
                      color="white"
                    />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.teamName}>{formData.name}</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* <Text style={styles.sectionTitle}>Team Information</Text> */}
              
              <View style={styles.formField} className="flex">
              <Text style={styles.fieldLabel}>Team Name</Text>
                <TouchableOpacity
                  onPress={() => handleFieldPress("name")}
                  style={styles.fieldValue}
                >
                  
                  <Text style={styles.fieldText} numberOfLines={1}>
                    {formData.name || "Add team name"}
                  </Text>
                  
                  {isUserAdmin && (
                    <MaterialCommunityIcons name="pencil-outline" size={20} color="#999" />
                  )}
                </TouchableOpacity>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Sport</Text>
                <View style={styles.fieldValue}>
                  <Text style={styles.fieldText} numberOfLines={1}>
                    {formData.sport || "Not specified"}
                  </Text>
                </View>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Location</Text>
                <TouchableOpacity
                  onPress={() => handleFieldPress("location")}
                  style={styles.fieldValue}
                >
                  <Text style={styles.fieldText} numberOfLines={1}>
                    {formData.location || "Add location"}
                  </Text>
                  {isUserAdmin && (
                    <MaterialCommunityIcons name="pencil-outline" size={20} color="#999" />
                  )}
                </TouchableOpacity>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Established</Text>
                <TouchableOpacity
                  onPress={() => handleFieldPress("established")}
                  style={styles.fieldValue}
                >
                  <Text style={styles.fieldText} numberOfLines={1}>
                    {formData.established || "Add established date"}
                  </Text>
                  {isUserAdmin && (
                    <MaterialCommunityIcons name="pencil-outline" size={20} color="#999" />
                  )}
                </TouchableOpacity>
              </View>
              {/* Description */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TouchableOpacity
                
                  onPress={() => {
                    if (isUserAdmin) {
                      router.push({
                        pathname: `/(app)/(team)/teams/${teamId}/settings/EditDescription` as RelativePathString, 
                        params: { description: formData.description },
                      });
                    }
                  }}
                  style={styles.fieldValue}
                >
                 <Text style={styles.fieldText} numberOfLines={3}>
                 {currentDescription || "Add description"}
                 </Text>
                  {isUserAdmin && (
                    <MaterialCommunityIcons name="pencil-outline" size={20} color="#999" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Members Section */}
            <View style={styles.membersHeader}>
                <Text style={styles.sectionTitle}>Members ({members.length})</Text>
                
              </View>
              <View>
               
              {isUserAdmin && (
              <TouchableOpacity
                onPress={() => inviteModalRef.current?.open()}
                style={styles.inviteButton}
              >
                <Image 
                  source={InviteMem}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.inviteText}>Invite Members</Text>
              </TouchableOpacity>
            )}


                </View>
                <View className="px-5">
                <Divider style={styles.memberDivider} />
                </View>
               

            <View style={styles.membersContainer}>

              
              
              {members.length > 0 ? (
                <FlatList
                  key = {members.find(m => m._id)} 
                  data={members}
                  renderItem={renderMember}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <Divider style={styles.memberDivider} />}
                  style={styles.membersList}
                />
              ) : (
                <View style={styles.noMembers}>
                  <Text style={styles.noMembersText}>No members yet</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Edit Field Modal */}
          <Modal
            visible={activeField !== null}
            transparent
            animationType="slide"
            onRequestClose={() => setActiveField(null)}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalOverlay}
            >
              <TouchableOpacity
                style={styles.modalBackground}
                activeOpacity={1}
                onPress={() => setActiveField(null)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {activeField ? `Edit ${activeField.charAt(0).toUpperCase() + activeField.slice(1)}` : ""}
                    </Text>
                    {/* <TouchableOpacity onPress={() => setActiveField(null)}>
                      <Icon name="close" size={24} color="white" />
                    </TouchableOpacity> */}
                  </View>
                  
                  <TextInput
                    style={styles.modalInput}
                    placeholder={`Enter ${activeField || "value"}...`}
                    placeholderTextColor="#999"
                    value={activeField ? formData[activeField] : ""}
                    onChangeText={(text) => activeField && handleChange(activeField, text)}
                    autoFocus
                  />
                  
                  {/* <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setActiveField(null);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Save Changes</Text>
                  </TouchableOpacity> */}
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
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
                  <Text style={styles.pickerTitle}>Change Team Logo</Text>
                  <View style={styles.pickerDivider} />
                </View>
                
                <TouchableOpacity
                  style={styles.pickerOption}
                  onPress={pickImage}
                >
                  <FontAwesome5 name="images" size={20} color="white" />
                  <Text style={styles.pickerOptionText}>Choose from Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.pickerOption, styles.pickerOptionBorder]}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, logo: "" }));
                    setIsEdited(true);
                    setPicModalVisible(false);
                  }}
                >
                  <MaterialCommunityIcons name="delete" size={20} color="#FF5252" />
                  <Text style={styles.pickerOptionTextDanger}>Remove Logo</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          <InviteModal
            modalRef={inviteModalRef}
            roles={roles}
            isAdmin={isUserAdmin}
            onInvitePress={handleInvitePress}
          />
        </View>
      </PageThemeView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: 6,
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
  },
  scrollContent: {
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logoWrapper: {
    width: 110,
    height: 110,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#444',
    position: 'relative',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    // backgroundColor: '#444',
    borderRadius: 15,
    paddingBottom: 80,
  },
  teamName: {
    // color: 'white',
    // fontSize: 20,
    // fontWeight: 'bold',
    // marginTop: 10,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 8,
  },
  fieldValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#202020',
    paddingVertical: 4,
    paddingBottom:10,
  },
  fieldText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  membersContainer: {
    paddingHorizontal: 16,
  },
  membersHeader: {
    paddingHorizontal: 18,
    // flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // marginBottom: 10,
    
  },
  inviteButton: {
    marginLeft:5,
    paddingHorizontal:15,
    paddingVertical:20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteText: {

    color: 'white',
    fontSize: 18,
    marginLeft: 12,
  },
  membersList: {
    marginBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  memberAvatar: {
    backgroundColor: '#333',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 16,
  },
  memberName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  memberRole: {
    color: '#999',
    fontSize: 10,
    marginTop: 2,
  },
  memberAction: {
    flexDirection :"row",
    // padding: 8,
  
  },
  memberDivider: {
    backgroundColor: '#333',
  },
  noMembers: {
    padding: 20,
    alignItems: 'center',
  },
  noMembersText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#161616',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    // paddingTop:0/,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  modalTitle: {
    marginLeft:6,
    color: 'gray',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalInput: {
    backgroundColor: '#2A2B31',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: 'white',
    marginBottom: 2,
  },
  modalButton: {
    backgroundColor: '#12956B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
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