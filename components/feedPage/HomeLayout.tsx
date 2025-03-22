import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Animated,
  Image,
  Modal as RNModal,
  Pressable,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Entypo";
import {
  MaterialCommunityIcons,
  Feather,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import defaultPic from "../../assets/images/nopic.jpg";
import { useNavigation, useRouter } from "expo-router";
import nopic from "@/assets/images/nopic.jpg";
import { logoutUser } from "~/reduxStore/slices/user/authSlice";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { Platform } from "react-native";
import { ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddPostContainer from "../modals/AddPostContainer";
import { getTeams } from "~/reduxStore/slices/team/teamSlice";
import CustomDrawer, { DrawerRefProps } from "../ui/CustomDrawer";
import { StyleSheet } from "react-native";
import EdgeSwipe from "../ui/EdgeSwipe";
import CustomDivider from "../ui/CustomDivider";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

interface MenuItem {
  label: string;
  onPress: () => void;
}

const menuItems = [
  {
    label: "Add in squad",
    onPress: () => console.log("/teams/edit/editTeam"), // Example function for "Home"
  },
  {
    label: "Add Members",
    onPress: () => console.log("/teams/edit/members"), // Example function for "Settings"
  },
  {
    label: "Logout",
    onPress: () => console.log("Logout clicked!"), // Example function for "Logout"
  },
];

const HEADER_HEIGHT = 60;

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [teamDetails, setTeamDetails] = useState<any>([]);
  const { error, loading, user } = useSelector((state: any) => state?.profile);

  const navigation = useNavigation();

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

  useEffect(() => {
    check();
  }, []);

  const check = async () => {
    const fetchedTeamsData = await dispatch(getTeams()).unwrap();
    const teamsList = fetchedTeamsData.createdTeams
      .concat(fetchedTeamsData.joinedTeams)
      .map((teamEntry) => ({
        name: teamEntry.team.name, // Assuming 'name' exists in team object
        url: teamEntry.team.logo.url, // Assuming 'url' exists in team object
        id: teamEntry.team._id,
      }));

    console.log(teamsList); // Logs an array of team names and URLs

    setTeamDetails(teamsList);
  };

  const drawerRef = useRef<DrawerRefProps>(null);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleOpenDrawer = () => {
    drawerRef.current?.open();
    setDrawerOpen(true);
  };

  // Called when an edge swipe is detected
  const handleEdgeSwipe = () => {
    drawerRef.current?.open();
  };

  const handleCloseDrawer = () => {
    drawerRef.current?.close();
    setDrawerOpen(false);
  };

  return (
    <SafeAreaView className="flex-1">
      {isDrawerOpen && (
        <Pressable style={styles.overlay} onPress={handleCloseDrawer} />
      )}
      {/* Fixed Header Drawer */}
      <View
        className="flex-row justify-between items-center px-4 py-4 bg-black fixed top-0 left-0 right-0 z-30 border-b-[0.5px] border-[#525252]"
        style={{ height: HEADER_HEIGHT }}
      >
        {/* Avatar Profile Picture */}
        <TouchableOpacity onPress={handleOpenDrawer}>
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
            width: "75%",
            height: 37,
            justifyContent: "space-between",
            paddingHorizontal: 6,
          }}
          // onPress={() => setAddPostContainerOpen(true)}
          onPress={() => router.push("/addPost")}
        >
          <Text
            style={{
              color: "grey",
              fontSize: 14,
              fontWeight: "400",
              marginLeft: 6,
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

      {/* Render the custom drawer */}
      <CustomDrawer ref={drawerRef} onClose={() => setDrawerOpen(false)}>
        <View
          className="w-full h-full bg-black pt-6"
          onStartShouldSetResponder={() => true}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleCloseDrawer}
            className="absolute top-4 right-4"
          >
            <Ionicons name="close" size={25} color="white" />
          </TouchableOpacity>

          {/* Sidebar Content */}
          <View className="flex-1 pt-12">
            {/* Profile Section */}
            <View className="flex-row items-center justify-start pl-6 space-x-4 mb-6">
              <Image
                source={user.profilePic ? { uri: user.profilePic } : nopic} // replace with user?.profilePic or defaultPic
                className="w-14 h-14 rounded-full"
                resizeMode="cover"
              />
              <View className="pl-4">
                <Text className="text-white text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </Text>
                <Text className="text-gray-400 text-lg">@{user.username}</Text>
              </View>
            </View>

            <CustomDivider
              color="#5C5C5C"
              thickness={0.2}
              style={{ marginHorizontal: "auto", width: "90%", opacity: 0.5 }}
            />

            {/* Teams section */}
            <View className="mt-2 w-[90%] mx-auto">
              <Text className="text-white text-4xl font-bold">
                Manage Teams
              </Text>

              {teamDetails.map((team: any, index: any) => (
                <View
                  className={
                    index === teamDetails.length - 1 ? "mb-4 mx-2" : "mb-2 mx-2"
                  }
                  key={index}
                >
                  {/* Replace teamDetails mapping with your data */}
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      router.push(`../(team)/teams/${team.id}`);
                      handleCloseDrawer();
                    }}
                  >
                    <View className="flex-row items-center mt-4">
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
                </View>
              ))}

              <View className="flex-row mb-4 px-3">
                {/* Create Team Button */}
                <View className="border border-[#12956B] px-3 py-1 rounded-md flex-row items-center">
                  <TouchableOpacity
                    onPress={() => {
                      router.push("/(app)/(team)/teams/InitiateCreateTeam");
                      handleCloseDrawer();
                    }}
                  >
                    <Text className="text-[#12956B] text-base font-semibold">
                      Create Team
                    </Text>
                  </TouchableOpacity>
                  <AntDesign
                    className="ml-1"
                    name="plus"
                    size={10}
                    color="#12956B"
                  />
                </View>

                {/* Join Team Button */}
                <TouchableOpacity
                  onPress={() => {
                    // your join team logic here
                  }}
                  className="ml-4"
                >
                  <View className="bg-[#12956B] px-4 py-2 rounded-md items-center">
                    <Text className="text-white text-base font-semibold">
                      Join Team
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <CustomDivider
                color="#5C5C5C"
                thickness={0.2}
                style={{
                  marginHorizontal: "auto",
                  width: "100%",
                  opacity: 0.5,
                }}
              />
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="mb-2 w-[90%] mx-auto"
            >
              <Text className="text-white text-4xl font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>

          <CustomDivider
            color="#5C5C5C"
            thickness={0.2}
            style={{ marginHorizontal: "auto", width: "90%", opacity: 0.5 }}
          />

          <View className="pb-24 w-[90%] mx-auto">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => {
                router.push("/(app)/(settings)/settings");
                handleCloseDrawer();
              }}
            >
              <Feather
                name="settings"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="text-white text-4xl font-medium">Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomDrawer>

      {/* Render the edge swipe detector */}
      <EdgeSwipe onSwipe={handleEdgeSwipe} />

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

      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black", // Color overlay when bottom sheet is open
    opacity: 0.5, // Adjust opacity as needed
    zIndex: 50,
  },
});

export default HomeLayout;
