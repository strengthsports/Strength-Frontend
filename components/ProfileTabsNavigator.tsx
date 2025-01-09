import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router"; // Import useRouter from expo-router

const ProfileTabsNavigator = () => {
  const router = useRouter(); // Initialize the router
  const [activeTab, setActiveTab] = useState("Overview"); // Default active tab

  const handleTabPress = (tabName, route) => {
    setActiveTab(tabName); // Set active tab state
    router.push(route); // Navigate to the route
  };

  return (
    <View style={styles.tabContainer}>
      {/* Tab buttons */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Overview" && styles.activeTab,
          ]}
          onPress={() => handleTabPress("Overview", "/(app)/(tabs)/profile")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Overview" && styles.activeTabText,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Activity" && styles.activeTab,
          ]}
          onPress={() => handleTabPress("Activity", "/(app)/(tabs)/profile/Activity")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Activity" && styles.activeTabText,
            ]}
          >
            Activity
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Events" && styles.activeTab]}
          onPress={() => handleTabPress("Events", "/events")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Events" && styles.activeTabText,
            ]}
          >
            Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Teams" && styles.activeTab]}
          onPress={() => handleTabPress("Teams", "/teams")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Teams" && styles.activeTabText,
            ]}
          >
            Teams
          </Text>
        </TouchableOpacity>
        <View
          style={[
            styles.tabIndicator,
            {
              left: `${
                activeTab === "Overview"
                  ? 2
                  : activeTab === "Activity"
                  ? 27.6
                  : activeTab === "Events"
                  ? 51.4
                  : 74
              }%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: "11%",
    paddingTop: "0.5%",
    paddingBottom: "2%",
  },
  tabButton: {
    paddingVertical: 10,
  },
  tabText: {
    color: "white",
    fontSize: 15,
  },
  activeTab: {
    borderBottomWidth: 0,
    borderBottomColor: "#12956B",
  },
  activeTabText: {
    color: "#12956B",
  },
  tabIndicator: {
    position: "absolute",
    top: "106%",
    alignSelf: "center",
    width: "25%", // Adjust width as needed to fit the number of tabs
    height: 1.5,
    backgroundColor: "#12956B",
    borderRadius: 2,
  },
});

export default ProfileTabsNavigator;