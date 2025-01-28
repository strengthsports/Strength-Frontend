import {
  StyleSheet,
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ToastAndroid,
  Platform,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import PageThemeView from "~/components/PageThemeView";
import TextScallingFalse from "~/components/CentralText";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, usePathname } from "expo-router";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import CustomButton from "~/components/CustomButtons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { editUserProfile } from "~/reduxStore/slices/user/profileSlice";
import { UserData } from "@/types/user";
import { dateFormatter } from "~/utils/dateFormatter";
import { getToken } from "~/utils/secureStore";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import { Text } from "react-native";
import useGetAddress from "~/hooks/useGetAddress";
import { setAddress } from "~/reduxStore/slices/user/onboardingSlice";

let finalUploadData = new FormData();

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const isAndroid = Platform.OS === "android";
  const params = useLocalSearchParams();
  const { value } = useLocalSearchParams();
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [picType, setPicType] = useState<keyof typeof formData | "">("");

  const [selectedField, setSelectedField] = useState<string | null>(
    picType === "height" ? "feetInches" : "kilograms" // this is the default unit for each section
  );
  // Units state
  const [heightInFeet, setHeightInFeet] = useState("");
  const [heightInCentimeters, setHeightInCentimeters] = useState("");
  const [heightInMeters, setHeightInMeters] = useState("");
  const [weightInKg, setWeightInKg] = useState("");
  const [weightInLbs, setWeightInLbs] = useState("");
  const [addressPickup, setAddressPickup] = useState("");
  const [isLocationError, setLocationError] = useState("");
  const [isAlertModalSet, setAlertModal] = useState<boolean>(false);

  // Profile pic and cover pic modal
  const [picModalVisible, setPicModalVisible] = useState({
    coverPic: false,
    profilePic: false,
  });

  // Main form data of profile
  const [formData, setFormData] = useState<UserData>({
    firstName: params.firstName.toString(),
    lastName: params.lastName.toString(),
    username: params.username.toString(),
    headline: params.headline.toString(),
    dateOfBirth: params.dateOfBirth,
    address: {
      city: params.city,
      state: params.state,
      country: params.country,
      location: {
        coordinates: [params.latitude, params.longitude],
      },
    },
    height: params.height?.toString(),
    weight: params.weight?.toString(),
    assets: [params.coverPic?.toString(), params.profilePic?.toString()],
  });

  // Cover Image, Profile Image states
  const [coverImage, setCoverImage] = useState(formData.assets?.[0]);
  const [profileImage, setProfileImage] = useState(formData.assets?.[1]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Modal toggle functions
  const closeModal = () => setModalVisible(false);
  const openModal = (type: React.SetStateAction<string>) => {
    setPicType(type);
    setModalVisible(true);
  };

  // Render modal content based on type
  const renderModalContent = () => {
    switch (picType) {
      case "username":
        return {
          label: "Username",
          placeholder: "@username",
          description:
            "Help players discover your account by using the name that you're known by: either your name, nickname, or business name.",
        };
      case "headline":
        return {
          label: "Headline",
          placeholder: "Enter your headline",
          description:
            "If you are changing something then only press done else press back otherwise by default this field considers itself blank.",
        };
      case "dateOfBirth":
        return {
          label: "Date of Birth",
          placeholder: "DD-MM-YYYY",
          description:
            "Keep your date of birth original and maintain a healthy, trusted, and standard community.",
        };
      case "address":
        return {
          label: "Location",
          placeholder: "city, state, country",
          description:
            "Connect with local sports enthusiasts by sharing your address. Update manually or use automatic detection to stay visible and accessible to the community.",
        };
      case "height":
        return {
          label: "Height",
          unit1: "In feet inches [approx.]-",
          unit2: "In Centimeters [approx.]-",
          unit3: "In meters [approx.]-",
          description:
            "This is a short description for height in order to showcase a real, standard and fit community",
        };
      case "weight":
        return {
          label: "Weight",
          unit1: "In Kilograms [approx.]-",
          unit3: "In pounds [approx.]-",
          description:
            "This is a short description for weight in order to showcase a real, standard and fit community",
        };
      default:
        return { label: "", placeholder: "", description: "" };
    }
  };

  const { label, placeholder, unit1, unit2, unit3, description } =
    renderModalContent();

  // Set form data on visiting edit profile page
  useEffect(() => {
    if (picType && value) {
      setFormData((prev) => ({
        ...prev,
        [picType]: value,
      }));
    }
    console.log("formData-", formData);
  }, [picType, value]);

  // Handle done click after changing input value
  const handleDone = async (field: string, value: any) => {
    // Check if the value is empty
    if (
      ["username", "dateOfBirth", "address"].includes(field) &&
      (!value || value.trim() === "")
    ) {
      // Show a popup message for empty fields
      const message = "This field must not be empty!";
      if (isAndroid) {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      } else {
        Toast.show({
          type: "error",
          text1: message,
          visibilityTime: 1500,
          autoHide: true,
        });
      }
      return;
    }

    // Handle specific fields
    if (field === "height") {
      const heightValue = renderFieldValue(selectedField); // Get the value in the selected unit
      setFormData((prev) => ({
        ...prev,
        [field]: `${heightValue} ${
          selectedField === "feetInches"
            ? "ft"
            : selectedField === "centimeters"
            ? "cm"
            : "m"
        }`,
      }));
      finalUploadData.set(
        "height",
        `${heightValue} ${
          selectedField === "feetInches"
            ? "ft"
            : selectedField === "centimeters"
            ? "cm"
            : "m"
        }`
      );
    } else if (field === "weight") {
      const weightValue = renderFieldValue(selectedField); // Get value in selected unit
      setFormData((prev) => ({
        ...prev,
        [field]: `${weightValue} ${
          selectedField === "kilograms" ? "kg" : "lbs"
        }`,
      }));
      finalUploadData.set(
        "weight",
        `${selectedField === "kilograms" ? "kg" : "lbs"}`
      );
    } else if (field === "username") {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/checkUsername`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${await getToken("accessToken")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: value }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Username is valid and available
          setFormData((prev) => ({ ...prev, [field]: value }));
          finalUploadData.set("username", value);
        } else {
          Keyboard.dismiss();
          if (isAndroid) {
            ToastAndroid.show(
              data.message || "Username already exists!",
              ToastAndroid.SHORT
            );
          } else {
            Toast.show({
              type: "error",
              text1: data.message || "Username already exists!",
              visibilityTime: 1500,
              autoHide: true,
            });
          }
          return;
        }
      } catch (error) {
        console.error("Error checking username:", error);
        alert("Something went wrong. Please try again.");
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
      finalUploadData.set(`${field}`, `${value}`);
    }

    closeModal();
  };

  useEffect(() => {
    if (picType) {
      console.log("Input value changed");
      setInputValue(formData[picType] || "");
    }
  }, [picType]);

  // Pick Image (Cover pic, Profile Pic)
  const pickImage = async (imageType: "cover" | "profile") => {
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
        aspect: [1, 1],
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

        if (imageType === "cover") {
          finalUploadData.append("coverPic", fileObject as any);
          setCoverImage(file.uri);
        } else {
          finalUploadData.append("profilePic", fileObject as any);
          setProfileImage(file.uri);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Error picking image");
    } finally {
      setPicModalVisible({ coverPic: false, profilePic: false });
    }
  };

  // Unified toggle function for pic modal
  const togglePicModal = (type: any) => {
    setPicModalVisible((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const toggleSelectedField = (field: string) => {
    setSelectedField(field);
  };

  // Location fetching hook
  const { loading, error, address, getAddress } = useGetAddress();

  // Sync address with local state and Redux
  useEffect(() => {
    if (address) {
      setAddressPickup(address.formattedAddress);
    }
  }, [address]);

  useEffect(() => {
    if (error) {
      setLocationError(error);
    }
  }, [error]);

  // <------ Units related functions --->
  const renderFieldValue = (field: string) => {
    switch (field) {
      case "feetInches":
        return `${heightInFeet} ft`;
      case "centimeters":
        return `${heightInCentimeters} cm`;
      case "meters":
        return `${heightInMeters} m`;
      case "kilograms":
        return `${weightInKg} kg`;
      case "pounds":
        return `${weightInLbs} lbs`;
      default:
        return "";
    }
  };

  const handleFeetChange = (value: string) => {
    setHeightInFeet(value);
    if (value === "") {
      setHeightInCentimeters("");
      setHeightInMeters("");
    } else {
      const feet = parseFloat(value) || 0;
      setHeightInCentimeters((feet * 30.48).toFixed(2));
      setHeightInMeters((feet * 0.3048).toFixed(2));
    }
  };

  const handleCentimetersChange = (value: string) => {
    setHeightInCentimeters(value);
    if (value === "") {
      setHeightInFeet("");
      setHeightInMeters("");
    } else {
      const cm = parseFloat(value) || 0;
      setHeightInFeet((cm / 30.48).toFixed(2));
      setHeightInMeters((cm / 100).toFixed(2));
    }
  };

  const handleMetersChange = (value: string) => {
    setHeightInMeters(value);
    if (value === "") {
      setHeightInFeet("");
      setHeightInCentimeters("");
    } else {
      const meters = parseFloat(value) || 0;
      setHeightInFeet((meters / 0.3048).toFixed(2));
      setHeightInCentimeters((meters * 100).toFixed(2));
    }
  };

  const handleKgChange = (value: string) => {
    setWeightInKg(value);
    if (value === "") {
      setWeightInLbs("");
    } else {
      const kg = parseFloat(value) || 0;
      setWeightInLbs((kg * 2.20462).toFixed(2));
    }
  };

  const handleLbsChange = (value: string) => {
    setWeightInLbs(value);
    if (value === "") {
      setWeightInKg("");
    } else {
      const lbs = parseFloat(value) || 0;
      setWeightInKg((lbs / 2.20462).toFixed(2));
    }
  };
  // <------ Units related functions --->

  // Initialize final upload data to empty on path change
  useEffect(() => {
    finalUploadData = new FormData();
  }, [pathname]);

  // Handle FormSubmit with error handling
  const handleFormSubmit = async () => {
    try {
      setIsLoading(true);

      await dispatch(editUserProfile(finalUploadData)).unwrap();
      router.push("/profile");
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Update failed: ${error}`);
    } finally {
      setIsLoading(false);
      finalUploadData = new FormData();
    }
  };

  // Form configurations
  const formConfig = [
    { type: "username", label: "Username*", icon: null },
    { type: "headline", label: "Headline", icon: null },
    {
      type: "dateOfBirth",
      label: "Birth Date*",
      icon: <AntDesign name="calendar" size={24} color="grey" />,
    },
    {
      type: "address",
      label: "Location*",
      icon: <MaterialIcons name="location-pin" size={22.5} color="grey" />,
    },
    {
      type: "height",
      label: "Height",
      icon: <AntDesign name="down" size={20} color="grey" />,
    },
    {
      type: "weight",
      label: "Weight",
      icon: <AntDesign name="down" size={20} color="grey" />,
    },
    {
      type: "team",
      label: "Team",
      icon: <AntDesign name="down" size={20} color="grey" />,
      placeholder: "not joined yet",
    },
    {
      type: "academy",
      label: "Academy",
      icon: <AntDesign name="down" size={20} color="grey" />,
      placeholder: "not joined yet",
    },
    {
      type: "club",
      label: "Club",
      icon: <AntDesign name="down" size={20} color="grey" />,
      placeholder: "not joined yet",
    },
    {
      type: "gym",
      label: "Gym",
      icon: <AntDesign name="down" size={20} color="grey" />,
      placeholder: "not joined yet",
    },
  ];

  return (
    <SafeAreaView>
      <PageThemeView>
        <ScrollView
          style={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header */}
          <View className="h-12 w-full flex-row justify-between items-center px-5">
            {/* Back button */}
            <TouchableOpacity
              onPress={() =>
                !Array.from(finalUploadData.entries()).length
                  ? router.push("/profile")
                  : setAlertModal(true)
              }
              className="basis-[10%]"
            >
              <TextScallingFalse className="text-[#808080] text-4xl font-normal">
                Back
              </TextScallingFalse>
            </TouchableOpacity>
            {/* Heading */}
            <TextScallingFalse className="flex-grow text-center text-white font-light text-5xl">
              Edit profile
            </TextScallingFalse>
            {/* Save button */}
            {isLoading ? (
              <View className="basis-[10%]">
                <ActivityIndicator
                  size="small"
                  color="#12956B"
                  style={styles.loader}
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleFormSubmit}
                className="basis-[10%]"
                disabled={!Array.from(finalUploadData.entries()).length}
              >
                <TextScallingFalse
                  className={`${
                    Array.from(finalUploadData.entries()).length
                      ? "text-[#12956B]"
                      : "text-[#808080]"
                  } text-4xl font-medium`}
                >
                  Save
                </TextScallingFalse>
              </TouchableOpacity>
            )}
          </View>

          {/* Profile and cover image */}
          <View className="relative w-full h-36 lg:h-60 mb-24 flex justify-center items-center">
            {/* cover pic */}
            <TouchableOpacity
              onPress={() => togglePicModal("coverPic")}
              activeOpacity={0.9}
              className="bg-black h-full w-full"
            >
              {coverImage ? (
                <Image
                  source={{
                    uri: coverImage,
                  }}
                  style={{ width: "100%", height: "100%", opacity: 0.5 }}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1720048170996-40507a45c720?q=80&w=1913&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  }}
                  style={{ width: "100%", height: "100%", opacity: 0.5 }}
                  resizeMode="cover"
                />
              )}

              <MaterialCommunityIcons
                className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                name="camera-plus-outline"
                size={30}
                color="white"
              />
            </TouchableOpacity>
            {/* profile pic */}
            <TouchableOpacity
              onPress={() => togglePicModal("profilePic")}
              activeOpacity={0.9}
              className="absolute bg-black w-[132px] h-[132px] top-[50%] right-[5%] rounded-full border-2 border-black"
            >
              {profileImage ? (
                <Image
                  source={{
                    uri: profileImage,
                  }}
                  className="w-full h-full opacity-50 rounded-full bg-cover"
                />
              ) : (
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1720048170996-40507a45c720?q=80&w=1913&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  }}
                  className="w-full h-full opacity-50 rounded-full bg-cover"
                />
              )}
              <MaterialCommunityIcons
                className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                name="camera-plus-outline"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {/* Form Part */}
          {/* first name */}
          <View className="flex-row items-center justify-between px-6 border-b border-[#3030309a]">
            <Text className="text-white text-4xl font-medium w-1/3">
              First Name*
            </Text>
            <TextInput
              placeholder="enter your first name"
              placeholderTextColor={"grey"}
              className="text-2xl font-light flex-grow text-white pl-0"
              onChangeText={(text) => {
                setFormData({ ...formData, firstName: text });
                finalUploadData.set("firstName", formData.firstName);
              }}
              value={formData.firstName}
            />
          </View>
          {/* last name */}
          <View className="flex-row items-center justify-between px-6 h-14 border-b border-[#3030309a]">
            <Text className="text-white text-4xl font-medium w-1/3">
              Last Name*
            </Text>
            <TextInput
              placeholder="enter your first name"
              placeholderTextColor={"grey"}
              className="text-2xl font-light flex-grow text-white pl-0"
              onChangeText={(text) => {
                setFormData({ ...formData, lastName: text });
                finalUploadData.set("lastName", formData.lastName);
              }}
              value={formData.lastName}
            />
          </View>
          {/* username, dob, location, height, weight */}
          {formConfig.map(({ type, label, icon, placeholder }, index) => (
            <FormField
              key={type}
              label={label}
              value={
                type === "address" // Check if the type is "address"
                  ? `${formData.address.city}, ${formData.address.state}, ${formData.address.country}` // Concatenate address properties
                  : formData[type] || "" // Use the value directly for other fields
              }
              isDate={type === "dateOfBirth" && true}
              placeholder={placeholder || "not given"}
              onPress={() => openModal(type)}
              icon={icon}
              isLast={index === formConfig.length - 1}
            />
          ))}

          {/* Profile pic, cover pic modal */}
          <Modal
            visible={picModalVisible.coverPic}
            onRequestClose={() => togglePicModal("coverPic")}
            transparent={true}
            animationType="slide"
          >
            <TouchableOpacity
              className="flex-1 justify-end items-center bg-black/40"
              activeOpacity={1}
              onPress={() => togglePicModal("coverPic")}
            >
              <View className="w-full bg-[#1D1D1D] rounded-tl-2xl rounded-tr-2xl mx-auto">
                <View className="justify-center items-center p-5 gap-1">
                  <TextScallingFalse
                    style={{ color: "white", fontSize: 13, fontWeight: "500" }}
                  >
                    Add Tour Cover Picture
                  </TextScallingFalse>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "white",
                      width: "28%",
                    }}
                  />
                </View>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                    marginBottom: "3%",
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      gap: "3%",
                      paddingHorizontal: 30,
                    }}
                    onPress={() => pickImage("cover")}
                  >
                    <FontAwesome5
                      name="images"
                      style={{ marginTop: "1%" }}
                      size={24}
                      color="white"
                    />
                    <View>
                      <TextScallingFalse
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "semibold",
                        }}
                      >
                        Upload your Cover Picture
                      </TextScallingFalse>
                      <TextScallingFalse
                        style={{
                          color: "white",
                          fontSize: 13,
                          fontWeight: "300",
                        }}
                      >
                        On Strength we require members to use their standard
                        details so upload a meaningful cover pic
                      </TextScallingFalse>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
          <Modal
            visible={picModalVisible.profilePic}
            onRequestClose={() => togglePicModal("profilePic")}
            transparent={true}
            animationType="slide"
          >
            <TouchableOpacity
              className="flex-1 justify-end items-center bg-black/40"
              activeOpacity={1}
              onPress={() => togglePicModal("profilePic")}
            >
              <View className="w-full bg-[#1D1D1D] rounded-tl-2xl rounded-tr-2xl mx-auto">
                <View className="justify-center items-center p-5 gap-1">
                  <TextScallingFalse
                    style={{ color: "white", fontSize: 13, fontWeight: "500" }}
                  >
                    Add your Profile Picture
                  </TextScallingFalse>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "white",
                      width: "28%",
                    }}
                  />
                </View>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                    marginBottom: "3%",
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      gap: "3%",
                      paddingHorizontal: 30,
                    }}
                    onPress={() => pickImage("profile")}
                  >
                    <FontAwesome5
                      name="images"
                      style={{ marginTop: "1%" }}
                      size={24}
                      color="white"
                    />
                    <View>
                      <TextScallingFalse
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "semibold",
                        }}
                      >
                        Upload your Profile Picture
                      </TextScallingFalse>
                      <TextScallingFalse
                        style={{
                          color: "white",
                          fontSize: 13,
                          fontWeight: "300",
                        }}
                      >
                        On Strength we require members to use their real
                        identities so upload a photo of yourself
                      </TextScallingFalse>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </ScrollView>

        {/* Date picker component */}
        {isDatePickerVisible && (
          <View>
            <DateTimePicker
              value={inputValue ? new Date(inputValue) : new Date()} // Set initial value
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  const formattedDate = selectedDate
                    .toISOString()
                    .split("T")[0]; // Format date
                  setInputValue(formattedDate); // Update state
                }
                setIsDatePickerVisible(false); // Close picker
              }}
              themeVariant="dark"
            />
          </View>
        )}

        {/* Alert modal */}
        <Modal visible={isAlertModalSet} transparent animationType="fade">
          <View style={styles.AlertModalView}>
            <View style={styles.AlertModalContainer}>
              <TextScallingFalse style={styles.AlertModalHeader}>
                Changes you made will not be saved!
              </TextScallingFalse>
              <TextScallingFalse style={styles.ModalContentText}>
                Are you sure to leave ?
              </TextScallingFalse>
              <View style={styles.ModalButtonsView}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setAlertModal(false)}
                  style={styles.RightButton}
                >
                  <TextScallingFalse style={styles.AlertModalButtonsText}>
                    Cancel
                  </TextScallingFalse>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/profile")}
                  style={styles.LeftButton}
                >
                  <TextScallingFalse style={styles.AlertModalButtonsText}>
                    Yes
                  </TextScallingFalse>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Modal */}
        <Modal visible={isModalVisible} transparent onRequestClose={closeModal}>
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={closeModal}
          >
            <View className="bg-black h-full">
              {/* Modal Header */}
              <View className="flex-row justify-between items-center p-5 border-b border-gray-800">
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={closeModal}>
                    <AntDesign name="arrowleft" size={28} color="white" />
                  </TouchableOpacity>
                  <Text className="text-white text-5xl font-medium ml-6">
                    {label}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDone(picType, inputValue)}
                >
                  <MaterialIcons name="done" size={28} color="#12956B" />
                </TouchableOpacity>
              </View>

              {/* Modal Content */}
              <View className="p-5">
                {["height", "weight"].includes(picType) ? (
                  <>
                    {picType === "height" && (
                      <>
                        <MeasurementInput
                          unit="In feet inches [approx.]-"
                          value={heightInFeet}
                          onChange={handleFeetChange}
                          field="feetInches"
                          selectedField={selectedField}
                          toggleField={() => toggleSelectedField("feetInches")}
                          renderFieldValue={() =>
                            renderFieldValue("feetInches")
                          }
                        />
                        <MeasurementInput
                          unit="In Centimeters [approx.]-"
                          value={heightInCentimeters}
                          onChange={handleCentimetersChange}
                          field="centimeters"
                          selectedField={selectedField}
                          toggleField={() => toggleSelectedField("centimeters")}
                          renderFieldValue={() =>
                            renderFieldValue("centimeters")
                          }
                        />
                        <MeasurementInput
                          unit="In meters [approx.]-"
                          value={heightInMeters}
                          onChange={handleMetersChange}
                          field="meters"
                          selectedField={selectedField}
                          toggleField={() => toggleSelectedField("meters")}
                          renderFieldValue={() => renderFieldValue("meters")}
                        />
                      </>
                    )}
                    {picType === "weight" && (
                      <>
                        <MeasurementInput
                          unit="In Kilograms [approx.]-"
                          value={weightInKg}
                          onChange={handleKgChange}
                          field="kilograms"
                          selectedField={selectedField}
                          toggleField={() => toggleSelectedField("kilograms")}
                          renderFieldValue={() => renderFieldValue("kilograms")}
                        />
                        <MeasurementInput
                          unit="In pounds [approx.]-"
                          value={weightInLbs}
                          onChange={handleLbsChange}
                          field="pounds"
                          selectedField={selectedField}
                          toggleField={() => toggleSelectedField("pounds")}
                          renderFieldValue={() => renderFieldValue("pounds")}
                        />
                      </>
                    )}
                  </>
                ) : picType === "dateOfBirth" ? (
                  <>
                    <Text className="text-gray-500 text-xl">{label}</Text>
                    <View className="flex-row border-b border-white">
                      <TextInput
                        value={dateFormatter(inputValue, "date")}
                        onChangeText={setInputValue}
                        placeholder={placeholder}
                        placeholderTextColor="gray"
                        className="text-white text-4xl flex-1 pl-0 pb-0"
                      />
                      {picType === "dateOfBirth" && (
                        <TouchableOpacity
                          onPress={() => setIsDatePickerVisible(true)}
                          className="inset-y-3"
                        >
                          <AntDesign name="calendar" size={22} color="white" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </>
                ) : (
                  <>
                    <Text className="text-gray-500 text-xl">{label}</Text>
                    <View className="flex-row border-b border-white">
                      <TextInput
                        value={
                          picType === "address" ? addressPickup : inputValue
                        }
                        onChangeText={setInputValue}
                        placeholder={placeholder}
                        placeholderTextColor="gray"
                        className="text-white text-4xl flex-1 pl-0 pb-0"
                      />
                      {picType === "dateOfBirth" && (
                        <TouchableOpacity
                          onPress={() => setIsDatePickerVisible(true)}
                          className="inset-y-3"
                        >
                          <AntDesign name="calendar" size={22} color="white" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </>
                )}

                <Text className="text-gray-500 text-base mt-4">
                  {description}
                </Text>
                {picType === "address" ? (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    className="flex-row w-1/2 justify-center items-center h-10 gap-[5%] mt-[5%] border-[0.3px] border-white self-center rounded-xl"
                    onPress={getAddress}
                  >
                    {loading ? (
                      <TextScallingFalse
                        style={{
                          color: "grey",
                          fontSize: 11,
                          fontWeight: "400",
                        }}
                      >
                        Fetching current location...
                      </TextScallingFalse>
                    ) : (
                      <>
                        <TextScallingFalse
                          style={{
                            color: "grey",
                            fontSize: 11,
                            fontWeight: "400",
                          }}
                        >
                          Use my current location
                        </TextScallingFalse>
                        <FontAwesome5
                          name="map-marker-alt"
                          size={13}
                          color="grey"
                        />
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  ""
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </PageThemeView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire container
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent black
  },
  ContainerView2: {
    width: "100%",
    paddingHorizontal: 25,
    alignItems: "center",
    gap: 20,
  },
  QuestionBoxView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  QuestionText2: {
    color: "white",
    fontSize: responsiveFontSize(2),
    fontWeight: "300",
    width: 212,
  },
  FlexContainer: {
    flexDirection: "row",
  },
  NumberInput: {
    width: 100,
    backgroundColor: "#1E1E1E",
    height: 40,
    color: "white",
    fontWeight: "400",
    borderRadius: 5,
    fontSize: 15,
    paddingHorizontal: 10,
  },
  ContainerViews: {
    width: "100%",
    height: 45,
    borderBottomWidth: 0.3,
    borderBottomColor: "#303030",
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalView: {
    marginTop: "50%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  QuestionText: {
    color: "white",
    fontSize: responsiveFontSize(1.88),
    fontWeight: "500",
    width: "32.5%",
  },
  AnswerText: {
    color: "white",
    fontSize: responsiveFontSize(1.88),
    fontWeight: "300",
    width: "100%",
  },
  DescriptiveView: {
    borderBottomWidth: 0.3,
    borderBottomColor: "#303030",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  Button: {
    width: "65%",
    flexDirection: "row",
  },
  shortedWidth: {
    width: "89.6%",
  },
  PaddingLeft: {
    paddingLeft: "4%",
  },
  InputSections: {
    fontSize: 14,
    fontWeight: "300",
    paddingStart: 0,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    // backgroundColor: "white",
    padding: 20,
    height: "30%", // Controls the modal height
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
  },
  loader: {
    marginVertical: 20,
  },
  AlertModalView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    paddingVertical: 250,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  AlertModalContainer: {
    width: "80%",
    height: 200,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
  },
  AlertModalHeader: {
    color: "black",
    fontSize: 17,
    fontWeight: "500",
    alignSelf: "center",
    paddingTop: 40,
  },
  ModalContentText: {
    width: "100%",
    padding: 20,
    textAlign: "center",
    color: "black",
    fontWeight: "400",
  },
  ModalButtonsView: {
    flexDirection: "row",
    borderTopColor: "grey",
    borderTopWidth: 0.3,
    width: "100%",
  },
  LeftButton: {
    borderRightWidth: 0.3,
    borderRightColor: "grey",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  RightButton: {
    borderRightWidth: 0.3,
    borderRightColor: "grey",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  AlertModalButtonsText: {
    color: "grey",
    fontSize: 14,
    fontWeight: "600",
  },
});

// Reusable FormField Component
const FormField = ({
  label,
  value,
  placeholder,
  onPress,
  icon,
  isLast,
  isDate,
}: {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  icon?: React.ReactNode;
  isLast?: boolean;
  isDate?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.5}
    className={`flex-row items-center justify-between px-6 h-14 ${
      !isLast ? "border-b border-[#3030309a]" : ""
    }`}
  >
    <Text className="text-white text-4xl font-medium w-1/3">{label}</Text>
    <View className="flex-row items-center justify-between w-2/3">
      <Text
        className={`text-2xl font-light ${
          value ? "text-white" : "text-gray-500"
        }`}
      >
        {isDate ? dateFormatter(value, "date") : value || placeholder}
      </Text>
      {icon && <View className="">{icon}</View>}
    </View>
  </TouchableOpacity>
);

// Measurement Input Component
const MeasurementInput = ({
  unit,
  value,
  onChange,
  field,
  selectedField,
  toggleField,
  renderFieldValue,
}: {
  unit: string;
  value: string;
  onChange: (text: string) => void;
  field: string;
  selectedField: string;
  toggleField: () => void;
  renderFieldValue: () => string;
}) => {
  // Validation logic for height and weight
  const handleInputChange = (text: string) => {
    const numericValue = parseFloat(text);

    if (isNaN(numericValue)) {
      onChange(""); // Allow empty input
      return;
    }

    // Define reasonable limits for height and weight
    let maxValue: number;
    switch (field) {
      case "feetInches": // Height in feet (e.g., max 10 feet)
        maxValue = 10;
        break;
      case "centimeters": // Height in centimeters (e.g., max 300 cm)
        maxValue = 300;
        break;
      case "meters": // Height in meters (e.g., max 3 meters)
        maxValue = 3;
        break;
      case "kilograms": // Weight in kilograms (e.g., max 500 kg)
        maxValue = 500;
        break;
      case "pounds": // Weight in pounds (e.g., max 1100 lbs)
        maxValue = 1100;
        break;
      default:
        maxValue = Infinity; // No limit for other fields
    }

    // Restrict input to the defined limits
    if (numericValue <= maxValue) {
      onChange(text);
    }
  };

  return (
    <View className="flex-row items-center justify-between w-full mb-4">
      <Text className="text-white text-3xl font-light basis-[55%]">{unit}</Text>
      <View className="flex-row basis-[45%]">
        <TextInput
          value={value}
          onChangeText={handleInputChange} // Use the validated input handler
          keyboardType="numeric"
          className="bg-[#1E1E1E] text-white text-2xl font-normal rounded px-2 py-2 w-24"
        />
        <CustomButton
          field={field}
          selectedField={selectedField}
          toggleSelectedField={toggleField}
          renderFieldValue={() => renderFieldValue(field)}
        />
      </View>
    </View>
  );
};
