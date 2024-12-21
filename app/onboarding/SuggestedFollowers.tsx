import React, { useState } from 'react';
import {
  View,
  Text,
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
  <View className="w-48 rounded-xl mb-4 border border-[#464646] p-4 relative">
    <TouchableOpacity className="absolute right-2 top-2 z-10 p-1" onPress={() => onToggleSelect(id)}>
      <Text className="text-[#808080] text-lg">✕</Text>
    </TouchableOpacity>
    
    <View className="items-center">
      <View className="w-15 h-15 rounded-full bg-white justify-center items-center mb-3">
        <Image 
          source={{ uri: icon }}
          className="w-10 h-10"
        />
      </View>
      
      <Text className="text-white text-lg font-semibold mb-1">Strength</Text>
      <Text className="text-[#808080] text-sm text-center mb-3">Step into the world of sports</Text>
      
      <TouchableOpacity 
        className={`border border-[#00A67E] rounded-full py-2 px-6 ${isSelected ? 'bg-[#00A67E]' : ''}`}
        onPress={() => onToggleSelect(id)}
      >
        <Text className="text-white text-base font-semibold">{isSelected ? 'Remove' : 'Support'}</Text>
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
    <SafeAreaView className="flex-1 bg-black px-7">
      <StatusBar barStyle="light-content" />
      <NavigationLogo />
    
      <Text className="text-[#808080] text-lg mt-10">Step 3 of 3</Text>
      <Text className="text-white text-3xl font-bold mt-3">Suggested Followers</Text>
      <Text className="text-[#808080] text-lg mt-2 mb-6">
        Supporting others lets you see updates and keep in touch.
      </Text>

      <ScrollView className="flex-1">
        <View className="flex-row flex-wrap justify-between">
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
        className={`py-4 items-center ${selectedSupports.length > 0 ? ' rounded-xl w-2/4 self-center' : ''}`}
        onPress={handleSupport}
      >
        <Text className="text-white text-lg">{selectedSupports.length > 0 ? 'Continue' : 'Skip for now'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SuggestedSupportsScreen;
