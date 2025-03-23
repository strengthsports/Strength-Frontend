import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  ExploreCategoryHeader,
  ExploreAllSportsCategoryHeader,
} from "./exploreHeader";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";


type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: () => void;
};

export const FilterModal = ({ visible, onClose }: FilterModalProps) => {
  const router = useRouter();

  return (
    <Modal visible={visible} transparent={true}>
      <View className="flex-1 bg-black/90 justify-center items-center">
        <View className="w-full h-full bg-black">
          {/* Back Button */}
          <View className="flex-row justify-between items-center py-4 p-4">
            <TouchableOpacity activeOpacity={0.5} onPress={onClose}>
              <Feather name="arrow-left" size={30} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-3xl">Filters</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.5}>
              <Text className="text-[#12956B] text-3xl font-semibold">
                Apply
              </Text>
            </TouchableOpacity>
          </View>
          <View className="h-[0.5px] bg-[#303030] w-full"></View>

          {/* Filter Content */}
          <View className="mt-1 p-4">
            <Text className="text-3xl text-white font-semibold mb-1">Sort by</Text>
            </View>
            <View>
            <ExploreCategoryHeader />
            </View>
            <View className="p-3">
            <ExploreAllSportsCategoryHeader />
          </View>
        </View>
      </View>
    </Modal>
  );
};
