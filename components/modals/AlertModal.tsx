import { View, Text, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
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
}

const AlertModal = ({
  alertConfig,
  isVisible,
}: {
  alertConfig: AlertConfig;
  isVisible: boolean;
}) => {
  return (
      <KeyboardAvoidingView style={styles.AlertModalView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* it was h-[22%] below */}
        <View className="bg-[#161616] border border-[#242424] rounded-xl pt-6 h-[200px] w-[80%]"> 
          <View className="flex-1 items-center justify-center">
            <TextScallingFalse className="text-center text-6xl font-semibold text-[#FFFCFC] mb-4">
              {alertConfig.title}
            </TextScallingFalse>
            <TextScallingFalse className="text-center text-2xl text-[#D0D0D0] mb-2">
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
                onPress={() => {
                  alertConfig.discardAction();
                }}
                style={{
                  paddingHorizontal: 36,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: "#242424",
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text className="text-white text-2xl">
                  {alertConfig.cancelMessage}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
              colors={["#E14A4B", "#A23637"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ borderRadius: 10 }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  alertConfig.confirmAction();
                }}
                style={{
                  paddingHorizontal: 36,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: "#646464",
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text className="text-white text-2xl">
                  {alertConfig.confirmMessage}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  AlertModalView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position:'absolute',
    zIndex: 100,
  },
  AlertModalContainer: {
    width: "85%",
    backgroundColor: "#161616",
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#242424",
  },
  titleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 10,
  },
  messageText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "gray",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderRightWidth: 0.5,
    borderRightColor: "gray",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "red",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default AlertModal;
