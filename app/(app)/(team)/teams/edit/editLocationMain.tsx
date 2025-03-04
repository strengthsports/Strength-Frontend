import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const LocationPageOfEdit = () => {
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("Kolkata, West Bengal");
  const router = useRouter();
  const handleDone = () => {
    // Push the location data to the router as query params
    router.push({
      pathname: "./editTeam", // The page where you want to navigate back
      params: {
        country,
        city,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex flex-row items-center justify-between px-5 py-4">
        {/* Back Button */}
        <TouchableOpacity onPress={() => console.log("Back Button Clicked")}>
          <Icon name="arrowleft" size={30} color="white" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-white text-5xl font-semibold">Location</Text>

        {/* Done Button */}
        <TouchableOpacity onPress={() => handleDone()}>
          <Text className="text-[#12956B] text-4xl font-semibold">Done</Text>
        </TouchableOpacity>
      </View>

      {/* Location Selection */}
      <View className="px-8 mt-6">
        {/* Country Input */}
        <Text className="text-white/60 text-3xl">Country/Region*</Text>
        <TextInput
          value={country}
          onChangeText={setCountry}
          placeholder="Enter Country"
          placeholderTextColor="#5C5C5C"
          className="border border-[#222020] mt-2 py-4 px-4 text-white text-3xl rounded-lg"
        />

        {/* City Input */}
        <Text className="text-white/60 text-3xl mt-6">City-State*</Text>
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="Enter City"
          placeholderTextColor="#5C5C5C"
          className="border border-[#222020] mt-2 py-4 px-4 text-white text-3xl rounded-lg"
        />
      </View>

      {/* Current Location Button */}
      <View className="flex items-center mt-8">
        <TouchableOpacity>
          <Text className="text-[#12956B] text-4xl font-semibold">
            Use Current Location
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LocationPageOfEdit;
