import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { ThemedText } from "~/components/ThemedText";

interface PotentialMember {
  id: string;
  name: string;
  role: string;
  image: string;
  selected?: boolean;
}

interface AddMembersModalProps {
  visible: boolean;
  onClose: () => void;
  onInvite: (selectedMembers: PotentialMember[]) => void;
  buttonName: string;
  multiselect: boolean;
  player: PotentialMember[];
}


const AddMembersModal: React.FC<AddMembersModalProps> = ({
  visible,
  onClose,
  onInvite,
  buttonName,
  multiselect,
  player,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<PotentialMember[]>(player);

  const toggleMemberSelection = (memberId: string) => {
    setMembers((prevMembers) => {
      if (multiselect) {
        // Allow multiple selection
        return prevMembers.map((member) =>
          member.id === memberId
            ? { ...member, selected: !member.selected }
            : member,
        );
      } else {
        // Allow only single selection
        return prevMembers.map((member) => ({
          ...member,
          selected: member.id === memberId ? !member.selected : false,
        }));
      }
    });
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleInvite = () => {
    const selectedMembers = members.filter((member) => member.selected);
    onInvite(selectedMembers);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 px-4 py-2">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={onClose}>
              <Icon name="arrowleft" size={30} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-semibold">
              Invite members
            </Text>
            <View className="w-8" />
          </View>

          {/* Search Bar */}
          <View className="mb-6">
            <View className="flex-row items-center bg-[#1F2937] rounded-full px-4 py-2">
              <Icon name="search1" size={30} color="#666" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search..."
                placeholderTextColor="#666"
                className="flex-1 text-white px-4 text-base"
              />
            </View>
          </View>

          {/* Members List */}
          <ScrollView className="flex-1">
            {filteredMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                onPress={() => toggleMemberSelection(member.id)}
                className="flex-row items-center py-4 border-b border-[#1F2937]"
              >
                <Image
                  source={{ uri: member.image }}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <View className="flex-1">
                  <Text className="text-white text-lg">{member.name}</Text>
                  <Text className="text-[#9CA3AF]">{member.role}</Text>
                </View>
                <View
                  className={`w-6 h-6 rounded-md border ${
                    member.selected
                      ? "bg-[#12956B] border-[#12956B]"
                      : "border-[#4B5563]"
                  } items-center justify-center`}
                >
                  {member.selected && (
                    <Icon name="check" size={20} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Invite Button */}
          <TouchableOpacity
            onPress={handleInvite}
            className="bg-[#12956B] rounded-md py-4 mt-4"
          >
            <ThemedText className="text-white text-center text-lg">
              {buttonName}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddMembersModal;
