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
import React, { useState, useEffect, useCallback } from "react";
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
import CustomButton from "~/components/common/CustomButtons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { editUserProfile } from "~/reduxStore/slices/user/profileSlice";
import { UserData } from "@/types/user";
import { dateFormatter } from "~/utils/dateFormatter";
import { getToken } from "~/utils/secureStore";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import useGetAddress from "~/hooks/useGetAddress";
import { setAddress } from "~/reduxStore/slices/user/onboardingSlice";
import UploadImg from "~/components/SvgIcons/Edit-Profile/UploadImg";

//type: PicType for modal-editable fields
type PicType =
  | "username"
  | "headline"
  | "dateOfBirth"
  | "address"
  | "height"
  | "weight"
  | "websiteLink"
  | "";

// Form configurations
const userFormConfig = [
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
  },
  {
    type: "height",
    label: "Height",
    icon: <AntDesign name="down" size={15} color="grey" />,
  },
  {
    type: "weight",
    label: "Weight",
    icon: <AntDesign name="down" size={15} color="grey" />,
  },
  {
    type: "team",
    label: "Team",
    icon: <AntDesign name="down" size={15} color="grey" />,
    placeholder: "not joined yet",
  },
  // {
  //   type: "academy",
  //   label: "Academy",
  //   icon: <AntDesign name="down" size={20} color="grey" />,
  //   placeholder: "not joined yet",
  // },
  // {
  //   type: "club",
  //   label: "Club",
  //   icon: <AntDesign name="down" size={20} color="grey" />,
  //   placeholder: "not joined yet",
  // },
  // {
  //   type: "gym",
  //   label: "Gym",
  //   icon: <AntDesign name="down" size={20} color="grey" />,
  //   placeholder: "not joined yet",
  // },
];

const pageFormConfig = [
  { type: "username", label: "Username*", icon: null },
  { type: "headline", label: "Tagline", icon: null },
  { type: "favouriteSports", label: "Sports Category*", icon: null },
  {
    type: "dateOfBirth",
    label: "Established",
    icon: <AntDesign name="calendar" size={24} color="grey" />,
  },
  {
    type: "address",
    label: "Location*",
  },
  { type: "websiteLink", label: "Website", icon: null },
];

