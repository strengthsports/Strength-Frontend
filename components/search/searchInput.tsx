import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { TextInput } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import SearchIcon from "../SvgIcons/Common_Icons/SearchIcon";

const SearchInput = ({ searchText, setSearchText }: { searchText: string; setSearchText: (text: string) => void }) => {
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
    <TouchableOpacity activeOpacity={0.5}
      onPress={() => {}}
      className="flex-row bg-[#212121] rounded-3xl h-[40px] border-[0.5px] border-[#343434] px-4 items-center flex-1">
      {/* <Feather name="search" size={22} color="grey" /> */}
      <SearchIcon />
      <TextInput
        ref={searchInputRef}
        className="w-full h-full px-3 text-[13px] text-white"
        placeholderTextColor="grey"
        placeholder="Search..."
        value={searchText}
        onChangeText={setSearchText} // Pass the input text to parent state

      />
    </TouchableOpacity>
  );
};

export default SearchInput;
