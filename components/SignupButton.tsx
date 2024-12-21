import { StyleSheet, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import React from 'react';

// Define the prop types
interface SignupButtonProps {
  onPress: (event: GestureResponderEvent) => void; // onPress should be a function handling the event
  children: React.ReactNode; // children can be any valid React node (string, element, etc.)
}

const SignupButton: React.FC<SignupButtonProps> = ({ onPress, children }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={{ width: 335, height: 42, backgroundColor: '#12956B', justifyContent: 'center', alignItems: 'center', borderRadius: 40 }}
    >
      {children}
    </TouchableOpacity>
  );
};

export default SignupButton;

const styles = StyleSheet.create({});
