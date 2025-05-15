import { View,  TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/reduxStore";
import { setTeamDescription } from "~/reduxStore/slices/team/teamSlice";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";
import TextScallingFalse from "~/components/CentralText";

const EditDescription = () => {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const currentDescription = useSelector((state: RootState) => state.team.currentTeamDescription);
  const { team } = useSelector((state: RootState) => state.team);
  
  // Initialize state with the correct description
  const [newDescription, setNewDescription] = useState(
    currentDescription || team?.description || ""
  );

  // Update state when currentDescription changes
  useEffect(() => {
    setNewDescription(currentDescription || team?.description || "");
  }, [currentDescription, team?.description]);

  const handleSave = () => {
    dispatch(setTeamDescription(newDescription));
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-black">
        {/* Header Section */}
        <View className="flex-row items-center px-4 bg-black h-14 border-gray-700">
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon/>
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View className="px-6 pt-2 flex-1 pb-20">
          <TextScallingFalse className="text-white text-5xl font-semibold mb-1">Team Description</TextScallingFalse>
          <TextScallingFalse className="text-gray-500 text-base mb-8">
            Share details about your team's goals, history, achievements, or unique aspects.
          </TextScallingFalse>
          <TextInput
            className="bg-black border border-gray-800 text-white text-regular rounded-lg p-4 h-80"
            value={newDescription}
            onChangeText={setNewDescription}
            multiline
            placeholder="Enter team description..."
            placeholderTextColor="#6b7280"
          />
        </View>

        {/* Footer with Save Button */}
        <SafeAreaView className="absolute bottom-0 left-0 right-0 p-6 bg-black">
          <TouchableOpacity
            className="bg-green-600 py-3 rounded-lg"
            onPress={handleSave}
          >
            <TextScallingFalse className="text-white text-center text-lg font-semibold">
              Save Changes
            </TextScallingFalse>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default EditDescription;