import {
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";

// Define the prop types
interface SignupButtonProps {
  onPress: (event: GestureResponderEvent) => void; // onPress handler
  children: React.ReactNode; // Button content
  disabled: boolean;
}

const SignupButton: React.FC<SignupButtonProps> = ({
  onPress,
  children,
  disabled,
}) => {
  return Platform.OS === "android" ? (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#121212" }} // Ripple effect for Android
      style={{
        width: 335,
        height: 42,
        backgroundColor: "#12956B",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
      }}
      disabled={disabled}
    >
      {children}
    </Pressable>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={{
        width: 335,
        height: 42,
        backgroundColor: "#12956B",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
      }}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
};

export default SignupButton;

const styles = StyleSheet.create({});
