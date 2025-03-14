import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import {
  useRouter,
  Slot,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import { Tabs, TabsList } from "~/components/ui/tabs";
import { TouchableOpacity } from "react-native";
import TextScallingFalse from "~/components/CentralText";

const ActivityLayout = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const pathname = usePathname();

  const fetchedUserId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params?.userId as string))
      : null;
  }, [params.userId]);

  const { width } = useWindowDimensions();
  // Dynamic scaling for responsiveness
  const containerWidth = width > 768 ? "50%" : "96%";
  const { width: screenWidth2 } = Dimensions.get("window");
  const scaleFactor = screenWidth2 / 410;

  const [activeSubSection, setActiveSubSection] = useState("posts");
  return (
    <View className="mt-2">
      <Tabs value={activeSubSection} onValueChange={setActiveSubSection}>
        {/* Horizontal Tab Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={200}
          snapToAlignment="start"
          contentContainerStyle={{ paddingStart: 15 * scaleFactor }}
        >
          <TabsList className="flex-row gap-x-2 w-[100%]">
            {["posts", "images", "comments", "writtenpost"].map(
              (tab, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setActiveSubSection(tab);
                    router.push(
                      tab === "posts"
                        ? `/(app)/(profile)/profile/${params?.userId}/activity`
                        : (`/profile/${params?.userId}/activity/${tab}` as any)
                    );
                  }}
                  className={`px-5 py-2 flex flex-row gap-x-3 items-center justify-center rounded-full ${
                    activeSubSection === tab
                      ? "bg-[#12956B]"
                      : "bg-black border-gray-600"
                  } border`}
                >
                  <TextScallingFalse className="text-white">
                    {tab
                      .charAt(0)
                      .toUpperCase()
                      .concat(tab.slice(1, tab.length))}
                  </TextScallingFalse>
                </Pressable>
              )
            )}
          </TabsList>
        </ScrollView>
      </Tabs>
      <Slot />
    </View>
  );
};

export default ActivityLayout;

const styles = StyleSheet.create({});
