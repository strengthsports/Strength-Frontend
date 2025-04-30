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
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import {
  fetchTeamDetails,
  changeUserPosition,
  changeUserRole,
} from "~/reduxStore/slices/team/teamSlice";
import Toast from 'react-native-toast-message';
import { toastConfig } from "~/configs/toastConfig";
import PageThemeView from "~/components/PageThemeView";
import AntIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button, Divider } from "react-native-paper";
import Nopic from "../../../../../../assets/images/nopic.jpg";
import RoleEdit from "~/components/SvgIcons/teams/RoleEdit";
import TextScallingFalse from "~/components/CentralText";
import ViceCaptain from "~/components/SvgIcons/teams/ViceCaptain";
import Captain from "~/components/SvgIcons/teams/Captain";
import RemoveFromTeam from "~/components/SvgIcons/teams/RemoveFromTeam";
import TransferAdmin from "~/components/SvgIcons/teams/TransferAdmin";
import AlertModal from "~/components/modals/AlertModal"; 
import { showSuccess, showError, showInfo, showWarning } from '../../../../../../utils/feedbackToast';

// Types
interface Role {
  _id: string;
  name: any;
}

interface AlertConfig {
  title: string;
  message: string;
  confirmAction: () => void;
  discardAction: () => void;
  confirmMessage: string;
  cancelMessage: string;
  discardButtonColor?: {
    bg: string;
    text: string;
  };
  cancelButtonColor?: {
    bg: string;
    text: string;
  };
}

interface ActionButtonProps {
  onPress: () => void;
  label: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

// Role Dropdown Component - With properly named component and fixed keys
const RoleDropdownComponent = ({
  visible,
  onClose,
  roles,
  onSelect,
  currentRole,
}: {
  visible: boolean;
  onClose: () => void;
  roles: Role[];
  onSelect: (role: string) => void;
  currentRole: string;
}) => (
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
      {/* Use FlatList instead of ScrollView for better key handling */}
      <FlatList
        data={roles}
        keyExtractor={(item) => item._id}
        renderItem={({ item: role }) => (
          <TouchableOpacity
            style={[
              styles.roleItem,
              currentRole === role.name && styles.selectedRole,
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
        )}
      />
    </View>
  </Modal>
);


// Apply React.memo with a display name
const RoleDropdown = React.memo(RoleDropdownComponent);

// Set a display name for easier debugging
RoleDropdown.displayName = "RoleDropdown";

// Action Button Component
const ActionButton = React.memo(
  ({
    label,
    onPress,
    backgroundColor,
    textColor,
    iconName,
    disabled = false,
    isLoading = false,
  }: {
    label: string;
    onPress: () => void;
    backgroundColor: string;
    textColor: string;
    iconName?: string;
    disabled?: boolean;
    isLoading?: boolean;
  }) => (
    <Button
      mode="contained"
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.actionButton,
        { backgroundColor, opacity: disabled || isLoading ? 0.5 : 1 },
      ]}
      contentStyle={styles.buttonContent}
      labelStyle={[styles.actionButtonText, { color: textColor }]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.textWithIcon}>
          <Text
            style={[styles.actionButtonText, { color: textColor, flex: 1 }]}
          >
            {label}
          </Text>
          {iconName && (
            <MaterialCommunityIcons
              name={iconName}
              size={20}
              color={textColor}
            />
          )}
        </View>
      )}
    </Button>
  )
);

// Action Button with Role
const ActionButtonRole = React.memo(
  ({
    onPress,
    label,
    backgroundColor = "#141414",
    textColor = "#CFCFCF",
    icon,
    disabled = false,
  }: ActionButtonProps) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className="flex-row w-full justify-between pl-8 pr-3 py-4 mb-4 rounded-lg"
      style={{ backgroundColor }}
    >
      <Text className="text-3xl font-bold" style={{ color: textColor }}>
        {label}
      </Text>
      {icon && <View className="mr-2">{icon}</View>}
    </TouchableOpacity>
  )
);

