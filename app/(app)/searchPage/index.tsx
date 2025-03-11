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
  resetSearchHistory
} from "~/reduxStore/slices/explore/searchSlice";
import SearchInput from "~/components/search/searchInput";
import SearchHistoryText from "~/components/search/searchHistoryText";
import SearchHistoryProfile from "~/components/search/searchHistoryProfile";

const SearchPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = Dimensions.get("window");
  const { height } = Dimensions.get("window");

  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchBarHeight, setSearchBarHeight] = useState(0);


  // Redux State: Extract user info & search history
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const location = useSelector(
    (state: RootState) => state.auth.user?.address?.location
  );
  const latitude = location?.coordinates?.[1] ?? null;
  const longitude = location?.coordinates?.[0] ?? null;

  const searchHistory = useSelector((state: RootState) => 
    state.search.searchHistory.filter((item) => item !== null) // Filter out null values
  );
  const recentSearches = useSelector((state: RootState) => state.search.recentSearches);

  console.log("Search History (Stored Users):", searchHistory);

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
  const clearSearchHistory = () => {
    dispatch(resetSearchHistory());
  };
  
  // Handle Item Click (Save to Search History & Recent Searches)
  const handleItemPress = (user) => {
    console.log("Selected User:", user); // Debug log
    
    if (!user?._id) {
      console.error("Invalid user:", user); // Log invalid data
      return;
    }
  
    setSearchText(`${user.firstName} ${user.lastName}`);
    dispatch(addSearchHistory(user)); // Store full user object in Redux
    dispatch(addRecentSearch(`${user.firstName} ${user.lastName}`));
  };

  return (
    <SafeAreaView>
      {/* Header Section */}
      <View className="flex-row items-center my-4 gap-x-2 max-w-[640px] w-[90%] mx-auto" onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setSearchBarHeight(height); // 🟢 Store search bar height dynamically
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <SearchInput searchText={searchText} setSearchText={setSearchText} />
      </View>

      {/* Live Search Results Dropdown */}
      {searchText.length > 0 && (
        <View
          style={{
            backgroundColor: "black",
            width: width,
            padding: 8,
            maxHeight: height,
            alignSelf: "center",
            position: "absolute",
            top: searchBarHeight+10,
            zIndex: 10,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <FlatList
              data={searchResults || []}
              renderItem={({ item }) =>
                item ? (
                  <TouchableOpacity
                    onPress={() => handleItemPress(item)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: "black",
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
                      style={{ color: "white", fontSize: 16, fontWeight: "300" }}
                    >
                      {item.firstName} {item.lastName}
                    </Text>
                  </TouchableOpacity>
                ) : null
              }
              keyExtractor={(item, index) => (item?._id ? item._id.toString() : index.toString())}
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

          {/* Search History Profiles */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={searchHistory}
            renderItem={({ item }) =>
              item ? (
                <SearchHistoryProfile
                  name={item.firstName ?? "Mrinal"}
                  username={item.username ?? "Anand"}
                  profilePic={item.profilePic}
                />
              ) : null
            }
            keyExtractor={(item, index) => `${item?._id || index}-${index}`}
            contentContainerStyle={{
              paddingHorizontal: 0,
              gap: 16,
            }}
          />

          {/* Recent Searches */}
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
