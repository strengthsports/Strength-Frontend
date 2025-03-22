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
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 bg-black/90 justify-center items-center">
        <View className="w-full h-full bg-black p-6">
          {/* Back Button */}
          <View className="flex-row justify-between items-center px-2 py-2">
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

          {/* Filter Content */}
          <View className="mt-2">
            <Text className="text-2xl text-white font-bold mb-4">Sort by</Text>
            <ExploreCategoryHeader />
            <ExploreAllSportsCategoryHeader />
          </View>
        </View>
      </View>
    </Modal>
  );
};
