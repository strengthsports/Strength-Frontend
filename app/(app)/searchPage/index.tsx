import React, { useState, useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/reduxStore";
import { useSearchUsersMutation } from "~/reduxStore/api/explore/searchApi";
import {
  addSearchHistory,
  addRecentSearch,
  resetSearchHistory,
} from "~/reduxStore/slices/explore/searchSlice";
import SearchInput from "~/components/search/searchInput";
import SearchHistoryText from "~/components/search/searchHistoryText";
import SearchHistoryProfile from "~/components/search/searchHistoryProfile";
import nopic from "@/assets/images/nopic.jpg";
import BackIcon2 from "~/components/SvgIcons/Common_Icons/BackIcon2";
import { createSelector } from "@reduxjs/toolkit";

// Memoized Redux selectors
const selectFilteredSearchHistory = createSelector(
  (state: RootState) => state.search.searchHistory,
  (searchHistory) => searchHistory.filter((item) => item !== null)
);

const selectUserLocation = createSelector(
  (state: RootState) => state.profile.user?.address?.location,
  (location) => ({
    latitude: location?.coordinates?.[1] ?? null,
    longitude: location?.coordinates?.[0] ?? null,
  })
);

const SearchPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = Dimensions.get("window");
  const { height } = Dimensions.get("window");

  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchBarHeight, setSearchBarHeight] = useState(0);

  // Memoized Redux state selections
  const userId = useSelector((state: RootState) => state.profile.user?._id);
  const { latitude, longitude } = useSelector(selectUserLocation);
  const searchHistory = useSelector(selectFilteredSearchHistory);
  const recentSearches = useSelector(
    (state: RootState) => state.search.recentSearches
  );

  const [searchUsers] = useSearchUsersMutation();

  // API call with proper cleanup
  useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const response = await searchUsers({
          username: searchText,
          limit: 10,
          page: 1,
          latitude,
          longitude,
          userId,
        }).unwrap();

        setSearchResults((prev) =>
          JSON.stringify(prev) === JSON.stringify(response)
            ? prev
            : response || []
        );
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchText, latitude, longitude, userId]);

  // Stable event handler
  const handleItemPress = useCallback(
    (user: any) => {
      if (!user?._id) return;

      const fullName = `${user.firstName} ${user.lastName}`;
      setSearchText(fullName);
      dispatch(addSearchHistory(user));
      dispatch(addRecentSearch(fullName));

      const serializedUser = encodeURIComponent(
        JSON.stringify({ id: user._id, type: user.type })
      );
      router.push(`/(app)/(profile)/profile/${serializedUser}`);
    },
    [dispatch, router]
  );

  const clearSearchHistory = useCallback(() => {
    dispatch(resetSearchHistory());
  }, [dispatch]);

  // Memoized list renderers
  const renderSearchResult = useCallback(
    ({ item }: { item: any }) => (
      <SearchResultItem item={item} onPress={handleItemPress} />
    ),
    [handleItemPress]
  );

  const renderHistoryProfile = useCallback(
    ({ item }: { item: any }) => (
      <SearchHistoryProfile
        name={item.firstName}
        username={item.username}
        profilePic={item.profilePic}
      />
    ),
    []
  );

  const renderRecentSearch = useCallback(
    ({ item }: { item: string }) => (
      <SearchHistoryText searchText={item} setSearchText={setSearchText} />
    ),
    []
  );

  return (
    <SafeAreaView>
      <View
        className="flex-row items-center my-3 gap-x-2 max-w-[640px] w-[95%] mx-auto"
        onLayout={(e) => setSearchBarHeight(e.nativeEvent.layout.height)}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon2 />
        </TouchableOpacity>
        <MemoizedSearchInput
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </View>

      {searchText ? (
        <View className="px-5 mt-3">
          {isSearching ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item._id}
            />
          )}
        </View>
      ) : (
        <View className="px-5">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl text-[#808080] mb-2">Recent</Text>
            <Text
              onPress={clearSearchHistory}
              className="text-2xl text-[#808080] mb-2"
            >
              Clear
            </Text>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={searchHistory}
            renderItem={renderHistoryProfile}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ gap: 16 }}
          />

          <FlatList
            data={recentSearches}
            renderItem={renderRecentSearch}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ gap: 14, paddingVertical: 16 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

// Memoized components
const MemoizedSearchInput = memo(SearchInput);

const SearchResultItem = memo(
  ({ item, onPress }: { item: any; onPress: (user: any) => void }) => (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className="flex-row items-center py-2 px-4 border-b border-black"
    >
      <Image
        source={item?.profilePic?.trim() ? { uri: item.profilePic } : nopic}
        className="w-10 h-10 rounded-full mr-3"
      />
      <Text className="text-white text-lg font-light">
        {item.firstName} {item.lastName}
      </Text>
    </TouchableOpacity>
  )
);

export default SearchPage;
