import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface CustomButtonProps {
  field: 'feetInches' | 'centimeters' | 'meters' | 'kilograms' | 'pounds'; 
  toggleSelectedField: (field: string) => void;
  selectedField: string;
  renderFieldValue: () => string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ field, toggleSelectedField, selectedField, renderFieldValue }) => (
  <TouchableOpacity
    activeOpacity={0.5}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 15,
    }}
    onPress={() => toggleSelectedField(field)}
  >
    <MaterialIcons
      name={selectedField === field ? "visibility" : "visibility-off"}
      size={26}
      color={selectedField === field ? "#12956B" : "grey"}
    />
    <Text allowFontScaling={false} style={{ marginLeft: 5 }}>
      {renderFieldValue()}
    </Text>
  </TouchableOpacity>
);

export default CustomButton;
