import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import React, { useState } from "react";
import TextScallingFalse from "../CentralText";

interface AlertConfig {
  title: string;
  message: string;
  discardAction: () => void;
  confirmAction: () => void;
  confirmMessage: string;
  cancelMessage: string;
}

const AlertModal = ({
  alertConfig,
  isVisible,
}: {
  alertConfig: AlertConfig;
  isVisible: boolean;
}) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.AlertModalView}>
        <View
          style={styles.AlertModalContainer}
          className="h-full flex items-center justify-center gap-y-3 pt-5"
        >
          <TextScallingFalse className="text-[20px] font-semibold">
            {alertConfig.title}
          </TextScallingFalse>
          <TextScallingFalse className="text-[16px] text-center">
            {alertConfig.message}
          </TextScallingFalse>
          <View className="w-full">
            <TouchableOpacity
              onPress={() => {
                alertConfig.confirmAction();
              }}
              className="w-full py-2 items-center border-t border-[#8080808b]"
            >
              <TextScallingFalse className="font-semibold text-4xl text-red-600">
                {alertConfig.confirmMessage}
              </TextScallingFalse>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                alertConfig.discardAction();
              }}
              className="w-full py-2 items-center border-t border-[#8080808b]"
            >
              <TextScallingFalse className="font-semibold text-4xl text-[#808080]">
                {alertConfig.cancelMessage}
              </TextScallingFalse>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  AlertModalView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    paddingVertical: 250,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  AlertModalContainer: {
    width: "80%",
    height: 200,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
  },
});

export default AlertModal;
