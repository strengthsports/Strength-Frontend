import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import NavigationLogo from '../../components/onboarding/Logo';

interface SupportCardProps {
  icon: string;
  id: string;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

interface SportData {
  id: string;
  icon: string;
}

const SupportCard: React.FC<SupportCardProps> = ({ icon, id, isSelected, onToggleSelect }) => (
  <View style={styles.card}>
    <TouchableOpacity style={styles.closeButton} onPress={() => onToggleSelect(id)}>
      <Text style={styles.closeButtonText}>✕</Text>
    </TouchableOpacity>
    
    <View style={styles.cardContent}>
      <View style={styles.iconContainer}>
        <Image 
          source={{ uri: icon }}
          style={styles.sportIcon}
        />
      </View>
      
      <Text style={styles.cardTitle}>Strength</Text>
      <Text style={styles.cardSubtitle}>Step into the world of sports</Text>
      
      <TouchableOpacity 
        style={[styles.supportButton, isSelected && styles.supportButtonSelected]}
        onPress={() => onToggleSelect(id)}
      >
        <Text style={styles.supportButtonText}>{isSelected ? 'Remove' : 'Support'}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const SuggestedSupportsScreen: React.FC = () => {
  const sportsData: SportData[] = [
    { id: '1', icon: 'trophy-icon-uri' },
    { id: '2', icon: 'football-icon-uri' },
    { id: '3', icon: 'basketball-icon-uri' },
    { id: '4', icon: 'volleyball-icon-uri' },
    { id: '5', icon: 'karate-icon-uri' },
    { id: '6', icon: 'cricket-icon-uri' },
    { id: '7', icon: 'tennis-icon-uri' },
    { id: '8', icon: 'baseball-icon-uri' },
  ];

  const [selectedSupports, setSelectedSupports] = useState<string[]>([]);

  const handleToggleSelect = (id: string) => {
    setSelectedSupports(prevSelected => 
      prevSelected.includes(id) ? prevSelected.filter(supportId => supportId !== id) : [...prevSelected, id]
    );
  };

  const handleClose = () => {
    console.log('Closed cards:', selectedSupports);
  };

  const handleSupport = () => {
    console.log('Supported cards:', selectedSupports);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <NavigationLogo />
    
      <Text style={styles.stepText}>Step 3 of 3</Text>
      <Text style={styles.title}>Suggested Followers</Text>
      <Text style={styles.subtitle}>
        Supporting others lets you see updates and keep in touch.
      </Text>

      <ScrollView style={styles.scrollView}>
        <View style={styles.cardsGrid}>
          {sportsData.map((sport) => (
            <SupportCard
              key={sport.id}
              id={sport.id}
              icon={sport.icon}
              isSelected={selectedSupports.includes(sport.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.skipButton, selectedSupports.length > 0 && styles.continueButton]}
        onPress={handleSupport}
      >
        <Text style={styles.skipButtonText}>{selectedSupports.length > 0 ? 'Continue' : 'Skip for now'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 28,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  stepText: {
    color: '#808080',
    fontSize: 16,
    marginTop: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    color: '#808080',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 16,
    borderColor: '#464646',
    padding: 16,
    borderWidth: 1,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 1,
    padding: 4,
  },
  closeButtonText: {
    color: '#808080',
    fontSize: 16,
  },
  cardContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sportIcon: {
    width: 40,
    height: 40,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#808080',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  supportButton: {
    borderWidth: 1,
    borderColor: '#00A67E',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  supportButtonSelected: {
    backgroundColor: '#00A67E', // Filled background when selected
    borderColor: '#00A67E',
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  continueButton: {
    alignItems: 'center',
    // backgroundColor: '#00A67E', // Filled background when "Continue"
    borderRadius: 20,
    width: '50%',
    alignSelf: 'center',
  },
});

export default SuggestedSupportsScreen;
