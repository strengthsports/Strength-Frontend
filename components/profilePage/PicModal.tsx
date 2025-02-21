import {
  View,
  TouchableOpacity,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Image } from "react-native";
import TopBar from "../TopBar";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import TextScallingFalse from "../CentralText";
import nopic from "@/assets/images/nopic.jpg";
import nocoverpic from "@/assets/images/nocover.png";
import AlertModal from "../modals/AlertModal";

const PicModal = ({
  type,
  imgUrl,
  heading,
  handleBack,
  handleRemovePic,
  handleAddEditPic,
}: {
  type: string;
  imgUrl: string | any;
  heading: string;
  handleBack?: () => void;
  handleRemovePic?: () => void;
  handleAddEditPic?: () => void;
}) => {
  const [isPic, setPic] = useState<ImageSourcePropType>(
    type === "profilePic" ? nopic : nocoverpic
  );
  const [isAlertModalOpen, setAlertModalOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleOpenAlertModal = () => {
    setAlertModalOpen(true);
  };

  const handleCloseAlertModal = () => {
    setAlertModalOpen(false);
  };

  const handleSetPic = async () => {
    setAlertModalOpen(false);
    // Show the activity indicator overlay on the image
    setIsProcessing(true);
    try {
      type === "profilePic" ? setPic(nopic) : setPic(nocoverpic);
      if (handleRemovePic) {
        await handleRemovePic();
      }
    } catch (error) {
      console.error("Error removing picture:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <TopBar heading={heading} backHandler={handleBack} />
      {type === "profilePic" ? (
        <View className="relative">
          <Image
            source={imgUrl !== null ? { uri: imgUrl } : isPic}
            className="w-[22rem] h-[22rem] rounded-full"
          />
          {isProcessing && (
            <View className="absolute inset-0 flex justify-center items-center bg-transparent">
              <ActivityIndicator size="large" color="#12956B" />
            </View>
          )}
        </View>
      ) : type === "coverPic" ? (
        <View className="relative">
          <Image
            source={imgUrl !== null ? { uri: imgUrl } : isPic}
            className="w-full h-36"
          />
          {isProcessing && (
            <View className="absolute inset-0 flex justify-center items-center bg-transparent">
              <ActivityIndicator size="large" color="#12956B" />
            </View>
          )}
        </View>
      ) : (
        <></>
      )}
      <View className="w-full border-t-[0.5px] border-gray-400 py-4 flex-row justify-center items-center gap-x-20">
        <TouchableOpacity
          className="items-center"
          activeOpacity={0.8}
          onPress={handleAddEditPic}
        >
          <MaterialCommunityIcons
            name="image-edit-outline"
            size={24}
            color="grey"
          />
          <TextScallingFalse className="text-[#808080] text-base">
            Add/Edit
          </TextScallingFalse>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          activeOpacity={0.8}
          onPress={handleOpenAlertModal}
          disabled={imgUrl === null}
        >
          <AntDesign
            name="delete"
            size={24}
            color={imgUrl === null ? "#3f3f46" : "grey"}
          />
          <TextScallingFalse
            className={`${
              imgUrl === null ? "text-zinc-700" : "text-[#808080]"
            } text-base`}
          >
            Remove
          </TextScallingFalse>
        </TouchableOpacity>
      </View>
      {/* Alert modal */}
      <AlertModal
        alertConfig={{
          title: `Remove ${heading}?`,
          message:
            "Are you sure you want to remove your profile picture? This action cannot be undone.",
          cancelMessage: "Cancel",
          confirmMessage: "Yes",
          confirmAction: handleSetPic,
          discardAction: handleCloseAlertModal,
        }}
        isVisible={isAlertModalOpen}
      />
    </>
  );
};

export default PicModal;
