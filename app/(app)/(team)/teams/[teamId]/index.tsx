import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  useRouter,
  useLocalSearchParams,
  RelativePathString,
} from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTeam,
  fetchTeamDetails,
  removeTeamMember, 
} from "~/reduxStore/slices/team/teamSlice";
import {
  sendTeamJoinRequest,
  resetJoinStatus,
} from "~/reduxStore/slices/team/teamJoinSlice";
import { AppDispatch, RootState } from "~/reduxStore";
import TeamCard from "~/components/teamPage/TeamCard";
import SubCategories from "~/components/teamPage/SubCategories";
import CombinedDrawer from "~/components/teamPage/CombinedDrawer";
import { fetchMyProfile } from "~/reduxStore/slices/user/profileSlice";
import { useFocusEffect } from "@react-navigation/native";
import SettingsIcon from "~/components/SvgIcons/teams/SettingsIcon";
import InviteMembers from "~/components/SvgIcons/teams/InviteMembers";
import LeaveTeam from "~/components/SvgIcons/teams/LeaveTeam";
import TextScallingFalse from "~/components/CentralText";
import { Modalize } from "react-native-modalize";
import InviteModal from "~/components/teamPage/InviteModel";
import { Team } from "~/types/team";
import AlertModal from "~/components/modals/AlertModal";
import Toast from "react-native-toast-message";
import { toastConfig } from "~/configs/toastConfig";
import {
  showSuccess,
  showError,
  showInfo,
  showWarning,
} from "~/utils/feedbackToast";
import PageThemeView from "~/components/PageThemeView";

const { height } = Dimensions.get("window");
const HEADER_HEIGHT = 40;
const TeamPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useLocalSearchParams();

  const teamId = params.teamId ? String(params.teamId) : "";
  const { user } = useSelector((state: RootState) => state.profile);
  const teamDetails = useSelector((state: RootState) => state.team.team);
  const loading = useSelector((state: RootState) => state.team.loading);
  const [joining, setJoining] = useState(false);
  const teamJoin = useSelector((state: RootState) => state.teamJoin);
  const joinError = teamJoin?.error || null;
  const joinSuccess = teamJoin?.success || false;
  const [requestSent, setRequestSent] = useState(false);
  const [isTeamMember, setIsteamMember] = useState(false);

  // Refresh state
  const [refreshing, setRefreshing] = useState(false);

  // Alert modal state
  const [alertVisible, setAlertVisible] = useState(false);
const [alertConfig, setAlertConfig] = useState({
  title: "",
  message: "",
  confirmAction: () => {},
  discardAction: () => {},
  confirmMessage: "Confirm",
  cancelMessage: "Cancel",
  isDestructive: false,
  confirmButtonColor: undefined,
  cancelButtonColor: undefined,
  discardButtonColor: undefined
});

  const modalRef = useRef<Modalize>(null);
  const scrollViewRef = useRef<ScrollView>(null);

