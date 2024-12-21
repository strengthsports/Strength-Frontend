import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions
} from "react-native";

const { height } = Dimensions.get('window');

const SetHeadline = () => {
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.topSafeArea} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/onboarding/logo2.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Strength</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.mainHeading}>Let's get you{'\n'}started</Text>
            <Text style={styles.stepText}>Step 1 of 3</Text>
            <Text style={styles.subHeading}>Set your sports Headline</Text>
            <Text style={styles.description}>
              Let others know your position, you can always change it later.
            </Text>

            <Text style={styles.inputLabel}>Headline</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#666"
              placeholder="Enter your headline"
            />

            <Text style={styles.exampleText}>Example:</Text>
            <View style={styles.exampleContainer}>
              <View style={styles.profileSection}>
                <Image 
                  source={require('../../assets/images/onboarding/nopic.jpg')}
                  style={styles.profileImage}
                />
                <Text style={styles.nameText}>Your Name</Text>
                <Text style={styles.roleText}>
                  Cricketer-Right hand batsman,{'\n'}
                  Ranji Trophy player
                </Text>
              </View>
            </View>
            <View style={styles.footer}>
            <TouchableOpacity style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
          </View>
     
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 8,
  },
  topSafeArea: {
    flex: 0,
    backgroundColor: 'black',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: height * 0.08,
  },
  logo: {
    width: 100,
    height: 60,
  },
  logoText: {
    color: 'white',
    fontSize: 13,
    marginTop: 8,
  },
  content: {
    flex: 1,
    marginTop: height * 0.03,
  },
  mainHeading: {
    fontSize: Platform.OS === 'ios' ? 40 : 36,
    fontWeight: '600',
    color: 'white',
    lineHeight: Platform.OS === 'ios' ? 46 : 42,
  },
  stepText: {
    color: '#666',
    fontSize: 15,
    marginTop: height * 0.02,
  },
  subHeading: {
    fontSize: Platform.OS === 'ios' ? 28 : 26,
    color: 'white',
    fontWeight: '600',
    marginTop: height * 0.015,
  },
  description: {
    fontSize: 15,
    color: '#666',
    marginTop: height * 0.01,
  },
  inputLabel: {
    color: 'white',
    fontSize: 16,
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white',
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  exampleText: {
    color: '#666',
    fontSize: 15,
    marginTop: height * 0.025,
  },
  exampleContainer: {
    flexDirection: 'row',
    marginTop: height * 0.015,
  },
  verticalLine: {
    width: 2,
    backgroundColor: '#00A67E',
    height: height * 0.18,
    marginRight: 16,
  },
  profileSection: {
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  nameText: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
  },
  roleText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
  footer: {
    bottom: 0,
    marginTop: height * 0.06,
  },
  nextButton: {
    backgroundColor: '#00A67E',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  skipButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 15,
  },
});

export default SetHeadline;