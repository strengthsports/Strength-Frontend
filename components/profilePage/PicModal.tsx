import {
  View,
  TouchableOpacity,
  ImageSourcePropType,
  ActivityIndicator,
  Animated,
} from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
import React, { useRef, useState } from "react";
import { Image } from "react-native";
import TopBar from "../TopBar";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import TextScallingFalse from "../CentralText";
import nopic from "@/assets/images/nopic.jpg";
import nocoverpic from "@/assets/images/nocover.png";
import AlertModal from "../modals/AlertModal";
import * as EXImagePicker from "expo-image-picker";
import { uploadPic } from "~/reduxStore/slices/user/profileSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import ImagePicker, { ImageOrVideo } from "react-native-image-crop-picker";
import * as FileSystem from "expo-file-system";

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
  const pickImage = async () => {
    picData.delete(type);
    try {
      const permissionResult =
        await EXImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access the camera roll is required!");
        return;
      }

      const result = await EXImagePicker.launchImageLibraryAsync({
        mediaTypes: EXImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "coverPic" ? [82, 27] : [1, 1],
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

        if (type === "coverPic") {
          picData.set("coverPic", fileObject as any);
          setPic(file);
        } else {
          picData.set("profilePic", fileObject as any);
          setPic(file);
        }
        setDoneButtonClickable(true);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Error picking image");
    }
  };

  // Handle edit pic
  // const handleEditPic = async () => {
  //   try {
  //     // Download the existing image
  //     const localUri = await FileSystem.downloadAsync(
  //       imgUrl,
  //       FileSystem.cacheDirectory + "temp-image.jpg"
  //     );

  //     // Open editor with the downloaded image
  //     const editedImage = await ImagePicker.openCropper({
  //       path: localUri.uri,
  //       mediaType: "photo", // Add this required property
  //       width: type === "profilePic" ? 300 : 800,
  //       height: type === "profilePic" ? 300 : 200,
  //       cropping: true,
  //       freeStyleCropEnabled: true,
  //     });

  //     // React Native requires this format for file uploads
  //     const fileObject = {
  //       uri: editedImage.path,
  //       name: "edited-image.jpg",
  //       type: "image/jpeg",
  //     };

  //     if (type === "coverPic") {
  //       picData.append("coverPic", fileObject as any);
  //       setPic(fileObject);
  //     } else {
  //       picData.append("profilePic", fileObject as any);
  //       setPic(fileObject);
  //     }

  //     setDoneButtonClickable(true);
  //   } catch (error) {
  //     console.error("Editing error:", error);
  //   }
  // };

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
              source={
                imgUrl !== null && !isDoneButtonClickable
                  ? { uri: imgUrl }
                  : isPic
              }
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
            source={
              imgUrl !== null && !isDoneButtonClickable
                ? { uri: imgUrl }
                : isPic
            }
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
            onPress={pickImage}
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