const showAlert = (
  title: string,
  message: string,
  confirmAction: () => void,
  confirmMessage = "Confirm",
  isDestructive = false
) => {
  setAlertConfig({
    title,
    message,
    confirmAction: () => {
      setAlertVisible(false);
      confirmAction();
    },
    discardAction: () => setAlertVisible(false),
    confirmMessage,
    cancelMessage: "Cancel",
    isDestructive,
    confirmButtonColor: isDestructive ? { bg: "#D44044", text: "white" } : undefined,
    cancelButtonColor: undefined,
    discardButtonColor: undefined
  });
  setAlertVisible(true);
};

  const hideAlert = () => {
    setAlertVisible(false);
  };

  // Memoized team data
 const teamData = useMemo(
    () => ({
      name: teamDetails?.name || "Loading...",
      sportName: teamDetails?.sport?.name || "Loading...",
      logo: teamDetails?.logo?.url || "",
      sportLogo: teamDetails?.sport?.logo || "0",
      membersCount: teamDetails?.members?.length || 0,
      isRequested: teamDetails?.isRequested || false,
    }),
    [teamDetails, teamId]
  );

  // Memoized captain and vice captain data
  const { captain, viceCapt } = useMemo(() => {
    const captainMember = teamDetails?.members?.find(
      (member: any) => member?.position?.toLowerCase() === "captain"
    );
    const viceCaptainMember = teamDetails?.members?.find(
      (member: any) => member?.position?.toLowerCase() === "vicecaptain"
    );

    return {
      captain: captainMember
        ? `${captainMember.user?.firstName || ""} ${
            captainMember.user?.lastName || ""
          }`.trim()
        : "Not Assigned",
      viceCapt: viceCaptainMember
        ? `${viceCaptainMember.user?.firstName || ""} ${
            viceCaptainMember.user?.lastName || ""
          }`.trim()
        : "Not assigned",
    };
  }, [teamDetails]);

  // Memoized location
  const location = useMemo(
    () =>
      teamDetails?.address
        ? `${teamDetails.address.city}, ${teamDetails.address.country}`
        : "Unknown",
    [teamDetails?.address]
  );

  // Memoized roles
  const roles = useMemo(
    () =>
      teamDetails?.sport?.playerTypes?.map(
        (playerType: any) => playerType.name
      ) || [],
    [teamDetails?.sport?.playerTypes]
  );

  // Memoized isAdmin check
  const isAdmin = useMemo(
    () => user?._id === teamDetails?.admin?.[0]?._id,
    [user?._id, teamDetails?.admin]
  );

  // Enhanced fetch team details function
  const fetchTeamData = useCallback(async (showErrorToast = true) => {
    if (teamId) {
      try {
        await dispatch(fetchTeamDetails(teamId)).unwrap();
        return true;
      } catch (error) {
        console.error("Failed to fetch team details:", error);
        if (showErrorToast) {
          showError("Failed to fetch team data");
        }
        throw error;
      }
    }
    return false;
  }, [teamId, dispatch]);

  // Initial fetch on component mount and teamId change
  useEffect(() => {
    if (teamId) {
      fetchTeamData().catch(() => {
        // Error already handled in fetchTeamData
      });
    }
  }, [teamId, dispatch]); // Added dispatch dependency

  // Reset join status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetJoinStatus());
    };
  }, [dispatch]);

  // Handle join success or error with alerts
  useEffect(() => {
    if (joinSuccess) {
      setRequestSent(true);
      setJoining(false);
      showSuccess("Join request sent successfully!");
      dispatch(resetJoinStatus());
    }

    if (joinError) {
      setJoining(false);
      if (joinError.includes("already sent")) {
        setRequestSent(true);
        showInfo("You have already sent a join request to this team.");
      } else {
        showError(joinError);
      }
      dispatch(resetJoinStatus());
    }
  }, [joinSuccess, joinError, dispatch]);

  // Instagram-style pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    console.log("🔄 Starting refresh...");
    setRefreshing(true);
    
    try {
      // Create array of promises to run simultaneously
      const promises = [];
      
      // Always fetch team details - don't show error toast during refresh
      if (teamId) {
        console.log("📡 Fetching team details...");
        promises.push(
          dispatch(fetchTeamDetails(teamId)).unwrap()
        );
      }
      
      // Fetch user profile if available
      if (user?._id) {
        console.log("👤 Fetching user profile...");
        promises.push(
          dispatch(fetchMyProfile({ 
            targetUserId: user._id, 
            targetUserType: "User" 
          })).unwrap()
        );
      }
      
      // Wait for all promises to complete
      await Promise.all(promises);
      
      console.log("✅ Refresh completed successfully");
      // Show success toast only after successful refresh
      // showSuccess("Refreshed");
      
    } catch (error) {
      console.error("❌ Failed to refresh data:", error);
      showError("Failed to refresh");
    } finally {
      console.log("🏁 Setting refreshing to false");
      // Always set refreshing to false
      setRefreshing(false);
    }
  }, [dispatch, teamId, user?._id]);


const handleLeaveTeam = useCallback(async () => {
  if (!user?._id || !teamId) {
    showError("Missing user or team information");
    return;
  }

  // If admin is trying to leave but there are other members
  if (isAdmin && teamData.membersCount > 1) {
    showAlert(
      "Cannot Leave Team",
      `To Leave the Team - "${teamDetails?.name}", assign the new admin first `,
      () => {
        // Navigate to members screen to manage members
        router.push(`/(app)/(team)/teams/${teamId}/members` as RelativePathString);
      },
      "Assign"
    );
    return;
  }

  showAlert(
    "Leave Team",
    "Are you sure you want to leave this team?",
    async () => {
      try {
        const result = await dispatch(
          removeTeamMember({
            teamId: teamId,
            userId: user._id,
          })
        ).unwrap();

        showSuccess("You have left the team successfully");
        router.push("/(app)/(tabs)/home");
      } catch (error) {
        showError("Failed to leave the team");
        console.error("Failed to leave team:", error);
      }
    },
    "Leave",
    true
  );
}, [dispatch, teamId, user?._id, router, isAdmin, teamData.membersCount, teamDetails?.name]);





  const handleJoinTeam = useCallback(async () => {
    setJoining(true);
    if (requestSent) {
      showInfo("You have already sent a join request to this team.");
      setJoining(false);
      return;
    }

    if (!user?._id || !teamId) {
      showError("Missing user or team information");
      setJoining(false);
      return;
    }

    try {
      const UserId = user?._id || "";
      setJoining(true);
      await dispatch(sendTeamJoinRequest({ UserId, teamId }));
    } catch (err) {
      console.error("Failed to send request:", err);
      setJoining(false);
    }
  }, [dispatch, requestSent, teamId, user?._id]);

  const handleInvitePress = useCallback(
    (role: string) => {
      modalRef.current?.close();
      router.push(
        `/(app)/(team)/teams/${teamId}/InviteMembers?role=${role}` as RelativePathString
      );
    },
    [router, teamId]
  );


  const isMember = useMemo(
    () =>
      teamDetails?.members?.some(
        (member: any) => member.user?._id === user?._id
      ),
    [teamDetails?.members, user?._id]
  );

  useFocusEffect(
    React.useCallback(() => {
      if (user?._id) {
        dispatch(fetchMyProfile({ 
          targetUserId: user._id, 
          targetUserType: "User" 
        }));
      }
    }, [dispatch, user?._id])
  );

