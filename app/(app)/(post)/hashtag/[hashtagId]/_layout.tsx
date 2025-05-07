import { useState, useMemo, Suspense, lazy } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import PageThemeView from "~/components/PageThemeView";
import SearchBar from "~/components/search/searchbar";
import TextScallingFalse from "~/components/CentralText";

const TABS = [
  { key: "Top", label: "Top", component: lazy(() => import("./top")) },
  { key: "Latest", label: "Latest", component: lazy(() => import("./latest")) },
  { key: "People", label: "People", component: lazy(() => import("./people")) },
  { key: "Media", label: "Media", component: lazy(() => import("./media")) },
  { key: "Polls", label: "Polls", component: lazy(() => import("./polls")) },
];

export default function HashtagLayout() {
  const { hashtagId } = useLocalSearchParams();
  const hashtag =
    typeof hashtagId === "string" ? hashtagId : hashtagId?.[0] || "";

  const [activeTab, setActiveTab] = useState("Top");
  const ActiveComponent = useMemo(() => {
    return TABS.find((t) => t.key === activeTab)?.component;
  }, [activeTab]);

  return (
    <PageThemeView>
      <SearchBar searchText={`#${hashtag}`} marginBottom={0} />

      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={styles.tab}
            activeOpacity={0.8}
          >
            <TextScallingFalse
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </TextScallingFalse>
            {activeTab === tab.key && <View style={styles.indicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <Suspense
        fallback={
          <ActivityIndicator
            size="large"
            color="#12956B"
            style={{ marginTop: 20 }}
          />
        }
      >
        {ActiveComponent && <ActiveComponent hashtag={hashtag} />}
      </Suspense>
    </PageThemeView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000",
    borderBottomWidth: 0.5,
    borderBottomColor: "#464646",
  },
  tab: {
    paddingTop: 20,
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    color: "#aaa",
    fontWeight: "700",
    fontSize: 13,
    paddingBottom: 2,
  },
  activeTabText: {
    color: "#fff",
  },
  indicator: {
    marginTop: 4,
    height: 3,
    width: "60%",
    backgroundColor: "#12956B",
    borderRadius: 20,
  },
});
