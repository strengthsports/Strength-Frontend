import {
  View,
  TouchableOpacity,
  ImageSourcePropType,
  ActivityIndicator,
  Animated,
} from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
import React, { useCallback, useRef, useState } from "react";
import { Image } from "react-native";
import TopBar from "../TopBar";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import TextScallingFalse from "../CentralText";
import nopic from "@/assets/images/nopic.jpg";
import nocoverpic from "@/assets/images/nocover.png";
import AlertModal from "../modals/AlertModal";
import * as ImagePicker from "expo-image-picker";
import { uploadPic } from "~/reduxStore/slices/user/profileSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";

const picData = new FormData();

const PicModal = ({
  type,
  imgUrl,
  heading,
  handleBack,
  handleRemovePic,
  profileType,
}: {
  type: string;
  imgUrl: string | any;
  heading: string;
  handleBack?: () => void;
  handleRemovePic?: () => void;
  profileType?: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isPic, setPic] = useState<ImageSourcePropType>(
    type === "profilePic" ? nopic : nocoverpic
  );
  const [isAlertModalOpen, setAlertModalOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<any>({
    state: false,
    scope: "neutral",
  });
  const [isDoneButtonClickable, setDoneButtonClickable] =
    useState<boolean>(false);
  const scale = useRef(new Animated.Value(1)).current;
  // const lastScale = useRef(1);

  // Handle alert modal
  const handleOpenAlertModal = () => {
    setAlertModalOpen(true);
  };
  const handleCloseAlertModal = () => {
    setAlertModalOpen(false);
  };

  // Pick Image (Cover pic, Profile Pic)
  const pickImage = async (imageType: string) => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access the camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: imageType === "coverPic" ? [16, 9] : [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        const fileName = file.uri.split("/").pop();
        const mimeType = file.mimeType || "image/jpeg";

        // React Native requires this format for file uploads
        const fileObject = {
          uri: file.uri,
          name: fileName,
          type: mimeType,
        };

        if (imageType === "coverPic") {
          picData.append("coverPic", fileObject as any);
          setPic(file);
        } else {
          picData.append("profilePic", fileObject as any);
          setPic(file);
        }
      }

      setDoneButtonClickable(true);
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Error picking image");
    }
  };

  // Handle edit pic
  const handleEditPic = () => {};

  // Handle add new pic
  const handleAddPic = async () => {
    setIsProcessing({ state: true, scope: "save" });
    try {
      await dispatch(uploadPic({ type, data: picData }));
      console.log("Pic uploading...");
      handleBack && handleBack();
    } catch (error) {
      console.log("Error adding pic : ", error);
    } finally {
      setIsProcessing({ state: false, scope: "" });
      picData.delete(type);
    }
  };

  // Handle remove pic
  const handleSetRemovedPic = async () => {
    setAlertModalOpen(false);
    // Show the activity indicator overlay on the image
    setIsProcessing({ state: true, scope: "remove" });
    try {
      type === "profilePic" ? setPic(nopic) : setPic(nocoverpic);
      if (handleRemovePic) {
        await handleRemovePic();
      }
    } catch (error) {
      console.error("Error removing picture:", error);
    } finally {
      setIsProcessing({ state: false, scope: "neutral" });
    }
  };

  // Handle zoom gesture on image
  const handlePinch = Animated.event(
    [{ nativeEvent: { scale } }],
    { useNativeDriver: true } // Add native driver for better performance
  );

  return (
    <>
      <TopBar heading={heading} backHandler={handleBack}>
        {isDoneButtonClickable &&
          (isProcessing.scope === "save" && isProcessing.state === true ? (
            <View className="justify-center items-end">
              <ActivityIndicator size="small" color="#12956B" />
            </View>
          ) : (
            <TouchableOpacity onPress={handleAddPic} className="items-end">
              <TextScallingFalse className="text-[#12956B] text-4xl">
                Save
              </TextScallingFalse>
            </TouchableOpacity>
          ))}
      </TopBar>
      {type === "profilePic" ? (
        <View className={`relative ${profileType === "other" && "mt-[50%]"}`}>
          <PinchGestureHandler onGestureEvent={handlePinch}>
            <Animated.Image
              source={imgUrl !== null ? { uri: imgUrl } : isPic}
              className="w-[22rem] h-[22rem] rounded-full"
              style={{
                transform: [{ scale }], // Apply the scale transform here
              }}
            />
          </PinchGestureHandler>
          {isProcessing.scope === "remove" && isProcessing.state === true && (
            <View className="absolute inset-0 flex justify-center items-center bg-transparent">
              <ActivityIndicator size="large" color="#12956B" />
            </View>
          )}
        </View>
      ) : type === "coverPic" ? (
        <View
          className={`relative w-full ${profileType === "other" && "mt-[75%]"}`}
        >
          <Image
            source={imgUrl !== null ? { uri: imgUrl } : isPic}
            className="w-full h-36"
          />
          {isProcessing.scope === "remove" && isProcessing.state === true && (
            <View className="absolute inset-0 flex justify-center items-center bg-transparent">
              <ActivityIndicator size="large" color="#12956B" />
            </View>
          )}
        </View>
      ) : (
        <></>
      )}

      {profileType !== "other" && (
        <View className="w-full border-t-[0.5px] border-gray-400 py-4 flex-row justify-center items-center gap-x-20">
          <TouchableOpacity
            className="items-center"
            activeOpacity={0.5}
            onPress={() => pickImage(type)}
          >
            <MaterialCommunityIcons
              name="image-edit-outline"
              size={24}
              color="grey"
            />
            <TextScallingFalse className="text-[#808080] text-base">
              {imgUrl === null ? "Add" : "Edit"}
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
      )}

      {/* Alert modal */}
      <AlertModal
        alertConfig={{
          title: `Remove ${heading}?`,
          message:
            "Are you sure you want to remove your profile picture? This action cannot be undone.",
          cancelMessage: "Cancel",
          confirmMessage: "Yes",
          confirmAction: handleSetRemovedPic,
          discardAction: handleCloseAlertModal,
        }}
        isVisible={isAlertModalOpen}
      />
    </>
  );
};

export default PicModal;
