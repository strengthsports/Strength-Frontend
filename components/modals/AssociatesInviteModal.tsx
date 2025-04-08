import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import TextScallingFalse from "../CentralText";
import { useRouter } from "expo-router";
import ModalLayout1 from "./layout/ModalLayout1";
import RightArrow from "../Arrows/RightArrow";

const roleViews =
  "rounded-2xl bg-[#141414] w-full p-5 flex-row justify-between items-center";

const roles = ["Coaches", "Athletes", "Trainers"];

const AssociatesInviteModal = ({ visible, onClose }: any) => {
  const router = useRouter();

  if (!visible) return null;

  return (
    <ModalLayout1 onClose={onClose} visible={visible} heightValue={2.5}>
      <TextScallingFalse className="text-3xl text-white text-center font-semibold my-5">
        Invite
      </TextScallingFalse>
      {/* Role views */}
      <View className="gap-y-4">
        {roles.map((role, index) => (
          <View className={roleViews} key={index}>
            <TextScallingFalse className="text-[#CFCFCF]">
              {role}
            </TextScallingFalse>
            <TouchableOpacity>
              <RightArrow />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ModalLayout1>
  );
};

const styles = StyleSheet.create({});

export default AssociatesInviteModal;
