import React from 'react';
import { StyleSheet, TextInput, View, TextInputProps } from 'react-native';

interface TextInputSectionProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean; // Accept secureTextEntry as a prop
  customStyle?: object;
}

const TextInputSection: React.FC<TextInputSectionProps> = ({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  secureTextEntry, // Destructure secureTextEntry
  customStyle,
}) => {
  return (
    <View style={{marginTop: 4}}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={'transparent'}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry} // Add secureTextEntry here
        style={[styles.input, customStyle]}
        textAlignVertical="center"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 335,
    height: 44,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5.5,
    color: 'white',
    fontSize: 18,
    paddingLeft: 10,
    paddingEnd: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
  },
});

export default TextInputSection;
