import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { addMemberToSquad } from "../../redux/teamSlice";

const AddMembersModal = ({ visible, onClose, buttonName, onInvite }) => {
  const users = useSelector((state) => state.team.allUsers); // Fetch all users
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleInvite = () => {
    onInvite(selectedUsers);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black bg-opacity-75 justify-center items-center">
        <View className="bg-gray-900 p-6 rounded-lg w-4/5">
          <Text className="text-white text-lg font-bold mb-4">Select Members</Text>

          <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex flex-row items-center p-2"
                onPress={() => toggleSelection(item._id)}
              >
                <Image
                  source={{ uri: item.profilePic }}
                  className="w-12 h-12 rounded-full"
                />
                <Text className="text-white ml-4">
                  {item.firstName} {item.lastName}
                </Text>
                {selectedUsers.includes(item._id) && (
                  <Text className="ml-auto text-green-500">✓</Text>
                )}
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            className="bg-blue-500 p-3 rounded mt-4"
            onPress={handleInvite}
          >
            <Text className="text-white text-center">{buttonName}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="mt-2" onPress={onClose}>
            <Text className="text-gray-400 text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddMembersModal;
