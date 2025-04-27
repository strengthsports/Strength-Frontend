import { Modal, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import PageThemeView from "@/components/PageThemeView";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import tickmark from "@/assets/images/tickmark.gif";

interface RequestSuccessfulModalProps {
  visible: boolean;
  onClose: () => void;
}

const RequestSuccessfulModal: React.FC<RequestSuccessfulModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <PageThemeView>
        <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 70 }}>
          <Image source={tickmark} style={{ width: "78%", height: 300 }} />
          <TextScallingFalse
            style={{
              color: "white",
              fontWeight: "500",
              fontSize: 30,
              marginTop: -45,
            }}
          >
            We got your feedback!
          </TextScallingFalse>
          <View style={{ width: "80%", marginTop: 5 }}>
            <TextScallingFalse
              style={{
                color: "grey",
                fontSize: 13,
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              Thank you for helping us make Strength a better sports platform!
            </TextScallingFalse>
          </View>
        </View>
        <View style={{ marginTop: 40, justifyContent: "center", alignItems: "center" }}>
          <SignupButton onPress={onClose} disabled={false}>
            <TextScallingFalse style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Next
            </TextScallingFalse>
          </SignupButton>
        </View>
      </PageThemeView>
    </Modal>
  );
};

export default RequestSuccessfulModal;

const styles = StyleSheet.create({});
