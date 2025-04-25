import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";

// Define prop types
interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
}

const ClearSearchAlertModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  message,
  onConfirm,
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <BlurView intensity={50} style={styles.blurBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={[styles.buttonText, { color: "#fff" }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default ClearSearchAlertModal;

const styles = StyleSheet.create({
  blurBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#222",
    padding: 25,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#5A67D8",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
});
