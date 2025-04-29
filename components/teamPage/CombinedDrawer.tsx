import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { RelativePathString, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackIcon from "../SvgIcons/Common_Icons/BackIcon";
import { resetTeamState } from "~/reduxStore/slices/team/teamSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";

interface MenuItem {
  label: string;
  onPress: () => void;
  color?: string;
  isMember: boolean;
  isAdmin:boolean;
  logo?: React.ComponentType<any>;

}

interface DrawerProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
  teamId: string;
}

const HEADER_HEIGHT = 40;

const CombinedDrawer: React.FC<DrawerProps> = ({
  children,
  menuItems,
  isMember, 
  isAdmin,
  teamId,
}) => {
  const SIDEBAR_WIDTH = 200;
  const dispatch = useDispatch<AppDispatch>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  // const { width } = Dimensions.get('window');

  // Toggle Sidebar visibility
  const toggleSidebar = () => {
    if (isSidebarOpen) {
      // Close sidebar
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SIDEBAR_WIDTH,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsSidebarOpen(false);
      });
    } else {
      // Open sidebar
      setIsSidebarOpen(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SIDEBAR_WIDTH - 200,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Function to close sidebar
  const closeSidebar = () => {
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  const barIconRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const handleBackFromTeamPage = () => {
    router.push("/(app)/(tabs)/home");
    dispatch(resetTeamState());
  };

  return (
    <SafeAreaView className="flex-1">
      {/* Fixed Header Drawer */}
      <View
        className="flex-row justify-between items-center px-4 py-1 bg-black top-0 left-0 right-0 z-30"
        style={{ height: HEADER_HEIGHT }}
      >
        <TouchableOpacity onPress={handleBackFromTeamPage}>
          <BackIcon />
        </TouchableOpacity>
        {
          isMember || isAdmin?
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
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSidebar}>
            <Animated.View style={{ transform: [{ rotate: barIconRotate }] }}>
              <Icon name="bars" size={24} color="white" />
            </Animated.View>
          </TouchableOpacity>
        </View>
        :<></>
}
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        scrollEnabled={!isSidebarOpen} // Disable scrolling when drawer is open
      >
        {children}
      </ScrollView>

      {/* Drawer System - Only rendered when needed */}
      {isSidebarOpen && (
        <>
          {/* Overlay */}
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              opacity: opacityAnim,
              zIndex: 15,
            }}
          >
            <TouchableWithoutFeedback onPress={closeSidebar}>
              <View style={{ width: "100%", height: "100%" }} />
            </TouchableWithoutFeedback>
          </Animated.View>

          {/* Sidebar */}
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              width: 200,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              zIndex: 20,
              transform: [{ translateX: slideAnim }],
            }}
          >
            <View className="flex-1 mt-10 pt-[72px]">
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    item.onPress();
                    closeSidebar();
                  }}
                  className="py-4 pl-5 border-b border-gray-600"
                >
                  <View className="flex flex-row justify-between mr-4">
                    <Text
                      style={{ color: item.color || "white", fontSize: 16 }}
                    >
                      {item.label}
                    </Text>
                    {item?.logo && (
                      <item.logo
                        width={32}
                        height={32}
                        fill="white"
                        className="mr-2"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CombinedDrawer;
