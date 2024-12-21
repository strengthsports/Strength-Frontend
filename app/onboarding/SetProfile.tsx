import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import NavigationLogo from '@/components/onboarding/Logo';

interface ProfilePictureScreenProps {
  onImageSelected?: (uri: string) => void;
  onSkip?: () => void;
  containerStyle?: string;
}

const ProfilePictureScreen: React.FC<ProfilePictureScreenProps> = ({
  onImageSelected,
  onSkip,
  containerStyle,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async (): Promise<void> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImage(result.assets[0].uri);
        onImageSelected?.(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    }
  };

  const handleSkip = (): void => {
    onSkip?.();
  };

  const handleContinue = (): void => {
    // Add your "Continue" functionality here (e.g., navigation or state updates)
    router.push('/onboarding/SetHeadline'); // Replace with your actual route
  };

  return (
    <SafeAreaView className={`flex-1 bg-black px-8 pt-${Platform.OS === 'android' ? StatusBar.currentHeight : 0} ${containerStyle}`}>
      <StatusBar barStyle="light-content" />

      <NavigationLogo />

      <Text className="text-gray-400 text-lg mt-10">Step 2 of 3</Text>

      <Text className="text-white text-2xl font-bold mt-2">Pick a profile picture</Text>
      <Text className="text-gray-400 text-base mt-2">Adding a photo helps people recognize you.</Text>

      <View className="items-center mt-10">
        <View className="w-36 h-36 rounded-full bg-gray-700 justify-center items-center relative">
          {image ? (
            <Image 
              source={{ uri: image }} 
              className="w-36 h-36 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-gray-600 justify-center items-center">
              <View className="w-10 h-10 bg-gray-400 rounded-full" />
            </View>
          )}
          <TouchableOpacity 
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#00A67E] justify-center items-center" 
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <Text className="text-white text-xl font-bold">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        className="bg-[#00A67E] rounded-full h-12 justify-center items-center mt-10" 
        onPress={image ? handleContinue : pickImage} // Conditional function based on image state
        activeOpacity={0.8}
      >
        <Text className="text-white text-base font-semibold">
          {image ? 'Continue' : 'Add a photo'} {/* Change text based on image state */}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="mt-5 py-2 items-center" 
        onPress={handleSkip} 
        activeOpacity={0.6}
      >
        <Text className="text-gray-400 text-base">Skip for now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfilePictureScreen;
