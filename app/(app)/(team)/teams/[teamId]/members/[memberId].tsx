import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import { fetchTeamDetails, changeUserPosition } from "~/reduxStore/slices/team/teamSlice";
import PageThemeView from "~/components/PageThemeView";
import AntIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button, Divider } from "react-native-paper";
import Nopic from "../../../../../../assets/images/nopic.jpg";
import TextScallingFalse from "~/components/CentralText";

// --- Components ---

const ActionButton = ({ label, onPress, backgroundColor, textColor, iconName }) => (
  <Button
    mode="contained"
    onPress={onPress}
    style={[styles.actionButton, { backgroundColor }]}
    contentStyle={styles.buttonContent}
    labelStyle={[styles.actionButtonText, { color: textColor }]}
  >
    <View style={styles.textWithIcon}>
      <Text style={[styles.actionButtonText, { color: textColor, flex: 1 }]}>
        {label}
      </Text>
      {iconName && (
        <MaterialCommunityIcons name={iconName} size={20} color={textColor} />
      )}
    </View>
  </Button>
);

const FollowButton = ({ isFollowing, onPress }) => (
  <Button
    mode="contained"
    style={[styles.buttonGray, styles.smallButton]}
    labelStyle={styles.whiteText}
    onPress={onPress}
  >
    {isFollowing ? (
      <>
        <AntIcon name="check" size={16} color="white" style={styles.icon} /> Following
      </>
    ) : (
      "Follow"
    )}
  </Button>
);

const ProfileSection = ({ member }) => (
  <View style={styles.centered}>
    <Image
      source={member?.profilePic ? { uri: member.profilePic } : Nopic}
      style={styles.profileImage}
    />
    <Text style={styles.nameText}>{member?.firstName} {member?.lastName}</Text>
    <Text style={styles.roleText}>{member?.headline}</Text>
  </View>
);

// --- Main Screen ---

const MemberDetails = () => {
  const { member, role: roleParam, teamId: teamIdParam } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const parsedMember = member ? JSON.parse(member) : null;
  const teamId = teamIdParam ? String(teamIdParam) : "";
  const originalRole = parsedMember?.headline || "";

  const [role, setRole] = useState(roleParam || originalRole);
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { team } = useSelector((state: RootState) => state.team);
  const { user } = useSelector((state: RootState) => state?.profile);

  useEffect(() => {
    setHasChanges(role !== originalRole);
  }, [role]);

  const handleSave = () => {
    Alert.alert("Changes Saved", `Role updated to "${role}"`);
    setHasChanges(false);
    // Optional: Dispatch API call to update role
  };

  const handlePosition = (newPosition: string) => {
    dispatch(changeUserPosition({
      teamId: teamId,
      userId:user?._id,
      newPosition: "Captain",
    }));
    setRole(newPosition); // Also reflect UI change
  };

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

        <TouchableOpacity disabled={!hasChanges} onPress={handleSave}>
          <Text style={[styles.whiteText, { opacity: hasChanges ? 1 : 0.3 }]}>
            Save
          </Text>
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
          onPress={() => setIsFollowing(prev => !prev)}
        />
        <Button
          mode="contained"
          style={[styles.buttonGray, styles.smallButtonRight]}
          labelStyle={styles.whiteText}
          onPress={() => {}}
        >
          View Profile
        </Button>
      </View>

      {/* Role Actions */}
      <View style={styles.actionsContainer}>
        <ActionButton
          label={role}
          backgroundColor="#141414"
          textColor="#CFCFCF"
          iconName="cricket"
        />
        <ActionButton
          label="Promote to Captain"
          onPress={() => handlePosition("Captain")}
          backgroundColor="#141414"
          textColor="#CFCFCF"
          iconName="crown"
        />
        <ActionButton
          label="Demote to Vice Captain"
          onPress={() => handlePosition("Vice Captain")}
          backgroundColor="#141414"
          textColor="#CFCFCF"
          iconName="crown-outline"
        />
        <ActionButton
          label="Remove from Team"
          onPress={() => handlePosition("Removed")}
          backgroundColor="#141414"
          textColor="#D44044"
          iconName="account-remove"
        />
        <ActionButton
          label="Transfer Admin"
          onPress={() => handlePosition("Admin")}
          backgroundColor="#141414"
          textColor="#D44044"
          iconName="swap-horizontal"
        />
      </View>
    </PageThemeView>
  );
};

export default MemberDetails;

// --- Styles ---
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
});
