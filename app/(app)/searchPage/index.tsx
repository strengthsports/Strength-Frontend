import React, { useState, useEffect, useCallback, memo } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Modal, 
  StyleSheet,
  ActivityIndicator
} from "react-native";
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
import TextScallingFalse from "~/components/CentralText";
import PageThemeView from "~/components/PageThemeView";

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
  const [modalVisible, setModalVisible] = useState(false);

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
    setModalVisible(false);
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

  interface ClearSearchAlertModalProps {
    visible: boolean; // Indicates whether the modal is visible
    onClose: () => void; // Function to close the modal
    onConfirm: () => void; // Function to confirm the action
  }
    // Function to handle closing the modal
    const handleCloseModal = () => {
      setModalVisible(false);
    };
  const ClearSearchAlertModal: React.FC<ClearSearchAlertModalProps> = ({ visible, onClose, onConfirm }) => {
    if (!visible) return null; // Don't render if modal is not visible

    return (
      <Modal transparent={true} animationType="fade" visible={visible}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TextScallingFalse style={{ color: 'white', fontSize: 20 }}>Clear search history?</TextScallingFalse>
            <TextScallingFalse style={{ fontSize: 12, color: 'white', lineHeight: 17, fontWeight:'400'}}>Your search history is only visible to you, by clearing your search history both your recent searches and texts will be removed.</TextScallingFalse>

            <View style={{ width:'100%', alignItems:'flex-end'}}>
              <View style={{flexDirection:'row', gap: 35}}>
              <TouchableOpacity onPress={handleCloseModal} >
                <TextScallingFalse style={{ color: 'white', fontSize: 16 }}>Cancel</TextScallingFalse>
              </TouchableOpacity>

              <TouchableOpacity onPress={clearSearchHistory} >
                <TextScallingFalse style={{ color: 'white', fontSize: 16 }}>Confirm</TextScallingFalse>
              </TouchableOpacity>
            </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <PageThemeView>
      <View
        className="flex-row items-center my-3 gap-x-5 max-w-[640px] w-[92%] mx-auto"
        onLayout={(e) => setSearchBarHeight(e.nativeEvent.layout.height)}
      >
        <TouchableOpacity style={{ width: 20, height: 40, justifyContent: 'center' }} onPress={() => router.back()}>
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
            <View style={{paddingTop: 5}}>
            <ActivityIndicator size="small" color="gray" />
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item._id}
            />
          )}
        </View>
      ) : (
        <>
          {
            (searchHistory.length > 0 || recentSearches.length > 0) ? (
              <View>
                <View className="flex-row justify-between items-center px-6 py-2">
                  <TextScallingFalse className="text-3xl text-[#808080] mb-2">Recent</TextScallingFalse>
                  <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7} style={{ width: 60, alignItems: 'flex-end' }}>
                    <TextScallingFalse
                      className="text-2xl text-[#808080] mb-2"
                    >
                      Clear
                    </TextScallingFalse>
                  </TouchableOpacity>
                  {/* Clear Search Alert Modal */}
                  <ClearSearchAlertModal
                    visible={modalVisible} // Pass the visibility state to the modal
                    onClose={handleCloseModal} // Pass the function to close the modal
                    onConfirm={clearSearchHistory} // Pass the function to confirm the action
                  />
                </View>

                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={searchHistory}
                  renderItem={renderHistoryProfile}
                  keyExtractor={(item) => item._id}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    gap: 16,
                    paddingStart: 16,
                    paddingRight: 20,
                  }}
                />

                <FlatList
                  data={recentSearches}
                  renderItem={renderRecentSearch}
                  keyExtractor={(item, index) => index.toString()}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    gap: 27,
                    paddingVertical: 26,
                    paddingHorizontal: 20,
                  }}
                />
              </View>
            )
              :
              (
                <View style={{ width: '100%', padding: 100, justifyContent: 'center', alignItems: 'center' }}>
                  <TextScallingFalse style={{ color: 'grey', fontWeight: '400', fontSize: 13 }}>No recent search available !</TextScallingFalse>
                </View>
              )
          }
        </>
      )}
    </PageThemeView>
  );
};

// Memoized components
const MemoizedSearchInput = memo(SearchInput);

const SearchResultItem = memo(
  ({ item, onPress }: { item: any; onPress: (user: any) => void }) => (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className="flex-row items-center py-2 px-3"
    >
      <Image
        source={item?.profilePic?.trim() ? { uri: item.profilePic } : nopic}
        className="w-12 h-12 rounded-full mr-3 border border-[#2F2F2F]"
      />
      <View>
        <TextScallingFalse className="text-white text-lg font-medium">
          {item.firstName} {item.lastName}
        </TextScallingFalse>
        <TextScallingFalse className="text-[#EAEAEA] text-base font-light">
          @{item.username}
          {item.headline
            ? ` | ${item.headline.length > 18
              ? item.headline.slice(0, 18) + "..."
              : item.headline
            }`
            : ""}
        </TextScallingFalse>
      </View>
    </TouchableOpacity>
  )
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    backgroundColor: "#202020",
    padding: 22,
    paddingHorizontal: 30,
    borderRadius: 10,
    height: 180,
    gap: 12,
    width: '85%',
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchPage;
