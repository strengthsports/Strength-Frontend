import React from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import TextScallingFalse from "../CentralText";
import Icon from "react-native-vector-icons/AntDesign";
import nopic from "@/assets/images/nopic.jpg";

type InviteUserProps = {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic: string;
    headline: string;
    type: string;
  };
  selected?: boolean;
  onSelect?: (userId: string) => void;
};

const InviteUser = ({ user, selected = false, onSelect }: InviteUserProps) => {
  return (
    <View
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
        className={`flex flex-1 flex-row ml-2 items-center justify-between gap-2 border-b-[0.5px] border-[#3B3B3B] py-5`}
      >
        <View className="flex flex-col">
          <TextScallingFalse
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "600", // Bold
            }}
          >
            {user.firstName} {user.lastName}
          </TextScallingFalse>
          <TextScallingFalse
            style={{
              color: "#B2B2B2",
              fontSize: 12,
              fontWeight: "300", // Regular
            }}
          >
            {user.headline.slice(0, 40)}
          </TextScallingFalse>
        </View>
        <TouchableOpacity
          className={`w-8 h-8 rounded-md border ${
            selected ? "border-[#12956B] bg-[#12956B]" : "border-[#4B5563]"
          }  items-center justify-center`}
          onPress={() => onSelect && onSelect(user._id)}
        >
          {selected && <Icon name="check" size={20} color="white" />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InviteUser;

const styles = StyleSheet.create({});
