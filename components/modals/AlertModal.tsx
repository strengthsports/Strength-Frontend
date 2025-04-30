import { View, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import TextScallingFalse from "../CentralText";
import { LinearGradient } from "expo-linear-gradient";

interface AlertConfig {
  title: string;
  message: string;
  confirmAction: () => void;
  discardAction: () => void;
  confirmMessage: string;
  cancelMessage: string;
  isDestructive?: boolean;
  confirmButtonColor?: { bg: string; text: string };  // Add this
  cancelButtonColor?: { bg: string; text: string };  // Add this
  discardButtonColor?: { bg: string; text: string };
}

const AlertModal = ({
  alertConfig,
  isVisible,
}: {
  alertConfig: AlertConfig;
  isVisible: boolean;
}) => {
  // Determine button colors based on action type
  const isPositiveAction = ["Promote", "Change", "Confirm", "Update", "Save"].some(action => 
    alertConfig.confirmMessage.includes(action)
  );
  
  const confirmButtonColors = alertConfig.confirmButtonColor
  ? [alertConfig.confirmButtonColor.bg, alertConfig.confirmButtonColor.bg] // use same color for solid background
  : isPositiveAction
    ? ["#12956B", "#0D7A55"]
    : ["#E14A4B", "#A23637"];

    console.log("Confirm Button Color:", alertConfig.confirmButtonColor);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={alertConfig.discardAction}
    >
      <KeyboardAvoidingView 
        style={styles.AlertModalView} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="bg-[#161616] border border-[#242424] rounded-xl pt-6 h-[200px] w-[80%]"> 
          <View className="flex-1 items-center justify-center">
            <TextScallingFalse className="text-center text-6xl font-semibold text-[#FFFCFC] mb-4">
              {alertConfig.title}
            </TextScallingFalse>
            <TextScallingFalse className="text-center text-2xl px-[20px] text-[#D0D0D0] mb-2">
              {alertConfig.message}
            </TextScallingFalse>
          </View>
          <View className="basis-[40%] flex-row items-center gap-x-3 justify-center border-t border-t-[#2B2B2B]">
            <LinearGradient
              colors={["#242424", "#161616"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ borderRadius: 10 }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={alertConfig.discardAction}
                style={{
                  paddingHorizontal: 36,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: "#242424",
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <TextScallingFalse className="text-white text-2xl">
                  {alertConfig.cancelMessage}
                </TextScallingFalse>
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
              colors={confirmButtonColors}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ borderRadius: 10 }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={alertConfig.confirmAction}
                style={{
                  paddingHorizontal: 36,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: isPositiveAction ? "#0D7A55" : "#646464",
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <TextScallingFalse className="font-semibold text-2xl"
                 style={{ color: alertConfig.confirmButtonColor?.text || "white" }}>
                  {alertConfig.confirmMessage}
                </TextScallingFalse>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  AlertModalView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: 'absolute',
    zIndex: 100,
  },
});

export default AlertModal;