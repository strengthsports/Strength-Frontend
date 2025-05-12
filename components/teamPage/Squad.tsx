import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import TeamMember from "./TeamMember";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";
import ThreeDot from "~/components/SvgIcons/teams/ThreeDot";
import DownwardDrawer from "@/components/teamPage/DownwardDrawer";
import Nopic from "../../assets/images/nopic.jpg";
import UserInfoModal from "../modals/UserInfoModal";
import TextScallingFalse from "../CentralText";

interface SquadProps {
  teamDetails: any;
}

const { width } = Dimensions.get("window");

const Squad: React.FC<SquadProps> = ({ teamDetails }) => {
  const [fontsLoaded] = useFonts({
    "Sansation-Regular": require("../../assets/fonts/Sansation_Bold_Italic.ttf"),
  });
  const router = useRouter();
  const params = useLocalSearchParams();
  const teamId = params.teamId ? String(params.teamId) : "";
  const { user } = useSelector((state: any) => state?.profile);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDownwardDrawer, setShowDownwardDrawer] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Responsive calculations
  const isSmallScreen = width < 375; // iPhone SE and similar small devices
  const isMediumScreen = width >= 375 && width < 414; // Most phones
  const isLargeScreen = width >= 414; // Larger phones and small tablets

  // Adjust member card width based on screen size
  const memberCardWidth = isSmallScreen ? "50%" : isMediumScreen ? "50%" : "33%";
  const memberCardHeight = isSmallScreen ? 160 : isMediumScreen ? 180 : 200;
  const memberCardImageSize = isSmallScreen ? 70 : isMediumScreen ? 80 : 90;
  const titleFontSize = isSmallScreen ? 20 : isMediumScreen ? 22 : 24;

  useEffect(() => {
    if (teamDetails && teamDetails.admin) {
      const adminCheck = teamDetails.admin.some(
        (admin: any) => admin._id === user?._id
      );
      setIsAdmin(adminCheck);
    }
  }, [teamDetails, user?._id]);

  const isMember = useMemo(
    () =>
      teamDetails?.members?.some(
        (member: any) => member.user?._id === user?._id
      ),
    [user?._id]
  );

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="white" />;
  }

  if (!teamDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
        <TextScallingFalse style={styles.loadingText}>
          Loading team details...
        </TextScallingFalse>
      </View>
    );
  }

  const handleAddMember = (playerType: string) => {
    router.push(
      `/(app)/(team)/teams/${teamId}/InviteMembers?role=${playerType}`
    );
  };

  const categorizeMembers = (playerType: string) => {
    return (
      teamDetails.members?.filter((member: any) => {
        const role = member.role?.toLowerCase();
        const playerTypeLower = playerType.toLowerCase();
        
        if (playerTypeLower.includes("Rounder")) {
          return role === "All-Rounders" || 
                 role === "allrounder" || 
                 role === "member" ||
                 role === "Captain";
        }
        
        return role === playerTypeLower;
      }) || []
    );
  };

  const renderMemberSection = (title: string, members: any[], sectionKey: string) => {
    if (members.length === 0 && !isAdmin) {
      return null;
    }
  
    return (
      <View key={`section-${sectionKey}`} style={styles.sectionContainer}>
        {(members.length > 0 || isAdmin) && (
          <TextScallingFalse
            style={[styles.sectionTitle, { fontSize: titleFontSize }]}
          >
            {title}
          </TextScallingFalse>
        )}
        
        <View style={styles.membersContainer}>
          {members.length > 0 ? (
            members.map((member) => {
              const user = {...member.user, role: member.role, position: member.position};
              const memberKey = member._id || `member-${Math.random().toString(36).substr(2, 9)}`;
              const profilePic = user?.profilePic ? { uri: user.profilePic } : Nopic;
              
              return (
                <View
                  key={memberKey}
                  style={[styles.memberWrapper, { width: memberCardWidth }]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedMember(user);
                      setShowDownwardDrawer(true);
                    }}
                  >
                    <TeamMember
                      key={`team-member-${memberKey}`}
                      imageUrl={user?.profilePic}
                      name={`${user?.firstName || "Unknown"} ${user?.lastName || ""}`}
                      isCaptain={member.position?.toLowerCase() === "captain"}
                      isViceCaptain={member.position?.toLowerCase() === "vicecaptain"}
                      description={user?.headline || "No description available"}
                      isAdmin={isAdmin}
                      username={user?.username}
                      onRemove={() => console.log("Remove user:", user?._id)}
                      imageSize={memberCardImageSize}
                      cardHeight={memberCardHeight}
                    />
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            isAdmin && (
              <TouchableOpacity
                key={`add-${sectionKey}`}
                style={[styles.addMemberButton, { width: memberCardWidth }]}
                onPress={() => handleAddMember(title)}
              >
                <View style={[styles.addMemberContainer, { height: memberCardHeight }]}>
                  <TextScallingFalse style={styles.addMemberPlus}>
                    +
                  </TextScallingFalse>
                  <TextScallingFalse style={styles.addMemberText}>
                    Add {title}
                  </TextScallingFalse>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.scrollView}
        // contentContainerStyle={styles.scrollContent}
      >
        {(isMember || isAdmin) && (
          <View style={styles.threeDotContainer}>
            <TouchableOpacity
              onPress={() => router.push(`/(app)/(team)/teams/${teamId}/members`)}
              activeOpacity={0.7}
              style={styles.threeDotButton}
            >
              <ThreeDot />
            </TouchableOpacity>
          </View>
        )}
       
        {teamDetails?.sport?.playerTypes?.map((playerType: any) =>
          renderMemberSection(
            playerType.name,
            categorizeMembers(playerType.name),
            playerType._id || playerType.name
          )
        )}

        <UserInfoModal
          visible={showDownwardDrawer}
          onClose={() => setShowDownwardDrawer(false)}
          member={selectedMember}
          isTeam={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 16,
  },
  sectionContainer: {
    marginTop: -12,
    marginBottom:18,
  },
  sectionTitle: {
    fontFamily: "Sansation-Regular",
    color: "#CECECE",
    marginLeft: 14,
  },
  membersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    marginBottom: 20,
  },
  memberWrapper: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  addMemberButton: {
    padding: 8,
  },
  addMemberContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151", // gray-700 equivalent
    borderRadius: 8,
  },
  addMemberPlus: {
    color: "white",
    fontSize: 30,
    fontFamily: "Sansation-Regular",
  },
  addMemberText: {
    color: "white",
    fontFamily: "Sansation-Regular",
  },
  threeDotContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginTop: 36,
  },
  threeDotButton: {
    zIndex: 90,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Squad;