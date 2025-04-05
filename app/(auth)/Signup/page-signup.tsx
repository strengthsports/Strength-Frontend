import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import PageThemeView from "~/components/PageThemeView";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Logo from "~/components/logo";
import TextScallingFalse from "~/components/CentralText";
import TextInputSection from "~/components/TextInputSection";
import { useRouter } from "expo-router";
import SignupButton from "~/components/SignupButton";
import { ActivityIndicator } from "react-native-paper";
import { Colors } from "~/constants/Colors";
import { Pressable } from "react-native";
import { FlatList } from "react-native";
import Modal from "react-native-modal";
import { showFeedback } from "~/utils/feedbackToast";
import { signupUser } from "~/reduxStore/slices/user/signupSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";

const options = [
  "Academy",
  "Gym",
  "Fitness Hub",
  "Sports Brand",
  "Institute",
  "Club",
  "Association",
  "Company",
  "Product",
  "Team",
  "Retail",
  "Sporting goods",
  "Entertainment",
  "Event",
  "Tournament",
  "League",
];

const PageSignup = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [pageName, setPageName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  StatusBar.setBackgroundColor("black");

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const validateForm = () => {
    if (!pageName.trim()) {
      showFeedback("Page Name is required");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback("Enter a valid email");
      return false;
    }
    if (!selectedValue) {
      showFeedback("Page Type is required");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const response = await dispatch(
      signupUser({
        email,
        firstName: pageName,
        category: selectedValue,
        userType: "Page",
      })
    ).unwrap();
    // console.log('frontend response',response)
    showFeedback(response.message || "OTP sent to email", "success");

    router.push({
      pathname: "/Signup/signupEnterOtp2",
    });
    router.push({
      pathname: "/Signup/signupEnterOtp2",
    });
  };

  return (
    <PageThemeView>
      {/* Header */}
      <View className="flex-row justify-between items-center my-[30px] px-4">
        <TouchableOpacity
          onPress={() => router.push("/option")}
          activeOpacity={0.5}
        >
          <MaterialIcons name="keyboard-backspace" size={30} color="white" />
        </TouchableOpacity>
        <Logo />
        <TouchableOpacity
          onPress={() => router.push("/login")}
          activeOpacity={0.5}
        >
          <AntDesign name="close" size={25} color="white" />
        </TouchableOpacity>
      </View>

      <View className="px-8">
        <TextScallingFalse className="text-white text-[28px] font-semibold mt-5 mb-8">
          Create a page
        </TextScallingFalse>

        <View className="flex-col gap-y-5">
          <View className="flex-col gap-y-1">
            <TextScallingFalse
              style={{ color: "white", fontSize: 14, fontWeight: "500" }}
            >
              Page Name*
            </TextScallingFalse>
            <TextInput
              style={{
                width: "100%",
                height: 40,
                borderRadius: 5,
                fontSize: 16,
                color: "white",
                borderColor: "white",
                borderWidth: 1,
                paddingHorizontal: 10,
              }}
              value={pageName}
              onChangeText={setPageName}
            />
          </View>

          <View>
            <TextScallingFalse
              style={{ color: "white", fontSize: 14, fontWeight: "500" }}
            >
              Email*
            </TextScallingFalse>
            <TextInputSection
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="flex-col gap-y-1">
            <TextScallingFalse
              style={{ color: "white", fontSize: 14, fontWeight: "500" }}
            >
              Page Type*
            </TextScallingFalse>
            <View style={styles.container}>
              <Pressable onPress={openModal}>
                <View style={styles.inputBox}>
                  <Text style={{ color: selectedValue ? "white" : "#aaa" }}>
                    {selectedValue || "Please Select"}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        <View className="mt-20 gap-y-3">
          <View className="justify-center items-center mb-8">
            <TextScallingFalse style={{ fontSize: 11, color: "white" }}>
              {" "}
              By clicking Agree & Join you agree to the Strength.
            </TextScallingFalse>
            <TouchableOpacity activeOpacity={0.5}>
              <TextScallingFalse style={{ fontSize: 11, color: "#12956B" }}>
                User Agreement, Privacy Policy, Cookies Policy.
              </TextScallingFalse>
            </TouchableOpacity>
          </View>

          <SignupButton onPress={handleSignup} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <TextScallingFalse
                style={{ color: "white", fontSize: 14.5, fontWeight: "500" }}
              >
                Continue
              </TextScallingFalse>
            )}
          </SignupButton>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TextScallingFalse style={{ color: "white", fontSize: 14 }}>
              Already on Strength?
            </TextScallingFalse>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              activeOpacity={0.5}
            >
              <TextScallingFalse style={{ color: Colors.themeColor }}>
                {" "}
                Sign in
              </TextScallingFalse>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal */}
      <Modal
        isVisible={modalVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        className="bg-black w-screen mx-auto px-4"
      >
        <View className="flex-row items-center justify-start mt-[30px]">
          <TouchableOpacity onPress={closeModal} activeOpacity={0.5}>
            <MaterialIcons name="keyboard-backspace" size={30} color="white" />
          </TouchableOpacity>
          <View className="absolute left-1/2 -translate-x-1/2">
            <Logo />
          </View>
        </View>
        <TextScallingFalse className="mt-12 text-[#A5A5A5] text-5xl font-medium">
          Please Select
        </TextScallingFalse>
        <FlatList
          data={options}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              style={styles.option}
              onPress={() => {
                setSelectedValue(item);
                closeModal();
              }}
            >
              <Text style={styles.optionText}>{item}</Text>
            </Pressable>
          )}
        />
      </Modal>
    </PageThemeView>
  );
};

export default PageSignup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    justifyContent: "center",
    // padding: 20,
  },
  inputBox: {
    width: "100%",
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
});
