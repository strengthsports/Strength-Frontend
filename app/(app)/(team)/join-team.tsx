import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { AppDispatch, RootState } from "~/reduxStore";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTeams, selectAllTeams, selectAllTeamsLoading } from "~/reduxStore/slices/team/teamSlice";
import PageThemeView from '~/components/PageThemeView';
// import { BackIcon2 } from '~/components/Icons';
import { router } from 'expo-router';
import TextScallingFalse from '~/components/CentralText';
import BackIcon2 from '~/components/SvgIcons/Common_Icons/BackIcon2';
import SportsIndicator from '~/components/SvgIcons/SideMenu/SportsIndicator';
// import TextScallingFalse from '~/components/TextScallingFalse';

const TeamListView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const teams = useSelector(selectAllTeams);
  const loading = useSelector(selectAllTeamsLoading);
  const [searchText, setSearchText] = useState('');
  const [searchBarHeight, setSearchBarHeight] = useState(0);

  useEffect(() => {
    dispatch(fetchAllTeams({ page: 1, limit: 90 }));
    console.log("All Teams --->", JSON.stringify(teams, null, 2));
  }, [dispatch]);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchText.toLowerCase())
  );

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
      <TextScallingFalse className="text-[#9FAAB5] text-[12px] font-regular ml-[3px]">{item.address.city},{" "}{item.address.state},{" "}{item.address.country}</TextScallingFalse>
      </View>
      </View>
    </TouchableOpacity>
  );

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
            onChangeText={setSearchText}
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
          data={filteredTeams}
          renderItem={renderTeamItem}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
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
  // Search styles matching your modal's dark theme
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
  
  // List container with dark theme
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "black", // Dark background
  },
  
  // Team card matching modal's styling
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  
  teamLogo: {
    borderWidth:1,
    borderColor:"#181818",
    width: 44,
    height: 44,
    borderRadius: 6,
    marginRight: 15,
    backgroundColor: '#303030', // Dark placeholder
  },
  
  
  
  // Loading and empty states
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
    color: '#808080', // Gray text
    fontWeight: '400',
    fontSize: 14,
  },
  
  // Modal-like overlay (if needed for any future modal in this component)
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 1000,
  },
  
  modalContainer: {
    backgroundColor: "#202020",
    padding: 22,
    paddingHorizontal: 30,
    borderRadius: 10,
    height: 180,
    gap: 12,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TeamListView;