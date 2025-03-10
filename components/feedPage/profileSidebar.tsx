import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Animated,
  Image,
  Modal as RNModal,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Entypo";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import defaultPic from "../../assets/images/nopic.jpg";
import { useRouter } from "expo-router";

import { logoutUser } from "~/reduxStore/slices/user/authSlice";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { Platform } from "react-native";
import { ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddPostContainer from "../Cards/AddPostContainer";
import { getTeams } from "~/reduxStore/slices/team/teamSlice";
import CreateTeam from "~/app/(app)/(team)/teams/createTeam";

interface MenuItem {
  label: string;
  onPress: () => void;
}

interface DrawerProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
}

const HEADER_HEIGHT = 60;

const ProfileSidebar: React.FC<DrawerProps> = ({ children, menuItems }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [teamDetails, setTeamDetails] = useState<any>([]);
  const { error, loading, user } = useSelector((state: any) => state?.profile);
  const [isAddPostContainerOpen, setAddPostContainerOpen] =
    useState<boolean>(false);
  const handleLogout = async () => {
    const isAndroid = Platform.OS == "android";
    try {
      const response = await dispatch(logoutUser()).unwrap();
      isAndroid
        ? ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT)
        : Toast.show({
            type: "error",
            text1: "Logged out successfully",
            visibilityTime: 1500,
            autoHide: true,
          });
    } catch (err) {
      console.error("Logout failed:", err);
      isAndroid
        ? ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT)
        : Toast.show({
            type: "error",
            text1: "Logged out successfully",
            visibilityTime: 1500,
            autoHide: true,
          });
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    check();
  }, []);

  const check = async () => {
    const fetchedTeamsData = await dispatch(getTeams()).unwrap();
    const teamsList = fetchedTeamsData.createdTeams.map((teamEntry) => ({
      name: teamEntry.team.name, // Assuming 'name' exists in team object
      url: teamEntry.team.logo.url, // Assuming 'url' exists in team object
      id: teamEntry.team._id,
    }));

    console.log(teamsList); // Logs an array of team names and URLs

    setTeamDetails(teamsList);
  };

  return (
    <SafeAreaView className="flex-1">
      {/* Fixed Header Drawer */}
      <View
        className="flex-row justify-between items-center px-4 py-4 bg-black fixed top-0 left-0 right-0 z-30"
        style={{ height: HEADER_HEIGHT }}
      >
        {/* Avatar Profile Picture */}
        <TouchableOpacity onPress={toggleSidebar}>
          <Image
            source={user?.profilePic ? { uri: user?.profilePic } : defaultPic}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
        </TouchableOpacity>

        {/* Add Post Section */}
        <TouchableOpacity
          style={{
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#141414",
            padding: 6,
            borderRadius: 12,
            width: "72%",
            height: 37,
            justifyContent: "space-between",
            paddingHorizontal: 6,
          }}
          onPress={() => setAddPostContainerOpen(true)}
        >
          <Text
            style={{
              color: "grey",
              fontSize: 14,
              fontWeight: "400",
              marginRight: 6,
            }}
          >
            What's on your mind...
          </Text>
          <Animated.View
            style={{
              width: 25,
              height: 25,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "grey",
              borderRadius: 7,
            }}
          >
            <Feather name="plus" size={15} color="grey" />
          </Animated.View>
        </TouchableOpacity>

        {/* Message Icon */}
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="message-reply-text-outline"
            size={27.5}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Sidebar Modal */}
      {isSidebarOpen && (
        <Modal
          isVisible={isSidebarOpen}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          onBackButtonPress={() => setIsSidebarOpen(false)}
          style={{ margin: 0, padding: 0 }}
        >
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setIsSidebarOpen(false)}
          >
            <View
              className="absolute top-0 left-0 bottom-0 w-3/4 bg-black z-50 pt-6"
              onStartShouldSetResponder={() => true}
            >
              {/* Close Button */}
              <TouchableOpacity
                onPress={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4"
              >
                <Icon name="cross" size={30} color="white" />
              </TouchableOpacity>

              {/* Sidebar Content */}
              <View className="flex-1 pt-12">
                {/* Profile Section */}
                <View className="flex-row items-center space-x-4 mb-6 px-6">
                  <Image
                    source={
                      user?.profilePic ? { uri: user?.profilePic } : defaultPic
                    }
                    className="w-16 h-16 rounded-full"
                    resizeMode="cover"
                  />
                  <View className="pl-4">
                    <Text className="text-white text-xl font-semibold">
                      {user?.firstName} {user?.lastName}
                    </Text>
                    <Text className="text-gray-400 text-lg">
                      @{user?.username}
                    </Text>
                  </View>
                </View>

                {/* Sidebar Menu */}
                <View className=" mt-2 py-4 border-t border-[#5C5C5C] px-6">
                  <Text className="text-white text-4xl font-bold">
                    Manage Teams
                  </Text>

                  <Text className="text-white text-4xl font-semibold mt-2 mb-4 px-6">
                    <View className="">
                      {teamDetails.map((team, index) => (
                        <TouchableOpacity
                          onPress={() =>
                            router.push(`../(team)/teams/${team.id}`)
                          }
                        >
                          <View key={index}>
                            <View className="flex-row items-center mt-4">
                              <Image
                                source={
                                  team.url ? { uri: team.url } : defaultPic
                                }
                                className="w-12 h-12 rounded-full"
                                resizeMode="cover"
                              />
                              <Text className="text-white text-4xl font-semibold ml-4">
                                {team.name}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Text>
                  <View className="flex-row mt-4">
                    {/* Create Team Button */}
                    <View className="border border-[#12956B] px-4 py-2 rounded-md flex-row items-center">
                      <TouchableOpacity
                        onPress={() =>
                          router.push("/(app)/(team)/teams/InitiateCreateTeam")
                        }
                      >
                        <Text className="text-[#12956B] text-md font-semibold">
                          Create Team
                        </Text>
                      </TouchableOpacity>
                      <Icon name="plus" size={15} color="#12956B" />
                    </View>

                    {/* Join Team Button with Spacing */}
                    <TouchableOpacity onPress={() => check()}>
                      <View className="ml-4 bg-[#12956B] px-4 py-2 rounded-md items-center">
                        <Text className="text-white text-md font-semibold">
                          Join Team
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="border-t border-[#5C5C5C] mt-4 py-2 px-6">
                  <Text className="text-white text-4xl font-semibold">
                    Add in Squad
                  </Text>
                </View>
                <View className="border-t border-b border-[#5C5C5C] mt-2 py-2 px-6">
                  <TouchableOpacity onPress={() => handleLogout()}>
                    <Text className="text-white text-4xl font-semibold">
                      Logout
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="p-4">
                <TouchableOpacity className="flex-row items-center border-t border-[#5C5C5C] py-3">
                  <Feather
                    name="settings"
                    size={20}
                    color="white"
                    className="mr-2"
                  />
                  <Text className="text-white text-5xl font-bold">
                    Settings
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Add Post Modal */}
      {isAddPostContainerOpen && (
        <RNModal
          visible={isAddPostContainerOpen}
          animationType="slide"
          onRequestClose={() => setAddPostContainerOpen(false)}
          transparent={true}
        >
          <TouchableOpacity className="flex-1 bg-black" activeOpacity={1}>
            <AddPostContainer
              onBackPress={() => setAddPostContainerOpen(false)}
            />
          </TouchableOpacity>
        </RNModal>
      )}

      {/* Scrollable Content Area */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSidebar;
