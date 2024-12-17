import { StyleSheet, View, SafeAreaView } from 'react-native';
import React from 'react';

interface PageThemeViewProps {
  children: React.ReactNode; // Define children prop
}

const PageThemeView: React.FC<PageThemeViewProps> = ({ children }) => {
  return (
    <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
      {children} {/* Render the children passed to this component */}
    </SafeAreaView>
  );
};

export default PageThemeView;

const styles = StyleSheet.create({});
