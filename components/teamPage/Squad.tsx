import React, { useEffect, useState } from "react";
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
      `/(app)/(team)/teams/${teamId}/InviteMembers?role=${playerType.toLowerCase()}`
    );
  };

  const categorizeMembers = (playerType: string) => {
    return (
      teamDetails.members?.filter((member: any) => {
        const role = member.role?.toLowerCase();
        const playerTypeLower = playerType.toLowerCase();
        
        if (playerTypeLower.includes("rounder")) {
          return role === "all-rounder" || 
                 role === "allrounder" || 
                 role === "member" ||
                 role === "Captain";
        }
        
        
        return role === playerTypeLower;
      }) || []
    );
  };

  const renderMemberSection = (title: string, members: any[], sectionKey: string) => (
    <View key={`section-${sectionKey}`}>
      <Text
        style={{
          fontFamily: "Sansation-Regular",
          color: "#CECECE",
          fontSize: 26,
          marginTop: 16,
        }}
      >
        {title}
      </Text>
      <View className="flex mt-6 mb-5 flex-row flex-wrap">
        {members.length > 0 ? (
          members.map((member) => {
            const user = member.user;
            const memberKey = member._id || `member-${Math.random().toString(36).substr(2, 9)}`;
            
            return (
              <View
                key={memberKey}
                className="w-1/2 p-1"
              >
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMember(member);
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
                    onRemove={() => console.log("Remove user:", user?._id)}
                  />
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
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
        )}
      </View>
    </View>
  );

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
        <View
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
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThreeDot />
          </TouchableOpacity>
        </View>

        {teamDetails?.sport?.playerTypes?.map((playerType: any) =>
          renderMemberSection(
            playerType.name,
            categorizeMembers(playerType.name),
            playerType._id || playerType.name
          )
        )}

        <DownwardDrawer
          visible={showDownwardDrawer}
          onClose={() => setShowDownwardDrawer(false)}
          member={selectedMember}
        />
      </ScrollView>
    </View>
  );
};

export default Squad;

const styles = StyleSheet.create({});