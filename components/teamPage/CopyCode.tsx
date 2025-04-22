import React, { useState } from "react";
import {View, TouchableOpacity, Text, StyleSheet, Animated, Easing } from "react-native";
import * as Clipboard from 'expo-clipboard';

const CopyCode = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const scaleAnim = new Animated.Value(1);
  const opacityAnim = new Animated.Value(1);

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(code);
      
      // Button press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Show copied state
      setCopied(true);
      setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start(() => {
          setCopied(false);
          opacityAnim.setValue(1);
        });
      }, 1500);
      
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <View style={styles.container}>
     
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleCopy}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {copied ? "✓ Copied" : "Copy Code"}
          </Text>
        </TouchableOpacity>
     
      
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    backgroundColor: "#141414",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#9D9D9D",
    borderWidth: 0.5,
    marginLeft: 8,
    minWidth: 80,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: '500',
  },
  tooltip: {
    position: 'absolute',
    top: -30,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CopyCode;