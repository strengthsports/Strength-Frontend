import NavigationLogo from '@/components/onboarding/Logo';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';

interface Sport {
  id: string;
  name: string;
  icon: any; // Replace with proper image import type
}

const sports: Sport[] = [
  { id: '1', name: 'Cricket', icon: require('../../assets/images/onboarding/logo2.png') },
  { id: '2', name: 'Football', icon: require('../../assets/images/onboarding/logo2.png') },
  { id: '3', name: 'Basketball', icon: require('../../assets/images/onboarding/logo2.png') },
  { id: '4', name: 'Badminton', icon: require('../../assets/images/onboarding/logo2.png') },
  { id: '5', name: 'Table Tennis', icon: require('../../assets/images/onboarding/logo2.png') },
  { id: '6', name: 'Tennis', icon: require('../../assets/images/onboarding/logo2.png') },
  { id: '7', name: 'Volleyball', icon: require('../../assets/images/onboarding/logo2.png') },
  { id: '8', name: 'Gym', icon: require('../../assets/images/onboarding/logo2.png') },
  { id: '9', name: 'Hockey', icon: require('../../assets/images/onboarding/logo2.png') },
  { id: '10', name: 'Karate', icon: require('../../assets/images/onboarding/logo2.png') },
];

const SportsChoice: React.FC = () => {
  const [selectedSports, setSelectedSports] = React.useState<Set<string>>(new Set());

  const toggleSport = (sportId: string) => {
    const newSelected = new Set(selectedSports);
    if (newSelected.has(sportId)) {
      newSelected.delete(sportId);
    } else {
      newSelected.add(sportId);
    }
    setSelectedSports(newSelected);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
     <NavigationLogo/>

      <Text style={styles.title}>Ready to dive in?{'\n'}Fantastic!</Text>
      
      <Text style={styles.subtitle}>What's your sport of choice?</Text>
      <Text style={styles.description}>
        Let us know your athletic passion as you sign up!
      </Text>

      <View style={styles.searchContainer}>
        <Image
          source={require('../../assets/images/onboarding/logo2.png')}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search...."
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.sportsGrid}>
          {sports.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              style={[
                styles.sportItem,
                selectedSports.has(sport.id) && styles.selectedSport,
              ]}
              onPress={() => toggleSport(sport.id)}
            >
              <View style={styles.sportContent}>
                <Image source={sport.icon} style={styles.sportIcon} />
                <Text style={styles.sportText} numberOfLines={1}>
  {sport.name}
</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can always select more than 1
        </Text>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  trophy: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  strengthText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  subtitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    height: 50,
  },
  scrollView: {
    flex: 1,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sportItem: {
    width: '31%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#464646',
    padding: 12,
    marginBottom: 15,
  },
  selectedSport: {
    backgroundColor: '#00A67E', // Filled background when selected
    borderColor: '#00A67E',
  },
  sportContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  sportText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
  },
  nextButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SportsChoice;