const menuItems = useMemo(() => {
  const baseMenuItems = [
    {
      id: "members",
      label: `Members`,
      logo: () => null,
      color: "white",
      onPress: () =>
        router.push(
          `/(app)/(team)/teams/${teamId}/members` as RelativePathString
        ),
    },
  ];

  // For admin with only 1 member (themselves) - show Delete Team
  if (isAdmin && teamData.membersCount === 1) {
    baseMenuItems.push({
      id: "delete",
      label: "Delete Team",
      logo: LeaveTeam,
      color: "red",
      onPress: () => showAlert(
        "Delete Team",
        "Are you sure you want to delete this team? This action cannot be undone.",
        async () => {
          try {
            await dispatch(deleteTeam(teamId)).unwrap();
            showSuccess("Team deleted successfully");
            router.push("/(app)/(tabs)/home");
          } catch (error) {
            showError("Failed to delete team");
          }
        },
        "Delete",
        true
      ),
    });
  }
  // For admin with more than 1 member - show Leave Team with special logic
  else if (isAdmin && teamData.membersCount > 1) {
    baseMenuItems.push({
      id: "leave",
      label: "Leave Team",
      logo: LeaveTeam,
      color: "red",
      onPress: handleLeaveTeam, // This will show the "manage members first" alert
    });
  }
  // For regular members - show regular Leave Team
  else if (!isAdmin && isMember) {
    baseMenuItems.push({
      id: "leave",
      label: "Leave Team",
      logo: LeaveTeam,
      color: "red",
      onPress: handleLeaveTeam,
    });
  }

  // Admin-specific menu items (settings and invite)
  if (isAdmin) {
    return [
      {
        id: "settings",
        label: "Settings",
        logo: SettingsIcon,
        color: "white",
        onPress: () =>
          router.push(
            `/(app)/(team)/teams/${teamId}/settings` as RelativePathString
          ),
      },
      {
        id: "invite",
        label: "Invite Members",
        logo: InviteMembers,
        color: "white",
        onPress: () => modalRef.current?.open(),
      },
      ...baseMenuItems,
    ];
  }

  return baseMenuItems;
}, [isAdmin, isMember, teamData.membersCount, teamId, router, handleLeaveTeam, dispatch]);

return (
  <PageThemeView style={{ flex: 1, backgroundColor: "black" }}>
    <Toast config={toastConfig} />

  <AlertModal
  isVisible={alertVisible}
  alertConfig={alertConfig}  // Pass the config object directly
/>
    
    {/* Header with Sidebar */}
    <CombinedDrawer
      menuItems={menuItems} 
      isAdmin={isAdmin} 
      isMember={isMember} 
      teamId={teamId} 
      memberCount={teamData.membersCount}
    />

    {/* Main Content */}
    <ScrollView
      showsVerticalScrollIndicator={false}
      ref={scrollViewRef}
      contentContainerStyle={{ flexGrow: 1, paddingTop: HEADER_HEIGHT }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TeamCard
        requestSent={teamData.isRequested}
        teamName={teamData.name}
        sportCategory={teamData.sportName}
        captain={captain}
        viceCapt={viceCapt}
        location={location}
        teamLogo={teamData.logo}
        sportLogo={teamData.sportLogo}
        showJoinButton={!isMember && !isAdmin}
        onJoinPress={handleJoinTeam}
        joining={joining}
      />

      <SubCategories teamDetails={teamDetails} />
    </ScrollView>

    <InviteModal
      modalRef={modalRef}
      roles={roles}
      isAdmin={isAdmin}
      onInvitePress={handleInvitePress}
    />

    {loading && (
      <ActivityIndicator
        size="large"
        color="#000"
        style={{
          paddingTop: 20,
          position: "absolute",
          top: height * 0.4, // Screen height ka 40% - more flexible and lower position
          alignSelf: "center",
        }}
      />
    )}

  </PageThemeView>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  squadContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    paddingVertical: 50,
  },
  loader: {
    alignSelf: "center",
    marginBottom: 10,
  },
  refreshText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default React.memo(TeamPage);