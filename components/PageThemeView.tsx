import { StyleSheet, View, SafeAreaView, KeyboardAvoidingView, StatusBar} from 'react-native';
import React from 'react';

interface PageThemeViewProps {
  children: React.ReactNode; // Define children prop
}

const PageThemeView: React.FC<PageThemeViewProps> = ({ children }) => {
  return (
    <KeyboardAvoidingView style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default PageThemeView;

const styles = StyleSheet.create({});
