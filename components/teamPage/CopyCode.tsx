import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Clipboard } from 'react-native';


const CopyCode= () => {
  const handleCopy = () => {
    Clipboard.setString("RKR1421"); 
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleCopy}>
      <Text style={styles.buttonText}>Copy Code</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black", 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 20, 
    alignItems: "center",
    marginVertical: 2, 
    borderColor: "#9D9D9D", 
    borderWidth: 0.5,
    marginLeft: 12,
    marginBottom: 2,
    marginTop: -2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default CopyCode;
