import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";

const SearchBar = () => {
    return (
        <View className="flex-row items-center justify-between gap-2 mt-2 px-2">
            {/* Search Bar */}
            <TouchableOpacity
                activeOpacity={0.8}
                className=" flex-row bg-neutral-800 rounded-md px-3 items-center flex-1"
                onPress={() => ({})}
            >
                <MaterialCommunityIcons name="magnify" size={24} color="grey" className="" />
                <TextInput
                    placeholder="Search for news, team, matches, etc..."
                    placeholderTextColor="grey"
                    className="text-2xl text-neutral-500  "
                >
                    Search...
                </TextInput>
            </TouchableOpacity>

            {/* Plus Icon */}
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => ({})}
                className="border-2 border-white rounded-md justify-center items-center ml-3"
            >
                <MaterialCommunityIcons name="plus" size={20} color="white" />
                
            </TouchableOpacity>

            {/* Message Icon */}
            <MaterialCommunityIcons
                name="message-reply-text-outline"
                size={25}
                color="grey"
            />
        </View>
    );
};

export default SearchBar;
