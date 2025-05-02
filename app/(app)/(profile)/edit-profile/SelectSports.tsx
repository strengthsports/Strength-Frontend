import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Keyboard,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import TextScallingFalse from "@/components/CentralText";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import { fetchSportsData } from "~/reduxStore/slices/user/onboardingSlice";
import {
  editUserProfile,
  fetchMyProfile,
  setUserProfile,
  updateProfileSports,
} from "~/reduxStore/slices/user/profileSlice";

export interface Sport {
  _id: string;
  name: string;
  logo?: string;
}

const defaultImage = require("@/assets/images/onboarding/sportsIcon/okcricket.png");

const SportsSelection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Get sports data from Redux
  const { sportsData, isLoading, isError } = useSelector(
    (state: RootState) => state.onboarding
  );

  // Get current user's selected sports
  const { user } = useSelector((state: RootState) => state.profile);
  const [localSelectedSports, setLocalSelectedSports] = useState<Set<string>>(
    new Set(
      user?.favouriteSports?.map((sport: any) =>
        typeof sport === "string" ? sport : sport._id
      ) || []
    )
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Fetch sports on mount
  useEffect(() => {
    dispatch(fetchSportsData());
  }, [dispatch]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    // Clean existing sports data
    const validInitialSports = (user?.favouriteSports || [])
      .map((sport) => sport?._id)
      .filter((id): id is string => !!id);

    setLocalSelectedSports(new Set(validInitialSports));
  }, [user]);

  // Toggle sport selection
  const toggleSport = (sportId: string) => {
    if (!sportId || typeof sportId !== "string") {
      console.error("Invalid sport ID:", sportId);
      return;
    }

    setLocalSelectedSports((prev) => {
      const updated = new Set(prev);
      updated.has(sportId) ? updated.delete(sportId) : updated.add(sportId);
      return updated;
    });
  };

  // Confirm selection
  const handleConfirmSelection = async () => {
    try {
      const validSports = Array.from(localSelectedSports).filter(Boolean);
      const formData = new FormData();
      formData.append("favouriteSports", JSON.stringify(validSports));

      const response = await dispatch(editUserProfile(formData)).unwrap();

      // Handle server response
      if (!response?.data?.updatedUser?.favouriteSports) {
        console.warn("Server response missing sports data, updating locally");

        // Merge with existing profile data
        const updatedProfile = {
          ...user,
          favouriteSports: validSports.map((id) => ({ _id: id, name: "" })),
        };

        dispatch(setUserProfile(updatedProfile));
      }

      // Force profile refresh
      if (user?._id) {
        await dispatch(fetchMyProfile(user._id));
      }

      router.back();
    } catch (error) {
      console.error("Update failed:", error);
      router.back();
    }
  };

  // Filter sports
  const filteredSports = sportsData
    .filter((sport) =>
      sport.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const renderSportItem = ({ item }: { item: Sport }) => {
    const isSelected = localSelectedSports.has(item._id);
    return (
      <TouchableOpacity className="m-1" onPress={() => toggleSport(item._id)}>
        <View
          className={`rounded-lg w-[110px] h-[100px] items-center justify-center p-2 ${
            isSelected
              ? "bg-[#12956B] border border-[#12956B]"
              : "bg-black border border-white/30"
          }`}
        >
          <Image
            source={item.logo ? { uri: item.logo } : defaultImage}
            className="w-[28px] h-[28px] mb-2"
            style={{ tintColor: isSelected ? "white" : undefined }}
          />
          <TextScallingFalse
            className={`text-center text-[13px] ${
              isSelected ? "text-white" : "text-white"
            }`}
            numberOfLines={2}
          >
            {item.name}
          </TextScallingFalse>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Select Sports</Text>
          <TouchableOpacity onPress={handleConfirmSelection}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={24}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sports..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#12956B"
            style={styles.loader}
          />
        ) : isError ? (
          <Text style={styles.errorText}>Error loading sports: {isError}</Text>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.sportsGrid}>
              {filteredSports.map((item) => (
                <View key={item._id} style={styles.sportItem}>
                  {renderSportItem({ item })}
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {!keyboardVisible && (
          <View style={styles.footer}>
            <Text style={styles.countText}>
              {localSelectedSports.size} sports selected
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  doneText: {
    color: "#12956B",
    fontSize: 16,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 25,
    paddingHorizontal: 16,
    marginVertical: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    marginTop: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  sportsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  sportItem: {
    margin: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  countText: {
    color: "#ccc",
    textAlign: "center",
  },
});

export default SportsSelection;
