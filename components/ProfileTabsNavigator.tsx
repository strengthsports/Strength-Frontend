import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import Overview from '~/components/ProfileTabComponents/Overview';
import Activity from '~/components/ProfileTabComponents/Activity';
import Teams from '~/components/ProfileTabComponents/Teams';
import Events from '~/components/ProfileTabComponents/Events';

const ProfileTabsNavigator = ({posts}) => {

  const [activeTab, setActiveTab] = useState('Overview'); // Default active tab

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <Overview posts={posts} />;
      case 'Activity':
        return <Activity />;
      case 'Events':
        return <Events />;
      case 'Teams':
        return <Teams />;
      default:
        return <Overview posts={posts} />;
    }
  };

  return (
    <View style={styles.tabContainer}>
      {/* Tab buttons */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Overview' && styles.activeTab]}
          onPress={() => setActiveTab('Overview')}
        >
          <Text style={[styles.tabText, activeTab === 'Overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Activity' && styles.activeTab]}
          onPress={() => setActiveTab('Activity')}
        >
          <Text style={[styles.tabText, activeTab === 'Activity' && styles.activeTabText]}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Events' && styles.activeTab]}
          onPress={() => setActiveTab('Events')}
        >
          <Text style={[styles.tabText, activeTab === 'Events' && styles.activeTabText]}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Teams' && styles.activeTab]}
          onPress={() => setActiveTab('Teams')}
        >
          <Text style={[styles.tabText, activeTab === 'Teams' && styles.activeTabText]}>Teams</Text>
        </TouchableOpacity>
        <View style={[styles.tabIndicator, { left: `${activeTab === 'Overview' ? 2 : activeTab === 'Activity' ? 27.6 : activeTab === 'Events' ? 51.4 : 74}%` }]} />
      </View>

      

      {/* Tab content */}
      <FlatList
        data={[{ key: activeTab }]} // Dynamic key for re-rendering content based on active tab
        renderItem={() => renderTabContent()}
        keyExtractor={(item) => item.key}
        scrollEnabled={false} // Disable scrolling in FlatList (content is handled manually)
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent:'center',
    gap:'11%',
    paddingTop: '0.5%',
    paddingBottom: '2%',
  },
  tabButton: {
    paddingVertical: 10,
  },
  tabText: {
    color: 'white',
    fontSize: 15,
  },
  activeTab: {
    borderBottomWidth: 0,
    borderBottomColor: '#12956B',
  },
  activeTabText: {
    color: '#12956B',
  },
  tabIndicator: {
    position: 'absolute',
    top: '106%',
    alignSelf:'center',
    width: '25%', // Adjust width as needed to fit the number of tabs
    height: 1.5,
    backgroundColor: '#12956B',
    borderRadius: 2,
  },
});

export default ProfileTabsNavigator;
