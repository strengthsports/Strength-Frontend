import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
  Vibration,
  Platform,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Logo from "@/components/logo";
import { useRouter } from "expo-router";
import TextInputSection from "@/components/TextInputSection";
import DateTimePicker from "@react-native-community/datetimepicker";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import PageThemeView from "@/components/PageThemeView";
import { z } from "zod";
import { signupSchema } from "@/schemas/signupSchema";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "~/reduxStore/slices/user/signupSlice";
import { AppDispatch, RootState } from "@/reduxStore";
import Toast from "react-native-toast-message";
import { vibrationPattern } from "~/constants/vibrationPattern";
import { dateFormatter } from "~/utils/dateFormatter";
import { ScrollView } from "react-native-gesture-handler";
import AgreementsModalView from "~/app/(app)/(settings)/settings/AgreementsModalView";

const SignupEmail1 = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.signup);
  const isAndroid = Platform.OS === "android";

  const [openModal14, setOpenModal14] = React.useState(false);
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [maleSelected, setMaleSelected] = useState(false);
  const [femaleSelected, setFemaleSelected] = useState(false);
  const [gender, setGender] = useState("");

  // Calculate max date (13 years ago from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 4);

  // Use current date as initial if empty, otherwise use the selected date
  const getInitialDateValue = () => {
    if (dateOfBirth) {
      const [day, month, year] = dateOfBirth.split("-");
      return new Date(`${year}-${month}-${day}`);
    }
    return maxDate; // Default to max date (13 years ago) as starting point
  };

  const handleDateChange = (event, selectedDate) => {
    setIsDatePickerVisible(Platform.OS === "ios"); // Only hide on Android after selection

    if (selectedDate) {
      // Format the date correctly
      const formatted = dateFormatter(selectedDate, "date");
      setDateOfBirth(formatted);
    }
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

  function greet() {
    console.log('Hello!');
  }

  // form order
  const formData = {
    email,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    userType: "User",
  };

  const feedback = (message: string, type: "error" | "success" = "error") => {
    if (type === "error") {
      Vibration.vibrate(vibrationPattern);
      isAndroid
        ? ToastAndroid.show(message, ToastAndroid.SHORT)
        : Toast.show({
            type,
            text1: message,
            visibilityTime: 3000,
            autoHide: true,
          });
    } else
      Toast.show({
        type,
        text1: message,
        visibilityTime: 3000,
        autoHide: true,
      });
  };

  const validateSignupForm = async () => {
    try {
      const SignupPayload = signupSchema.parse(formData);

      // ✅ NOW convert to ISO only for sending to backend
      const payloadForBackend = {
        ...SignupPayload,
        dateOfBirth: SignupPayload.dateOfBirth
          ? (() => {
              const [day, month, year] = SignupPayload.dateOfBirth.split("-");
              return `${year}-${month}-${day}`;
            })()
          : undefined,
      };

      const response = await dispatch(signupUser(payloadForBackend)).unwrap();
      feedback(response.message || "OTP sent to email", "success");

      router.push({
        pathname: "/Signup/signupEnterOtp2",
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const validationError = err.errors[0]?.message || "Invalid input.";
        feedback(validationError, "error");
      } else {
        console.log("Backend response: ", err);
        feedback(err || "An error occurred. Please try again.");
      }
    }
  };

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
                <Text style={styles.datePickerHeaderButton}>Cancel</Text>
              </TouchableOpacity>

              <Text style={styles.datePickerHeaderTitle}>Date of Birth</Text>

              <TouchableOpacity
                onPress={() => {
                  setIsDatePickerVisible(false);
                }}
              >
                <Text
                  style={[styles.datePickerHeaderButton, { color: "#12956B" }]}
                >
                  Done
                </Text>
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.5}>
            <MaterialIcons name="keyboard-backspace" size={30} color="white" />
          </TouchableOpacity>
          <Logo />
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.5}>
            <AntDesign name="close" size={25} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <TextScallingFalse style={styles.title}>
              Create your account
            </TextScallingFalse>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.nameInputsRow}>
              <View style={styles.nameInputContainer}>
                <TextScallingFalse style={styles.inputLabel}>
                  First Name
                </TextScallingFalse>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                   cursorColor={'#12956B'}
                />
              </View>
              <View style={styles.nameInputContainer}>
                <TextScallingFalse style={styles.inputLabel}>
                  Last Name
                </TextScallingFalse>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                   cursorColor={'#12956B'}
                />
              </View>
            </View>

            <View>
              <TextScallingFalse style={styles.inputLabel}>
                Email
              </TextScallingFalse>
              <TextInputSection
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

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
                  <Text style={styles.dateText}>
                    {dateOfBirth || "Select date"}
                  </Text>
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
          </View>

          <View style={styles.footerContainer}>
            <View style={styles.termsContainer}>
              <TextScallingFalse style={styles.termsText}>
                {" "}
                By clicking Agree & Join you agree to the Strength.
              </TextScallingFalse>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setOpenModal14(true)}
              >
                <TextScallingFalse style={styles.termsLink}>
                  User Agreement, Privacy Policy, Cookies Policy.
                </TextScallingFalse>
              </TouchableOpacity>
            </View>

            <View style={styles.signupButtonContainer}>
              {loading ? (
                <ActivityIndicator size={"small"} />
              ) : (
                <SignupButton onPress={() => validateSignupForm()}>
                  <TextScallingFalse style={styles.signupButtonText}>
                    Agree & join
                  </TextScallingFalse>
                </SignupButton>
              )}
            </View>
            <View style={styles.loginContainer}>
              <TextScallingFalse style={styles.loginText}>
                Already on Strength?
              </TextScallingFalse>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/login")}
                activeOpacity={0.5}
              >
                <TextScallingFalse style={styles.loginLink}>
                  {" "}
                  Sign in
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Date picker for iOS (modal) */}
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

        {openModal14 && (
          <Modal
            visible={openModal14}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setOpenModal14(false)}
          >
            <AgreementsModalView onClose={() => setOpenModal14(false)} />
          </Modal>
        )}
      </ScrollView>
    </PageThemeView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  container: {
    alignItems: "center",
    flex: 1,
  },
  titleContainer: {
    padding: 40,
    width: "100%",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "500",
  },
  formContainer: {
    gap: 18,
    width: "100%",
    paddingHorizontal: 30,
  },
  nameInputsRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  nameInputContainer: {
    flex: 1,
    gap: 4,
  },
  inputLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    width: "100%",
    height: 40,
    borderRadius: 5,
    fontSize: 16,
    color: "white",
    borderColor: "white",
    borderWidth: 1,
    paddingHorizontal: 10,
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
  footerContainer: {
    gap: 15,
    marginTop: 30,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  termsContainer: {
    width: 330,
    justifyContent: "center",
    alignItems: "center",
  },
  termsText: {
    fontSize: 11,
    color: "white",
  },
  termsLink: {
    fontSize: 11,
    color: "#12956B",
  },
  signupButtonContainer: {
    marginTop: 25,
    width: "100%",
    alignItems: "center",
  },
  signupButtonText: {
    color: "white",
    fontSize: 14.5,
    fontWeight: "500",
  },
  loginContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loginText: {
    color: "white",
    fontSize: 14,
  },
  loginLink: {
    color: "#12956B",
  },
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
  datePickerHeaderTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  datePickerHeaderButton: {
    color: "white",
    fontSize: 16,
  },
  iosDatePicker: {
    width: "100%",
    height: 220,
    backgroundColor: "#1D1D1D",
  },
  // Agreements Modal Styles
  agreementsModalContainer: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  agreementsModal: {
    width: "100%",
    backgroundColor: "#1D1D1D",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  agreementsModalHeader: {
    marginTop: 25,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  agreementsModalTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "300",
  },
  agreementsModalDivider: {
    height: 0.2,
    width: 180,
    backgroundColor: "grey",
    marginTop: 6.5,
  },
  agreementsModalContent: {
    marginTop: 15,
    paddingHorizontal: 25,
  },
  agreementItem: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
    gap: 20,
  },
  agreementDot: {
    backgroundColor: "#12956B",
    width: 10,
    height: 10,
    borderRadius: 10,
    marginTop: 1,
  },
  agreementText: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
});

export default SignupEmail1;
