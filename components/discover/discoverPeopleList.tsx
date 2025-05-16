import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useMemo, useState } from "react";
import TextScallingFalse from "../CentralText";
import { useSuggestUsersQuery } from "~/reduxStore/api/community/communityApi";
import SuggestionCard from "../Cards/SuggestionCard";
import { useRouter } from "expo-router";
import MultipleProfiles from "../ui/atom/MultipleProfiles";

const DiscoverPeopleList = () => {
  const router = useRouter();
  const { data: popularUsers, isLoading: loadingPopularUsers } =
    useSuggestUsersQuery({ limit: 13, start: 0 });

  const [removedUserIds, setRemovedUserIds] = useState<Set<string>>(new Set());

  const removeSuggestion = (userId: string) => {
    setRemovedUserIds((prev) => new Set([...prev, userId]));
  };

  // Split users into first 10 and next 3
  const { first10Users, next3Users } = useMemo(() => {
    const filteredUsers = (popularUsers?.users || []).filter(
      (user) => !removedUserIds.has(user._id)
    );
    return {
      first10Users: filteredUsers.slice(0, 10),
      next3Users: (popularUsers?.users || []).slice(10, 13), // Get original users 11-13
    };
  }, [popularUsers, removedUserIds]);

  const data = useMemo(() => {
    return [...first10Users, { _id: "custom-card", isCustomCard: true } as any];
  }, [first10Users]);

  return (
    <View
      className="flex-1 pb-5"
      style={{ borderBottomWidth: 1, borderColor: "#1c1c1c" }}
    >
      <TextScallingFalse className="text-white text-4xl ml-3 my-2 font-bold">
        Discover People
      </TextScallingFalse>
      {/* <Divider width={2} color="#1e1e1e" /> */}

      {loadingPopularUsers ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#12956B" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              {item.isCustomCard ? (
                <View className="bg-black justify-center items-center gap-y-2 rounded-xl pb-4 relative border w-[150px] h-[180px] border-[#80808085] overflow-hidden">
                  <MultipleProfiles users={next3Users} />
                  <TouchableOpacity
                    onPress={() => router.push("/(app)/(tabs)/community")}
                  >
                    <Text className="text-2xl text-[#12956B] text-center">
                      See all
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <SuggestionCard
                  size="small"
                  user={item}
                  removeSuggestion={removeSuggestion}
                />
              )}
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
        />
      )}
    </View>
  );
};

const CARD_WIDTH = 150;
const CARD_MARGIN = 10;

const styles = StyleSheet.create({
  flatListContent: {
    paddingLeft: 10,
    paddingVertical: 8,
  },
  itemWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_MARGIN,
  },
});

export default DiscoverPeopleList;
