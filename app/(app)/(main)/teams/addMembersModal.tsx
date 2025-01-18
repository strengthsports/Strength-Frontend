import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";

// Types for member data
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
}

// Dummy data for potential members
const dummyMembers: PotentialMember[] = [
  {
    id: "1",
    name: "Prathik Jha",
    role: "Cricketer | Ranji Trophy Player",
    image: "https://picsum.photos/id/1/100/100",
    selected: false,
  },
  {
    id: "2",
    name: "Rohan Deb Nath",
    role: "Cricketer | Right-Hand Batsman",
    image: "https://picsum.photos/id/2/100/100",
    selected: false,
  },
  {
    id: "3",
    name: "Aditi Mehra",
    role: "Cricketer | Left-Hand Batsman",
    image: "https://picsum.photos/id/3/100/100",
    selected: false,
  },
  {
    id: "4",
    name: "Arjun Kapoor",
    role: "All-Rounder | State Team Player",
    image: "https://picsum.photos/id/4/100/100",
    selected: false,
  },
  {
    id: "5",
    name: "Sneha Roy",
    role: "Cricketer | Wicket-Keeper",
    image: "https://picsum.photos/id/5/100/100",
    selected: false,
  },
  {
    id: "6",
    name: "Rajesh Kumar",
    role: "Bowler | Swing Specialist",
    image: "https://picsum.photos/id/6/100/100",
    selected: false,
  },
  {
    id: "7",
    name: "Priya Singh",
    role: "All-Rounder | District Team Player",
    image: "https://picsum.photos/id/7/100/100",
    selected: false,
  },
  {
    id: "8",
    name: "Vikram Joshi",
    role: "Cricketer | Opening Batsman",
    image: "https://picsum.photos/id/8/100/100",
    selected: false,
  },
  {
    id: "9",
    name: "Tanya Sharma",
    role: "Cricketer | Spin Bowler",
    image: "https://picsum.photos/id/9/100/100",
    selected: false,
  },
  {
    id: "10",
    name: "Karan Patel",
    role: "Bowler | Fast Bowling Specialist",
    image: "https://picsum.photos/id/10/100/100",
    selected: false,
  },
];

const AddMembersModal: React.FC<AddMembersModalProps> = ({
  visible,
  onClose,
  onInvite,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<PotentialMember[]>(dummyMembers);

  const toggleMemberSelection = (memberId: string) => {
    setMembers(
      members.map((member) =>
        member.id === memberId
          ? { ...member, selected: !member.selected }
          : member,
      ),
    );
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
        <View className="px-4 py-2 flex-1">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-white text-2xl">←</Text>
            </TouchableOpacity>
            <Text className="text-white text-xl font-semibold">
              Add members
            </Text>
            <View className="w-8" /> {/* Spacer for alignment */}
          </View>

          {/* Search Bar */}
          <View className="mb-6">
            <View className="flex-row items-center bg-gray-900 rounded-full px-4 py-2">
              <Text className="text-gray-400 mr-2">🔍</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search..."
                placeholderTextColor="#666"
                className="flex-1 text-white"
              />
            </View>
          </View>

          {/* Members List */}
          <ScrollView className="flex-1">
            {filteredMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                onPress={() => toggleMemberSelection(member.id)}
                className="flex-row items-center py-4 border-b border-gray-800"
              >
                <Image
                  source={{ uri: member.image }}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <View className="flex-1">
                  <Text className="text-white text-lg">{member.name}</Text>
                  <Text className="text-gray-400">{member.role}</Text>
                </View>
                <View
                  className={`w-6 h-6 rounded border ${
                    member.selected
                      ? "bg-green-500 border-green-500"
                      : "border-gray-600"
                  } items-center justify-center`}
                >
                  {member.selected && (
                    <Text className="text-white text-sm">✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Invite Button */}
          <TouchableOpacity
            onPress={handleInvite}
            className="bg-green-600 rounded-lg p-4 mt-4"
          >
            <Text className="text-white text-center text-lg">Invite</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddMembersModal;
