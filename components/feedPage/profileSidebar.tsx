import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Animated,
  Image,
} from "react-native";
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
  const { error, loading, user } = useSelector((state: any) => state?.auth);
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

  const SIDEBAR_WIDTH = 250;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? SIDEBAR_WIDTH : 0;
    const rotateToValue = isSidebarOpen ? 0 : 1;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: rotateToValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <View className="flex-1">
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
          onPress={() => router.push({
            pathname: "/(app)/(main)/addPost",
            options: { animation: 'slide_from_bottom' }, // Specify the animation

          })}
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

        {/* Sidebar Toggle Button */}
        {/* <TouchableOpacity onPress={toggleSidebar}>
          <Animated.View style={{ transform: [{ rotate: barIconRotate }] }}>
            <Icon name="bars" size={30} color="white" />
          </Animated.View>
        </TouchableOpacity> */}
      </View>

      {/* Sidebar Modal */}
      {isSidebarOpen && (
        <View className="absolute top-0 left-0 bottom-0 w-3/4 bg-black bg-opacity-80 z-50 pt-6">
          {/* Close Button */}
          <TouchableOpacity
            onPress={closeSidebar}
            className="absolute top-4 right-4"
          >
            <Icon name="cross" size={30} color="white" />
          </TouchableOpacity>

          {/* Sidebar Content */}
          <View className="flex-1 pt-12">
            {/* Profile Section */}
            <View className="flex-row items-center space-x-4 mb-6 px-6">
              <Image
                source={user?.profilePic ? { uri: user?.profilePic } : defaultPic}
                className="w-16 h-16 rounded-full"
                resizeMode="cover"
              />
              <View className="pl-4">
                <Text className="text-white text-xl font-semibold">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-gray-400 text-lg">@{user?.username}</Text>
              </View>
            </View>

            {/* Sidebar Menu */}
            <View className=" mt-2 py-4 border-t border-[#5C5C5C] px-6">
              <Text className="text-white text-4xl font-bold">
                Manage Teams
              </Text>
              <View className="flex-row mt-4">
                {/* Create Team Button */}
                <View className="border border-[#12956B] px-4 py-2 rounded-md flex-row items-center">
                  <TouchableOpacity
                    onPress={() => router.push("/teams/InitiateCreateTeam")}
                  >
                    <Text className="text-[#12956B] text-md font-semibold">
                      Create Team
                    </Text>
                  </TouchableOpacity>
                  <Icon name="plus" size={15} color="green" />
                </View>

                {/* Join Team Button with Spacing */}
                <View className="ml-4 bg-[#12956B] px-4 py-2 rounded-md items-center">
                  <Text className="text-white text-md font-semibold">
                    Join Team
                  </Text>
                </View>
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
              <Text className="text-white text-5xl font-bold">Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Scrollable Content Area */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {children}
      </ScrollView>
    </View>
  );
};

export default ProfileSidebar;
