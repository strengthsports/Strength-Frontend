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
import { useRouter, useLocalSearchParams } from "expo-router";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import CustomButton from "~/components/CustomButtons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { editUserProfile } from "~/reduxStore/slices/user/profileSlice";
import { UserData } from "@/types/user";
import { dateFormatter } from "~/utils/dateFormatter";
import { getToken } from "~/utils/secureStore";
import Toast from "react-native-toast-message";

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isAndroid = Platform.OS === "android";
  const params = useLocalSearchParams();
  const { value } = useLocalSearchParams();
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [picType, setPicType] = useState<keyof typeof formData | "">("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const closeModal = () => setModalVisible(false);
  const openModal = (type: React.SetStateAction<string>) => {
    setPicType(type);
    setModalVisible(true);
  };

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
          label: "address",
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
    height: params.height.toString(),
    weight: params.weight.toString(),
  });

  useEffect(() => {
    if (picType && value) {
      setFormData((prev) => ({
        ...prev,
        [picType]: value,
      }));
    }
    console.log("formData-", formData);
  }, [picType, value]);

  const handleDone = async (field, value) => {
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
    } else if (field === "weight") {
      const weightValue = renderFieldValue(selectedField); // Get value in selected unit
      setFormData((prev) => ({
        ...prev,
        [field]: `${weightValue} ${
          selectedField === "kilograms" ? "kg" : "lbs"
        }`,
      }));
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
        } else {
          Keyboard.dismiss();
          isAndroid
            ? ToastAndroid.show(
                data.message || "Username already exists!",
                ToastAndroid.SHORT
              )
            : Toast.show({
                type: "error",
                text1: data.message || "Username already exists!",
                visibilityTime: 1500,
                autoHide: true,
              });
          return;
        }
      } catch (error) {
        console.error("Error checking username:", error);
        alert("Something went wrong. Please try again.");
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    closeModal();
  };

  useEffect(() => {
    if (picType) {
      setInputValue(formData[picType] || "");
    }
  }, [picType]);

  const handleDateChange = (selectedDate: string) => {
    setDateOfBirth(selectedDate);
    setIsDatePickerVisible(false);
  };

  const [selectedField, setSelectedField] = useState<string | null>(
    picType === "height" ? "feetInches" : "kilograms" // this is the default unit for each section
  );
  const [heightInFeet, setHeightInFeet] = useState("");
  const [heightInCentimeters, setHeightInCentimeters] = useState("");
  const [heightInMeters, setHeightInMeters] = useState("");
  const [weightInKg, setWeightInKg] = useState("");
  const [weightInLbs, setWeightInLbs] = useState("");

  const toggleSelectedField = (field: string) => {
    setSelectedField(field);
  };

  const renderFieldValue = (field: string) => {
    switch (field) {
      case "feetInches":
        return heightInFeet;
      case "centimeters":
        return heightInCentimeters;
      case "meters":
        return heightInMeters;
      case "kilograms":
        return weightInKg;
      case "pounds":
        return weightInLbs;

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

  const handleFormSubmit = () => {
    dispatch(editUserProfile(formData));
    router.push("/profile");
  };

  return (
    <PageThemeView>
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View
          style={{
            width: "100%",
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <TextScallingFalse
              style={{ color: "grey", fontSize: 19, fontWeight: "400" }}
            >
              Back
            </TextScallingFalse>
          </TouchableOpacity>
          <TextScallingFalse
            style={{ color: "white", fontSize: 18, fontWeight: "300" }}
          >
            Edit profile
          </TextScallingFalse>
          <TouchableOpacity onPress={handleFormSubmit}>
            <TextScallingFalse
              style={{ color: "#12956B", fontSize: 16, fontWeight: "500" }}
            >
              Done
            </TextScallingFalse>
          </TouchableOpacity>
        </View>

        {/* <View>
      <TouchableOpacity activeOpacity={0.9} style={{width: '100%', height: 135, justifyContent:'center', alignItems:'center'}}>
      <Image source={{}} style={{ backgroundColor:'white', width:'100%', height: '100%',}}/>
      <MaterialCommunityIcons style={{position:'absolute', zIndex: 100, left: 190}} name="camera-plus-outline" size={30} color="white" />
      <View style={styles.overlay} />
      </TouchableOpacity>      
      <View style={{alignItems:'flex-end', borderWidth: 0.3, borderColor:'white', position:'relative', top:'-25%'}}>
        <View style={{paddingRight: 25}}>
        <TouchableOpacity activeOpacity={0.9} style={{ width: '35.06%', aspectRatio: 1, borderRadius: 100,  justifyContent:'center', alignItems:'center'}}>
          <Image source={{}} style={{width: '100%', height: '100%', borderRadius: 100, backgroundColor:'grey',}}/>
          <MaterialCommunityIcons style={{position:'absolute', zIndex: 100,}} name="camera-plus-outline" size={30} color="white" />
          <View style={[styles.overlay, {borderRadius: 100}]}/>
        </TouchableOpacity>
        </View>
        </View>
        </View> */}

        {/* Profile and cover image */}
        <View
          style={{
            position: "relative",
            width: "100%",
            height: 136,
            marginBottom: 85,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/(app)/(main)/modal?picType=cover")}
            activeOpacity={0.9}
            style={{ backgroundColor: "black", height: "100%", width: "100%" }}
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1720048170996-40507a45c720?q=80&w=1913&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={{ width: "100%", height: "100%", opacity: 0.5 }}
              resizeMode="cover"
            />
            <MaterialCommunityIcons
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: [{ translateY: -15 }, { translateX: -15 }],
              }}
              name="camera-plus-outline"
              size={30}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(app)/(main)/modal?picType=profile")}
            activeOpacity={0.9}
            style={{
              position: "absolute",
              width: 132,
              height: 132,
              backgroundColor: "black",
              borderRadius: 100,
              right: 20,
              bottom: -72,
              borderColor: "black",
              borderWidth: 3,
            }}
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1720048170996-40507a45c720?q=80&w=1913&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={{ width: "100%", height: "100%", opacity: 0.5 }}
              borderRadius={100}
              resizeMode="cover"
            />
            <MaterialCommunityIcons
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: [{ translateY: -15 }, { translateX: -15 }],
              }}
              name="camera-plus-outline"
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Form Part */}
        {/* first name */}
        <View
          style={[
            styles.ContainerViews,
            { borderTopWidth: 0.5, borderTopColor: "#303030" },
          ]}
        >
          <TextScallingFalse style={styles.QuestionText}>
            First Name*
          </TextScallingFalse>
          <TouchableOpacity activeOpacity={0.5} style={styles.Button}>
            <TextInput
              placeholder="enter your first name"
              placeholderTextColor={"grey"}
              style={[styles.AnswerText, styles.InputSections]}
              onChangeText={(text) =>
                setFormData({ ...formData, firstName: text })
              }
              value={formData.firstName}
            />
          </TouchableOpacity>
        </View>
        {/* last name */}
        <View style={styles.ContainerViews}>
          <TextScallingFalse style={styles.QuestionText}>
            Last Name*
          </TextScallingFalse>
          <TouchableOpacity activeOpacity={0.5} style={styles.Button}>
            <TextInput
              placeholder="enter your last name"
              placeholderTextColor={"grey"}
              style={[styles.AnswerText, styles.InputSections]}
              onChangeText={(text) =>
                setFormData({ ...formData, lastName: text })
              }
              value={formData.lastName}
            />
          </TouchableOpacity>
        </View>
        {/* username */}
        <View style={styles.ContainerViews}>
          <TextScallingFalse style={styles.QuestionText}>
            Username*
          </TextScallingFalse>
          <TouchableOpacity
            onPress={() => openModal("username")}
            activeOpacity={0.5}
            style={styles.Button}
          >
            <TextScallingFalse
              style={[
                styles.AnswerText,
                {
                  color: formData.username ? "white" : "grey",
                },
              ]}
            >
              {formData.username || "not given"}
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
        {/* headline */}
        <View style={styles.DescriptiveView}>
          <TextScallingFalse style={styles.QuestionText}>
            Headline
          </TextScallingFalse>
          <TouchableOpacity
            onPress={() => openModal("headline")}
            activeOpacity={0.5}
            style={styles.Button}
          >
            <TextScallingFalse
              style={[
                styles.AnswerText,
                {
                  color: formData.headline ? "white" : "grey",
                },
              ]}
            >
              {formData.headline || "not given"}
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
        {/* date of birth */}
        <View style={styles.ContainerViews}>
          <TextScallingFalse style={styles.QuestionText}>
            Birth Date*
          </TextScallingFalse>
          <TouchableOpacity
            onPress={() => openModal("dateOfBirth")}
            activeOpacity={0.5}
            style={styles.Button}
          >
            <TextScallingFalse
              style={[
                styles.AnswerText,
                styles.shortedWidth,
                {
                  color: formData.dateOfBirth?.toString() ? "white" : "grey",
                },
              ]}
            >
              {formData.dateOfBirth?.toString() || "not given"}
            </TextScallingFalse>
            <AntDesign
              name="calendar"
              style={styles.PaddingLeft}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        </View>
        {/* location */}
        <View style={styles.DescriptiveView}>
          <TextScallingFalse style={styles.QuestionText}>
            Location*
          </TextScallingFalse>
          <TouchableOpacity
            onPress={() => openModal("address")}
            activeOpacity={0.5}
            style={styles.Button}
          >
            <TextScallingFalse
              style={[
                styles.AnswerText,
                styles.shortedWidth,
                { color: "grey" },
              ]}
            >
              {formData.address.city +
                "," +
                formData.address.state +
                "," +
                formData.address.country || "not given"}
            </TextScallingFalse>
            <MaterialIcons
              name="location-pin"
              style={styles.PaddingLeft}
              size={22.5}
              color="grey"
            />
          </TouchableOpacity>
        </View>
        {/* height */}
        <View style={styles.ContainerViews}>
          <TextScallingFalse style={styles.QuestionText}>
            Height
          </TextScallingFalse>
          <TouchableOpacity
            onPress={() => openModal("height")}
            activeOpacity={0.5}
            style={styles.Button}
          >
            <TextScallingFalse
              style={[
                styles.AnswerText,
                styles.shortedWidth,
                { color: formData.height ? "white" : "grey" },
              ]}
            >
              {formData.height || "not given"}
            </TextScallingFalse>
            <AntDesign
              name="down"
              style={styles.PaddingLeft}
              size={20}
              color="grey"
            />
          </TouchableOpacity>
        </View>
        {/* weight */}
        <View style={styles.ContainerViews}>
          <TextScallingFalse style={styles.QuestionText}>
            Weight
          </TextScallingFalse>
          <TouchableOpacity
            onPress={() => openModal("weight")}
            activeOpacity={0.5}
            style={styles.Button}
          >
            <TextScallingFalse
              style={[
                styles.AnswerText,
                styles.shortedWidth,
                { color: formData.weight ? "white" : "grey" },
              ]}
            >
              {formData.weight || "not given"}
            </TextScallingFalse>
            <AntDesign
              name="down"
              style={styles.PaddingLeft}
              size={20}
              color="grey"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.ContainerViews}>
          <TextScallingFalse style={styles.QuestionText}>
            Team
          </TextScallingFalse>
          <View
            style={[
              styles.DescriptiveView,
              { paddingHorizontal: 0, alignItems: "center", gap: "4%" },
            ]}
          >
            <TextScallingFalse
              style={{
                fontWeight: "300",
                color: "#12956B",
                fontSize: responsiveFontSize(1.41),
              }}
            >
              ●
            </TextScallingFalse>
            <TextScallingFalse style={[styles.AnswerText, { width: "65.5%" }]}>
              Pro Trackers
            </TextScallingFalse>
            <AntDesign name="right" size={20} color="grey" />
          </View>
        </View>
        <View style={styles.ContainerViews}>
          <TextScallingFalse style={styles.QuestionText}>
            Academy
          </TextScallingFalse>
          <TouchableOpacity activeOpacity={0.5} style={styles.Button}>
            <TextScallingFalse
              style={[
                styles.AnswerText,
                styles.shortedWidth,
                { color: "grey" },
              ]}
            >
              not joined yet
            </TextScallingFalse>
            <AntDesign
              name="down"
              style={styles.PaddingLeft}
              size={20}
              color="grey"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.ContainerViews}>
          <TextScallingFalse style={styles.QuestionText}>
            Club
          </TextScallingFalse>
          <TouchableOpacity activeOpacity={0.5} style={styles.Button}>
            <TextScallingFalse
              style={[
                styles.AnswerText,
                styles.shortedWidth,
                { color: "grey" },
              ]}
            >
              not joined yet
            </TextScallingFalse>
            <AntDesign
              name="down"
              style={styles.PaddingLeft}
              size={20}
              color="grey"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.ContainerViews}>
          <TextScallingFalse style={styles.QuestionText}>Gym</TextScallingFalse>
          <TouchableOpacity activeOpacity={0.5} style={styles.Button}>
            <TextScallingFalse
              style={[
                styles.AnswerText,
                styles.shortedWidth,
                { color: "grey" },
              ]}
            >
              not joined yet
            </TextScallingFalse>
            <AntDesign
              name="down"
              style={styles.PaddingLeft}
              size={20}
              color="grey"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {isDatePickerVisible && (
        <View>
          <DateTimePicker
            value={inputValue ? new Date(inputValue) : new Date()} // Set initial value
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date
                setInputValue(formattedDate); // Update state
              }
              setIsDatePickerVisible(false); // Close picker
            }}
            themeVariant="dark"
          />
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <PageThemeView>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              padding: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity activeOpacity={0.5} onPress={closeModal}>
                <AntDesign name="arrowleft" size={28} color="white" />
              </TouchableOpacity>
              <TextScallingFalse
                style={{
                  color: "white",
                  fontSize: 19,
                  fontWeight: "500",
                  paddingLeft: 20,
                }}
              >
                {label}
              </TextScallingFalse>
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => handleDone(picType, inputValue)}
            >
              <MaterialIcons name="done" size={28} color="#12956B" />
            </TouchableOpacity>
          </View>

          {picType === "height" || picType === "weight" ? (
            <View style={styles.ContainerView2}>
              <View style={styles.QuestionBoxView}>
                <TextScallingFalse style={styles.QuestionText2}>
                  {unit1}
                </TextScallingFalse>
                {picType === "height" ? (
                  <View style={styles.FlexContainer}>
                    <TextInput
                      value={heightInFeet}
                      onChangeText={handleFeetChange}
                      keyboardType="numeric"
                      style={styles.NumberInput}
                    ></TextInput>
                    <CustomButton
                      field="feetInches"
                      selectedField={selectedField}
                      toggleSelectedField={toggleSelectedField}
                      renderFieldValue={() => renderFieldValue("feetInches")}
                    />
                  </View>
                ) : (
                  <View style={styles.FlexContainer}>
                    <TextInput
                      value={weightInKg}
                      onChangeText={handleKgChange}
                      keyboardType="numeric"
                      style={styles.NumberInput}
                    ></TextInput>
                    <CustomButton
                      field="kilograms"
                      selectedField={selectedField}
                      toggleSelectedField={toggleSelectedField}
                      renderFieldValue={() => renderFieldValue("kilograms")}
                    />
                  </View>
                )}
              </View>
              {picType === "weight" ? (
                ""
              ) : (
                <View style={styles.QuestionBoxView}>
                  <TextScallingFalse style={styles.QuestionText2}>
                    {unit2}
                  </TextScallingFalse>
                  <View style={styles.FlexContainer}>
                    <TextInput
                      value={heightInCentimeters}
                      onChangeText={handleCentimetersChange}
                      keyboardType="numeric"
                      style={styles.NumberInput}
                    ></TextInput>
                    <CustomButton
                      field="centimeters"
                      selectedField={selectedField}
                      toggleSelectedField={toggleSelectedField}
                      renderFieldValue={() => renderFieldValue("centimeters")}
                    />
                  </View>
                </View>
              )}
              <View style={[styles.QuestionBoxView, { marginBottom: 35 }]}>
                <TextScallingFalse style={styles.QuestionText2}>
                  {unit3}
                </TextScallingFalse>
                {picType === "height" ? (
                  <View style={styles.FlexContainer}>
                    <TextInput
                      value={heightInMeters}
                      onChangeText={handleMetersChange}
                      keyboardType="numeric"
                      style={styles.NumberInput}
                    ></TextInput>
                    <CustomButton
                      field="meters"
                      selectedField={selectedField}
                      toggleSelectedField={toggleSelectedField}
                      renderFieldValue={() => renderFieldValue("meters")}
                    />
                  </View>
                ) : (
                  <View style={styles.FlexContainer}>
                    <TextInput
                      value={weightInLbs}
                      onChangeText={handleLbsChange}
                      keyboardType="numeric"
                      style={styles.NumberInput}
                    ></TextInput>
                    <CustomButton
                      field="pounds"
                      selectedField={selectedField}
                      toggleSelectedField={toggleSelectedField}
                      renderFieldValue={() => renderFieldValue("pounds")}
                    />
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View
              style={{
                width: "100%",
                paddingVertical: 20,
                paddingHorizontal: 25,
                gap: 10,
              }}
            >
              <TextScallingFalse
                style={{ color: "grey", fontSize: 13, fontWeight: "400" }}
              >
                {label}
              </TextScallingFalse>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder={placeholder}
                  placeholderTextColor={"grey"}
                  style={{
                    color: "white",
                    width: picType === "dateOfBirth" ? "90%" : "100%",
                    fontSize: 17,
                    fontWeight: "400",
                    borderBottomWidth: 1,
                    borderBottomColor: "white",
                    paddingBottom: 3,
                    paddingStart: 0,
                  }}
                />
                {picType === "dateOfBirth" ? (
                  <TouchableOpacity
                    onPress={() => setIsDatePickerVisible(!isDatePickerVisible)}
                    activeOpacity={0.5}
                    style={{
                      justifyContent: "flex-end",
                      paddingVertical: 5,
                      width: "10%",
                      marginTop: "0.5%",
                      borderBottomWidth: 1,
                      borderBottomColor: "white",
                    }}
                  >
                    <AntDesign
                      name="calendar"
                      size={22}
                      style={{}}
                      color="white"
                    />
                  </TouchableOpacity>
                ) : (
                  ""
                )}
              </View>
            </View>
          )}
          <View style={{ paddingHorizontal: 22 }}>
            <TextScallingFalse
              style={{
                color: "grey",
                fontSize: 12.5,
                fontWeight: "400",
                textAlign: picType === "address" ? "center" : "left",
              }}
            >
              {description}
            </TextScallingFalse>
            {picType === "address" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  flexDirection: "row",
                  width: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                  gap: "5%",
                  marginTop: "5%",
                  borderWidth: 0.3,
                  borderColor: "white",
                  borderRadius: 30,
                  alignSelf: "center",
                }}
              >
                <TextScallingFalse
                  style={{ color: "grey", fontSize: 11, fontWeight: "400" }}
                >
                  Use my current address
                </TextScallingFalse>
                <FontAwesome5 name="map-marker-alt" size={13} color="grey" />
              </TouchableOpacity>
            ) : (
              ""
            )}
          </View>
        </PageThemeView>
      </Modal>
    </PageThemeView>
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
});
