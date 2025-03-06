import React, { useState, useEffect } from "react";
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
  const [users, setUsers] = useState([]);

  const { headline, profilePic, selectedSports, loading, error } = useSelector(
    (state: RootState) => state.onboarding,
  );
  const { fetchedUsers } = useSelector((state: RootState) => state.onboarding);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log("Selected Sports id:", selectedSports);
    dispatch(fetchUserSuggestions({ selectedSports, limit, page })); // add limit, page for pagination while scrolling up
    console.log("Dispatch completed...");
  }, [dispatch, page]);
  useEffect(() => {
    if (fetchedUsers) {
      setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]);
    }
  }, [fetchedUsers]); // Update `users` when `fetchedUsers` changes

  const loadMoreUsers = () => {
    if (!loading) {
      SetPage((prevPage) => prevPage + 1); // Increment page to load more users
    }
  };

  const handleClose = (id: string) => {
    setSelectedPlayers((prev) => prev.filter((player) => player !== id));
  };

  const handleContinue = async () => {
    // console.log("Selected Sports:", selectedSports);

    const onboardingData = {
      headline: headline,
      profilePic: profilePic?.fileObject,
      followings: selectedPlayers,
    };

    try {
      // console.log("Data to be submitted : ", onboardingData);
      const finalOnboardingData = new FormData();
      finalOnboardingData.append("headline", onboardingData.headline);
      finalOnboardingData.append("profilePic", profilePic?.fileObject as any);
      finalOnboardingData.append(
        "followings",
        JSON.stringify(onboardingData.followings),
      );

      // Log FormData values (for debugging)
      // finalOnboardingData.forEach((value, key) => {
      //   console.log(`${key}: ${value}`);
      // });

      const response = await dispatch(
        onboardingUser(finalOnboardingData),
      ).unwrap();

      // console.log(response);

      dispatch(fetchMyProfile(user?._id));

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
      prev.includes(id)
        ? prev.filter((player) => player !== id)
        : [...prev, id],
    );
  };
  const handleSkip = async () => {
    const onboardingData = {
      headline: headline,
      profilePic: profilePic?.fileObject,
      followings: selectedPlayers,
    };

    try {
      // console.log("Data to be submitted : ", onboardingData);
      const finalOnboardingData = new FormData();
      finalOnboardingData.append("headline", onboardingData.headline);
      finalOnboardingData.append("profilePic", profilePic?.fileObject as any);
      finalOnboardingData.append(
        "followings",
        JSON.stringify(onboardingData.followings),
      );

      await dispatch(onboardingUser(finalOnboardingData)).unwrap();

      // console.log(response);

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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black" }}
      className="py-12"
    >
      <Logo />
      <StatusBar barStyle="light-content" />

      <View
        style={{ paddingTop: insets.top }}
        className="px-4 py-6 flex-1 mt-6"
      >
        <View className="mb-6">
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

        {/* <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator size={24} color="#12956B" />
          ) : (
            <View className="flex-row flex-wrap justify-center">
              {fetchedUsers.map((user) => (
                <SuggestionCard
                  key={user._id}
                  user={user}
                  onboarding={true}
                  size="large" // or "small" depending on your design preference
                  removeSuggestion={handleClose}
                  isSelected={handleSelectedPlayers}
                />
              ))}
            </View>
          )}
        </ScrollView> */}
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          numColumns={2} // Adjust based on your preferred layout
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: 20,
          }}
          columnWrapperStyle={{
            justifyContent: "center", // Aligns items in the center
          }}
          ListEmptyComponent={() => (
            <ActivityIndicator size={24} color="#12956B" />
          )}
          renderItem={({ item }) => (
            <SuggestionCard
              user={item}
              onboarding={true}
              size="large"
              removeSuggestion={handleClose}
              isSelected={handleSelectedPlayers}
            />
          )}
          onEndReached={loadMoreUsers}
          onEndReachedThreshold={0.9} // Load more users when the list is halfway to the bottom
          ListFooterComponent={
            users.length > 0 && loading ? (
              <ActivityIndicator size={24} color="#12956B" />
            ) : null
          }
        />

        <TouchableOpacity
          className={`py-2 mt-4 mx-4 rounded-full  ${
            selectedPlayers.length > 0 ? "bg-[#12956B]" : "bg-transparent"
          }`}
          style={{
            alignSelf: "center",
            width: "100%",
            maxWidth: 120,
            height: 36,
          }}
          onPress={selectedPlayers.length > 0 ? handleContinue : handleSkip}
        >
          <TextScallingFalse
            className={`${
              selectedPlayers.length > 0 ? "text-white" : "text-gray-400"
            } text-center`}
          >
            {selectedPlayers.length > 0 ? "Continue" : "Skip for now"}
          </TextScallingFalse>
        </TouchableOpacity>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default SuggestedSupportScreen;
