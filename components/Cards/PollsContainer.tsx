import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import TextScallingFalse from "../CentralText";

interface PollsContainerProps {
  onClose: () => void; // Function to close the poll UI
}

const PollsContainer: React.FC<PollsContainerProps> = ({ onClose }) => {
  const [options, setOptions] = useState(["", ""]); // Two default inputs
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const addOption = () => {
    if (options.length < 4) {
      // Restrict to 5 options max
      setOptions([...options, ""]);
    }
  };

  const updateOption = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextScallingFalse style={styles.title}>Polls</TextScallingFalse>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.closeButton}
          onPress={onClose}
        >
          <AntDesign name="close" size={14} color="grey" />
        </TouchableOpacity>
      </View>

      {/* Dynamic Poll Options */}
      <View style={{ width: "100%", paddingVertical: 10 }}>
        {options.map((option, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            placeholder={`Choice ${index + 1}...`}
            placeholderTextColor="grey"
            value={option}
            onChangeText={(text) => updateOption(text, index)}
            style={styles.optionInput}
          />
        ))}
      </View>

      {/* Add Option Button */}
      {options.length < 4 && (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.addButton}
          onPress={addOption}
        >
          <Text style={styles.addButtonText}>Add Option</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PollsContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#181818",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
    width: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.2)",
    width: 27,
    height: 27,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  optionInput: {
    fontSize: 16,
    color: "white",
    paddingHorizontal: 16,
    height: 45,
    backgroundColor: "#181818",
    borderWidth: 0.8,
    borderColor: "grey",
    borderRadius: 10,
    paddingVertical: 8,
    marginVertical: 5,
  },
  addButton: {
    padding: 12,
    backgroundColor: "#181818",
    borderWidth: 0.8,
    borderColor: "grey",
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 15,
  },
});
