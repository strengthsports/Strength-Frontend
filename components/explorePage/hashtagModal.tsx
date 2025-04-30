import { View, Text, Modal, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import Hashtag from "./hashtag";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackIcon from "../SvgIcons/Common_Icons/BackIcon";

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
  console.log(setModalVisible);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <SafeAreaView className="flex-1 bg-black">
        {/* Modal Header */}
        <View className="flex-row items-center px-5 py-6 mb-5 border-b border-[#303030]">
          <TouchableOpacity onPress={() => setModalVisible(false)}>
           <BackIcon />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-[#E9E9E9] self-center text-5xl" style={{fontWeight:'400'}}>
              Trending #'s
            </Text>
          </View>
        </View>

        {/* Scrollable Hashtag List */}
        <ScrollView className="flex-1 py-2">
          <Hashtag data={hashtagData} setModalVisible={setModalVisible}/>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default HashtagModal;
