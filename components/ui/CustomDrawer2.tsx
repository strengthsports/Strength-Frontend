import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import TextScallingFalse from "../CentralText";
import SportsIndicator from "../SvgIcons/SideMenu/SportsIndicator";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import { fetchTeams, TeamsList } from "~/reduxStore/slices/team/teamSlice";
import nopic from "@/assets/images/nopic.jpg";

interface Team {
  id: string;
  name: string;
  url: string;
  sport: string;
  members?: any[];
}

const CustomDrawer2 = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const isNavigatingRef = useRef(false);

  const [showAllTeams, setShowAllTeams] = useState(false);

  const user = useSelector((state: RootState) => state.profile.user);
  const teams = useSelector((state: RootState) => state.team.teams);
  const [teamList, setTeamList] = useState<TeamsList[]>([]);
  const processTeams = () => {
    const uniqueTeams = new Map<string, Team>();

    [...(teams?.createdTeams || []), ...(teams?.joinedTeams || [])].forEach(
      (teamEntry) => {
        if (teamEntry.team && !uniqueTeams.has(teamEntry.team._id)) {
          uniqueTeams.set(teamEntry.team._id, {
            name: teamEntry.team.name,
            sportname: teamEntry.team.sportname,
            url: teamEntry.team.logo?.url || "",
            id: teamEntry.team._id,
            membersLength: teamEntry.team.membersLength,
          });
        }
      }
    );

    setTeamList(Array.from(uniqueTeams.values()));
  };

  useEffect(() => {
    dispatch(fetchTeams());
  }, []);

  useEffect(() => {
    if (isFocused) {

      console.log('Drawer screen is focused, refreshing data...');
      dispatch(fetchTeams());
    }
  }, [isFocused]);

  useEffect(() => {
    processTeams();
  }, [teams]);

  const visibleTeams = showAllTeams ? teamList : teamList.slice(0, 5);
  const handleTeamPress = (teamId) => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;

    router.push(`../(team)/teams/${teamId}`);

    // allow navigation again after 1 second
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };
  return (
    <SafeAreaView
      className={`w-full h-full bg-[#101010] ${Platform.OS === "ios" ? "pt-10" : "pt-4"
        }`}
      style={{ justifyContent: "space-between" }}
    >
      <ScrollView className="flex-1 pt-12">
        {/* Profile Section */}
        <TouchableOpacity
          onPress={() => {
            router.push("/(app)/(tabs)/profile");
          }}
          activeOpacity={0.7}
          className="flex-row items-center pb-8 mb-6"
          style={{
            width: "85%",
            marginHorizontal: "auto",
            borderBottomWidth: 1,
            borderColor: "#404040",
          }}
        >
          <Image
            source={user?.profilePic ? { uri: user.profilePic } : nopic}
            className="w-14 h-14 rounded-full border-[1px] border-[#202020]"
            resizeMode="cover"
          />
          <View className="pl-4">
            <TextScallingFalse className="text-white text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </TextScallingFalse>
            <View style={{ width: 130 }}>
              <TextScallingFalse
                numberOfLines={2}
                ellipsizeMode="tail"
                className="text-gray-400 text-lg"
              >
                @{user?.username} | {user?.headline}
              </TextScallingFalse>
            </View>
          </View>
        </TouchableOpacity>

        {/* <CustomDivider
              color="#5C5C5C"
              thickness={1}
              style={{ width: "90%", opacity: 0.5, alignSelf: "center" }}
            /> */}
        {/* Teams Section */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 8, gap: 8 }}>
          <TextScallingFalse
            className="text-white text-4xl mb-4"
            style={{ fontWeight: "500" }}
          >
            Manage Teams
          </TextScallingFalse>

          {visibleTeams.map((team, index) => (
            <TouchableOpacity
              key={team.id}
              activeOpacity={0.7}
              onPress={() => handleTeamPress(team.id)}
              className={`mb-${index === visibleTeams.length - 1 ? 4 : 2}`}
            >
              <View
                style={{
                  width: 210,
                  flexDirection: "row",
                  gap: 15,
                  alignItems: "center",
                }}
              >
                <View
                  style={{ borderWidth: 1.5, borderColor: "#202020" }}
                  className="rounded-lg"
                >
                  <Image
                    source={{ uri: team.url }}
                    className="w-12 h-12 rounded-md"
                    resizeMode="cover"
                  />
                </View>
                <View style={{ gap: 4 }}>
                  <TextScallingFalse
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="text-white text-xl font-medium"
                    style={{ fontWeight: "500" }}
                  >
                    {team.name}
                  </TextScallingFalse>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        gap: 4,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <SportsIndicator />
                      <TextScallingFalse
                        style={{
                          color: "#12956B",
                          fontSize: 12,
                          fontWeight: "500",
                        }}
                      >
                        {team.sportname}
                      </TextScallingFalse>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {teamList.length > 5 && (
            <TouchableOpacity
              onPress={() => {
                router.push(
                  "/(app)/(profile)/edit-overview/(modal)/current-team"
                );
              }}
            >
              <TextScallingFalse
                className="text-2xl font-semibold"
                style={{ color: "gray" }}
              >
                See all
              </TextScallingFalse>
            </TouchableOpacity>
          )}

          {teamList.length === 0 && (
            <View className="flex-row mb-2 mt-2">
              <TouchableOpacity
                onPress={() => {
                  router.push("/(app)/(team)/teams");
                }}
                className="border border-[#12956B] px-3 py-[5px] gap-1 rounded-md flex-row items-center mr-4"
              >
                <TextScallingFalse className="text-[#12956B] text-sm font-semibold">
                  Create Team
                </TextScallingFalse>
                <AntDesign name="plus" size={10} color="#12956B" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  router.push("/(app)/(team)/join-team");
                }}
                className="bg-[#303030] px-3 py-2 rounded-md"
              >
                <TextScallingFalse className="text-white text-sm font-semibold">
                  Join Team
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      {/* Settings and Logout */}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {/* <CustomDivider
              color="#5C5C5C"
              thickness={1}
              style={{ width: "90%", opacity: 0.5, alignSelf: "center" }}
            /> */}
        <View
          style={{
            height: 140,
            borderTopWidth: 1,
            paddingVertical: 20,
            borderTopColor: '#404040',
            width: "85%",
          }}
        >
          <TouchableOpacity
            className="flex-row items-center mb-4"
            style={{ paddingLeft: 5 }}
            onPress={() => {
              router.push("/(app)/(settings)/settings");
            }}
            activeOpacity={0.5}
          >
            <Feather name="settings" size={20} color="white" />
            <TextScallingFalse className="text-white text-4xl font-medium ml-2">
              Settings
            </TextScallingFalse>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center"
            style={{ paddingLeft: 5 }}
            onPress={() => {
              router.push("/(app)/(settings)/FeedBack/feedback2");
            }}
            activeOpacity={0.5}
          >
            <MaterialIcons name="feedback" size={15} color="white" className="ml-1" />
            <TextScallingFalse className="text-neutral-500 text-2xl ml-2 mb-1">
              Feedback
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawer2;

const styles = StyleSheet.create({});