let finalUploadData = new FormData();

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: any) => state?.profile);
  const router = useRouter();
  const pathname = usePathname();
  const isAndroid = Platform.OS === "android";
  const { value } = useLocalSearchParams();
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [picType, setPicType] = useState<PicType>("");

  const formConfig = user?.type === "User" ? userFormConfig : pageFormConfig;

  const [selectedField, setSelectedField] = useState<string | null>(
    picType === "height" ? "feetInches" : "kilograms" // this is the default unit for each section
  );
  // Units state
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [heightInCentimeters, setHeightInCentimeters] = useState("");
  const [heightInMeters, setHeightInMeters] = useState("");
  const [weightInKg, setWeightInKg] = useState("");
  const [weightInLbs, setWeightInLbs] = useState("");

  // address state
  const [addressPickup, setAddressPickup] = useState(
    user?.address?.city && user?.address?.state && user?.address?.country
      ? `${user.address.city}, ${user.address.state}, ${user.address.country}`
      : ""
  );
  const [isLocationError, setLocationError] = useState("");
  const [isAlertModalSet, setAlertModal] = useState<boolean>(false);

  // Profile pic and cover pic modal
  const [picModalVisible, setPicModalVisible] = useState({
    coverPic: false,
    profilePic: false,
  });

  // Main form data of profile
  const [formData, setFormData] = useState<UserData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    headline: user?.headline || "",
    dateOfBirth: user?.dateOfBirth || "",
    address: user?.address || {},
    height: user?.height || "",
    weight: user?.weight || "",
    assets: [
      user?.coverPic?.toString() || "",
      user?.profilePic?.toString() || "",
    ],
    websiteLink: user?.websiteLink || "",
  });

  // Cover Image, Profile Image states
  const [coverImage, setCoverImage] = useState(formData.assets?.[0]);
  const [profileImage, setProfileImage] = useState(formData.assets?.[1]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const [initialValue, setInitialValue] = useState<string>("");
  const [initialMeasurement, setInitialMeasurement] = useState<number>(0);

  // Modal toggle functions
  const closeModal = () => setModalVisible(false);
  const openModal = (type: PicType) => {
    setPicType(type);
    if (type === "height" || type === "weight") {
      const currentValue = formData[type];
      let selectedUnit: string = type === "height" ? "feetInches" : "kilograms";
      const parsed = parseMeasurement(currentValue);
      let initialFeet = 0;
      let initialInches = 0;
      let initialCm = 0;
      let initialM = 0;
      let initialKg = 0;
      let initialLbs = 0;

      // Initialize measurement values
      if (type === "height") {
        selectedUnit = "feetInches";
        if (parsed.unit === "ft in") {
          initialFeet = parsed.feet;
          initialInches = parsed.inches;
          const totalFeet = initialFeet + initialInches / 12;

          initialCm = totalFeet * 30.48;
          initialM = totalFeet * 0.3048;
          selectedUnit = "feetInches";
        } else if (parsed.unit === "cm") {
          initialCm = parsed.value;
          initialM = initialCm / 100;
          const totalInches = initialCm / 2.54;

          initialFeet = Math.floor(totalInches / 12);
          initialInches = totalInches % 12;
          selectedUnit = "centimeters";
        } else if (parsed.unit === "m") {
          initialM = parsed.value;
          initialCm = initialM * 100;
          const totalInches = initialCm / 2.54;

          initialFeet = Math.floor(totalInches / 12);
          initialInches = totalInches % 12;
          selectedUnit = "meters";
        }
        setHeightFeet(initialFeet > 0 ? initialFeet.toFixed(0) : "");
        setHeightInches(initialInches > 0 ? initialInches.toFixed(0) : "");
        setHeightInCentimeters(initialCm > 0 ? initialCm.toFixed(2) : "");
        setHeightInMeters(initialM > 0 ? initialM.toFixed(2) : "");
        const baseCm = initialFeet * 30.48 + initialInches * 2.54;
        setInitialMeasurement(baseCm);
      } else {
        if (parsed.unit === "kg") {
          initialKg = parsed.value;
          initialLbs = initialKg * 2.20462;
          selectedUnit = "kilograms";
        } else if (parsed.unit === "lbs") {
          initialLbs = parsed.value;
          initialKg = initialLbs / 2.20462;
          selectedUnit = "pounds";
        }
        setWeightInKg(initialKg > 0 ? initialKg.toFixed(2) : "");
        setWeightInLbs(initialLbs > 0 ? initialLbs.toFixed(2) : "");

        //calculate initial measurement in a base unit (kg)
        const baseKg =
          parsed.unit === "kg"
            ? parsed.value
            : parsed.unit === "lbs"
            ? parsed.value / 2.20462
            : 0;
        setInitialMeasurement(baseKg);
      }

      setSelectedField(selectedUnit);
    } else {
      const value =
        type === "address"
          ? addressPickup
          : formData[type as keyof UserData] || "";
      setInputValue(value);
      setInitialValue(value);
    }
    setModalVisible(true);
  };

  const parseMeasurement = (
    value: string
  ): { feet: number; inches: number; value: number; unit: string } => {
    if (!value) return { feet: 0, inches: 0, value: 0, unit: "" };
    const parts = value.trim().split(" ");

    try {
      if (parts.length === 4 && parts[1] === "ft" && parts[3] === "in") {
        //handles "X ft Y in"
        const feet = parseFloat(parts[0]);
        const inches = parseFloat(parts[2]);
        if (!isNaN(feet) && !isNaN(inches)) {
          const totalValueInches = feet * 12 + inches;
          return {
            feet: feet,
            inches: inches,
            value: totalValueInches / 12,
            unit: "ft in",
          };
        }
      } else if (parts.length === 2) {
        const numericValue = parseFloat(parts[0]);
        const unit = parts[1];
        if (!isNaN(numericValue)) {
          if (unit === "ft") {
            //handle "X ft" treat as X ft 0 in
            return {
              feet: numericValue,
              inches: 0,
              value: numericValue,
              unit: "ft in",
            };
          }
          if (
            unit === "cm" ||
            unit === "m" ||
            unit === "kg" ||
            unit === "lbs"
          ) {
            // Other units (keep value as is, feet/inches not applicable directly)
            return { feet: 0, inches: 0, value: numericValue, unit: unit };
          }
        }
      }
    } catch (e) {
      console.error("Error parsing measurement:", e);
    }
    //default fallback
    return { feet: 0, inches: 0, value: 0, unit: "" };
  };

  // Helper to calculate base measurement
  // const calculateBaseMeasurement = (
  //   type: string,
  //   value: number,
  //   unit: string
  // ) => {
  //   if (type === "height") {
  //     return unit === "ft"
  //       ? value * 30.48
  //       : unit === "cm"
  //       ? value
  //       : unit === "m"
  //       ? value * 100
  //       : 0;
  //   }
  //   return unit === "kg" ? value : unit === "lbs" ? value / 2.20462 : 0;
  // };

  // Render modal content based on type
  const renderModalContent = () => {
    switch (picType) {
      case "username":
        return {
          label: "Username",
          placeholder: "@username",
          description:
            "Your username is your unique identity on Strength—make it memorable, recognizable, and true to your sports journey!.",
        };
      case "headline":
        return {
          label: "Headline",
          placeholder: "Enter your headline",
          description:
            "Your headline is the perfect way to showcase your identity in sports. keep it concise and impactful to let others instantly know who you are!",
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
            "Connect with local sports enthusiasts by sharing your address.",
        };
      case "height":
        return {
          label: "Height",
          unit1: "In feet inches [approx.]-",
          unit2: "In Centimeters [approx.]-",
          unit3: "In meters [approx.]-",
          description:
            "Showcase your height to help teams and athletes know your physical presence in the game!",
        };
      case "weight":
        return {
          label: "Weight",
          unit1: "In Kilograms [approx.]-",
          unit3: "In pounds [approx.]-",
          description:
            "Your weight helps define your athletic profile. Enter it to showcase your physical attributes!",
        };
      case "websiteLink":
        return {
          label: "Website",
          description: "Give your website link here",
          placeholder: "www.example.com",
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

  // reusable toast msg function
  const showToast = (message: string) => {
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
  };

  // parse the address string
  const parseAddress = (addressString: string) => {
    const parts = addressString.split(",").map((part) => part.trim());
    if (parts.length === 3) {
      return { city: parts[0], state: parts[1], country: parts[2] };
    }
    return null;
  };

  // Handle done click after changing input value
  const handleDone = async (field: PicType, value: string) => {
    // Check if the value is empty
    if (!hasChanges) return;
    if (
      ["username", "dateOfBirth"].includes(field) &&
      (!value || value.trim() === "")
    ) {
      // Show a popup message for empty fields
      showToast("This field must not be empty!");
      return;
    }

    // Handle specific fields
    if (field === "address") {
      //address field
      const parsedAddress = parseAddress(value); //parse the input value
      if (parsedAddress) {
        const { city, state, country } = parsedAddress;
        setFormData((prev) => ({
          ...prev,
          address: { city, state, country },
        }));
        setAddressPickup(value); //reflect the confirmed address in the UI

        //sync with redux
        setAddress({
          city,
          state,
          country,
          location: { coordinates: address?.coordinates || [] }, // Use fetched coordinates if available
        });

        // Update finalUploadData
        finalUploadData.set("city", city);
        finalUploadData.set("state", state);
        finalUploadData.set("country", country);
        if (address?.coordinates) {
          finalUploadData.set("latitude", address.coordinates[0].toString());
          finalUploadData.set("longitude", address.coordinates[1].toString());
        }
      } else {
        showToast("Please enter address in format: city, state, country");
        return;
      }
    } else if (field === "height") {
      let heightString = "";
      if (selectedField === "feetInches") {
        const ft = parseInt(heightFeet, 10) || 0;
        const inch = parseFloat(heightInches) || 0;
        if (ft > 0 || inch > 0) {
          heightString = `${ft} ft ${inch.toFixed(0)} in`;
        }
      } else if (selectedField === "centimeters") {
        const cm = parseFloat(heightInCentimeters) || 0;
        if (cm > 0) {
          heightString = `${cm.toFixed(1)} cm`;
        }
      } else if (selectedField === "meters") {
        const m = parseFloat(heightInMeters) || 0;
        if (m > 0) {
          heightString = `${m.toFixed(2)} m`;
        }
      }

      setFormData((prev) => ({ ...prev, [field]: heightString }));
      if (heightString) {
        finalUploadData.set("height", heightString);
      } else {
        finalUploadData.delete("height");
      }
    } else if (field === "weight") {
      // weight field
      const weightValue = renderFieldValue(selectedField || "");
      const weightString = weightValue
        ? `${weightValue} ${selectedField === "kilograms" ? "kg" : "lbs"}`
        : "";

      setFormData((prev) => ({ ...prev, [field]: weightString }));
      finalUploadData.set("weight", weightString);
    } else if (field === "username") {
      const usernameRegex = /^[a-z0-9._]+$/;

      if (!usernameRegex.test(value)) {
        showToast(
          "Username can only contain lowercase letters, numbers,(.) and (_)."
        );
        return;
      }

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
          showToast(data.message || "Username already exists!");
          return;
        }
      } catch (error) {
        console.error("Error checking username:", error);
        showToast("Something went wrong. Please try again.");
        return;
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
      finalUploadData.set(field, value);
    }

    closeModal();
  };

  useEffect(() => {
    if (picType) {
      if (picType === "address") {
        setInputValue(addressPickup); //initialize with current addressPickup
      } else {
        setInputValue(formData[picType] || "");
      }
    }
  }, [picType, addressPickup]);

  // Pick Image (Cover pic, Profile Pic)
  // Pick Image (Cover pic, Profile Pic)
  const pickImage = async (imageType: "cover" | "profile") => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        showToast("Permission to access the camera roll is required!");
        return;
      }

      let aspect: [number, number] = [1, 1]; // Explicitly type aspect as [number, number]
      if (imageType === "cover") {
        aspect = [3, 1];
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: aspect,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        const fileName = file.uri.split("/").pop() || "image.jpg";
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
      showToast("Error picking image");
    } finally {
      setPicModalVisible({ coverPic: false, profilePic: false });
    }
  };

  // Unified toggle function for pic modal
  const togglePicModal = (type: "coverPic" | "profilePic") => {
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
      const formattedAddress = `${address.city}, ${address.state}, ${address.country}`;
      setAddressPickup(formattedAddress);
      setInputValue(formattedAddress); // Update input for review. not update formData.address here, let the user confirm it
    }
  }, [address]);

  useEffect(() => {
    if (error) {
      setLocationError(error);
    }
  }, [error]);

  // <------ Units related functions --->
  const renderFieldValue = (field: string | null) => {
    switch (field) {
      case "feetInches":
        return heightFeet || "";
      case "centimeters":
        return heightInCentimeters || "";
      case "meters":
        return heightInMeters || "";
      case "kilograms":
        return weightInKg || "";
      case "pounds":
        return weightInLbs || "";
      default:
        return "";
    }
  };

  const handleFeetChange = useCallback(
    (value: string) => {
      if (value === "") {
        setHeightFeet("");
        const inches = parseFloat(heightInches) || 0;
        const totalFeet = 0 + inches / 12;
        if (heightInches === "") {
          setHeightInCentimeters("");
          setHeightInMeters("");
        } else {
          setHeightInCentimeters((totalFeet * 30.48).toFixed(2));
          setHeightInMeters((totalFeet * 0.3048).toFixed(2));
        }
        return;
      }

      const numericString = value.replace(/[^0-9]/g, "");
      let feet = parseInt(numericString, 10);

      if (isNaN(feet)) {
        if (numericString === "") {
          setHeightFeet("");
          const inches = parseFloat(heightInches) || 0;
          const totalFeet = 0 + inches / 12;
          if (heightInches === "") {
            setHeightInCentimeters("");
            setHeightInMeters("");
          } else {
            setHeightInCentimeters((totalFeet * 30.48).toFixed(2));
            setHeightInMeters((totalFeet * 0.3048).toFixed(2));
          }
          return;
        }
        feet = 0;
      }

      const MAX_FEET = 9;
      if (feet > MAX_FEET) {
        feet = MAX_FEET;
      }

      const inches = parseFloat(heightInches) || 0;
      const feetString = feet.toString();

      setHeightFeet(feetString);

      const totalFeet = feet + inches / 12;
      setHeightInCentimeters((totalFeet * 30.48).toFixed(2));
      setHeightInMeters((totalFeet * 0.3048).toFixed(2));
    },
    [heightInches, setHeightFeet, setHeightInCentimeters, setHeightInMeters]
  );

  const handleInchesChange = useCallback(
    (value: string) => {
      if (value === "") {
        setHeightInches("");
        const feet = parseInt(heightFeet, 10) || 0;
        const totalFeet = feet + 0 / 12;
        if (heightFeet === "") {
          setHeightInCentimeters("");
          setHeightInMeters("");
        } else {
          setHeightInCentimeters((totalFeet * 30.48).toFixed(2));
          setHeightInMeters((totalFeet * 0.3048).toFixed(2));
        }
        return;
      }

      const numericString = value.replace(/[^0-9]/g, "");

      let inches = parseInt(numericString, 10);

      if (isNaN(inches)) {
        if (numericString === "") {
          setHeightInches("");
          const feet = parseInt(heightFeet, 10) || 0;
          const totalFeet = feet + 0 / 12;
          if (heightFeet === "") {
            setHeightInCentimeters("");
            setHeightInMeters("");
          } else {
            setHeightInCentimeters((totalFeet * 30.48).toFixed(2));
            setHeightInMeters((totalFeet * 0.3048).toFixed(2));
          }
          return;
        }
        inches = 0;
      }

      const MAX_INCHES = 11;
      if (inches > MAX_INCHES) {
        inches = MAX_INCHES;
      } else if (inches < 0) {
        inches = 0;
      }

      const finalInchesString = inches.toString();
      const feet = parseInt(heightFeet, 10) || 0;

      setHeightInches(finalInchesString);

      const totalFeet = feet + inches / 12;
      setHeightInCentimeters((totalFeet * 30.48).toFixed(2));
      setHeightInMeters((totalFeet * 0.3048).toFixed(2));
    },
    [heightFeet, setHeightInches, setHeightInCentimeters, setHeightInMeters]
  );

  const handleCentimetersChange = useCallback(
    (value: string) => {
      setHeightInCentimeters(value);
      if (value === "") {
        setHeightFeet("");
        setHeightInches("");
        setHeightInMeters("");
      } else {
        const cm = parseFloat(value) || 0;
        const totalInches = cm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;

        setHeightFeet(feet.toFixed(0));
        setHeightInches(inches.toFixed(0));
        setHeightInMeters((cm / 100).toFixed(2));
      }
    },
    [setHeightInCentimeters, setHeightFeet, setHeightInches, setHeightInMeters]
  );

  const handleMetersChange = useCallback(
    (value: string) => {
      setHeightInMeters(value);
      if (value === "") {
        setHeightFeet("");
        setHeightInches("");
        setHeightInCentimeters("");
      } else {
        const meters = parseFloat(value) || 0;
        const cm = meters * 100;
        const totalInches = cm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;

        setHeightFeet(feet.toFixed(0));
        setHeightInches(inches.toFixed(0));
        setHeightInCentimeters(cm.toFixed(2));
      }
    },
    [setHeightInMeters, setHeightFeet, setHeightInches, setHeightInCentimeters]
  );

  const handleKgChange = useCallback(
    (value: string) => {
      setWeightInKg(value);
      if (value === "") {
        setWeightInLbs("");
      } else {
        const kg = parseFloat(value) || 0;
        setWeightInLbs((kg * 2.20462).toFixed(2));
      }
    },
    [setWeightInKg, setWeightInLbs]
  );

  const handleLbsChange = useCallback(
    (value: string) => {
      setWeightInLbs(value);
      if (value === "") {
        setWeightInKg("");
      } else {
        const lbs = parseFloat(value) || 0;
        setWeightInKg((lbs / 2.20462).toFixed(2));
      }
    },
    [setWeightInLbs, setWeightInKg]
  );

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
      showToast(`Update failed: ${error}`);
    } finally {
      setIsLoading(false);
      finalUploadData = new FormData();
    }
  };

  const calculateCurrentMeasurement = () => {
    if (picType === "height") {
      const ft = parseInt(heightFeet, 10) || 0;
      const inches = parseFloat(heightInches) || 0;
      const cm = parseFloat(heightInCentimeters) || 0;
      const m = parseFloat(heightInMeters) || 0;

      if (selectedField === "feetInches") {
        return ft * 30.48 + inches * 2.54;
      } else if (selectedField === "centimeters") {
        return cm;
      } else if (selectedField === "meters") {
        return m * 100;
      }
    }

    if (picType === "weight") {
      const kg = parseFloat(weightInKg) || 0;
      const lbs = parseFloat(weightInLbs) || 0;

      if (selectedField === "kilograms") {
        return kg;
      } else if (selectedField === "pounds") {
        return lbs / 2.20462;
      }
    }
    return 0;
  };

  const hasChanges = ["height", "weight"].includes(picType)
    ? calculateCurrentMeasurement() !== initialMeasurement
    : inputValue !== initialValue;

  const today = new Date();
  const maxDOB = new Date();
  maxDOB.setFullYear(today.getFullYear() - 13); // must be born before today minus 13 years

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
              className="basis-[20%]"
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
              <View className="basis-[20%] items-end">
                <ActivityIndicator
                  size="small"
                  color="#12956B"
                  style={styles.loader}
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleFormSubmit}
                className="basis-[20%] items-end"
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
          <View
            style={{
              position: "relative",
              width: "100%",
              height: 137,
              marginBottom: 96,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* cover pic */}
            <TouchableOpacity
              onPress={() => togglePicModal("coverPic")}
              activeOpacity={0.9}
              className="bg-black h-full w-full"
            >
              {coverImage ? (
                <Image
                  source={{ uri: coverImage as string }}
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
              className="absolute bg-black w-[132px] h-[132px] top-[50%] right-[5%] rounded-full  border-2 border-black"
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage as string }}
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
          <View className="flex-row items-center justify-between px-6 h-[50px] border-b border-[#3030309a]">
            <TextScallingFalse className="text-white text-4xl font-medium w-1/3">
              {user?.type === "User" ? "First Name*" : "Page Name*"}
            </TextScallingFalse>
            <TextInput
              placeholder="enter your first name"
              placeholderTextColor={"grey"}
              className="text-2xl font-light h-full flex-grow text-white pl-0"
              onChangeText={(text) => {
                setFormData({ ...formData, firstName: text });
                finalUploadData.set("firstName", text);
              }}
              value={formData.firstName}
            />
          </View>
          {/* last name */}
          {user?.type === "User" && (
            <View className="flex-row items-center justify-between px-6 h-14 border-b border-[#3030309a]">
              <TextScallingFalse className="text-white text-4xl font-medium w-1/3">
                Last Name*
              </TextScallingFalse>
              <TextInput
                placeholder="enter your first name"
                placeholderTextColor={"grey"}
                className="text-2xl font-light h-full flex-grow text-white pl-0"
                onChangeText={(text) => {
                  setFormData({ ...formData, lastName: text });
                  finalUploadData.set("lastName", text);
                }}
                value={formData.lastName}
              />
            </View>
          )}
          {/* username, dob, location, height, weight */}
          {formConfig.map(
            ({ type, label, icon, placeholder }, index: Number) => (
              <FormField
                key={type}
                label={label}
                value={
                  type === "address"
                    ? formData.address?.city &&
                      formData.address?.state &&
                      formData.address?.country
                      ? `${formData.address.city}, ${formData.address.state}, ${formData.address.country}`
                      : ""
                    : formData[type as keyof UserData] || ""
                }
                isDate={type === "dateOfBirth" && true}
                placeholder={placeholder || "not given"}
                onPress={() => openModal(type as PicType)}
                icon={icon}
                isLast={index === formConfig.length - 1}
              />
            )
          )}

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
                    Add your Cover Picture
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
                      paddingHorizontal: 35,
                    }}
                    onPress={() => pickImage("cover")}
                  >
                    <View className="w-[20%] justify-center items-center border border-gray-500 rounded-[15px]">
                      <UploadImg />
                    </View>
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
                        Add a cover photo that represents your sports journey,
                        passion, or team spirit. Make your profile stand out!
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
                      paddingHorizontal: 35,
                    }}
                    onPress={() => pickImage("profile")}
                  >
                    <View className="w-[20%] justify-center items-center border border-gray-500 rounded-[15px]">
                      <UploadImg />
                    </View>
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
                        Your profile picture is your identity in the sports
                        community. Choose an image that represents you best!
                      </TextScallingFalse>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </ScrollView>

        {/* Alert modal */}
        <Modal visible={isAlertModalSet} transparent animationType="fade">
          <View style={styles.AlertModalView}>
            <View
              style={styles.AlertModalContainer}
              className="h-full flex items-center justify-center gap-y-3 pt-5"
            >
              <TextScallingFalse className="text-[20px] font-semibold">
                Discard changes?
              </TextScallingFalse>
              <TextScallingFalse className="text-[16px] text-center">
                If you go back now, you will lose your changes.
              </TextScallingFalse>
              <View className="w-full">
                <TouchableOpacity
                  onPress={() => router.push("/profile")}
                  className="w-full py-2 items-center border-t border-[#8080808b]"
                >
                  <TextScallingFalse className="font-semibold text-4xl text-red-600">
                    Discard changes
                  </TextScallingFalse>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setAlertModal(false)}
                  className="w-full py-2 items-center border-t border-[#8080808b]"
                >
                  <TextScallingFalse className="font-semibold text-4xl text-[#808080]">
                    Continue editing
                  </TextScallingFalse>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent
          onRequestClose={closeModal}
        >
          <View className="flex-1">
            <SafeAreaView className="bg-black h-full">
              {/* Modal Header */}
              <View
                className="flex-row justify-between items-center p-4"
                style={{ borderBottomColor: "#252525", borderWidth: 0.7 }}
              >
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="w-[50px] h-[40px] justify-center"
                    onPress={closeModal}
                  >
                    <AntDesign name="arrowleft" size={28} color="white" />
                  </TouchableOpacity>
                  <TextScallingFalse className="text-white text-5xl font-medium">
                    {label}
                  </TextScallingFalse>
                </View>
                <TouchableOpacity
                  onPress={() => handleDone(picType, inputValue)}
                  disabled={!hasChanges}
                  className="w-[60px] justify-end items-end"
                >
                  <MaterialIcons
                    name="done"
                    size={28}
                    color={hasChanges ? "#12956B" : ""}
                  />
                </TouchableOpacity>
              </View>

              {/* Modal Content */}
              <View className="p-5">
                {["height", "weight"].includes(picType) ? (
                  <>
                    {picType === "height" && (
                      <>
                        <View className="flex-row items-center justify-between w-full mb-4">
                          <TextScallingFalse className="text-white text-3xl font-light basis-[50%]">
                            {unit1 || "In Feet & Inches [approx.]-"}
                          </TextScallingFalse>
                          <View className="flex-row basis-[45%] items-center">
                            <View className="relative items-center mr-1">
                              <TextInput
                                value={heightFeet}
                                onChangeText={handleFeetChange}
                                keyboardType="numeric"
                                maxLength={1}
                                className="bg-[#1E1E1E] text-white text-2xl font-normal rounded px-2 py-2 w-[54px] h-9 text-center"
                                style={{ paddingRight: 28 }}
                              />
                              <TextScallingFalse
                                style={{ top: 6 }}
                                className="absolute right-2 text-white text-2xl font-semibold  pointer-events-none"
                              >
                                ft
                              </TextScallingFalse>
                            </View>
                            <View className="relative items-center mr-1">
                              <TextInput
                                value={heightInches}
                                onChangeText={handleInchesChange}
                                keyboardType="numeric"
                                maxLength={2}
                                className="bg-[#1E1E1E] text-white text-2xl font-normal rounded px-2 py-2 w-[54px] h-9 text-center"
                                style={{ paddingRight: 28 }}
                              />
                              <TextScallingFalse
                                style={{ top: 6 }}
                                className="absolute right-2 text-white text-2xl font-semibold  pointer-events-none"
                              >
                                in
                              </TextScallingFalse>
                            </View>
                            <CustomButton
                              field={"feetInches"}
                              selectedField={selectedField || ""}
                              toggleSelectedField={() =>
                                toggleSelectedField("feetInches")
                              }
                              renderFieldValue={() =>
                                `${heightFeet || 0} ft ${heightInches || 0} in`
                              }
                            />
                          </View>
                        </View>
                        <MeasurementInput
                          unit={unit2 || ""}
                          value={heightInCentimeters}
                          onChange={handleCentimetersChange}
                          field="centimeters"
                          selectedField={selectedField || ""}
                          toggleField={() => toggleSelectedField("centimeters")}
                          renderFieldValue={() =>
                            renderFieldValue("centimeters")
                          }
                        />
                        <MeasurementInput
                          unit={unit3 || ""}
                          value={heightInMeters}
                          onChange={handleMetersChange}
                          field="meters"
                          selectedField={selectedField || ""}
                          toggleField={() => toggleSelectedField("meters")}
                          renderFieldValue={() => renderFieldValue("meters")}
                        />
                      </>
                    )}
                    {picType === "weight" && (
                      <>
                        <MeasurementInput
                          unit={unit1 || ""}
                          value={weightInKg}
                          onChange={handleKgChange}
                          field="kilograms"
                          selectedField={selectedField || ""}
                          toggleField={() => toggleSelectedField("kilograms")}
                          renderFieldValue={() => renderFieldValue("kilograms")}
                        />
                        <MeasurementInput
                          unit={unit3 || ""}
                          value={weightInLbs}
                          onChange={handleLbsChange}
                          field="pounds"
                          selectedField={selectedField || ""}
                          toggleField={() => toggleSelectedField("pounds")}
                          renderFieldValue={() => renderFieldValue("pounds")}
                        />
                      </>
                    )}
                  </>
                ) : picType === "dateOfBirth" ? (
                  <>
                    <TextScallingFalse className="text-gray-500 text-xl mb-5">
                      {label}
                    </TextScallingFalse>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        height: 31,
                        borderColor: "white",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setIsDatePickerVisible(true)}
                        activeOpacity={0.7}
                        style={{ width: "90%", justifyContent: "center" }}
                      >
                        <TextScallingFalse className="text-white text-4xl flex-1 pl-0 pb-0">
                          {dateFormatter(new Date(inputValue), "date")}
                        </TextScallingFalse>
                      </TouchableOpacity>
                      {picType === "dateOfBirth" && (
                        <TouchableOpacity
                          onPress={() => setIsDatePickerVisible(true)}
                          className="w-[10%] justify-center items-center"
                          activeOpacity={0.5}
                        >
                          <AntDesign name="calendar" size={22} color="white" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <TextScallingFalse className="text-gray-500 text-base mt-4">
                      {description}
                    </TextScallingFalse>
                    {/* Date picker component */}
                    {isDatePickerVisible && (
                      <View
                        style={{
                          width: "100%",
                          height: "100%",
                          paddingTop: 30,
                          alignItems: "center",
                        }}
                      >
                        <DateTimePicker
                          value={inputValue ? new Date(inputValue) : maxDOB}
                          mode="date"
                          display={
                            Platform.OS === "ios" ? "spinner" : "default"
                          }
                          maximumDate={maxDOB} // restrict to users at least 13
                          onChange={(event, selectedDate) => {
                            if (selectedDate) {
                              const formattedDate = selectedDate
                                .toISOString()
                                .split("T")[0];
                              setInputValue(formattedDate);
                            }
                            if (Platform.OS === "android") {
                              setIsDatePickerVisible(false);
                            }
                          }}
                        />
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    <TextScallingFalse className="text-gray-500 text-xl">
                      {label}
                    </TextScallingFalse>
                    <View
                      className={`flex-row border-b border-white ${
                        picType === "headline" ? "" : "h-[50px]"
                      }`}
                    >
                      <TextInput
                        value={inputValue}
                        onChangeText={(text) => {
                          let newText = text;

                          if (picType === "username") {
                            // Remove spaces and force lowercase
                            newText = text.replace(/\s/g, "").toLowerCase();

                            // Enforce max length
                            if (newText.length > 20) {
                              return;
                            }

                            setInputValue(newText);
                            return;
                          }

                          if (picType === "headline" && text.length > 60) {
                            // Prevent exceeding the limit
                            return;
                          }
                          setInputValue(text);
                          if (picType === "address") {
                            setAddressPickup(text); //sync addressPickup with input
                          }
                        }}
                        placeholder={placeholder}
                        placeholderTextColor="gray"
                        className="text-white text-4xl flex-1 pl-0 pb-0 w-80%"
                        style={{ lineHeight: 25 }}
                        maxLength={picType === "headline" ? 60 : undefined} // Apply maxLength conditionally
                        multiline={picType === "headline"}
                        numberOfLines={picType === "headline" ? 2 : 1}
                        autoCapitalize="none"
                      />
                    </View>
                    {/* Character Counter (Only shown if picType is "headline") */}
                    {picType === "headline" && (
                      <TextScallingFalse className="text-gray-500 text-sm mt-1">
                        {inputValue.length} / 60
                      </TextScallingFalse>
                    )}

                    {/* Character Counter (Only shown if picType is "username") */}
                    {picType === "username" && (
                      <TextScallingFalse className="text-gray-500 text-sm mt-1">
                        {inputValue.length} / 20
                      </TextScallingFalse>
                    )}
                  </>
                )}

                {picType === "dateOfBirth" ? null : (
                  <TextScallingFalse className="text-gray-500 text-base mt-4">
                    {description}
                  </TextScallingFalse>
                )}
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
            </SafeAreaView>
          </View>
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
    color: "red",
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
  <View
    className={`flex-row items-center justify-between px-6 h-16 ${
      !isLast ? "border-b border-[#3030309a]" : ""
    }`}
  >
    <TextScallingFalse className="text-white text-4xl font-medium w-1/3">
      {label}
    </TextScallingFalse>
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      className="flex-row items-center justify-between h-full w-2/3"
    >
      <TextScallingFalse
        className={`text-2xl font-light ${
          value ? "text-white" : "text-gray-500"
        }`}
      >
        {isDate ? dateFormatter(value as any, "date") : value || placeholder}
      </TextScallingFalse>
      {icon && <View className="">{icon}</View>}
    </TouchableOpacity>
  </View>
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
  selectedField: string | null;
  toggleField: () => void;
  renderFieldValue: (field: string | null) => string;
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
      <TextScallingFalse className="text-white text-3xl font-light basis-[55%]">
        {unit}
      </TextScallingFalse>
      <View className="flex-row basis-[45%]">
        <View className="relative">
          <TextInput
            value={value}
            onChangeText={handleInputChange}
            keyboardType="numeric"
            className="bg-[#1E1E1E] text-white text-2xl font-normal rounded px-2 py-2 w-32 h-9"
            style={{
              textAlign: "justify",
              textAlignVertical: "center",
            }}
          />
          <TextScallingFalse className="absolute right-4 top-[5px] text-white text-2xl font-semibold pointer-events-none">
            {field === "feetInches"
              ? "ft"
              : field === "centimeters"
              ? "Cm"
              : field === "meters"
              ? "m"
              : field === "kilograms"
              ? "kg"
              : "lbs"}
          </TextScallingFalse>
        </View>
        <CustomButton
          field={
            field as
              | "feetInches"
              | "centimeters"
              | "meters"
              | "kilograms"
              | "pounds"
          }
          selectedField={selectedField || ""}
          toggleSelectedField={toggleField}
          renderFieldValue={() => renderFieldValue(field)}
        />
      </View>
    </View>
  );
};
