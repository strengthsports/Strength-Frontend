import NavigationLogo from '@/components/onboarding/Logo';
import React from 'react';
import {
  View,
  Text,
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
  icon: any;
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
    <SafeAreaView className="flex-1 bg-black px-6">
        <NavigationLogo />
      <StatusBar barStyle="light-content" />
      

      <Text className="text-white text-4xl font-bold mt-8 mb-10 leading-tight">
        Ready to dive in?{'\n'}Fantastic!
      </Text>
      
      <Text className="text-white text-2xl font-bold mb-3">
        What's your sport of choice?
      </Text>
      
      <Text className="text-gray-400 text-lg mb-8">
        Let us know your athletic passion as you sign up!
      </Text>

      <View className="flex-row items-center  rounded-2xl px-5 mb-8 h-14 border border-white">
        <Image
          source={require('../../assets/images/onboarding/logo2.png')}
          className="w-5 h-5 mr-2"
        />
        <TextInput
          className="flex-1 text-white h-[50px]"
          placeholder="Search...."
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView className="flex-1">
        <View className="flex-row flex-wrap justify-between">
          {sports.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              className={`w-[31%] rounded-lg border mb-4 p-3 ${
                selectedSports.has(sport.id)
                  ? 'bg-[#00A67E] border-[#00A67E]'
                  : 'border-[#464646]'
              }`}
              onPress={() => toggleSport(sport.id)}
            >
              <View className="flex-row items-center">
                <Image source={sport.icon} className="w-5 h-5 mr-2" />
                <Text className="text-white text-sm flex-1 text-center" numberOfLines={1}>
                  {sport.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="mt-6 mb-8 flex-row justify-between items-center">
        <Text className="text-gray-300 text-base">
          You can always select more than 1
        </Text>
        <TouchableOpacity className="bg-[#333] px-8 py-4 rounded-2xl">
          <Text className="text-white text-lg font-medium">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SportsChoice;