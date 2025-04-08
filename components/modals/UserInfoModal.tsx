import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import TextScallingFalse from "../CentralText";
import { useRouter } from "expo-router";
import ModalLayout1 from "./layout/ModalLayout1";
import { MaterialIcons } from "@expo/vector-icons";

const btn = "rounded-xl border border-[#12956B] py-2 w-[40%]";
const roleViews =
  "rounded-2xl bg-[#141414] w-full p-5 flex-row justify-between items-center";

const UserInfoModal = ({ visible, onClose, member }: any) => {
  const router = useRouter();
  const profilePic = member?.profilePic || "https://via.placeholder.com/150";
  const [isFollowing, setIsFollowing] = useState(false);

  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: member?._id, type: member?.type })
  );

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  const handleViewProfile = () => {
    onClose();
    router.push(`/(app)/(profile)/profile/${serializedUser}`);
  };

  if (!visible || !member) return null;

  return (
    <ModalLayout1 onClose={onClose} visible={visible} heightValue={1.8}>
      <View className="pt-10">
        <View>
          <Image source={{ uri: profilePic }} style={styles.profileImage} />
          <TextScallingFalse className="mt-2 text-white text-5xl font-semibold">
            {member?.firstName} {member?.lastName}
          </TextScallingFalse>
          <TextScallingFalse className="text-[#EAEAEA] font-light">
            {member?.headline || "No description available"}
          </TextScallingFalse>
        </View>

        {/* Buttons Container */}
        <View className="flex-row justify-start items-center gap-x-5 mt-8">
          {/* Follow / Following Button */}
          <TouchableOpacity
            onPress={handleFollowToggle}
            className={`${btn} bg-[#12956B]`}
          >
            {isFollowing ? (
              <TextScallingFalse className="text-white text-center">
                &#10004; Following
              </TextScallingFalse>
            ) : (
              <TextScallingFalse className="text-white text-center">
                Follow
              </TextScallingFalse>
            )}
          </TouchableOpacity>

          {/* View Profile Button */}
          <TouchableOpacity className={btn} onPress={handleViewProfile}>
            <TextScallingFalse className="text-white text-center">
              View Profile
            </TextScallingFalse>
          </TouchableOpacity>
        </View>

        {/* Role views */}
        <View className="mt-8 gap-y-4">
          <View className={roleViews}>
            <TextScallingFalse className="text-[#CFCFCF]">
              {member.role}
            </TextScallingFalse>
          </View>
          <TouchableOpacity className={roleViews}>
            <TextScallingFalse className="text-[#D44044]">
              Remove '{member.firstName} {member.lastName}'
            </TextScallingFalse>
            <MaterialIcons name="do-not-disturb" size={17} color="#D44044" />
          </TouchableOpacity>
        </View>
      </View>
    </ModalLayout1>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 78,
    height: 78,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: "#313131",
  },
});

export default UserInfoModal;
