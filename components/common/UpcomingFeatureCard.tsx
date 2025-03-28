import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import calm from "@/assets/images/calm.gif";

// Get screen height for responsive height
const { height: screenHeight } = Dimensions.get('window');

const UnderDevelopmentModal = () => {
  // State to control modal visibility
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={() => setIsVisible(false)} //for android back button
    >
      <View style={styles.overlay}>
        {/* Card container */}
        <View style={styles.card}>
          <View style={styles.topSection}>
            <Image
              source={calm}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Bottom section with text and button */}
          <View style={styles.bottomSection}>
            <Text style={styles.mainText}>
              The Feature is currently under development and will be available in the upcoming version.
            </Text>
            <Text style={styles.subText}>So stay tuned.</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  card: {
    width: '80%',
    height: screenHeight * 0.5,
    backgroundColor: '#1C2526',
    borderRadius: 10,
    overflow: 'hidden',
  },
  topSection: {
    flex: 0.6,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '80%',
    height: '80%',
  },
  bottomSection: {
    flex: 0.4,
    backgroundColor: '#1C2526',
    padding: 20,
    alignItems: 'center',
  },
  mainText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  subText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#28A745',
    borderRadius: 20,
    height: 40,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default UnderDevelopmentModal;