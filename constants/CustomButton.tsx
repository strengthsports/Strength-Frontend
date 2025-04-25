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
    backgroundColor: "black", 
    paddingVertical: 9, 
    paddingHorizontal: 28,
    borderRadius: 20,
    alignItems: "center",
   
    marginVertical: 2, 
    borderColor: "#6F6F6F",
    borderWidth: 0.5, 
    marginRight:12,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "semibold",
  },
});

export default CustomButton;
