import { Slot, useRouter, useSegments } from "expo-router";
import { Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import React, { useMemo } from "react";
import TextScallingFalse from "~/components/CentralText";

export default function ActivityTabLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { width } = useWindowDimensions();
  const scaleFactor = width / 410;

  const currentSegment = useMemo(() => {
    if (Array.isArray(segments) && segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      return lastSegment === "activity" ? "index" : lastSegment;
    }
    return "index";
  }, [segments]);

  const tabs = useMemo(
    () => [
      { name: "Posts", segment: "index" },
      { name: "Clips", segment: "clips" },
      { name: "Thoughts", segment: "thoughts" },
      { name: "Polls", segment: "polls" },
      { name: "Comments", segment: "comments" },
    ],
    []
  );

  const handleTabPress = (segment: string) => {
    const path =
      segment === "index"
        ? `/profile/activity`
        : `/profile/activity/${segment}`;
    router.replace(path as any);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        contentContainerStyle={{
          marginTop: 5,
          paddingStart: 15 * scaleFactor,
          paddingEnd: 80 * scaleFactor,
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 12,
          // width: "auto",
        }}
      >
        {tabs.map((tab) => {
          const isActive = currentSegment === tab.segment;
          return (
            <Pressable
              key={tab.name}
              onPress={() => handleTabPress(tab.segment)}
              className={`px-4 py-[9px] flex flex-row items-center justify-center rounded-[10px] border ${
                isActive ? "bg-[#12956B]" : "bg-black border-[#454545]"
              }`}
            >
              <TextScallingFalse
                className="text-white font-medium"
                style={{ fontSize: 12 }}
              >
                {tab.name}
              </TextScallingFalse>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="flex-1 w-full h-auto">
        <Slot />
      </View>
    </View>
  );
}
