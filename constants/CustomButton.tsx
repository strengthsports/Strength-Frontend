import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { grey600 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";


interface CustomButtonProps {
  buttonName: string;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ buttonName, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{buttonName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black", // Button background color
    paddingVertical: 10, // Reduced padding for smaller button size
    paddingHorizontal: 16, // Adjusted padding for smaller button size
    borderRadius: 20, // More rounded corners
    alignItems: "center",
    // justifyContent: "center",
    marginVertical: 2, // Smaller margin
    borderColor: "#9D9D9D", // Gray border color
    borderWidth: 0.5, // Border width to make it visible
  },
  buttonText: {
    color: "white",
    fontSize: 14, // Smaller font size
    fontWeight: "bold",
  },
});

export default CustomButton;
