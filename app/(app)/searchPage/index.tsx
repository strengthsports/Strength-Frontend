import React, { useState, useEffect } from "react";
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
} from "~/reduxStore/slices/explore/searchSlice";
import SearchInput from "~/components/search/searchInput";
import SearchHistoryText from "~/components/search/searchHistoryText";
import SearchHistoryProfile from "~/components/search/searchHistoryProfile";

const SearchPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = Dimensions.get("window");

  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Redux State: Extract user info & search history
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const location = useSelector(
    (state: RootState) => state.auth.user?.address?.location
  );
  const latitude = location?.coordinates?.[1] ?? null;
  const longitude = location?.coordinates?.[0] ?? null;

  const searchHistory = useSelector((state: RootState) =>
    state.search.searchHistory.filter((id) => id !== undefined && id !== null)
  );
  
  const recentSearches = useSelector(
    (state: RootState) => state.search.recentSearches
  );
  const authUser = useSelector((state: RootState) => state.auth.user);

  console.log(searchHistory);

  // Search API Mutation Hook
  const [searchUsers, { isLoading }] = useSearchUsersMutation();

  useEffect(() => {
    if (searchText.length > 0) {
      setIsSearching(true);
      const fetchResults = async () => {
        try {
          const response = await searchUsers({
            query: searchText,
            limit: 10,
            page: 1,
            latitude,
            longitude,
            userId,
          }).unwrap();

          setSearchResults(response || []);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setIsSearching(false);
        }
      };

      const debounce = setTimeout(fetchResults, 300); // Add debounce to reduce API calls
      return () => clearTimeout(debounce);
    } else {
      setSearchResults([]);
    }
  }, [searchText, latitude, longitude, userId]);

  // Function to Get User Details from Redux Store (by userId)
  const getUserById = (id: string) => {
    return authUser?.id === id ? authUser : null;
  };
  console.log("Search History (Raw):", searchHistory);

  // Filter valid users from search history
  const historyUsers = searchHistory.map(getUserById).filter(Boolean);
  console.log(historyUsers);

  // Handle Item Click (Save to Search History & Recent Searches)
  const handleItemPress = (item: { _id: string; firstName: string; lastName: string }) => {
    console.log("Selected User ID:", item._id); // Debug log
    
    if (!item._id) {
      console.error("Invalid user ID:", item); // Log invalid data
      return;
    }
  
    setSearchText(`${item.firstName} ${item.lastName}`);
    dispatch(addSearchHistory(item._id)); // Use _id instead of id
    dispatch(addRecentSearch(`${item.firstName} ${item.lastName}`));
  };
  

  return (
    <SafeAreaView>
      {/* Header Section */}
      <View className="flex-row items-center my-4 gap-x-2 max-w-[640px] w-[90%] mx-auto">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <SearchInput searchText={searchText} setSearchText={setSearchText} />
      </View>

      {/* Live Search Results Dropdown */}
      {searchText.length > 0 && (
        <View
          style={{
            backgroundColor: "#1E1E1E",
            width: "90%",
            borderRadius: 10,
            padding: 10,
            maxHeight: 200,
            alignSelf: "center",
            position: "absolute",
            top: 80,
            zIndex: 10,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <FlatList
              data={searchResults || []}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleItemPress(item)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: "#444",
                  }}
                >
                  {item.profilePic && (
                    <Image
                      source={{ uri: item.profilePic }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        marginRight: 10,
                      }}
                    />
                  )}

                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "500" }}
                  >
                    {item.firstName} {item.lastName}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) =>
                item?._id ? item._id.toString() : index.toString()
              }
            />
          )}
        </View>
      )}

      {/* Recent Profiles and Search History */}
      {searchText.length === 0 && (
        <View className="px-5">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl text-[#808080] mb-2">Recent</Text>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={historyUsers}
            renderItem={({ item }) => (
              <SearchHistoryProfile
                name={item.firstName}
                username={item.username}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 0,
              gap: 16,
            }}
          />

          <FlatList
            showsVerticalScrollIndicator={false}
            data={recentSearches}
            renderItem={({ item }) => <SearchHistoryText searchText={item} />}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ gap: 14, paddingVertical: 16 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchPage;
