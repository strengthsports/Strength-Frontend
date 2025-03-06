import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { TextInput } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SearchInput = () => {
  const searchInputRef = useRef<TextInput>(null);

  // Focus the TextInput on component mount
  useEffect(() => {
    if (searchInputRef.current) {
      // Add a slight delay to ensure the component is fully mounted
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {}}
      className="flex-row bg-neutral-800 rounded-md px-3 items-center flex-1"
    >
      <MaterialCommunityIcons name="magnify" size={24} color="grey" />
      <TextInput
        ref={searchInputRef}
        className="w-full h-full text-white"
        placeholderTextColor="grey"
        placeholder="Search..."
      />
    </TouchableOpacity>
  );
};

export default SearchInput;
