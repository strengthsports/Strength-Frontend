import React, { useState } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Tab, TabView } from "react-native-elements";

const Explore = () => {
  return (
    <>
      <ScrollView style={styles.container}>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Explore</Text>
    <ScrollView className="h-36">
      <View className="h-12 w-48 m-6 bg-slate-700">
        <Text className="text-white">Explore</Text>
      </View>
    </ScrollView>

    <ScrollView className="h-36">
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
      <Text className="text-white">Ver scroll</Text>
    </ScrollView>
    <Text className="text-white">Yo</Text>
    <View className="h-12 w-48 m-6 bg-slate-700">
      <Text className="text-white">Explore</Text>
    </View>
    <Text className="text-white">Explore</Text>
    <View className="h-12 w-48 m-6 bg-slate-700">
      <Text className="text-white">Explore</Text>
    </View>
    <Text className="text-white">Yo</Text>
    <View className="h-12 w-48 m-6 bg-slate-700">
      <Text className="text-white">Explore</Text>
    </View>
    <Text className="text-white">Explore</Text>
    {/* <Text className="text-white">Yo</Text>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Explore</Text>
    <Text className="text-white">Explore</Text> */}
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Yo</Text>
    <Text className="text-white">Yo</Text>
      </ScrollView>
    </>
  );
};

export default Explore;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes up the full screen
  },
});