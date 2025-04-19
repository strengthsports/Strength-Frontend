import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import { fetchTeamDetails, changeUserPosition, changeUserRole } from "~/reduxStore/slices/team/teamSlice";
import PageThemeView from "~/components/PageThemeView";
import AntIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button, Divider } from "react-native-paper";
import Nopic from "../../../../../../assets/images/nopic.jpg";
import RoleEdit from "~/components/SvgIcons/teams/RoleEdit";
import TextScallingFalse from "~/components/CentralText";
import ViceCaptain from "~/components/SvgIcons/teams/ViceCaptain";
import Captain from "~/components/SvgIcons/teams/Captain";

// Types
interface Role {
  _id: string;
  name: string;
}

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  destructive?: boolean;
}
interface ActionButtonProps {
  onPress: () => void;
  label: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

// Component for role selection dropdown
const RoleDropdown: React.FC<{
  visible: boolean;
  onClose: () => void;
  roles: Role[];
  onSelect: (role: string) => void;
  currentRole: string;
}> = ({ visible, onClose, roles, onSelect, currentRole }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay} />
    </TouchableWithoutFeedback>
    
    <View style={styles.dropdownContainer}>
      <ScrollView>
        {roles.map((role) => (
          <TouchableOpacity
            key={role._id}
            style={[
              styles.roleItem,
              currentRole === role.name && styles.selectedRole
            ]}
            onPress={() => {
              onSelect(role.name);
              onClose();
            }}
          >
            <Text style={styles.roleText}>{role.name}</Text>
            {currentRole === role.name && (
              <AntIcon name="check" size={16} color="#12956B" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  </Modal>
);

// Reusable action button component
const ActionButton: React.FC<{
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
  iconName?: string;
  disabled?: boolean;
  isLoading?: boolean;
}> = ({ label, onPress, backgroundColor, textColor, iconName, disabled = false, isLoading = false }) => (
  <Button
    mode="contained"
    onPress={onPress}
    disabled={disabled || isLoading}
    style={[styles.actionButton, { backgroundColor, opacity: (disabled || isLoading) ? 0.5 : 1 }]}
    contentStyle={styles.buttonContent}
    labelStyle={[styles.actionButtonText, { color: textColor }]}
  >
    {isLoading ? (
      <ActivityIndicator size="small" color={textColor} />
    ) : (
      <View style={styles.textWithIcon}>
        <Text style={[styles.actionButtonText, { color: textColor, flex: 1 }]}>
          {label}
        </Text>
        {iconName && (
          <MaterialCommunityIcons name={iconName} size={20} color={textColor} />
        )}
      </View>
    )}
  </Button>
);

// Follow button component
const FollowButton: React.FC<{
  isFollowing: boolean;
  onPress: () => void;
  isLoading?: boolean;
}> = ({ isFollowing, onPress, isLoading = false }) => (
  <Button
    mode="contained"
    style={[styles.buttonGray, styles.smallButton]}
    labelStyle={styles.whiteText}
    onPress={onPress}
    disabled={isLoading}
  >
    {isLoading ? (
      <ActivityIndicator size="small" color="white" />
    ) : isFollowing ? (
      <>
        <AntIcon name="check" size={16} color="white" style={styles.icon} /> Following
      </>
    ) : (
      "Follow"
    )}
  </Button>
);

// Profile section component
const ProfileSection: React.FC<{
  member: any;
}> = ({ member }) => (
  <View style={styles.centered}>
    <Image
      source={member?.profilePic ? { uri: member.profilePic } : Nopic}
      style={styles.profileImage}
      onError={() => console.log("Error loading profile image")}
    />
    <Text style={styles.nameText}>{member?.firstName} {member?.lastName}</Text>
    <Text style={styles.roleText}>{member?.headline}</Text>
  </View>
);

// Position confirmation dialog
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ 
  visible, 
  title, 
  message, 
  onCancel, 
  onConfirm, 
  confirmText = "Confirm", 
  destructive = false 
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.confirmationOverlay}>
      <View style={styles.confirmationContainer}>
        <Text style={styles.confirmationTitle}>{title}</Text>
        <Text style={styles.confirmationMessage}>{message}</Text>
        <View style={styles.confirmationButtons}>
          <TouchableOpacity style={styles.confirmationButton} onPress={onCancel}>
            <Text style={styles.confirmationButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.confirmationButton, destructive && styles.destructiveButton]} 
            onPress={onConfirm}
          >
            <Text style={[styles.confirmationButtonText, destructive && styles.destructiveText]}>
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);



const ActionButtonRole: React.FC<ActionButtonProps> = ({
  onPress,
  label,
  backgroundColor = "#141414",
  textColor = "#CFCFCF",
  icon,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className="flex-row  w-full justify-between  pl-8 pr-3 py-4 mb-4 rounded-lg"
      style={{ backgroundColor }}
    >
      {/* Icon and Label */}
      
      <Text
        className="text-3xl font-bold"
        style={{ color: textColor }}
      >
        {label}
      </Text>
      {icon && <View className="mr-2">{icon}</View>}
    </TouchableOpacity>
  );
};









// Main component
const MemberDetails = () => {
  const { member, role: roleParam, teamId: teamIdParam } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { team, loading } = useSelector((state: RootState) => state.team);
  const { user } = useSelector((state: RootState) => state.profile);
 
  const parsedMember = member ? JSON.parse(member as string) : null;
  const teamId = teamIdParam ? String(teamIdParam) : "";
  const originalRole = parsedMember?.headline || "";

  // State variables
  const [role, setRole] = useState<string>(roleParam as string || originalRole);
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [memberPosition, setMemberPosition] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialogProps>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
    confirmText: 'Confirm',
    destructive: false
  });
  const isAdmin = user?._id === team?.admin?.[0]?._id;
  // User permissions
  const isTeamOwner = () => {
    if (!team || !user) return false;
    return team.admin[0]._id === user._id;
  };
  
