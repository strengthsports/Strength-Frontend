import React from 'react';
import { View } from 'react-native';
import CustomButton from './CustomButtons';

interface CustomButtonWrapperProps {
  toggleSelectedField: (field: string) => void;
  selectedField: string;
  renderFieldValue: (field: string) => string;
  type: 'height' | 'weight'; // Add a `type` prop to differentiate
}

const CustomButtonWrapper: React.FC<CustomButtonWrapperProps> = ({ toggleSelectedField, selectedField, renderFieldValue, type }) => {
  const fields = type === 'height'
    ? ['feetInches', 'centimeters', 'meters'] // Fields for height
    : ['kilograms', 'pounds']; // Fields for weight

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {fields.map(field => (
        <CustomButton
          key={field}
          field={field}
          toggleSelectedField={toggleSelectedField}
          selectedField={selectedField}
          renderFieldValue={() => renderFieldValue(field)}
        />
      ))}
    </View>
  );
};

export default CustomButtonWrapper;
