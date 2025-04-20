// DrawerContext.tsx
import React, {
  createContext,
  useContext,
  useRef,
  ReactNode,
  useState,
  useEffect,
} from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import CustomDrawer, { DrawerRefProps } from "~/components/ui/CustomDrawer";
import nopic from "@/assets/images/nopic.jpg";
import { useRouter } from "expo-router";
import { RootState } from "~/reduxStore";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams } from "~/reduxStore/slices/team/teamSlice";
import CustomDivider from "~/components/ui/CustomDivider";
import { logoutUser } from "~/reduxStore/slices/user/authSlice";
import Toast from "react-native-toast-message";
import TextScallingFalse from "~/components/CentralText";

interface DrawerContextProps {
  handleOpenDrawer: () => void;
  handleCloseDrawer: () => void;
  isDrawerOpen: boolean;
}

interface Team {
  id: string;
  name: string;
  url: string;
}

const DrawerContext = createContext<DrawerContextProps>({
  handleOpenDrawer: () => { },
  handleCloseDrawer: () => { },
  isDrawerOpen: false,
});

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const drawerRef = useRef<DrawerRefProps>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAllTeams, setShowAllTeams] = useState(false);

  const user = useSelector((state: RootState) => state.profile.user);
  const teams = useSelector((state: RootState) => state.team.teams);
  const [teamList, setTeamList] = useState<Team[]>([]);

  const handleOpenDrawer = () => {
    drawerRef.current?.open();
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    drawerRef.current?.close();
    setIsDrawerOpen(false);
  };

  const processTeams = () => {
    const uniqueTeams = new Map<string, Team>();

    [...(teams?.createdTeams || []), ...(teams?.joinedTeams || [])].forEach((teamEntry) => {
      if (teamEntry.team && !uniqueTeams.has(teamEntry.team._id)) {
        uniqueTeams.set(teamEntry.team._id, {
          name: teamEntry.team.name,
          url: teamEntry.team.logo?.url || "",
          id: teamEntry.team._id,
        });
      }
    });

    setTeamList(Array.from(uniqueTeams.values()));
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      if (Platform.OS === "android") {
        ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
      } else {
        Toast.show({
          type: "success",
          text1: "Logged out successfully",
          visibilityTime: 1500,
        });
      }
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchTeams());
  }, [isDrawerOpen]);

  useEffect(() => {
    processTeams();
  }, [teams]);

  const visibleTeams = showAllTeams ? teamList : teamList.slice(0, 4);

  return (
    <DrawerContext.Provider
      value={{ handleOpenDrawer, handleCloseDrawer, isDrawerOpen }}
    >
      <CustomDrawer
        ref={drawerRef}
        onClose={handleCloseDrawer}
        onOpen={handleOpenDrawer}
      >
        <View className="w-full h-full bg-black pt-4">

          <ScrollView className="flex-1 pt-12">
            {/* Profile Section */}
            <View className="flex-row items-center pl-6 mb-6">
              <Image
                source={user?.profilePic ? { uri: user.profilePic } : nopic}
                className="w-14 h-14 rounded-full"
                resizeMode="cover"
              />
              <View className="pl-4">
                <TextScallingFalse className="text-white text-xl font-semibold">
                  {user?.firstName} {user?.lastName}
                </TextScallingFalse>
                <TextScallingFalse numberOfLines={2} className="text-gray-400 text-lg" style={{width:'35%'}}>
                  @{user?.username} | {user?.headline}
                </TextScallingFalse>
              </View>
            </View>

            <CustomDivider
              color="#5C5C5C"
              thickness={0.2}
              style={{ width: '90%', opacity: 0.5, alignSelf: 'center' }}
            />

            {/* Teams Section */}
            <View style={{ paddingHorizontal: 24 }}>
              <TextScallingFalse className="text-white text-4xl font-bold mb-4">
                Manage Teams
              </TextScallingFalse>

              {visibleTeams.map((team, index) => (
                <TouchableOpacity
                  key={team.id}
                  onPress={() => {
                    router.push(`../(team)/teams/${team.id}`);
                    handleCloseDrawer();
                  }}
                  className={`mb-${index === visibleTeams.length - 1 ? 4 : 2}`}
                >
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: team.url }}
                      className="w-10 h-10 rounded-full"
                      resizeMode="cover"
                    />
                    <Text className="text-white text-3xl font-medium ml-4">
                      {team.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {teamList.length > 4 && (
                <TouchableOpacity
                  onPress={() => setShowAllTeams(!showAllTeams)}
                  className="mt-2"
                >
                  <Text className="text-white text-2xl font-semibold">
                    {showAllTeams ? "See Less" : "See More"}
                  </Text>
                </TouchableOpacity>
              )}

              <View className="flex-row mb-2 mt-2">
                <TouchableOpacity
                  onPress={() => {
                    router.push("/(app)/(team)/teams");
                    handleCloseDrawer();
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
                    handleCloseDrawer();
                  }}
                  className="bg-[#303030] px-3 py-2 rounded-md"
                >
                  <Text className="text-white text-sm font-semibold">
                    Join Team
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Settings and Logout */}
              <TouchableOpacity
                className="flex-row items-center py-6"
                onPress={() => {
                  router.push("/(app)/(settings)/settings");
                  handleCloseDrawer();
                }}
              >
                <Feather name="settings" size={20} color="white" />
                <Text className="text-white text-4xl font-medium ml-2">
                  Settings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center"
              >
                <Ionicons name="log-out-outline" size={20} color="white" />
                <Text className="text-white text-4xl font-semibold ml-2">
                  Logout
                </Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </View>
      </CustomDrawer>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};