import {
  StyleSheet,
  View,
  ToastAndroid,
  Platform,
  Vibration,
  TouchableOpacity,
  Modal
} from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { AppDispatch, RootState } from "@/reduxStore";
import { setUsername } from "~/reduxStore/slices/user/onboardingSlice";
import Toast from "react-native-toast-message";
import { usernameSchema } from "~/schemas/profileSchema";
import { vibrationPattern } from "~/constants/vibrationPattern";
import { checkUsernameAvailability } from "~/utils/usernameCheck";
import { ActivityIndicator } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { dateFormatter } from "~/utils/dateFormatter";
import {
  setGender as setGenderRedux, 
  setDateOfBirth as setDateOfBirthRedux
} from "~/reduxStore/slices/user/onboardingSlice";


const signupEnterUsername3 = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [maleSelected, setMaleSelected] = useState(false);
  const [femaleSelected, setFemaleSelected] = useState(false);
  const [gender, setGender] = useState("");

  // Get username from Redux store
  const username =
    useSelector((state: RootState) => state.onboarding.username) || "";

  // Feedback function for error/success messages
  const feedback = (errorMsg: string, type: "error" | "success" = "error") => {
    if (type === "error") {
      Vibration.vibrate(vibrationPattern);
    }

    Platform.OS === "android"
      ? ToastAndroid.show(errorMsg, ToastAndroid.LONG)
      : Toast.show({
        type,
        text1: errorMsg,
        visibilityTime: 3000,
        autoHide: true,
      });
  };

  const handleUsername = (value: string) => {
    dispatch(setUsername(value)); // Update Redux store with the username
  };

  // Use current date as initial if empty, otherwise use the selected date
  const getInitialDateValue = () => {
    if (dateOfBirth) {
      const [day, month, year] = dateOfBirth.split("-");
      return new Date(`${year}-${month}-${day}`);
    }
    return maxDate; // Default to max date (13 years ago) as starting point
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleNext = async () => {
    setIsLoading(true);
    const validation = usernameSchema.safeParse({ username });
    if (!validation.success) {
      const errorMessage =
        validation.error.errors[0]?.message ||
        "Invalid username. Please try again.";

      console.log(
        "Username validation error:",
        validation.error.errors[0]?.message
      );

      feedback(errorMessage);
      setIsLoading(false);
      return;
    }

    // 👇 Await is valid now
    const result = await checkUsernameAvailability(username);

    if (!result.ok || result.data?.exists) {
      feedback("This username is already taken. Try another one.");
      setIsLoading(false);
      return;
    }

    // ✅ Store the additional data as needed (global state or pass via route)
    if (cameFromOption2) {
      if (gender) dispatch(setGenderRedux(gender));
      if (dateOfBirth) dispatch(setDateOfBirthRedux(dateOfBirth));
    }

    // Navigate to the next screen if validation passes
    setIsLoading(false);
    router.replace("/Signup/signupEnterLocation4");
  };


  const handleMalePress = () => {
    setMaleSelected(!maleSelected);
    setFemaleSelected(false);
    setGender("male");
  };

  const handleFemalePress = () => {
    setFemaleSelected(!femaleSelected);
    setMaleSelected(false);
    setGender("female");
  };

  // Calculate max date (13 years ago from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 0);

  const handleDateChange = (event, selectedDate) => {
    setIsDatePickerVisible(Platform.OS === "ios"); // Only hide on Android after selection

    if (selectedDate) {
      // Format the date correctly
      const formatted = dateFormatter(selectedDate, "date");
      setDateOfBirth(formatted);
    }
  };

  const { from } = useLocalSearchParams();
  const cameFromOption2 = from === "option2";

  // Separate rendering for iOS date picker (modal style)
  const renderIOSDatePicker = () => {
    if (!isDatePickerVisible) return null;

    return (
      <Modal
        visible={isDatePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsDatePickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDatePickerVisible(false)}
        >
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity onPress={() => setIsDatePickerVisible(false)}>
                <TextScallingFalse style={styles.datePickerHeaderButton}>Cancel</TextScallingFalse>
              </TouchableOpacity>

              <TextScallingFalse style={styles.datePickerHeaderTitle}>Date of Birth</TextScallingFalse>

              <TouchableOpacity
                onPress={() => {
                  setIsDatePickerVisible(false);
                }}
              >
                <TextScallingFalse
                  style={[styles.datePickerHeaderButton, { color: "#12956B" }]}
                >
                  Done
                </TextScallingFalse>
              </TouchableOpacity>
            </View>

            <DateTimePicker
              value={getInitialDateValue()}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              themeVariant="dark"
              maximumDate={maxDate}
              style={styles.iosDatePicker}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <PageThemeView>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: cameFromOption2 ? 40 : 80 }}>
          <View>
            <Logo />
          </View>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={{ gap: 30 }}>
            <View style={{ marginTop: 55 }}>
              <TextScallingFalse
                style={{ color: "white", fontSize: 23, fontWeight: "500" }}
              >
                What should we call you?
              </TextScallingFalse>
              <View>
                <TextScallingFalse
                  style={{ color: "white", fontSize: 12, fontWeight: "400" }}
                >
                  Your @username is unique. You can always change it later.
                </TextScallingFalse>
              </View>
            </View>
            <View>
              <TextScallingFalse
                style={{ color: "white", fontSize: 14, fontWeight: "400" }}
              >
                Username
              </TextScallingFalse>
              <TextInputSection
                placeholder="Enter your username"
                value={username}
                onChangeText={(text) => {
                  const normalized = text.toLowerCase().replace(/\s/g, ""); // remove spaces and make lowercase
                  if (normalized.length <= 20) {
                    handleUsername(normalized);
                  }
                }}
                autoCapitalize="none"
              />

              <TextScallingFalse className="text-gray-500 text-sm mt-1 p-1">
                {username.length} / 20
              </TextScallingFalse>
            </View>
          </View>


          {/* date of birth */}
          {cameFromOption2 && (
            <View style={styles.formContainer}>
              <View>
                <TextScallingFalse style={styles.inputLabel}>
                  Date of birth
                </TextScallingFalse>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => setIsDatePickerVisible(true)}
                  style={styles.datePickerButton}
                >
                  <View style={styles.datePickerButtonContent}>
                    <AntDesign name="calendar" size={25} color="white" />
                    <TextScallingFalse style={styles.dateText}>
                      {dateOfBirth || "Select date"}
                    </TextScallingFalse>
                  </View>

                  {dateOfBirth && (
                    <TouchableOpacity
                      onPress={() => setDateOfBirth("")}
                      activeOpacity={0.5}
                      style={styles.clearDateButton}
                    >
                      <AntDesign name="close" size={20} color="white" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>

              {/* gender */}
              <View style={styles.genderContainer}>
                <View style={styles.genderLabelContainer}>
                  <TextScallingFalse style={styles.inputLabel}>
                    Gender
                  </TextScallingFalse>
                </View>
                <View style={styles.genderButtonsContainer}>
                  <TouchableOpacity
                    onPress={handleFemalePress}
                    activeOpacity={0.5}
                    style={[
                      styles.genderButton,
                      femaleSelected && styles.genderButtonSelected,
                    ]}
                  >
                    <TextScallingFalse style={styles.genderButtonText}>
                      Female
                    </TextScallingFalse>
                    <View
                      style={[
                        styles.genderRadio,
                        femaleSelected && styles.genderRadioSelected,
                      ]}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleMalePress}
                    activeOpacity={0.5}
                    style={[
                      styles.genderButton,
                      maleSelected && styles.genderButtonSelected,
                    ]}
                  >
                    <TextScallingFalse style={styles.genderButtonText}>
                      Male
                    </TextScallingFalse>
                    <View
                      style={[
                        styles.genderRadio,
                        maleSelected && styles.genderRadioSelected,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {Platform.OS === "ios" && renderIOSDatePicker()}

              {/* Date picker for Android (inline) */}
              {Platform.OS === "android" && isDatePickerVisible && (
                <DateTimePicker
                  value={getInitialDateValue()}
                  mode="date"
                  display="calendar"
                  onChange={handleDateChange}
                  maximumDate={maxDate}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}
            </View>
          )}

          <View style={{ marginTop: 55 }}>
            {isLoading ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <SignupButton disabled={false} onPress={handleNext}>
                <TextScallingFalse
                  style={{ color: "white", fontSize: 15, fontWeight: "500" }}
                >
                  Next
                </TextScallingFalse>
              </SignupButton>
            )}
          </View>
        </View>
      </ScrollView>
    </PageThemeView>
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  datePickerButton: {
    height: 44,
    borderWidth: 1,
    borderColor: "white",
    flexDirection: "row",
    borderRadius: 5.5,
    marginTop: 4,
    paddingLeft: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerButtonContent: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  dateText: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
  clearDateButton: {
    paddingRight: 10,
    paddingLeft: 10,
    height: "100%",
    justifyContent: "center",
  },
  genderContainer: {
    gap: 4,
  },
  genderLabelContainer: {
    flexDirection: "row",
  },
  genderButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    height: 42,
    borderRadius: 5,
    borderColor: "white",
    borderWidth: 1.5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
  },
  genderButtonSelected: {
    borderColor: "#12956B",
  },
  genderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
  },
  genderRadio: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "white",
    backgroundColor: "black",
  },
  genderRadioSelected: {
    backgroundColor: "#12956B",
    borderColor: "#12956B",
  },
  formContainer: {
    gap: 18,
    width: "100%",
    paddingHorizontal: 30,
    paddingTop: 10
  },

  //date of birth
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
  },
  // iOS DatePicker Modal Styles
  datePickerContainer: {
    backgroundColor: "#1D1D1D",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  datePickerHeaderButton: {
    color: "white",
    fontSize: 16,
  },
  datePickerHeaderTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  iosDatePicker: {
    width: "100%",
    height: 220,
    backgroundColor: "#1D1D1D",
  },
})

export default signupEnterUsername3;
