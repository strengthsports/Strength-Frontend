import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { RelativePathString, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface MenuItem {
  label: string;
  onPress: () => void; // Function to be called when this item is clicked
}

interface DrawerProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
  teamId: string; // Accepting menu items as an array of objects
}

const HEADER_HEIGHT = 60; // Adjust this height based on your drawer's height

const CombinedDrawer: React.FC<DrawerProps> = ({
  children,
  menuItems,
  teamId,
}) => {
  const SIDEBAR_WIDTH = 250;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const router = useRouter();

  // Toggle Sidebar visibility
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

  // Close Sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const barIconRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <SafeAreaView className="flex-1">
      {/* Fixed Header Drawer */}
      <View
        className="flex-row justify-between items-center px-4 py-4 bg-black fixed top-0 left-0 right-0 z-30"
        style={{ height: HEADER_HEIGHT }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrowleft" size={30} color="white" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-x-5">
          <TouchableOpacity
            onPress={() =>
              router.push(
                `/(app)/(team)/teams/${teamId}/team-forum` as RelativePathString
              )
            }
          >
            <MaterialCommunityIcons
              name="message-reply-text-outline"
              size={27.5}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSidebar}>
            <Animated.View style={{ transform: [{ rotate: barIconRotate }] }}>
              <Icon name="bars" size={30} color="white" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sidebar Modal */}
      {isSidebarOpen && (
        <View className="absolute top-0 right-0  bottom-0 w-[200px] bg-black bg-opacity-80 z-20">
          <TouchableOpacity
            onPress={closeSidebar}
            className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-5"
          ></TouchableOpacity>
          <View className="flex-1 mt-10 bg-black pt-[72px]">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  item.onPress();
                  closeSidebar();
                  toggleSidebar();
                }}
                className="py-4 pl-5  border-b  border-gray-600"
              >
              <View className="flex flex-row justify-between mr-4">
              <Text style={{ color: item.color, fontSize: 16 }}>{item.label}</Text>
              {item?.logo && <item.logo width={24} height={24} fill="white" className="mr-2" />}
             

              </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Scrollable Content Area */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CombinedDrawer;
