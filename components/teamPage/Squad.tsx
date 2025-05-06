import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import TeamMember from "./TeamMember";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";
import ThreeDot from "~/components/SvgIcons/teams/ThreeDot";
import DownwardDrawer from "@/components/teamPage/DownwardDrawer";
import Nopic from "../../assets/images/nopic.jpg";
import UserInfoModal from "../modals/UserInfoModal";

interface SquadProps {
  teamDetails: any;
}

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
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">Loading team details...</Text>
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
    // Don't render the section at all if there are no members and user is not an admin
    if (members.length === 0 && !isAdmin) {
      return null;
    }
  
    return (
      <View key={`section-${sectionKey}`}>
        {/* Only show title if there are members OR if user is admin */}
        {(members.length > 0 || isAdmin) && (
          <Text
            style={{
              fontFamily: "Sansation-Regular",
              color: "#CECECE",
              fontSize: 24,
              marginTop: 16,
              marginLeft: 14,
            }}
          >
            {title}
          </Text>
        )}
        
        <View className="flex mt-6 mb-5 flex-row flex-wrap">
          {members.length > 0 ? (
            // If members exist, render them without "Add Member" button
            members.map((member) => {
              const user = {...member.user, role: member.role, position: member.position};
              const memberKey = member._id || `member-${Math.random().toString(36).substr(2, 9)}`;
              const profilePic = user?.profilePic ? { uri: user.profilePic } : Nopic;
              return (
                <View
                  key={memberKey}
                  className="w-1/2 px-2 pb-4"
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
                    />
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            // Show "Add Member" button ONLY if user is an admin and this player type has no members
            isAdmin && (
              <TouchableOpacity
                key={`add-${sectionKey}`}
                className="w-1/2 p-2"
                onPress={() => handleAddMember(title)}
              >
                <View className="flex justify-center h-[180] w-[170] border border-gray-700 items-center rounded-lg">
                  <Text
                    style={{
                      color: "white",
                      fontSize: 30,
                      fontFamily: "Sansation-Regular",
                    }}
                  >
                    +
                  </Text>
                  <Text style={{ color: "white", fontFamily: "Sansation-Regular" }}>
                    Add {title}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    );
  };

  return (
    <View>
      <ScrollView
        style={{
          flex: 1,
          maxWidth: "100%",
          paddingHorizontal: 12,
          backgroundColor: "#0B0B0B",
          maxHeight: "100%",
          paddingBottom: 80,
        }}
      >
        {(isMember || isAdmin) &&  ( <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            paddingHorizontal: 16,
            top: 36,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push(`/(app)/(team)/teams/${teamId}/members`)}
            activeOpacity={0.7}
            style={{
              zIndex: 90,
              padding: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThreeDot />
          </TouchableOpacity>
        </View>)}
       

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
      </ScrollView>
    </View>
  );
};

export default Squad;

const styles = StyleSheet.create({});