  const isCurrentUserAdmin = () => {
    if (!team || !user) return false;
    const currentMember = team.members.find(m => m.user._id === user._id);
    return currentMember?.position === "Admin" || isTeamOwner();
  };

  const showConfirmation = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    confirmText = "Confirm", 
    destructive = false
  ) => {
    setConfirmDialog({
      visible: true,
      title,
      message,
      onConfirm,
      onCancel: hideConfirmation,
      confirmText,
      destructive
    });
  };

  const hideConfirmation = () => {
    setConfirmDialog(prev => ({ ...prev, visible: false }));
  };

  // Find the member's current position in the team
  useEffect(() => {
    if (team?.members && parsedMember?._id) {
      const memberData = team.members.find(m => m.user._id === parsedMember._id);
      if (memberData) {
        setMemberPosition(memberData.position || "");
        if (memberData.role) {
          setRole(memberData.role);
        }
      }
    }
  }, [team, parsedMember]);

  useEffect(() => {
    if (team?.sport?.playerTypes) {
      setAvailableRoles(team?.sport?.playerTypes);
    }
  }, [team]);

  useEffect(() => {
    setHasChanges(role !== originalRole || memberPosition !== (parsedMember?.position || ""));
  }, [memberPosition,  parsedMember]);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
  
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert("Changes Saved", `Role updated to "${role}"`);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
      Alert.alert("Error", "Could not save changes. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

   const handleRoleSelect = (selectedRole: string) => {
    if (selectedRole === role) return;
    
    showConfirmation(
      "Change Role",
      `Are you sure you want to change this member's role to "${selectedRole}"?`,
      async () => {
        setIsUpdating(true);
        try {
          await dispatch(changeUserRole({
            teamId: teamId,
            userId: parsedMember?._id,
            newRole: selectedRole,
          })).unwrap();
          
          setRole(selectedRole);
          Alert.alert("Role Updated", `Changed to ${selectedRole}`);
          setHasChanges(false);
        } catch (error) {
          console.error("Failed to change role:", error);
          Alert.alert("Error", "Could not update role. Please try again.");
        } finally {
          setIsUpdating(false);
        }
      }
    );
  };

 
  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamDetails(teamId));
    }
  }, [teamId, dispatch, handleRoleSelect]);
  
  
  const handleFollowToggle = async () => {
    setIsFollowingLoading(true);
    try {
    
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsFollowing(prev => !prev);
    } catch (error) {
      console.error("Follow toggle failed:", error);
      Alert.alert("Error", "Could not update follow status");
    } finally {
      setIsFollowingLoading(false);
    }
  };

  // Position change handler
  const executePositionChange = async (newPosition: string) => {
    if (!team || !parsedMember) return;
  
    setIsUpdating(true);
    try {
      // Check if this is removing a position
      if (memberPosition.toLowerCase() === newPosition.toLowerCase()) {
        return handleRemovePosition();
      }
      
      // Find any conflicting members
      const conflictingMembers = team.members.filter(
        (member) =>
          member.position?.toLowerCase() === newPosition.toLowerCase() &&
          member.user._id !== parsedMember._id
      );

      // Clear existing positions if there are conflicts
      for (const member of conflictingMembers) {
        await dispatch(changeUserPosition({
          teamId: team._id,
          userId: member.user._id,
          newPosition: "",
        })).unwrap();
      }

      // Assign the new position
      await dispatch(changeUserPosition({
        teamId: team._id,
        userId: parsedMember._id,
        newPosition,
      })).unwrap();
      
      setMemberPosition(newPosition);
      Alert.alert("Position Updated", `Changed to ${newPosition}`);
    } catch (error) {
      console.error("Failed to change position:", error);
      Alert.alert("Error", "Could not update position. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle position change with confirmation
  const handlePositionChange = (newPosition: string) => {
    const conflictingMembers = team?.members.filter(
      (member) =>
        member.position?.toLowerCase() === newPosition.toLowerCase() &&
        member.user._id !== parsedMember._id
    ) || [];

    if (conflictingMembers.length > 0) {
      const conflictMember = conflictingMembers[0];
      showConfirmation(
        "Position Conflict",
        `${conflictMember.user.firstName} ${conflictMember.user.lastName} is already assigned as ${newPosition}. Do you want to replace them?`,
        () => executePositionChange(newPosition),
        "Replace"
      );
    } else {
      showConfirmation(
        "Change Position",
        `Are you sure you want to ${memberPosition ? 'change' : 'assign'} position to ${newPosition}?`,
        () => executePositionChange(newPosition)
      );
    }
  };
  
  // Handle position removal
  const handleRemovePosition = async () => {
    if (!team || !parsedMember) return;
    
    setIsUpdating(true);
    try {
      await dispatch(changeUserPosition({
        teamId: team._id,
        userId: parsedMember._id,
        newPosition: "",
      })).unwrap();
      
      setMemberPosition("");
      Alert.alert("Position Removed", "Member no longer has a special position");
    } catch (error) {
      console.error("Failed to remove position:", error);
      Alert.alert("Error", "Could not update position. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

 

  // Handle removing member from team
  const handleRemoveFromTeam = () => {
    showConfirmation(
      "Remove Member",
      "Are you sure you want to remove this member from the team?",
      async () => {
        setIsUpdating(true);
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          Alert.alert("Member Removed", "Member has been removed from the team");
          router.back();
        } catch (error) {
          console.error("Failed to remove member:", error);
          Alert.alert("Error", "Could not remove member. Please try again.");
          setIsUpdating(false);
        }
      },
      "Remove",
      true
    );
  };

  // Handle admin transfer
  const handleTransferAdmin = () => {
    showConfirmation(
      "Transfer Admin",
      "Are you sure you want to transfer admin rights to this member?",
      async () => {
        try {
          await executePositionChange("Admin");
          Alert.alert("Admin Transferred", "Admin rights have been transferred");
        } catch (error) {
          console.error("Failed to transfer admin:", error);
          Alert.alert("Error", "Could not transfer admin rights. Please try again.");
        }
      }
    );
  };

  // Render position-specific buttons
  const renderPositionButtons = () => {
    if (memberPosition === "Captain") {
      return (
        <>
          <ActionButtonRole
            label="Demote to Vice Captain"
            onPress={() => handlePositionChange("ViceCaptain")}
            backgroundColor="#141414"
            textColor="#CFCFCF"
            icon={<ViceCaptain/>}
            // isLoading={isUpdating}
          />
          <ActionButtonRole
            label="Remove from Captain"
            onPress={() => showConfirmation(
              "Remove Position",
              "Are you sure you want to remove the Captain position?",
              handleRemovePosition,
              "Remove"
            )}
            backgroundColor="#141414"
            textColor="#D44044"
            icon={<Captain/>}
            // isLoading={isUpdating}
          />
        </>
      );
    } else if (memberPosition === "Vice Captain" || memberPosition === "ViceCaptain") {
      return (
        <>
          <ActionButtonRole
            label="Promote to Captain"
            onPress={() => handlePositionChange("Captain")}
            backgroundColor="#141414"
            textColor="#CFCFCF"
            icon={<Captain/>}
            // isLoading={isUpdating}
          />
          <ActionButtonRole
            label="Remove from Vice Captain"
            onPress={() => showConfirmation(
              "Remove Position",
              "Are you sure you want to remove the Vice Captain position?",
              handleRemovePosition,
              "Remove"
            )}
            backgroundColor="#141414"
            textColor="#D44044"
            icon={<ViceCaptain/>}
            // isLoading={isUpdating}
          />
        </>
      );
    } else if (memberPosition === "Admin") {
      return (
        <ActionButton
          label="Remove Admin Rights"
          onPress={() => showConfirmation(
            "Remove Admin",
            "Are you sure you want to remove admin rights from this member?",
            handleRemovePosition,
            "Remove",
            true
          )}
          backgroundColor="#141414"
          textColor="#D44044"
          iconName="account-remove"
          isLoading={isUpdating}
        />
      );
    } else {
      return (
        <>
          <ActionButton
            label="Promote to Captain"
            onPress={() => handlePositionChange("Captain")}
            backgroundColor="#141414"
            textColor="#CFCFCF"
            iconName="crown"
            isLoading={isUpdating}
          />
          <ActionButton
            label="Promote to Vice Captain"
            onPress={() => handlePositionChange("ViceCaptain")}
            backgroundColor="#141414"
            textColor="#CFCFCF"
            iconName="crown-outline"
            isLoading={isUpdating}
          />
        </>
      );
    }
  };

  // Show loading state during initial fetch
  if (loading && !team) {
    return (
      <PageThemeView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#12956B" />
          <Text style={styles.loadingText}>Loading member details...</Text>  
        </View>
      </PageThemeView>
    );
  }

  return (
    <PageThemeView>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntIcon name="arrowleft" size={28} color="white" />
        </TouchableOpacity>

        <TextScallingFalse style={styles.headerText}>
          {parsedMember?.firstName} {parsedMember?.lastName}
        </TextScallingFalse>

        <TouchableOpacity 
          disabled={!hasChanges || isUpdating} 
          onPress={handleSave}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={[styles.whiteText, { opacity: hasChanges ? 1 : 0.3 }]}>
              Save
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ width: 28 }} />
      </View>

      <Divider />

      {/* Profile */}
      <ProfileSection member={parsedMember} />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <FollowButton
          isFollowing={isFollowing}
          onPress={handleFollowToggle}
          isLoading={isFollowingLoading}
        />
        <Button
          mode="contained"
          style={[styles.buttonGray, styles.smallButtonRight]}
          labelStyle={styles.whiteText}
          onPress={() => {
            // Navigate to user profile
          }}
        >
          View Profile
        </Button>
      </View>

      {/* Role Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionLabel}>Role</Text>
        <View>
        <View className="flex-row">
  
        <View className="flex-row">


      <ActionButtonRole
        onPress={() => {
          if (isAdmin) setDropdownVisible(true);
         else {
          console.log("You are not an Admin");
         }
         }}
       label={role || "Select Role"}
       backgroundColor="#141414"
       textColor="#CFCFCF"
       icon={<RoleEdit />} // Icon inside the button
       disabled={isUpdating}
  />
</View>


</View>

      </View>

        {/* Position-specific buttons */}
        {
          isAdmin && renderPositionButtons()
        }
       
       {
        isAdmin && <ActionButton
        label="Remove from Team"
        onPress={handleRemoveFromTeam}
        backgroundColor="#141414"
        textColor="#D44044"
        iconName="account-remove"
        isLoading={isUpdating}
      />
       }
        
        
        {isCurrentUserAdmin() && (
          <ActionButton
            label="Transfer Admin"
            onPress={handleTransferAdmin}
            backgroundColor="#141414"
            textColor="#CFCFCF"
            iconName="swap-horizontal"
            isLoading={isUpdating}
          />
          
        )}
      </View>

      {/* Role Dropdown */}
      <RoleDropdown
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        roles={availableRoles}
        onSelect={handleRoleSelect}
        currentRole={role}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        visible={confirmDialog.visible}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onCancel={hideConfirmation}
        onConfirm={() => {
          hideConfirmation();
          confirmDialog.onConfirm();
        }}
        confirmText={confirmDialog.confirmText}
        destructive={confirmDialog.destructive}
      />
    </PageThemeView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginLeft: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  headerText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  centered: {
    marginTop: 20,
    marginLeft: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  nameText: {
    marginTop: 15,
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  roleText: {
    color: "#949494",
    fontSize: 13,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 20,
    paddingHorizontal: 12,
  },
  buttonGray: {
    backgroundColor: "#141414",
    marginHorizontal: 6,
  },
  smallButton: {
    paddingVertical: 0,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#12956B",
  },
  smallButtonRight: {
    paddingVertical: 0,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderColor: "#12956B",
    borderWidth: 1,
    backgroundColor: "#000000",
  },
  whiteText: {
    color: "white",
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 6,
    paddingVertical: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  icon: {
    marginRight: 6,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  dropdownContainer: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 10,
    maxHeight: '40%',
    // Position the dropdown to appear after the first action button
    top: '40%', 
    zIndex: 1000,
  },
  roleItem: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  selectedRole: {
    backgroundColor: '#252525'
  },
  confirmationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmationContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 400
  },
  confirmationTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  confirmationMessage: {
    color: '#CFCFCF',
    fontSize: 16,
    marginBottom: 20
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  confirmationButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10
  },
  confirmationButtonText: {
    color: '#12956B',
    fontSize: 16
  },
  destructiveButton: {
    backgroundColor: 'rgba(212, 64, 68, 0.1)',
    borderRadius: 4
  },
  destructiveText: {
    color: '#D44044'
  },
  sectionLabel: {
    color: "#949494",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    marginLeft: 2
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000'
  },
  loadingText: {
    color: 'white',
    marginTop: 12,
    fontSize: 16
  }
});

export default MemberDetails;