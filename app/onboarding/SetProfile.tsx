import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ProfilePictureScreenProps {
  onImageSelected?: (uri: string) => void;
  onSkip?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  headerText: TextStyle;
  stepText: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  profileContainer: ViewStyle;
  profileCircle: ViewStyle;
  profileImage: ImageStyle;
  placeholderImage: ViewStyle;
  placeholderIcon: ViewStyle;
  addButton: ViewStyle;
  addButtonText: TextStyle;
  addPhotoButton: ViewStyle;
  addPhotoButtonText: TextStyle;
  skipButton: ViewStyle;
  skipButtonText: TextStyle;
}

const ProfilePictureScreen: React.FC<ProfilePictureScreenProps> = ({
  onImageSelected,
  onSkip,
  containerStyle,
}) => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async (): Promise<void> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (permissionResult.status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correctly updated
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

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <StatusBar barStyle="light-content" />
      
        <View style={styles.logoContainer}>
                  <Image 
                    source={require('../../assets/images/onboarding/logo2.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <Text style={styles.logoText}>Strength</Text>
                </View>

      <Text style={styles.stepText}>Step 1 of 3</Text>

      <Text style={styles.title}>Pick a profile picture</Text>
      <Text style={styles.subtitle}>Adding a photo helps people recognize you.</Text>

      <View style={styles.profileContainer}>
        <View style={styles.profileCircle}>
          {image ? (
            <Image 
              source={{ uri: image }} 
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <View style={styles.placeholderIcon} />
            </View>
          )}
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.addPhotoButton} 
        onPress={pickImage}
        activeOpacity={0.8}
      >
        <Text style={styles.addPhotoButtonText}>Add a photo</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.6}
      >
        <Text style={styles.skipButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

  },
  header: {
    alignItems: 'center',
    marginTop: 20,
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
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  profileCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#404040',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#606060',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#808080',
    borderRadius: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00A67E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addPhotoButton: {
    backgroundColor: '#00A67E',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  addPhotoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#808080',
    fontSize: 16,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: 150,
    height: 80,
  },
  logoText: {
    color: 'white',
    fontSize: 13,
    marginTop: 8,
  },
});

export default ProfilePictureScreen;
