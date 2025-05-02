import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing, StyleSheet } from "react-native";
import Squad from "./Squad";
import About from "@/components/teamPage/About";
import { TeamPayload } from "~/reduxStore/slices/team/teamSlice";
import {
  useFonts,
  SairaExtraCondensed_500Medium,
} from "@expo-google-fonts/saira-extra-condensed";
import AppLoading from "expo-app-loading";

const SubCategories = ({ teamDetails }: { teamDetails: TeamPayload }) => {
  const [selectedTab, setSelectedTab] = useState<"SQUAD" | "ABOUT">("ABOUT");
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [direction, setDirection] = useState<"left" | "right">("right");

  const [fontsLoaded] = useFonts({
    SairaExtraCondensed_500Medium,
  });

  const handleTabChange = (tab: "SQUAD" | "ABOUT") => {
    // Determine animation direction based on current tab
    const newDirection = 
      (selectedTab === "ABOUT" && tab === "SQUAD") || 
      (selectedTab === "SQUAD" && tab === "ABOUT") ? "left" : "right";
    
    setDirection(newDirection);

    // Start from offscreen right or left
    slideAnim.setValue(newDirection === "left" ? -100 : 100);
    
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 2000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    setSelectedTab(tab);
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const renderContent = () => {
    const translateX = slideAnim.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [-100, 0, 100],
    });

    return (
      <Animated.View 
        style={[
          styles.contentContainer,
          { transform: [{ translateX }] }
        ]}
      >
        {selectedTab === "SQUAD" ? (
          <Squad teamDetails={teamDetails} />
        ) : (
          <About teamDetails={teamDetails} />
        )}
      </Animated.View>
    );
  };

  return (
    <View className="flex-1">
      {/* Sticky Header */}
      <View className="bg-black">
        <View className="flex-row p-2 px-4 bg-[#191919]">
          <TouchableOpacity
            className={`px-4 rounded-[4px] ${
              selectedTab === "ABOUT" ? "bg-[#12956B]" : "bg-[#191919]"
            }`}
            onPress={() => handleTabChange("ABOUT")}
          >
            <Text
              className="text-white text-[21px] mt-1"
              style={{ fontFamily: "SairaExtraCondensed_500Medium" }}
            >
              ABOUT
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`ml-4 justify-center px-3 rounded-[4px] ${
              selectedTab === "SQUAD" ? "bg-[#12956B]" : "bg-[#191919]"
            }`}
            onPress={() => handleTabChange("SQUAD")}
          >
            <Text
              className="text-white text-[21px] mt-1"
              style={{ fontFamily: "SairaExtraCondensed_500Medium" }}
            >
              SQUAD
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    width: '100%',
  },
});

export default SubCategories;