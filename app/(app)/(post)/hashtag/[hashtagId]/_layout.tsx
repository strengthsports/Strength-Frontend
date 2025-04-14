import { useLocalSearchParams } from "expo-router";
import React, {
  useState,
  useRef,
  useEffect,
  Suspense,
  useCallback,
} from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import PageThemeView from "~/components/PageThemeView";
import SearchBar from "~/components/search/searchbar";
import PostSkeletonLoader1 from "~/components/skeletonLoaders/PostSkeletonLoader1";
import { Colors } from "~/constants/Colors";

// Lazy-load heavy content components
const LazyTop = React.lazy(() => import("./index"));
const LazyLatest = React.lazy(() => import("./latest"));
const LazyPeople = React.lazy(() => import("./people"));
const LazyPhotos = React.lazy(() => import("./photos"));
const LazyComments = React.lazy(() => import("./comments"));

// Define tabs outside component to prevent re-renders
const tabs = [
  { label: "Top", component: LazyTop },
  { label: "Latest", component: LazyLatest },
  { label: "People", component: LazyPeople },
  { label: "Photos", component: LazyPhotos },
  { label: "Polls", component: LazyComments },
];

// Memoized loader component
const Loader = React.memo(() => (
  <ScrollView
    contentContainerStyle={{
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: "100%",
      flex: 1,
      backgroundColor: "#000",
    }}
  >
    <PostSkeletonLoader1 />
    <PostSkeletonLoader1 />
    <PostSkeletonLoader1 />
  </ScrollView>
));

interface CustomNavigationProps {
  hashtag: string;
}

const CustomNavigation: React.FC<CustomNavigationProps> = () => {
  const { hashtagId } = useLocalSearchParams();
  const hashtag = hashtagId.toString();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tabsLayout, setTabsLayout] = useState<
    Array<{ x: number; width: number }>
  >([]);
  const tabsLayoutRef = useRef(tabsLayout);
  tabsLayoutRef.current = tabsLayout;

  const indicatorLeft = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;

  // Memoized tab press handler
  const handleTabPress = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  // Optimized layout handler with ref check
  const onTabLayout = useCallback((index: number, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    setTabsLayout((prev) => {
      if (prev[index]?.x === x && prev[index]?.width === width) return prev;
      const newLayouts = [...prev];
      newLayouts[index] = { x, width };
      return newLayouts;
    });
  }, []);

  // Initialize the indicator for the first tab on mount
  useEffect(() => {
    if (tabsLayout[0]) {
      const initialLeft = tabsLayout[0].x + tabsLayout[0].width * 0.25;
      const initialWidth = tabsLayout[0].width * 0.5;
      indicatorLeft.setValue(initialLeft);
      indicatorWidth.setValue(initialWidth);
    }
  }, [tabsLayout, indicatorLeft, indicatorWidth]);

  // Animation effect with proper cleanup
  useEffect(() => {
    let isActive = true;
    const layout = tabsLayoutRef.current[selectedIndex];

    if (layout) {
      const newLeft = layout.x + layout.width * 0.25;
      const newWidth = layout.width * 0.5;

      if (isActive) {
        Animated.parallel([
          Animated.timing(indicatorLeft, {
            toValue: newLeft,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(indicatorWidth, {
            toValue: newWidth,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      }
    }

    return () => {
      isActive = false;
    };
  }, [selectedIndex, indicatorLeft, indicatorWidth]);

  const SelectedComponent = tabs[selectedIndex].component;

  return (
    <PageThemeView >
      <SearchBar searchText={`#${hashtag}`} />

      <View className="h-12 bg-black border-b-[0.5px] border-[#808080]">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 10,
            position: "relative",
          }}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleTabPress(index)}
              onLayout={(e) => onTabLayout(index, e)}
              activeOpacity={0.7}
            >
              <View className="px-5">
                <Text
                  className={`text-2xl font-semibold ${
                    selectedIndex === index ? "text-white" : "text-[#808080]"
                  }`}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <Animated.View
            className="absolute bottom-0 h-[3px] bg-theme rounded-[1.5px]"
            style={{ left: indicatorLeft, width: indicatorWidth }}
          />
        </ScrollView>
      </View>

      <View className="flex-1">
        <Suspense fallback={<Loader />}>
          <SelectedComponent />
        </Suspense>
      </View>
    </PageThemeView>
  );
};

export default React.memo(CustomNavigation);
