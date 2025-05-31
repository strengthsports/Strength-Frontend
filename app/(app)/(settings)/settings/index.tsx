import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Linking,
  BackHandler,
  Share
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
  Feather
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import TextScallingFalse from "~/components/CentralText";
import TextInputSection from "~/components/TextInputSection";
import SignupButton from "~/components/SignupButton";
import logo from "@/assets/images/logo2.png";
import nopic from "@/assets/images/nopic.jpg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { logoutUser, resetUserData } from "~/reduxStore/slices/user/authSlice";
import { ToastAndroid } from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { resetFeed } from "~/reduxStore/slices/post/postsSlice";
import ChangePasswordForm from "./ChangePasswordForm";
import CloseAccountView from "./CloseAccountView";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";
import AgreementsModalView from "./AgreementsModalView";

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
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showCloseAccountPage, setShowCloseAccountPage] = useState(false);
  const [openModal14, setOpenModal14] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: any) => state?.profile);

  const handleLogout = async () => {
    const isAndroid = Platform.OS == "android";
    try {
      const response = await dispatch(logoutUser()).unwrap();
      // Dispatch resetUserData to clear user-related data from Redux store
      dispatch(resetUserData());
      !isAndroid && router.replace("/login");
      isAndroid
        ? ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT)
        : Toast.show({
          type: "error",
          text1: "Logged out successfully",
          visibilityTime: 1500,
          autoHide: true,
        });
      dispatch(resetFeed());
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


  const handleAppShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Hey! Just started using Strength — it's like a home for athletes and sports enthusiasts. Thought you’d love it too!\n\nDownload now and let’s level up together! 👇\nhttps://www.yourstrength.in",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('App shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing the app:', error.message);
    }
  };


  // Check if modal close request has came
  useEffect(() => {
    if (accountSettingsModal === "true") {
      setModalVisible((prev) => !prev);
    }
  }, []);

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

  return (
    <PageThemeView>
      <View style={styles.TopBarView}>
        <TouchableOpacity
          style={{ width: 60, height: 30, justifyContent: "center" }}
          activeOpacity={0.5}
          onPress={() => router.back()}
        >
          <BackIcon />
        </TouchableOpacity>
        <TextScallingFalse
          style={{ color: "white", fontSize: 20, fontWeight: "300" }}
        >
          Settings
        </TextScallingFalse>
        <View style={{ width: 60, height: 8 }} />
      </View>
      <View
        style={{
          width: "100%",
          paddingVertical: 40,
          paddingHorizontal: 20,
          flexDirection: "row",
        }}
      >
        <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
          <Image
            source={user?.profilePic ? { uri: user?.profilePic } : nopic}
            style={{
              backgroundColor: "orange",
              width: 84,
              height: 84,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: "#252525",
            }}
          />
          <View style={{ paddingVertical: 17, width: 220 }}>
            <TextScallingFalse
              style={{ color: "white", fontSize: 18, fontWeight: "600" }}
            >
              {user?.firstName} {user?.lastName}
            </TextScallingFalse>
            <TextScallingFalse
              style={{
                color: "#9FAAB5",
                fontSize: 13,
                fontWeight: "400",
                lineHeight: 17,
              }}
            >
              @{user?.username}{" "}
              <TextScallingFalse style={{ fontSize: 13 }}>|</TextScallingFalse>{" "}
              {user?.headline}
            </TextScallingFalse>
          </View>
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
          paddingVertical: 30,
          gap: 20,
        }}
      >
        <TouchableOpacity
          style={styles.OptionButtonView}
          onPress={openModal}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="account-cog-outline"
            size={31}
            color="white"
          />
          <TextScallingFalse style={styles.OptionText}>
            Account Settings
          </TextScallingFalse>
        </TouchableOpacity>
        {/* Blocked users */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.OptionButtonView}
          onPress={() => router.push("/(app)/(settings)/blocked-users")}
        >
          <MaterialIcons name="block" size={31} color="white" />
          <TextScallingFalse style={styles.OptionText}>
            Blocked Users
          </TextScallingFalse>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.OptionButtonView}>
          <MaterialIcons name="help-outline" size={31} color="white" />
          <TextScallingFalse style={styles.OptionText}>
            Customer Support
          </TextScallingFalse>
        </TouchableOpacity>
        {/* Feedback */}
        <TouchableOpacity style={styles.OptionButtonView}
          onPress={() => {
            router.push("/(app)/(settings)/FeedBack/feedback2");
          }}
          activeOpacity={0.5}
        >
          <Ionicons name="megaphone-outline" size={31} color="white" />
          <TextScallingFalse style={styles.OptionText}>
            Feedback
          </TextScallingFalse>
        </TouchableOpacity>
        {/* Share app  */}
        <TouchableOpacity style={styles.OptionButtonView}
          onPress={handleAppShare}
          activeOpacity={0.5}
        >
          <Feather name="share-2" size={29} color="white" />
          <TextScallingFalse style={styles.OptionText}>
            Share Strength
          </TextScallingFalse>
        </TouchableOpacity>
        {/* LogOut */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.OptionButtonView}
          onPress={handleLogout}
        >
          <Ionicons name="exit-outline" size={31} color="white" />
          <TextScallingFalse style={styles.OptionText}>
            Log Out
          </TextScallingFalse>
        </TouchableOpacity>
        {/* LogOut Bypass*/}
        {__DEV__ && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.OptionButtonView}
            onPress={() => router.push("/(auth)/login")}
          >
            <Ionicons name="exit-outline" size={31} color="white" />
            <TextScallingFalse style={styles.OptionText}>
              Log Out Bypass
            </TextScallingFalse>
          </TouchableOpacity>
        )}
      </View>

      {/* Account Settings Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <PageThemeView>
          <View style={styles.TopBarView}>
            <TouchableOpacity
              style={{ width: 60, height: 30, justifyContent: "center" }}
              activeOpacity={0.5}
              onPress={closeModal}
            >
              <BackIcon />
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
            <View style={{ width: 60, height: 8 }} />
          </View>
          <View
            style={{
              width: "100%",
              paddingHorizontal: 30,
              paddingVertical: 40,
              gap: 6,
            }}
          >
            <View style={styles.AccountSettingsButtonView}>
              <MaterialIcons name="password" size={26} color="white" />
              <TouchableOpacity
                className="py-4"
                onPress={() => {
                  setShowChangePasswordForm(true);
                }}
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
                className="py-4"
                onPress={() => setOpenModal14(true)}
                activeOpacity={0.7}
              >
                <TextScallingFalse style={styles.AccountSettingsOptions}>
                  Agreements & Policy
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
            <View style={styles.AccountSettingsButtonView}>
              <MaterialCommunityIcons
                name="account-cancel"
                size={26}
                color="white"
              />
              <TouchableOpacity
                className="py-4"
                onPress={() => {
                  setShowCloseAccountPage(true);
                }}
                activeOpacity={0.7}
              >
                <TextScallingFalse style={styles.AccountSettingsOptions}>
                  Close account
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </View>

          {showChangePasswordForm && (
            <Modal visible={showChangePasswordForm} transparent={true}>
              <ChangePasswordForm
                onSuccess={() => {
                  setShowChangePasswordForm(false);
                  setModalVisible(true);
                }}
                onCancel={() => setShowChangePasswordForm(false)}
              />
            </Modal>
          )}

          {showCloseAccountPage && (
            <Modal
              visible={showCloseAccountPage}
              transparent={true}
              onRequestClose={() => setShowCloseAccountPage(false)}
            >
              <CloseAccountView
                onClose={() => setShowCloseAccountPage(false)}
              />
            </Modal>
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
        </PageThemeView>
      </Modal>
    </PageThemeView>
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
    paddingHorizontal: 40,
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
