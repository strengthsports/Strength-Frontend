import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Animated,
  TouchableWithoutFeedback,
  Platform,
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
  logo?: React.ComponentType<any>;
  id?: string;
}

interface DrawerProps {
  menuItems: MenuItem[];
  teamId: string;
  isAdmin: boolean;
  isMember: boolean;
  memberCount: number;
}

const HEADER_HEIGHT = 30;
const SIDEBAR_WIDTH = 200;

const CombinedDrawer: React.FC<DrawerProps> = ({
  menuItems,
  isAdmin,
  isMember,
  teamId,
  memberCount,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const toggleSidebar = () => {
    if (isSidebarOpen) {
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
      setIsSidebarOpen(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
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

  const closeSidebar = () => {
    if (isSidebarOpen) toggleSidebar();
  };

  const barIconRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const handleBackFromTeamPage = () => {
    router.back();
    dispatch(resetTeamState());
  };

  return (
    <>
      {/* Header */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 4,
          backgroundColor: "black",
          height: HEADER_HEIGHT,
        }}
      >
        <TouchableOpacity
          heatSlop={{ top: 10, bottom: 50, left: 10, right: 100 }}
          onPress={handleBackFromTeamPage}
        >
          <BackIcon />
        </TouchableOpacity>

        {(isMember || isAdmin) && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
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
        )}
      </View>

      {/* Sidebar Overlay and Menu */}
      {isSidebarOpen && (
        <>
          {/* Black Overlay Background */}
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              opacity: opacityAnim,
              zIndex: 95,
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
              width: SIDEBAR_WIDTH,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              zIndex: 100,
              transform: [{ translateX: slideAnim }],
              paddingTop: Platform.select({
                ios: HEADER_HEIGHT + 30,
                android: HEADER_HEIGHT + 24,
              }),
              shadowColor: "#000",
              shadowOffset: {
                width: -2,
                height: 0,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              // borderLeftWidth: 1,
              // borderLeftColor: "#333",
            }}
          >
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 40,
              }}
              showsVerticalScrollIndicator={false}
            >
              {menuItems && menuItems.length > 0 ? (
                menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={`menu-item-${index}-${item.id || item.label}`}
                    onPress={() => {
                      console.log(`Menu pressed: ${item.label}`);
                      item.onPress();
                      closeSidebar();
                    }}
                    style={{
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderBottomWidth: 1,
                      borderColor: "#252525",
                      minHeight: 50,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: item.color || "white",
                          fontSize: 16,
                          fontWeight: "500",
                        }}
                      >
                        {item.label}
                      </Text>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {item?.id === "members" && (isAdmin || isMember) && (
                          <Text
                            style={{
                              color: "white",
                              marginLeft: 8,
                              fontSize: 14,
                            }}
                          >
                            [{memberCount}]
                          </Text>
                        )}
                        {item?.logo && typeof item.logo === "function" && (
                          <View style={{ marginLeft: 8 }}>
                            <item.logo width={20} height={20} fill="white" />
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View
                  style={{
                    padding: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>
                    No menu items available
                  </Text>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </>
      )}
    </>
  );
};

export default CombinedDrawer;
