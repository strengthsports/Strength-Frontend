import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ToastConfig, ToastConfigParams } from 'react-native-toast-message';

// Extending the type to support various message formats
interface CustomToastConfigParams extends ToastConfigParams<any> {
  text3?: string;  // Add the text3 property as optional
}

export const toastConfig: ToastConfig = {
  success: ({ text1, text2, text3, props }: CustomToastConfigParams) => {
    const message = text1 || text2 || text3 || props?.message || "Success";
    
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="file-download-done" size={23} color="green" style={{marginTop: 2.5}} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.spacer}></View>
        </View>
      </View>
    );
  },
  
  error: ({ text1, text2, text3, props }: CustomToastConfigParams) => {
    // Check if the message contains success phrases
    const allTexts = [text1, text2, text3, props?.message].filter(Boolean);
    const message = allTexts[0] || "Error";
    
    const isSuccess = allTexts.some(text => 
      text && typeof text === 'string' && (
        text.includes("Login successful!") || 
        text.includes("Logged out successfully")
      )
    );
    
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {isSuccess ? (
            <MaterialIcons name="file-download-done" size={23} color="green" style={{marginTop: 2.5}} />
          ) : (
            <MaterialCommunityIcons name="window-close" size={20} color="red" />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.spacer}></View>
        </View>
      </View>
    );
  },
  
  info: ({ text1, text2, text3, props }: CustomToastConfigParams) => {
    const message = text1 || text2 || text3 || props?.message || "Info";
    
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="info" size={22} color="#3498db" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.spacer}></View>
        </View>
      </View>
    );
  },
  
  warning: ({ text1, text2, text3, props }: CustomToastConfigParams) => {
    const message = text1 || text2 || text3 || props?.message || "Warning";
    
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="warning" size={22} color="#F9A825" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.spacer}></View>
        </View>
      </View>
    );
  },
  
  // This allows your existing code to still work even if it uses the wrong type
  any_custom_type: ({ text1, text2, text3, props, type }: CustomToastConfigParams & { type?: string }) => {
    const allTexts = [text1, text2, text3, props?.message].filter(Boolean);
    const message = allTexts[0] || "Notification";
    
    // Check for success phrases
    const isSuccess = allTexts.some(text => 
      text && typeof text === 'string' && (
        text.includes("Login successful!") || 
        text.includes("Logged out successfully") ||
        text.toLowerCase().includes('success') || 
        text.toLowerCase().includes('complete') ||
        text.toLowerCase().includes('saved') ||
        text.toLowerCase().includes('updated')
      )
    );
    
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {isSuccess ? (
            <MaterialIcons name="file-download-done" size={23} color="green" style={{marginTop: 2.5}} />
          ) : type === 'warning' ? (
            <MaterialIcons name="warning" size={22} color="#F9A825" />
          ) : (
            <MaterialCommunityIcons name="window-close" size={20} color="red" />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.spacer}></View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#181818',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: -15,
    gap: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 30, 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center'
  },
  textContainer: {
    flexDirection: 'row'
  },
  messageText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '400'
  },
  spacer: {
    width: 10,
    height: 22
  }
});