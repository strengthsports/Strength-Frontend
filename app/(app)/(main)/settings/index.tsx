import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Linking,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import PageThemeView from "~/components/PageThemeView";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Octicons,
  Entypo,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import TextScallingFalse from "~/components/CentralText";
import TextInputSection from "~/components/TextInputSection";
import SignupButton from "~/components/SignupButton";
import logo from "@/assets/images/logo2.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { logoutUser } from "~/reduxStore/slices/user/authSlice";
import { ToastAndroid } from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const router = useRouter();
  const { accountSettingsModal } = useLocalSearchParams();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [isModalVisible4, setModalVisible4] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prevState) => !prevState);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: any) => state?.auth);

  // Check if modal close request has came
  useEffect(() => {
    if (accountSettingsModal === "true") {
      setModalVisible((prev) => !prev);
    }
  }, []);

  const handleLogout = async () => {
    const isAndroid = Platform.OS == "android";
    try {
      const response = await dispatch(logoutUser()).unwrap();
      isAndroid
        ? ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT)
        : Toast.show({
            type: "error",
            text1: "Logged out successfully",
            visibilityTime: 1500,
            autoHide: true,
          });
      router.push("/(auth)/login");
    } catch (err) {
      console.error("Logout failed:", err);
      isAndroid
        ? ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT)
        : Toast.show({
            type: "error",
            text1: "Logged out successfully",
            visibilityTime: 1500,
            autoHide: true,
          });
    }
  };

  const closeModal = () => setModalVisible(false);
  const openModal = (type: React.SetStateAction<string>) => {
    setModalVisible(true);
  };

  const closeModal2 = () => setModalVisible2(false);
  const openModal2 = (type: React.SetStateAction<string>) => {
    setModalVisible2(true);
  };

  const closeModal3 = () => setModalVisible3(false);
  const openModal3 = (type: React.SetStateAction<string>) => {
    setModalVisible3(true);
  };

  const closeModal4 = () => setModalVisible4(false);
  const openModal4 = (type: React.SetStateAction<string>) => {
    setModalVisible4(true);
  };

  const handleChangePassword = async () => {
    //logic for change password
  };

  return (
    <SafeAreaView>
      <View style={styles.TopBarView}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => router.push("/profile")}
        >
          <AntDesign name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <TextScallingFalse
          style={{ color: "white", fontSize: 20, fontWeight: "300" }}
        >
          Settings
        </TextScallingFalse>
        <View style={{ width: 29, height: 8 }} />
      </View>
      <View
        style={{
          width: "100%",
          paddingVertical: 40,
          paddingHorizontal: 20,
          flexDirection: "row",
          gap: 15,
        }}
      >
        <Image
          source={{ uri: user?.profilePic }}
          style={{
            backgroundColor: "orange",
            width: 84,
            height: 84,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: "white",
          }}
        />
        <View style={{ paddingVertical: 17 }}>
          <TextScallingFalse
            style={{ color: "white", fontSize: 18, fontWeight: "600" }}
          >
            {user?.firstName} {user?.lastName}
          </TextScallingFalse>
          <TextScallingFalse
            style={{ color: "white", fontSize: 10, fontWeight: "300" }}
          >
            {user?.headline}
          </TextScallingFalse>
        </View>
      </View>
      <View
        style={{
          height: 0.4,
          backgroundColor: "#505050",
          width: "85%",
          alignSelf: "center",
        }}
      />
      <View
        style={{
          width: "100%",
          paddingHorizontal: 30,
          paddingVertical: 40,
          gap: 20,
        }}
      >
        <View style={styles.OptionButtonView}>
          <MaterialCommunityIcons
            name="account-cog-outline"
            size={31}
            color="white"
          />
          <TouchableOpacity onPress={openModal} activeOpacity={0.7}>
            <TextScallingFalse style={styles.OptionText}>
              Account Settings
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
        <View style={styles.OptionButtonView}>
          <MaterialIcons name="help-outline" size={31} color="white" />
          <TouchableOpacity activeOpacity={0.7}>
            <TextScallingFalse style={styles.OptionText}>
              Customer Support
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
        {/* Blocked users */}
        <View style={styles.OptionButtonView}>
          <MaterialIcons name="block" size={31} color="white" />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(app)/(main)/blocked-users")}
          >
            <TextScallingFalse style={styles.OptionText}>
              Blocked Users
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
        {/* LogOut */}
        <View style={styles.OptionButtonView}>
          <Ionicons name="exit-outline" size={31} color="white" />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(auth)/login")}
          >
            <TextScallingFalse style={styles.OptionText}>
              Log Out
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Settings Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <PageThemeView>
          <View style={styles.TopBarView}>
            <TouchableOpacity activeOpacity={0.5} onPress={closeModal}>
              <AntDesign name="arrowleft" size={28} color="white" />
            </TouchableOpacity>
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "300",
                borderBottomWidth: 0.3,
                borderBottomColor: "#707070",
                height: 37,
              }}
            >
              Account Settings
            </TextScallingFalse>
            <View style={{ width: 29, height: 8 }} />
          </View>
          <View
            style={{
              width: "100%",
              paddingHorizontal: 30,
              paddingVertical: 40,
              gap: 25,
            }}
          >
            <View style={styles.AccountSettingsButtonView}>
              <MaterialIcons name="password" size={26} color="white" />
              <TouchableOpacity
                onPress={() =>
                  router.push("/(app)/(main)/settings/change-password")
                }
                activeOpacity={0.7}
              >
                <TextScallingFalse style={styles.AccountSettingsOptions}>
                  Change Password
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
            <View style={styles.AccountSettingsButtonView}>
              <MaterialIcons name="policy" size={26} color="white" />
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://strength.net.in/?privacy")
                }
                activeOpacity={0.7}
              >
                <TextScallingFalse style={styles.AccountSettingsOptions}>
                  Privacy policy
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
            <View style={styles.AccountSettingsButtonView}>
              <MaterialCommunityIcons
                name="account-cancel"
                size={26}
                color="white"
              />
              <TouchableOpacity onPress={openModal3} activeOpacity={0.7}>
                <TextScallingFalse style={styles.AccountSettingsOptions}>
                  Close account
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </View>
        </PageThemeView>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={isModalVisible2}
        transparent={true}
        onRequestClose={closeModal2}
      >
        <PageThemeView>
          <View style={styles.TopBarView}>
            <TouchableOpacity activeOpacity={0.5} onPress={closeModal2}>
              <AntDesign name="arrowleft" size={28} color="white" />
            </TouchableOpacity>
            <TextScallingFalse
              style={{ color: "white", fontSize: 20, fontWeight: "300" }}
            >
              Password
            </TextScallingFalse>
            <View style={{ width: 29, height: 8 }} />
          </View>
          <View style={{ height: 30 }} />
          <View
            style={{
              width: "100%",
              paddingVertical: 25,
              paddingHorizontal: 40,
            }}
          >
            <TextScallingFalse
              style={{ color: "white", fontSize: 25, fontWeight: "bold" }}
            >
              Change Password
            </TextScallingFalse>
            <TextScallingFalse style={{ fontSize: 13, color: "white" }}>
              Make sure it's 8 character or more
            </TextScallingFalse>
          </View>

          <View style={{ width: "100%", alignItems: "center", gap: 20 }}>
            <View>
              <TextScallingFalse style={styles.PasswordTextHeading}>
                Enter old password
              </TextScallingFalse>
              <TextInputSection
                placeholder="Enter old password"
                placeholderTextColor={"grey"}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View>
              <TextScallingFalse style={styles.PasswordTextHeading}>
                Enter new password
              </TextScallingFalse>
              <TextInputSection
                placeholder="Enter old password"
                placeholderTextColor={"grey"}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View>
              <TextScallingFalse style={styles.PasswordTextHeading}>
                Confirm new password
              </TextScallingFalse>
              <TextInputSection
                placeholder="Enter old password"
                placeholderTextColor={"grey"}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                paddingHorizontal: 40,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleShowPassword}
              >
                <TextScallingFalse style={styles.ShowAndForgetButton}>
                  {showPassword ? "Hide Password" : "Show Password"}
                </TextScallingFalse>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <TextScallingFalse style={styles.ShowAndForgetButton}>
                  Forget passowrd?
                </TextScallingFalse>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "100%",
                paddingVertical: 30,
                alignItems: "center",
              }}
            >
              <SignupButton onPress={handleChangePassword}>
                <TextScallingFalse
                  style={{ color: "white", fontSize: 14.5, fontWeight: "500" }}
                >
                  Next
                </TextScallingFalse>
              </SignupButton>
            </View>
          </View>
        </PageThemeView>
      </Modal>

      {/* Close Account Modal */}
      <Modal
        visible={isModalVisible3}
        transparent={true}
        onRequestClose={closeModal3}
      >
        <PageThemeView>
          <View style={styles.TopBarView}>
            <TouchableOpacity activeOpacity={0.5} onPress={closeModal3}>
              <AntDesign name="arrowleft" size={28} color="white" />
            </TouchableOpacity>
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "300",
                borderBottomWidth: 0.3,
                borderBottomColor: "#707070",
                height: 37,
              }}
            >
              Close account
            </TextScallingFalse>
            <View style={{ width: 29, height: 8 }} />
          </View>
          <View style={{ paddingVertical: 30, paddingHorizontal: 20 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
            >
              <Image
                style={{
                  backgroundColor: "orange",
                  borderRadius: 100,
                  width: 40,
                  height: 40,
                }}
              />
              <View>
                <TextScallingFalse
                  style={{ color: "white", fontSize: 14, fontWeight: "500" }}
                >
                  First Last Name
                </TextScallingFalse>
                <TextScallingFalse
                  style={{ color: "white", fontSize: 9, fontWeight: "300" }}
                >
                  User Headline
                </TextScallingFalse>
              </View>
            </View>
            <View style={{ paddingVertical: 40, gap: 5 }}>
              <TextScallingFalse style={styles.CloseAccountHeadersText}>
                We’re sad to see you go
              </TextScallingFalse>
              <TextScallingFalse style={styles.CloseAccountDesText}>
                You're about to close your Strength account. Once closed, your
                public profile will no longer be visible on the Strength app.
              </TextScallingFalse>
            </View>
            <View style={{ gap: 5 }}>
              <TextScallingFalse style={styles.CloseAccountHeadersText}>
                What you Should Know
              </TextScallingFalse>
              <View style={{ flexDirection: "row", gap: 10, paddingTop: 10 }}>
                <Octicons name="dot-fill" size={12} color="grey" />
                <TextScallingFalse style={styles.CloseAccountDesText}>
                  Some of your account information may still be visible to users
                  you've interacted with, such as in their follower or following
                  lists.
                </TextScallingFalse>
              </View>
              <View style={{ flexDirection: "row", gap: 10, paddingTop: 5 }}>
                <Octicons name="dot-fill" size={12} color="grey" />
                <TextScallingFalse style={styles.CloseAccountDesText}>
                  If you only want to change your @username or date of birth,
                  there's no need to close your account—you can update those
                  details in your settings.
                </TextScallingFalse>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                padding: 75,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.AccountCloseButtons}
                onPress={openModal4}
              >
                <TextScallingFalse
                  style={{ color: "white", fontSize: 14, fontWeight: "600" }}
                >
                  Next
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </View>
        </PageThemeView>
      </Modal>

      {/* Close Account Confirm Password Modal */}
      <Modal
        visible={isModalVisible4}
        transparent={true}
        onRequestClose={closeModal4}
      >
        <PageThemeView>
          <View style={{ padding: 25, width: "100%" }}>
            <TouchableOpacity onPress={closeModal4}>
              <Entypo name="cross" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image style={{ width: 50, height: 50 }} source={logo} />
              <TextScallingFalse
                style={{ color: "white", fontSize: 13, fontWeight: "500" }}
              >
                Strength
              </TextScallingFalse>
            </View>
          </View>
          <View style={{ width: "100%", padding: 30 }}>
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: 27,
                fontWeight: "500",
                width: 230,
                lineHeight: 35,
              }}
            >
              Confirm your Email & password
            </TextScallingFalse>
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
            }}
          >
            <View>
              <TextScallingFalse style={styles.PasswordTextHeading}>
                Email
              </TextScallingFalse>
              <TextInputSection
                placeholder="Enter your email"
                placeholderTextColor={"grey"}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View>
              <TextScallingFalse style={styles.PasswordTextHeading}>
                Password
              </TextScallingFalse>
              <TextInputSection
                placeholder="Enter your email"
                placeholderTextColor={"grey"}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  paddingTop: 10,
                  paddingLeft: 5,
                }}
                activeOpacity={0.5}
                onPress={toggleShowPassword}
              >
                <TextScallingFalse
                  style={{ color: "#12956B", fontSize: 13, fontWeight: "400" }}
                >
                  {showPassword ? "Hide Password" : "Show Password"}
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
            <View style={{ paddingVertical: 30 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.AccountCloseButtons}
              >
                <TextScallingFalse
                  style={{ color: "white", fontWeight: "bold", fontSize: 14 }}
                >
                  Done
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </View>
        </PageThemeView>
      </Modal>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  TopBarView: {
    width: "100%",
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
  },
  PasswordTextHeading: {
    color: "white",
    fontSize: 14,
  },
  CloseAccountHeadersText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  AccountCloseButtons: {
    width: 220,
    paddingVertical: 10,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  CloseAccountDesText: {
    color: "grey",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 15,
  },
  ShowAndForgetButton: {
    color: "#12956B",
    fontSize: 13,
    fontWeight: "400",
  },
  OptionText: {
    color: "white",
    fontWeight: "500",
    fontSize: 17,
  },
  OptionButtonView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 19,
  },
  AccountSettingsOptions: {
    color: "white",
    fontSize: 15,
    fontWeight: "400",
  },
  AccountSettingsButtonView: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
});
