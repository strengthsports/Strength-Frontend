import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import TextScallingFalse from "~/components/CentralText";
import WrittenPost from "./writtenpost";
import { MotiView } from "moti";
import Polls from "./polls";
import Posts from "./posts";
import Comments from "./comments";
import Clips from "./clips";
import Articles from "./articles";

const ActivityLayout = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  // Dynamic scaling for responsiveness
  const containerWidth = width > 768 ? "50%" : "96%";
  const { width: screenWidth2 } = Dimensions.get("window");
  const scaleFactor = screenWidth2 / 410;

  const [activeTab, setActiveTab] = useState("Posts");

  // Define the available tabs.
  const tabs = useMemo(
    () => [
      { name: "Posts" },
      { name: "Thoughts" },
      { name: "Polls" },
      { name: "Comments" },
      { name: "Clips" },
      { name: "Articles" },
    ],
    []
  );

  // Memoized function to render the current tab's content.
  const renderContent = useCallback(() => {
    switch (activeTab) {
      case "Posts":
        return <Posts />;
      case "Polls":
        return <Polls />;
      case "Thoughts":
        return <WrittenPost />;
      case "Comments" :
        return <Comments />;
      case "Clips":
        return <Clips />;
      case "Articles":
        return <Articles />;
      default:
        return <Posts />;
    }
  }, [activeTab]);

  return (
    <View>
      {/* Horizontal Tab Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={200}
        snapToAlignment="start"
        contentContainerStyle={{
          paddingStart: 15 * scaleFactor,
          justifyContent: "flex-start",
          alignItems: "center",
          columnGap: 8,
          width: "auto",
        }}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.name;
          return (
            <Pressable
              key={index}
              onPress={() => {
                setActiveTab(tab.name);
              }}
              className={`px-5 py-2 flex flex-row gap-x-3 items-center justify-center rounded-lg ${
                isActive ? "bg-[#12956B]" : "bg-black border-gray-600"
              } border`}
            >
              <TextScallingFalse className="text-white">
                {tab.name}
              </TextScallingFalse>
            </Pressable>
          );
        })}
      </ScrollView>
      {/* Animated Tab Content */}
      <MotiView className="flex-1">{renderContent()}</MotiView>
    </View>
  );
};

export default ActivityLayout;

const styles = StyleSheet.create({});
