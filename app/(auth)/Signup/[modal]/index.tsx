import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalText}>This is a Modal you are looking for</Text>
      <Button title="Close Modal" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'grey',
  },
  modalText: {
    color: "black",
    fontSize: 18,
    marginBottom: 20,
  },
});
