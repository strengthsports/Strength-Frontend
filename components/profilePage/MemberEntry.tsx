import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useCallback, useState } from "react";
import { Member } from "~/types/user";
import { Image } from "react-native";
import nopic from "~/assets/images/nopic.jpg";
import TextScallingFalse from "../CentralText";
import RightArrow from "../Arrows/RightArrow";
import { useAssociate } from "~/context/UseAssociate";
import Icon from "react-native-vector-icons/AntDesign";

const MemberEntry = ({
  member,
  isLast,
  isEditView,
}: {
  member: Member;
  isLast: boolean;
  isEditView?: boolean;
}) => {
  const {
    openModal,
    isSelectModeEnabled,
    toggleMemberSelection,
    selectedMembers,
  } = useAssociate();

  // Handle select member
  const handleSelectMember = () => {
    toggleMemberSelection(member._id);
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 5,
        }}
      >
        {/* Member Profile Pic */}
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
        {/* Member Details */}
        <View
          className={`flex flex-1 flex-col ml-2 items-start justify-between gap-2 ${
            !isLast && "border-b-[0.5px] border-[#3B3B3B]"
          } py-5`}
        >
          <View className="flex flex-col">
            <TextScallingFalse
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "600", // Bold
              }}
            >
              {member.firstName} {member.lastName}
            </TextScallingFalse>
            <TextScallingFalse
              style={{
                color: "#B2B2B2",
                fontSize: 12,
                fontWeight: "300", // Regular
              }}
            >
              {member.headline}
            </TextScallingFalse>
          </View>
        </View>
        {isEditView && !isSelectModeEnabled && (
          <TouchableOpacity onPress={() => openModal(member)}>
            <RightArrow />
          </TouchableOpacity>
        )}

        {isSelectModeEnabled && (
          <TouchableOpacity
            className={`w-8 h-8 rounded-md border 
                ${
                  selectedMembers.includes(member._id)
                    ? "border-[#12956B] bg-[#12956B]"
                    : "border-[#4B5563]"
                } items-center justify-center`}
            onPress={handleSelectMember}
          >
            {selectedMembers.includes(member._id) && (
              <Icon name="check" size={20} color="white" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default MemberEntry;

const styles = StyleSheet.create({});
