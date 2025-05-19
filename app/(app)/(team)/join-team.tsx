import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { AppDispatch, RootState } from "~/reduxStore";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTeams, selectAllTeams, selectAllTeamsLoading } from "~/reduxStore/slices/team/teamSlice";
import PageThemeView from '~/components/PageThemeView';
import { router } from 'expo-router';
import TextScallingFalse from '~/components/CentralText';
import BackIcon2 from '~/components/SvgIcons/Common_Icons/BackIcon2';
import SportsIndicator from '~/components/SvgIcons/SideMenu/SportsIndicator';

const TeamListView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const teams = useSelector(selectAllTeams);
  const loading = useSelector(selectAllTeamsLoading);
  const [searchText, setSearchText] = useState('');
  const [searchBarHeight, setSearchBarHeight] = useState(0);
  const [displayLimit, setDisplayLimit] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    dispatch(fetchAllTeams({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Filter teams based on search text (searches through complete list)
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Teams to display (limited initially, or all if searching)
  const displayTeams = searchText ? filteredTeams : filteredTeams.slice(0, displayLimit);

  const loadMoreTeams = () => {
    if (!searchText && displayLimit < teams.length && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simulate network request delay
      setTimeout(() => {
        setDisplayLimit(prev => prev + 10);
        setIsLoadingMore(false);
      }, 2000);
    }
  };

  const renderTeamItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.teamCard}
      activeOpacity={0.7}
      onPress={() => router.push(`../(team)/teams/${item._id}`)}
    >
      <Image
        source={{ uri: item.logo?.url || 'https://via.placeholder.com/50' }}
        style={styles.teamLogo}
      />
      <View style={{gap: 4}}>
        <TextScallingFalse className="text-white text-[14px] font-semibold ">{item.name}</TextScallingFalse>
        <View className="flex-row" style={{justifyContent:'center', alignItems:'center', gap: 3}}>
          <SportsIndicator/> 
          <TextScallingFalse className='text-[#12956B] text-[12px] font-regular mr-[3px]'>{item.sport.name}</TextScallingFalse>
          <View className='w-[2px] h-[2px] bg-[#9FAAB5] rounded-full'></View>
          <TextScallingFalse className="text-[#9FAAB5] text-[12px] font-regular ml-[3px]">
            {item.address.city},{" "}{item.address.state},{" "}{item.address.country}
          </TextScallingFalse>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color="#808080" />
      </View>
    );
  };

  return (
    <PageThemeView>
      {/* Search Header */}
      <View
        className="flex-row items-center my-3 gap-x-5 max-w-[640px] w-[92%] mx-auto"
        onLayout={(e) => setSearchBarHeight(e.nativeEvent.layout.height)}
      >
        <TouchableOpacity
          style={{ width: 20, height: 40, justifyContent: "center" }}
          onPress={() => router.back()}
        >
         <BackIcon2/>
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search teams..."
            placeholderTextColor="#808080"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              // Reset display limit when searching
              if (text) {
                setDisplayLimit(10);
              }
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Content */}
      {loading && teams.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#808080" />
        </View>
      ) : (
        <FlatList
          data={displayTeams}
          renderItem={renderTeamItem}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          onEndReached={loadMoreTeams}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <TextScallingFalse style={styles.emptyText}>
                {searchText ? 'No teams found matching your search' : 'No teams available'}
              </TextScallingFalse>
            </View>
          }
        />
      )}
    </PageThemeView>
  );
};

const styles = StyleSheet.create({
  searchInputContainer: {
    flex: 1,
    backgroundColor: "#202020",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  listContainer: {
    marginTop: 10,
    marginBottom:50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "black",
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  teamLogo: {
    borderWidth: 1,
    borderColor: "#181818",
    width: 44,
    height: 44,
    borderRadius: 6,
    marginRight: 15,
    backgroundColor: '#303030',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#121212",
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    backgroundColor: "#121212",
  },
  emptyText: {
    color: '#808080',
    fontWeight: '400',
    fontSize: 14,
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default TeamListView;