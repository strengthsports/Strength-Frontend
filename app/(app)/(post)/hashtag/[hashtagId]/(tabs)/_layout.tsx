// app/hashtag/[hashtag]/_layout.tsx
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { Dimensions } from "react-native";

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

const TAB_CONFIG = [
  { name: "top", label: "Top" },
  { name: "latest", label: "Latest" },
  { name: "people", label: "People" },
  { name: "media", label: "Media" },
  { name: "polls", label: "Polls" },
];

export default function HashtagLayout() {
  const { hashtagId } = useLocalSearchParams(); // Get the hashtag from params
  const hashtag =
    typeof hashtagId === "string" ? hashtagId : hashtagId?.[0] || "";
  const { width } = Dimensions.get("screen");

  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#000",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0.5,
          borderBottomColor: "#464646",
          marginHorizontal: "auto",
          width: (width * 95) / 100,
        },
        tabBarActiveTintColor: "#fff",
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "700",
        },
        tabBarItemStyle: {
          padding: 1,
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#12956B",
          height: 3,
          borderRadius: 20,
        },
        swipeEnabled: false,
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <MaterialTopTabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarLabel: tab.label,
          }}
          initialParams={{ hashtagId: hashtag }}
        />
      ))}
    </MaterialTopTabs>
  );
}