// Follow Button Component
const FollowButton = React.memo(
  ({
    isFollowing,
    onPress,
    isLoading = false,
    isAdmin,
  }: {
    isFollowing: boolean;
    onPress: () => void;
    isLoading?: boolean;
    isAdmin?: boolean;
  }) => (
    <Button
      mode="contained"
      style={isAdmin ? styles.buttonGray : styles.smallButton}
      labelStyle={styles.whiteText}
      onPress={onPress}
      disabled={isLoading || isAdmin}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : isFollowing ? (
        <>
          <AntIcon name="check" size={16} color="white" style={styles.icon} />{" "}
          Following
        </>
      ) : (
        "Follow"
      )}
    </Button>
  )
);

// Profile Section Component
const ProfileSection = React.memo(({ member }: { member: any }) => (
  <View style={styles.centered}>
    <Image
      source={member?.profilePic ? { uri: member.profilePic } : Nopic}
      style={styles.profileImage}
    />
    <Text style={styles.nameText}>
      {member?.firstName} {member?.lastName}
    </Text>
    <View className="flex-row">
      <Text style={styles.roleText}>{"@"}{member?.username} |{" "}{member?.headline}</Text>
    </View>
  </View>
));

// Main component
const MemberDetails = () => {
  const {
    member,
    role: roleParam,
    teamId: teamIdParam,
  } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { team, loading } = useSelector((state: RootState) => state.team);
  const { user } = useSelector((state: RootState) => state.profile);

  const parsedMember = useMemo(() => {
    return member ? JSON.parse(member as string) : null;
  }, [member]);

  const teamId = teamIdParam ? String(teamIdParam) : "";
  const originalRole = parsedMember?.headline || "";

  // State variables
  const [role, setRole] = useState<string>(
    (roleParam as string) || originalRole
  );
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [memberPosition, setMemberPosition] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  // Alert modal state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    title: "",
    message: "",
    confirmAction: () => {},
    discardAction: () => {},
    confirmMessage: "Confirm",
    cancelMessage: "Cancel",
  });

  // Memoized values to prevent recalculations
  const isAdmin = useMemo(() => {
    if (!user || !team || !team.admin || !team.admin[0]) return false;
    return user._id === team.admin[0]._id;
  }, [user?._id, team?.admin]);

  const isTeamOwner = useMemo(() => {
    if (!team || !user || !team.admin || !team.admin[0]) return false;
    return team.admin[0]._id === user._id;
  }, [team?.admin, user]);

  const isCurrentUserAdmin = useMemo(() => {
    if (!team || !user || !team.members) return false;
    const currentMember = team.members.find(
      (m: any) => m.user && m.user._id === user._id
    );
    return (currentMember && currentMember.position === "Admin") || isTeamOwner;
  }, [team?.members, user, isTeamOwner]);

  // Initialize data once
  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamDetails(teamId));
    }
  }, [teamId, dispatch]);

  // Set available roles once team data is loaded
  useEffect(() => {
    if (team?.sport?.playerTypes) {
      setAvailableRoles(team?.sport?.playerTypes);
    }
  }, [team?.sport?.playerTypes]);

  // Set member position once when team data changes
  useEffect(() => {
    if (team?.members && parsedMember?._id) {
      const memberData = team.members.find(
        (m: any) => m.user && m.user._id === parsedMember._id
      );
      if (memberData) {
        setMemberPosition(memberData.position || "");
        if (memberData.role) {
          setRole(memberData.role);
        }
      }
    }
  }, [team?.members, parsedMember?._id]);

  // Check for changes when relevant values change
  useEffect(() => {
    const hasPositionChanged =
      memberPosition !== (parsedMember?.position || "");
    const hasRoleChanged = role !== originalRole;
    setHasChanges(hasPositionChanged || hasRoleChanged);
  }, [memberPosition, role, originalRole, parsedMember?.position]);

  // Unified toast message functions
  const showToastMessage = (message: string, type = 'success') => {
    // Using the imported toast utility functions
    switch(type) {
      case 'success':
        showSuccess(message);
        break;
      case 'error':
        showError(message);
        break;
      case 'info':
        showInfo(message);
        break;
      case 'warning':
        showWarning(message);
        break;
      default:
        showSuccess(message);
    }
  };

  // Functions for the Alert Modal
  const showAlert = (
    title: string,
    message: string,
    confirmAction: () => void,
    confirmMessage = "Confirm",
    isDestructive = false
  ) => {
    const config: AlertConfig = {
      title,
      message,
      confirmAction: () => {
        setAlertVisible(false); // Close the alert modal first
        confirmAction(); // Then execute the action
      },
      discardAction: () => setAlertVisible(false),
      confirmMessage,
      cancelMessage: "Cancel",
    };
    
    setAlertConfig(config);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const handleRoleSelect = useCallback(
    (selectedRole: string) => {
      if (selectedRole === role) return;

      showAlert(
        "Change Role",
        `Are you sure you want to change this member's role to "${selectedRole}"?`,
        async () => {
          setIsUpdating(true);
          try {
            // Check if required parameters exist
            if (!teamId || !parsedMember?._id) {
              throw new Error("Missing required parameters");
            }

            await dispatch(
              changeUserRole({
                teamId: teamId,
                userId: parsedMember._id,
                newRole: selectedRole,
              })
            ).unwrap();

            setRole(selectedRole);
            setHasChanges(false);
            showToastMessage(`Role successfully changed to ${selectedRole}`);
          } catch (error) {
            console.error("Failed to change role:", error);
            showToastMessage("Could not update role. Please try again.", "error");
          } finally {
            setIsUpdating(false);
          }
        },
        "Change"
      );
    },
    [role, teamId, parsedMember, dispatch]
  );

  const handleFollowToggle = useCallback(async () => {
    setIsFollowingLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsFollowing((prev) => !prev);
      showToastMessage(isFollowing ? "Unfollowed successfully" : "Following now");
    } finally {
      setIsFollowingLoading(false);
    }
  }, [isFollowing]);

  const executePositionChange = useCallback(
    async (newPosition: string) => {
      // Validate required data before proceeding
      if (!team || !team._id || !parsedMember) {
        showToastMessage("Missing team or member data", "error");
        return;
      }

      // Ensure the member ID exists
      if (!parsedMember._id) {
        showToastMessage("Invalid member data - missing ID", "error");
        return;
      }

      setIsUpdating(true);
      try {
        // Check if this is removing a position
        if (memberPosition.toLowerCase() === newPosition.toLowerCase()) {
          await dispatch(
            changeUserPosition({
              teamId: team._id,
              userId: parsedMember._id,
              newPosition: "",
            })
          ).unwrap();

          setMemberPosition("");
          showToastMessage("Position has been removed successfully");
          return;
        }

        const conflictingMembers = team.members.filter(
          (member: any) =>
            member?.user &&
            member?.position?.toLowerCase() === newPosition.toLowerCase() &&
            member?.user?._id !== parsedMember._id
        );

        for (const member of conflictingMembers) {
          if (member?.user && member?.user?._id) {
            await dispatch(
              changeUserPosition({
                teamId: team._id,
                userId: member.user._id,
                newPosition: "",
              })
            ).unwrap();
          }
        }

        await dispatch(
          changeUserPosition({
            teamId: team._id,
            userId: parsedMember._id,
            newPosition,
          })
        ).unwrap();

        setMemberPosition(newPosition);
        showToastMessage(`Position successfully changed to ${newPosition}`);
      } catch (error) {
        console.error("Failed to change position:", error);
        showToastMessage("Could not update position. Please try again.", "error");
      } finally {
        setIsUpdating(false);
      }
    },
    [team, parsedMember, memberPosition, dispatch]
  );

  const isMemberAdmin = useMemo(() => {
    if (!team || !team.admin || !parsedMember) return false;
    return team.admin.some(admin => admin._id === parsedMember._id);
  }, [team?.admin, parsedMember?._id]);

  const handlePositionChange = useCallback(
    (newPosition: string) => {
      if (!team || !team.members || !parsedMember) {
        showToastMessage("Missing team or member data", "error");
        return;
      }

      const conflictingMembers = team.members.filter(
        (member: any) =>
          member.user &&
          member.position?.toLowerCase() === newPosition.toLowerCase() &&
          member.user._id !== parsedMember._id
      );

      if (conflictingMembers.length > 0 && conflictingMembers[0].user) {
        const conflictMember = conflictingMembers[0];
        showAlert(
          "Position Conflict",
          `${conflictMember.user.firstName || "User"} ${
            conflictMember.user.lastName || ""
          } is already assigned as ${newPosition}. Do you want to replace them?`,
          () => executePositionChange(newPosition),
          "Replace"
        );
      } else {
        showAlert(
          "Change Position",
          `Are you sure you want to ${
            memberPosition ? "Promote" : "Promote"
          } position to ${newPosition}?`,
          () => executePositionChange(newPosition),
          "Promote"
        );
      }
    },
    [
      team,
      parsedMember,
      memberPosition,
      executePositionChange,
    ]
  );

  const handleRemovePosition = useCallback(async () => {
    if (!team || !team._id) {
      showToastMessage("Missing team data", "error");
      return;
    }

    if (!parsedMember || !parsedMember._id) {
      showToastMessage("Missing or invalid member data", "error");
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(
        changeUserPosition({
          teamId: team._id,
          userId: parsedMember._id,
          newPosition: "",
        })
      ).unwrap();

      setMemberPosition("");
      showToastMessage("Position has been removed successfully");
    } catch (error) {
      console.error("Failed to remove position:", error);
      showToastMessage("Could not update position. Please try again.", "error");
    } finally {
      setIsUpdating(false);
    }
  }, [team, parsedMember, dispatch]);

  // Handle removing member from team
  const handleRemoveFromTeam = useCallback(() => {
    showAlert(
      "Remove Member",
      "Are you sure you want to remove this member from the team?",
      async () => {
        setIsUpdating(true);
        try {
          // Implement the actual member removal logic here
          await new Promise((resolve) => setTimeout(resolve, 500));
          showToastMessage("Member has been removed from the team");
          router.back();
        } catch (error) {
          console.error("Failed to remove member:", error);
          showToastMessage("Could not remove member. Please try again.", "error");
        } finally {
          setIsUpdating(false);
        }
      },
      "Remove"
    );
  }, [router]);

  // Handle admin transfer
  const handleTransferAdmin = useCallback(() => {
    if (!team || !parsedMember) {
      showToastMessage("Missing team or member data", "error");
      return;
    }

    showAlert(
      "Transfer Admin",
      "Are you sure you want to transfer admin rights to this member?",
      () => executePositionChange("Admin"),
      "Transfer"
    );
  }, [executePositionChange, team, parsedMember]);

  // Render position-specific buttons - memoized to prevent re-renders
  const renderPositionButtons = useMemo(() => {
    if (memberPosition === "Captain") {
      return (
        <>
          <ActionButtonRole
            label="Demote to Vice Captain"
            onPress={() => handlePositionChange("ViceCaptain")}
            backgroundColor="#141414"
            textColor="#CFCFCF"
            icon={<ViceCaptain />}
          />
          <ActionButtonRole
            label="Remove from Captain"
            onPress={() =>
              showAlert(
                "Remove Position",
                "Are you sure you want to remove the Captain position?",
                handleRemovePosition,
                "Remove"
              )
            }
            backgroundColor="#141414"
            textColor="#D44044"
            icon={<Captain />}
          />
        </>
      );
    } else if (
      memberPosition === "Vice Captain" ||
      memberPosition === "ViceCaptain"
    ) {
      return (
        <>
          <ActionButtonRole
            label="Promote to Captain"
            onPress={() => handlePositionChange("Captain")}
            backgroundColor="#141414"
            textColor="#CFCFCF"
            icon={<Captain />}
          />
          <ActionButtonRole
            label="Remove from Vice Captain"
            onPress={() =>
              showAlert(
                "Remove Position",
                "Are you sure you want to remove the Vice Captain position?",
                handleRemovePosition,
                "Remove"
              )
            }
            backgroundColor="#141414"
            textColor="#D44044"
            icon={<ViceCaptain />}
          />
        </>
      );
    } else if (memberPosition === "Admin") {
      return (
        <ActionButton
          label="Remove Admin Rights"
          onPress={() =>
            showAlert(
              "Remove Admin",
              "Are you sure you want to remove admin rights from this member?",
              handleRemovePosition,
              "Remove"
            )
          }
          backgroundColor="#141414"
          textColor="#D44044"
          iconName="account-remove"
        />
      );
    } else {
      return (
        <>
          <ActionButtonRole
            label="Promote to Captain"
            onPress={() => handlePositionChange("Captain")}
            backgroundColor="#141414"
            textColor="#CFCFCF"
            icon={<Captain />}
          />
          <ActionButtonRole
            label="Promote to Vice Captain"
            onPress={() => handlePositionChange("ViceCaptain")}
            backgroundColor="#141414"
            textColor="#CFCFCF"
            icon={<ViceCaptain />}
          />
        </>
      );
    }
  }, [
    memberPosition,
    handlePositionChange,
    handleRemovePosition,
  ]);

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
      {/* Semi-transparent overlay when alert is visible */}
      {alertVisible && (
        <View style={styles.backdropOverlay} />
      )}
      
      {/* Alert Modal */}
      {alertVisible && (
        <AlertModal 
          alertConfig={alertConfig}
          isVisible={alertVisible}
          onClose={hideAlert}
        />
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntIcon name="arrowleft" size={28} color="white" />
        </TouchableOpacity>

        <TextScallingFalse style={styles.headerText}>
          {parsedMember?.firstName || ""} {parsedMember?.lastName || ""}
        </TextScallingFalse>

        <View style={{ width: 28 }} />
      </View>

      <Divider />

      {/* Profile */}
      <ProfileSection member={parsedMember} />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <FollowButton
          isAdmin={isAdmin}
          isFollowing={isFollowing}
          onPress={handleFollowToggle}
          isLoading={isFollowingLoading}
        />
        <Button
          mode="contained"
          style={styles.smallButtonRight}
          labelStyle={styles.whiteText}
          onPress={() => {
            /* Navigate to user profile */
          }}
        >
          View Profile
        </Button>
      </View>

      {/* Role Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionLabel}>Role</Text>
        <View>
          <ActionButtonRole
            onPress={() => {
              if (isAdmin) setDropdownVisible(true);
            }}
            label={role || "Select Role"}
            backgroundColor="#141414"
            textColor="#CFCFCF"
            icon={<RoleEdit />}
            disabled={isUpdating || !isAdmin}
          />
        </View>

        {/* Position-specific buttons */}
        {isAdmin && renderPositionButtons}

        {isAdmin && (
          <ActionButtonRole
            label="Remove from Team"
            onPress={handleRemoveFromTeam}
            backgroundColor="#141414"
            textColor="#D44044"
            icon={<RemoveFromTeam />}
          />
        )}

        {isCurrentUserAdmin && !isMemberAdmin && (
          <ActionButtonRole
            label="Transfer Admin"
            onPress={handleTransferAdmin}
            backgroundColor="#141414"
            textColor="#D44044"
            icon={<TransferAdmin />}
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

      {/* Toast Component */}
      <Toast config={toastConfig} />
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
    maxWidth: 300,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 25,
    paddingHorizontal: 12,
  },
  buttonGray: {
    backgroundColor: "#141414",
    marginHorizontal: 6,
    paddingVertical: 0,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  smallButton: {
    paddingVertical: 0,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#12956B",
  },
  smallButtonRight: {
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdownContainer: {
    position: "absolute",
    left: "5%",
    right: "5%",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 10,
    maxHeight: "40%",
    top: "40%",
    zIndex: 1000,
  },
  roleItem: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  selectedRole: {
    backgroundColor: "#252525",
  },
  sectionLabel: {
    color: "#949494",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    marginLeft: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
  },
  // Backdrop overlay for alert modal
  backdropOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
});

export default MemberDetails;