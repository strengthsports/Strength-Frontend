import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import Hashtag from "./hashtag";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface HashtagModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  hashtagData: { id: number; hashtag: string; postsCount: string }[];
}

const HashtagModal: React.FC<HashtagModalProps> = ({
  modalVisible,
  setModalVisible,
  hashtagData,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 bg-[#1C1C1C]">
        {/* Modal Header */}
        <View className="flex-row items-center px-5 py-3 mb-5 border-b border-[#474747]">
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color="#E9E9E9"
            />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-[#E9E9E9] self-center text-4xl font-bold">
              Trending #'s
            </Text>
          </View>
        </View>

        {/* Scrollable Hashtag List */}
        <ScrollView className="flex-1 px-4 py-2">
          <Hashtag data={hashtagData} />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default HashtagModal;
