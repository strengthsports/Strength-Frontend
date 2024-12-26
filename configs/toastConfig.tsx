import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ToastConfig, ToastConfigParams } from 'react-native-toast-message';

// Extending the type to support text3
interface CustomToastConfigParams extends ToastConfigParams<any> {
  text3?: string;  // Add the text3 property as optional
}

export const toastConfig: ToastConfig = {
  error: ({ text1, text2, text3 }: CustomToastConfigParams) => {
    // Check if the message contains "Login successful!"
    const isSuccess = [text1, text2, text3].some((text) => text?.includes("Login successful!"));

    return (
      <View
        style={{
          backgroundColor: '#181818',
          padding: 10,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          marginTop: -15,
          gap: 7,
        }}
      >
        <View style={{ width: 30, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          {/* Conditionally render the checkmark for success or close icon for error */}
          {isSuccess ? (
            <MaterialIcons name="file-download-done" style={{marginTop: 2.5}} size={23} color="green" />
          ) : (
            <MaterialCommunityIcons name="window-close" size={20} color="red" />
          )}
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: 'white', fontSize: 15, fontWeight: '400' }}>
            {text1 || text2 || text3}
          </Text>
          <View style={{ width: 10, height: 22 }}></View>
        </View>
      </View>
    );
  },
};
