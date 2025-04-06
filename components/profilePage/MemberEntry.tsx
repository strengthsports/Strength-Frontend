import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Member } from "~/types/user";
import { Image } from "react-native";
import nopic from "~/assets/images/nopic.jpg";
import TextScallingFalse from "../CentralText";
import RightArrow from "../Arrows/RightArrow";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { setOpenUserInfoModal } from "~/reduxStore/slices/user/profileSlice";

const MemberEntry = ({
  member,
  isLast,
  isEditView,
}: {
  member: Member;
  isLast: boolean;
  isEditView?: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenUserInfoModal = () => {
    dispatch(setOpenUserInfoModal(true));
  };

  return (
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
            Cricketer | Right-Hand Batsman
          </TextScallingFalse>
        </View>
      </View>
      {isEditView && (
        <TouchableOpacity onPress={handleOpenUserInfoModal}>
          <RightArrow />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MemberEntry;

const styles = StyleSheet.create({});
