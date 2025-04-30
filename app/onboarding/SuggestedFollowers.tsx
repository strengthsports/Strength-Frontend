import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import TextScallingFalse from "@/components/CentralText";
import Logo from "@/components/logo";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxStore";
import { useDispatch } from "react-redux";
import { fetchUserSuggestions } from "~/reduxStore/slices/user/onboardingSlice";
import { AppDispatch } from "@/reduxStore";
import { onboardingUser } from "~/reduxStore/slices/user/onboardingSlice";
import Toast from "react-native-toast-message";
import SuggestionCard from "~/components/Cards/SuggestionCard";
import { fetchMyProfile } from "~/reduxStore/slices/user/profileSlice";
import { FlatList } from "react-native";
import { SuggestionUser } from "~/types/user";
import { throttle } from "lodash";
import SuggestedUserCardLoader from "~/components/skeletonLoaders/onboarding/SuggestedUserCardLoader";
import UserCardSkeleton from "~/components/skeletonLoaders/onboarding/SuggestedUserCardLoader";

interface SupportCardProps {
  user: any;
  isSelected: boolean;
  onClose: (id: string) => void;
  onSupport: (id: string) => void;
}

const SuggestedSupportScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [limit, SetLimit] = useState(10);
  const [page, SetPage] = useState(1);
  const [users, setUsers] = useState<SuggestionUser[]>([]);

  const { headline, profilePic, selectedSports, loading, error } = useSelector(
    (state: RootState) => state.onboarding
  );
  const { fetchedUsers } = useSelector((state: RootState) => state.onboarding);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log("Selected Sports id:", selectedSports);
    dispatch(fetchUserSuggestions({ sportsData: selectedSports, limit, page })); // add limit, page for pagination while scrolling up
    console.log("Dispatch completed...");
  }, [dispatch, page]);

  useEffect(() => {
    if (fetchedUsers) {
      setUsers((prevUsers) => {
        const mergedUsers = [...prevUsers, ...fetchedUsers];

        // Remove duplicates based on _id
        const uniqueUsers = mergedUsers.filter(
          (user, index, self) =>
            index === self.findIndex((u) => u._id === user._id)
        );

        return uniqueUsers;
      });
    }
  }, [fetchedUsers]);
  // Update `users` when `fetchedUsers` changes

  const loadMoreUsers = throttle(() => {
    if (!loading) {
      SetPage((prevPage) => prevPage + 1);
    }
  }, 500); // only once every 500ms

  const handleClose = (id: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
  };

  const [finalLoading, setFinalLoading] = useState(false)
  const handleContinue = async () => {
    console.log("Selected Sports:", selectedSports);
    setFinalLoading(true);

    const onboardingData = {
      headline: headline,
      profilePic: profilePic?.fileObject,
      favSports: selectedSports,
    };

    try {
      // console.log("Data to be submitted : ", onboardingData);
      const finalOnboardingData = new FormData();
      finalOnboardingData.append("headline", onboardingData.headline);
      // Only add 'assets' if profilePic is available
      if (profilePic?.fileObject) {
        finalOnboardingData.append("assets", profilePic.fileObject as any);
      }

      onboardingData.favSports.forEach((sportId) => {
        finalOnboardingData.append("favSports", sportId);
      });

      //Log FormData values (for debugging)
      finalOnboardingData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      console.log("FormData object before dispatch:");
      for (let pair of (finalOnboardingData as any).entries()) {
        console.log(`${pair[0]}: ${typeof pair[1] === 'object' ? JSON.stringify(pair[1]) : pair[1]}`);
      }      

      await dispatch(onboardingUser(finalOnboardingData)).unwrap();

      // console.log(response);

      dispatch(fetchMyProfile(user?._id));
      setFinalLoading(false);

      // Alert the successful response
      Toast.show({
        type: "success",
        text1: "Successfully Updated Profile",
        visibilityTime: 1500,
      });
      router.push("/(app)/(tabs)/home");
    } catch (error: unknown) {
      console.log(error);
      if (error && typeof error === "object" && "message" in error) {
        Toast.show({
          type: "error",
          text1: (error as { message: string }).message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "An unknown error occurred",
        });
      }
    }
  };

  const handleSelectedPlayers = (id: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(id) ? prev.filter((player) => player !== id) : [...prev, id]
    );
  };


  const handleSkip = async () => {
    setFinalLoading(true);
    const onboardingData = {
      headline: headline,
      profilePic: profilePic?.fileObject,
      favSports: selectedSports,
    };

    try {
      // console.log("Data to be submitted : ", onboardingData);
      const finalOnboardingData = new FormData();
      finalOnboardingData.append("headline", onboardingData.headline);
      finalOnboardingData.append("profilePic", profilePic?.fileObject as any);
      onboardingData.favSports.forEach((sportId) => {
        finalOnboardingData.append("favSports", sportId);
      });

      await dispatch(onboardingUser(finalOnboardingData)).unwrap();

      // console.log(response);
      setFinalLoading(false);
      // Alert the successful response
      Toast.show({
        type: "success",
        text1: "Successfully Updated Profile",
      });
      router.push("/(app)/(tabs)/home");
    } catch (error: unknown) {
      console.log(error);
      if (error && typeof error === "object" && "message" in error) {
        Toast.show({
          type: "error",
          text1: (error as { message: string }).message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "An unknown error occurred",
        });
      }
    }
  };

  // 1. Define renderItem first
  const renderItem = useCallback(
    ({ item }: { item: SuggestionUser }) => (
      <SuggestionCard
        user={item}
        onboarding={true}
        size="large"
        removeSuggestion={handleClose}
        isSelected={handleSelectedPlayers}
      />
    ),
    [handleClose, handleSelectedPlayers]
  );
  const filteredUsers = users.filter(userItem => userItem._id !== user?._id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar barStyle="light-content" />

      {/* FlatList scrolls everything from Logo to suggestions */}
      <FlatList
        data={loading ? [] : filteredUsers}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100, // space for fixed skip button
          gap: 12,
          paddingTop: 40
        }}
        columnWrapperStyle={{ justifyContent: "center", gap: 12 }}
        ListHeaderComponent={
          <>
            <Logo />
            <View className="mb-6 mt-6">
              <TextScallingFalse className="text-gray-500 text-[1rem]">
                Step 2 of 2
              </TextScallingFalse>
              <TextScallingFalse className="text-white text-[1.8rem] font-semibold mt-1">
                Suggested Followers
              </TextScallingFalse>
              <TextScallingFalse className="text-gray-400 text-[0.9rem] mt-2">
                Following others lets you see updates and keep in touch.
              </TextScallingFalse>
            </View>
          </>
        }
        ListEmptyComponent={() => (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <UserCardSkeleton key={index} size="large" />
            ))}
          </View>
        )}
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.9}
        ListFooterComponent={
          users.length > 0 && loading ? (
            <ActivityIndicator size={24} color="#12956B" />
            // <SuggestedUserCardLoader />
          ) : null
        }
      />

      {/* Fixed Skip/Continue Button */}
      <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 70, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
        {
          finalLoading ?
            <ActivityIndicator size={'small'} color={'#606060'} />
            :
            <TouchableOpacity activeOpacity={0.7}
              className={`py-2 rounded-full ${selectedPlayers.length > 0 ? "bg-[#12956B]" : "bg-transparent"
                }`}
              style={{
                width: "60%",
                height: 36, justifyContent: 'center', alignItems: 'center',
              }}
              onPress={selectedPlayers.length > 0 ? handleContinue : handleSkip}
            >
              <TextScallingFalse
                className={`${selectedPlayers.length > 0 ? "text-white font-semibold" : "text-gray-400"
                  } text-center`}
              >
                {selectedPlayers.length > 0 ? "Continue" : "Skip for now"}
              </TextScallingFalse>
            </TouchableOpacity>
        }
      </View>
      <Toast />
    </SafeAreaView>

  );
};

export default SuggestedSupportScreen;
