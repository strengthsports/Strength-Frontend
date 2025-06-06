import React from 'react';
import { Text, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import TextScallingFalse from '../CentralText';

const GradientText = ({ text, style }) => {
  return (
    <MaskedView
      maskElement={
        <View style={{ backgroundColor: 'transparent' }}>
          <TextScallingFalse style={[style, { color: 'black'}]}>
            {text}
          </TextScallingFalse>
        </View>
      }
    >
      <LinearGradient
        colors={['#E7E7E8', '#626262']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: 300,      // ✅ FIXED WIDTH
          height: 50,      // ✅ FIXED HEIGHT
        }}
      />
    </MaskedView>
  );
};

export default GradientText;
