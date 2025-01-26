import { Slot } from "expo-router";
import React, { Component, useEffect, useState } from "react";
import { ScrollView, Platform, ToastAndroid, } from "react-native";
import { Divider } from "react-native-elements";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import HeaderFeed from "~/components/feedPage/HeaderFeed";
import PageThemeView from "~/components/PageThemeView";
import { AppDispatch } from "~/reduxStore";
import { logoutUser } from "~/reduxStore/slices/user/authSlice";

const ProfileLayout = () => {
  const dispatch = useDispatch<AppDispatch>();

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
      <HeaderFeed onPress={handleLogout} />
            {/* <Divider /> */}
      
        <Slot />
      </ScrollView>
    </PageThemeView>
  );
};

export default ProfileLayout;
