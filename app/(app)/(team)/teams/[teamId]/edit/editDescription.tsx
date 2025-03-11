import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";

interface EditDescriptionProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (description: string) => void;
  initialDescription?: string;
}
const EditDescription: React.FC<EditDescriptionProps> = ({
  isVisible,
  onClose,
  onSave,
  initialDescription,
}) => {
  const [description, setDescription] = useState(initialDescription || ""); // State for input

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <View style={{ flex: 1 }}>
          {/* Header with back icon */}
          <View
            style={{ padding: 16, flexDirection: "row", alignItems: "center" }}
          >
            <TouchableOpacity onPress={onClose}>
              <Icon name="arrowleft" size={30} color="white" />
            </TouchableOpacity>
          </View>

          {/* Title and subtitle */}
          <View style={{ paddingHorizontal: 24 }}>
            <Text style={{ color: "white", fontSize: 26, fontWeight: "bold" }}>
              Team Description
            </Text>
            <Text style={{ color: "#A0A0A0", fontSize: 17, marginTop: 6 }}>
              Share details about your team’s goals, history, achievements, or
              unique aspects.
            </Text>
          </View>

          {/* Scrollable text area */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          >
            <View
              style={{
                borderColor: "#FFFFFF",
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 30,
              }}
            >
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={10}
                style={{
                  height: 200,
                  textAlignVertical: "top",
                  padding: 10,
                  color: "white",
                  fontSize: 16,
                }}
                placeholder="Enter your team description..."
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </ScrollView>
        </View>

        {/* Save button at the bottom */}
        <View
          style={{
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: "#363636",
            backgroundColor: "black",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#12956B",
              padding: 16,
              borderRadius: 12,
              alignItems: "center",
            }}
            onPress={() => onSave(description)}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default EditDescription;
