import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import TextScallingFalse from "../CentralText";
import SearchIcon from "../SvgIcons/Common_Icons/SearchIcon";
import { Colors } from "~/constants/Colors";
import BackIcon2 from "../SvgIcons/Common_Icons/BackIcon2";

type SearchBarProps = {
  mode?: "show" | "search";
  searchText?: string;
  placeholder?: string;
  onChangeSearchText?: (text: string) => void;
  marginTop?: any;
  marginBottom?: any;
};

const SearchBar = ({
  mode = "show",
  searchText,
  placeholder,
  onChangeSearchText,
  marginTop,
  marginBottom,
}: SearchBarProps) => {
  const router = useRouter();

  return (
    <View
      className="flex-row px-5 bg-black"
      style={{
        marginTop: marginTop ?? 12,
        marginBottom: marginBottom ?? 12,
      }}
    >
      {mode === "show" ? (
        <>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.5}
            style={{ width: 35, justifyContent: "center" }}
          >
            <BackIcon2 />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row bg-[#212121] border-[0.5px] border-[#343434] h-[40px] rounded-3xl px-4 py-[10.2px] items-center flex-1"
            onPress={() => router.push("/(app)/searchPage")}
          >
            <SearchIcon />
            <TextScallingFalse
              className={`text-3xl pl-3 ${
                searchText ? "text-white" : "text-[#808080]"
              }`}
              aria-disabled={true}
            >
              {searchText || placeholder || "Search..."}
            </TextScallingFalse>
          </TouchableOpacity>
        </>
      ) : (
        <View className="flex-row bg-[#212121] border-[0.5px] border-[#343434] h-[40px] rounded-3xl px-4 items-center flex-1">
          <SearchIcon />
          <TextInput
            value={searchText}
            onChangeText={onChangeSearchText}
            placeholder={placeholder || "Search..."}
            placeholderTextColor="#808080"
            className="text-3xl pl-3 text-white flex-1"
            cursorColor={Colors.themeColor}
          />
        </View>
      )}
    </View>
  );
};

export default SearchBar;
