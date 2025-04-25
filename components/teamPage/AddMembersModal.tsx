import React, { useEffect, useState, useMemo } from "react";
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

interface PotentialMember {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  headline: string;
  username: string;
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

  // Filter and sort members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) {
      return [...members].sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
      );
    }

    const query = searchQuery.toLowerCase().trim();
    
    return [...members]
      .filter(member => {
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        const username = member?.username?.toLowerCase();
        
        return (
          fullName.includes(query) ||
          username.includes(query) ||
          member?.firstName?.toLowerCase().includes(query) ||
          member?.lastName?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        // Prioritize matches that start with the search query
        const aStartsWith = (
          a.firstName?.toLowerCase().startsWith(query) ||
          a.lastName?.toLowerCase().startsWith(query) ||
          a.username?.toLowerCase().startsWith(query));
        
        const bStartsWith = (
          b.firstName?.toLowerCase().startsWith(query) ||
          b.lastName?.toLowerCase().startsWith(query) ||
          b.username?.toLowerCase().startsWith(query)
        );
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // If both start with or don't start with, sort alphabetically
        return a.firstName.localeCompare(b.firstName);
      });
  }, [members, searchQuery]);

  const toggleMemberSelection = (memberId: string) => {
    setMembers((prevMembers) => {
      if (multiselect) {
        // Allow multiple selection
        return prevMembers.map((member) =>
          member._id === memberId
            ? { ...member, selected: !member.selected }
            : member
        );
      } else {
        // Allow only single selection
        return prevMembers.map((member) => ({
          ...member,
          selected: member._id === memberId ? !member.selected : false,
        }));
      }
    });
  };

  useEffect(() => {
    setMembers(player);
  }, [player]);

  const handleInvite = () => {
    const selectedMembers = members.filter((member) => member.selected);
    console.log("Selected members ->>>>", selectedMembers);
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
                backgroundColor: "#212121",
                borderRadius: 100,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <Icon name="search1" size={20} color="#CECECE" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search..."
                placeholderTextColor="#CECECE"
                style={{
                  flex: 1,
                  color: "white",
                  paddingHorizontal: 16,
                  fontSize: 14,
                }}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Icon name="close" size={20} color="#CECECE" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Members List */}
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <View
                  key={member._id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingHorizontal: 5,
                  }}
                >
                  {/* User Profile Pic */}
                  <Image
                    source={member.profilePic ? { uri: member.profilePic } : nopic}
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
                        {member.firstName} {member.lastName}
                      </TextScallingFalse>

                      <TextScallingFalse
                        style={{
                          width: 200,
                          color: "#B2B2B2",
                          fontSize: 12,
                          fontWeight: "300",
                          flexWrap: "wrap",
                        }}
                        numberOfLines={2}
                      >
                        @{member.username} | {member.headline}
                      </TextScallingFalse>
                    </View>

                    <TouchableOpacity
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: member.selected
                          ? "#12956B"
                          : "#4B5563",
                        backgroundColor: member.selected
                          ? "#12956B"
                          : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => toggleMemberSelection(member._id)}
                    >
                      {member.selected && (
                        <Icon name="check" size={20} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ padding: 20, alignItems: "center" }}>
                <TextScallingFalse style={{ color: "#FFFFFF" }}>
                  No members found
                </TextScallingFalse>
              </View>
            )}
          </ScrollView>

          {/* Invite Button */}
          {filteredMembers.some(member => member.selected) && (
            <TouchableOpacity
              onPress={handleInvite}
              style={{
                backgroundColor: "#12956B",
                borderRadius: 10,
                paddingVertical: 12,
            
                marginTop: 16,
              }}
            >
              <TextScallingFalse
                style={{
                  color: "#FFFFFF",
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {buttonName}
              </TextScallingFalse>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddMembersModal;