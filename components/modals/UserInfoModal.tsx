import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Modal } from "react-native-paper";
import PageThemeView from "../PageThemeView";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { setOpenUserInfoModal } from "~/reduxStore/slices/user/profileSlice";
import TextScallingFalse from "../CentralText";

const UserInfoModal = ({
  isUserInfoModalOpen,
}: {
  isUserInfoModalOpen: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleCloseUserInfoModal = () => {
    dispatch(setOpenUserInfoModal(false));
  };

  return (
    <Modal
      visible={isUserInfoModalOpen}
      onRequestClose={handleCloseUserInfoModal}
      transparent={true}
    >
      <TouchableOpacity
        className="flex-1 bg-black"
        activeOpacity={1}
        onPress={handleCloseUserInfoModal}
      >
        <PageThemeView>
          <View className="bg-[#1C1D23]">
            <TextScallingFalse className="text-white">Hello</TextScallingFalse>
          </View>
        </PageThemeView>
      </TouchableOpacity>
    </Modal>
  );
};

export default UserInfoModal;

const styles = StyleSheet.create({});
