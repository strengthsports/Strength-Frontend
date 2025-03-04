import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const EditDescription = () => {
  const [description, setDescription] = useState(""); // State to handle input
  const router = useRouter(); // Router to navigate between screens

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Header with back icon */}
        <View className="p-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrowleft" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* Team Description title and subtitle */}
        <View className="px-6">
          <Text className="text-white text-7xl font-semibold">
            Team Description
          </Text>
          <Text className="text-gray-400 text-2xl mt-2">
            Share details about your team’s goals, history, achievements, or
            unique aspects.
          </Text>
        </View>

        {/* Scrollable text area */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
        >
          <View className="border border-[#FFFFFF] rounded-lg mt-12">
            {/* TextInput for inputable field */}
            <TextInput
              value={description} // Bind the value to state
              onChangeText={setDescription} // Update state on text change
              multiline={true} // Allow multiple lines
              numberOfLines={10} // Adjust the number of visible lines
              style={{
                height: 200,
                textAlignVertical: "top", // Align text to the top of the input field
                padding: 10,
                color: "white",
                fontSize: 16,
                borderColor: "#FFFFFF",
                borderWidth: 1,
                borderRadius: 8,
              }}
              placeholder="Enter your team description..."
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </ScrollView>
      </View>

      {/* Save button at the bottom */}
      <View className="p-6 border-t border-[#363636] bg-black">
        <TouchableOpacity
          className="bg-[#12956B] p-4 rounded-2xl"
          onPress={() => router.push("./editTeam")}
        >
          <Text className="text-white text-2xl font-semibold text-center">
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditDescription;
