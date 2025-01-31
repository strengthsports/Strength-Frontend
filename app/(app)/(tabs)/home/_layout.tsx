import { Slot } from "expo-router";
import React, { Component, useEffect, useState } from "react";
import {
  ScrollView,
  Platform,
  ToastAndroid,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Divider } from "react-native-elements";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import HeaderFeed from "~/components/feedPage/HeaderFeed";
import Sidebar from "~/components/feedPage/Sidebar";
import PageThemeView from "~/components/PageThemeView";
import { AppDispatch } from "~/reduxStore";
import { logoutUser } from "~/reduxStore/slices/user/authSlice";

const ProfileLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

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
  return (
    <PageThemeView>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <HeaderFeed />
        {/* <HeaderFeed onPress={() => setSidebarVisible(true)} /> */}

        {/* <Divider /> */}
        {/* {isSidebarVisible && (
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      >
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>
      </Sidebar>
    )} */}

        <Slot />
      </ScrollView>
    </PageThemeView>
  );
};

export default ProfileLayout;
const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: "#2a2a2a",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android elevation
    elevation: 2,
  },
  menuItemPressed: {
    backgroundColor: "#3a3a3a",
    transform: [{ scale: 0.98 }],
  },
  menuText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 16,
    letterSpacing: 0.25,
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 8,
    marginHorizontal: 16,
  },
  iconContainer: {
    width: 24,
    alignItems: "center",
  },
});
