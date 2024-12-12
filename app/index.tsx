import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { TouchableOpacity, SafeAreaView } from 'react-native';
import { useEffect } from 'react';

const userState = true; // Replace with actual authentication state

export default function Home() {
  // useEffect(() => {
  //   // Navigate based on user state once the component has mounted
  //   if (userState) {
  //     router.push('/(tabs)');  // Navigate to home if logged in
  //   } else {
  //     router.push('/(auth)/login');  // Navigate to login if not logged in
  //   }
  // }, []); // Empty dependency array means this runs once after mount

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>Yo</ThemedText>
      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <ThemedText>to login</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(tabs)')}>
        <ThemedText>home</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
