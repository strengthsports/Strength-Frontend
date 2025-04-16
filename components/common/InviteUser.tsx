import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import TextScallingFalse from "../CentralText";
import nopic from "@/assets/images/nopic.jpg";

interface InviteUserProps {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  headline: string;
  username: string;
  selected?: boolean;
}

interface InviteUserModalProps {
  visible: boolean;
  onClose: () => void;
  onInvite: (selectedUsers: InviteUserProps[]) => void;
  buttonName: string;
  multiselect: boolean;
  users: InviteUserProps[];
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  visible,
  onClose,
  onInvite,
  buttonName,
  multiselect,
  users,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState<InviteUserProps[]>(users);

  const toggleUserSelection = (userId: string) => {
    setUserList((prevUsers) => {
      if (multiselect) {
        // Allow multiple selection
        return prevUsers.map((user) =>
          user._id === userId ? { ...user, selected: !user.selected } : user
        );
      } else {
        // Allow only single selection
        return prevUsers.map((user) => ({
          ...user,
          selected: user._id === userId ? !user.selected : false,
        }));
      }
    });
  };

  useEffect(() => {
    console.log("loaded users", userList);
  }, [users]);

  const handleInvite = () => {
    const selectedUsers = userList.filter((user) => user.selected);
    onInvite(selectedUsers);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
        <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Icon name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <TextScallingFalse
              style={{
                color: "#FFFFFF",
                fontSize: 20,
                fontWeight: "600",
              }}
            >
              {buttonName}
            </TextScallingFalse>
            <View style={{ width: 32 }} />
          </View>

          {/* Search Bar */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1F2937",
                borderRadius: 100,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <Icon name="search1" size={20} color="#666" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search..."
                placeholderTextColor="#666"
                style={{
                  flex: 1,
                  color: "white",
                  paddingHorizontal: 16,
                  fontSize: 14,
                }}
              />
            </View>
          </View>

          {/* Users List */}
          <ScrollView style={{ flex: 1 }}>
            {userList.map((user) => (
              <View
                key={user._id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingHorizontal: 5,
                }}
              >
                {/* User Profile Pic */}
                <Image
                  source={user.profilePic ? { uri: user.profilePic } : nopic}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    borderWidth: 1.5,
                    borderColor: "#1C1C1C",
                  }}
                />
                {/* User Details */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginLeft: 8,
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#3B3B3B",
                    paddingVertical: 20,
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <TextScallingFalse
                      style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {user.firstName} {user.lastName}
                    </TextScallingFalse>
                    <TextScallingFalse
                      style={{
                        color: "#B2B2B2",
                        fontSize: 12,
                        fontWeight: "300",
                      }}
                    >
                      @{user.username}
                    </TextScallingFalse>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: user.selected ? "#12956B" : "#4B5563",
                      backgroundColor: user.selected ? "#12956B" : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => toggleUserSelection(user._id)}
                  >
                    {user.selected && (
                      <Icon name="check" size={20} color="white" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Invite Button */}
          <TouchableOpacity
            onPress={handleInvite}
            style={{
              backgroundColor: "#12956B",
              borderRadius: 8,
              paddingVertical: 16,
              marginTop: 16,
            }}
          >
            <TextScallingFalse
              style={{
                color: "#FFFFFF",
                textAlign: "center",
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              {buttonName}
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default InviteUserModal;