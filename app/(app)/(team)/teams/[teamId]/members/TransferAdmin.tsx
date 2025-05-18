import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import { transferAdmin, fetchTeamDetails } from "~/reduxStore/slices/team/teamSlice";
import Toast from "react-native-toast-message";
import PageThemeView from "~/components/PageThemeView";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Nopic from "../../../../../../assets/images/nopic.jpg";
import TextScallingFalse from "~/components/CentralText";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";
import { showSuccess, showError } from "../../../../../../utils/feedbackToast";
import AlertModal from "~/components/modals/AlertModal";
import Transfer from "~/components/SvgIcons/teams/Transfer";

const TransferAdminScreen = () => {
  const { teamId, member } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { team } = useSelector((state: RootState) => state.team);
  const { user } = useSelector((state: RootState) => state.profile);

  const parsedMember = JSON.parse(member as string);
  const [isLoading, setIsLoading] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    confirmAction: () => {},
    discardAction: () => {},
    confirmMessage: "Confirm",
    cancelMessage: "Cancel",
  });
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamDetails(teamId as string));
    }
  }, [teamId, dispatch]);

const handleTransferAdmin = async () => {
  if (!team || !parsedMember || !isAcknowledged) {
    showError("Please acknowledge the transfer first");
    return;
  }

  setIsLoading(true);
  try {
    await dispatch(
      transferAdmin({
        teamId: team._id,
        userId: parsedMember._id,
      })
    ).unwrap();

    showSuccess("Admin rights transferred successfully");

    await dispatch(fetchTeamDetails(team._id)); // Optional, depending on whether back screen needs updated team

    setAlertVisible(false); // 👈 Alert modal band karo

    router.back(); // 👈 Back navigation karo

  } catch (error: any) {
    console.error("Admin transfer failed:", error);
    showError(error.message || "Could not transfer admin rights. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  const showConfirmation = () => {
    if (!isAcknowledged) {
      showError("Please acknowledge the transfer first");
      return;
    }

    setAlertConfig({
      title: "Transfer Admininstration",
      message: `Are you sure ? you want to transfer Admininstrations to "${parsedMember?.firstName} ${parsedMember?.lastName}" `,
      confirmAction: handleTransferAdmin,
      discardAction: () => setAlertVisible(false),
      confirmMessage: "Transfer",
      cancelMessage: "Cancel",
      discardButtonColor: {
        bg: "#D44044",
        text: "white"
      }
    });
    setAlertVisible(true);
  };

  const toggleAcknowledge = () => {
    setIsAcknowledged(!isAcknowledged);
  };

  if (!parsedMember) {
    return (
      <PageThemeView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </PageThemeView>
    );
  }

  return (
    <PageThemeView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header - Kept exactly the same */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
          <TextScallingFalse style={styles.headerText}>Transfer Administration</TextScallingFalse>
          <View style={{ width: 28 }} />
        </View>

        {/* Content - Kept exactly the same */}
        <View style={styles.content}>
          {/* Profiles - Kept exactly the same */}
          <View style={styles.profilesContainer}>
            <View style={styles.profileContent}>
                <Image 
                  source={user?.profilePic ? { uri: user.profilePic } : Nopic} 
                  style={styles.profileImage} 
                />
               
              </View>

            <View className="flex-row ml-[-30px] pl-3 pr-3 bg-[#0F0F0F] rounded-l-full  z-40 ">
            <View className="mt-10 pr-2">
             
            <Transfer/>
            </View>
                <Image 
                  source={parsedMember?.profilePic ? { uri: parsedMember.profilePic } : Nopic} 
                  style={styles.profileImage} 
                />
               
              </View>
          </View>

          {/* Info Box - Kept exactly the same */}
          <View style={styles.infoBox}>
            <TextScallingFalse style={styles.infoText}>
             This will transfer administration of "<TextScallingFalse style={{ color:"white" }}>
    {team?.name}
  </TextScallingFalse>{" "}" to {parsedMember.firstName} {parsedMember.lastName} {`(@${parsedMember.username}).`}
             {"\n"}This cannot be undone!
            </TextScallingFalse>
          </View>
        </View>

        {/* Acknowledge Checkbox - Modified only the circle style */}
        <View className="justify-center mx-8 my-3 pl-1 flex-row">
          <TouchableOpacity 
            onPress={toggleAcknowledge}
            className={`w-4 h-4 border-2 ${isAcknowledged ? 'bg-[#12956B] border-stone-700 ' : 'border-stone-500'} p-3 mr-3 mt-[1.5px] rounded-full justify-center items-center`}
          >
            {isAcknowledged && (
              <MaterialCommunityIcons name="check" size={16} color="black" />
            )}
          </TouchableOpacity>
          <TextScallingFalse className="text-white text-lg  mr-2">I acknowledge that by transferring administration of this team to @{parsedMember?.firstName}, it officially belongs to them.</TextScallingFalse>
        </View>

        {/* Footer - Modified only the button disabled state */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.transferButton, !isAcknowledged && styles.transferButtonDisabled]}
            onPress={showConfirmation}
            disabled={!isAcknowledged || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <TextScallingFalse style={styles.transferButtonText}>
                Transfer
              </TextScallingFalse>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Alert Modal - Kept exactly the same */}
      <AlertModal
        alertConfig={alertConfig}
        isVisible={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
      
      <Toast topOffset={50} visibilityTime={2000} autoHide />
    </PageThemeView>
  );
};

// Styles - Kept exactly the same except for the new disabled button style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#252525",
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoBox: {
    flexDirection: "row",
    borderRadius: 12,
    marginTop:-15,
    padding: 6,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  infoText: {
    color: "#A5A5A5",
    fontSize: 14,
    marginLeft: 5,
    flex: 1,
  },
  profilesContainer: {
    backgroundColor:"#0F0F0F",
    borderRadius:15,
    paddingVertical:30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  profileContent: {
    alignItems: "center",
    padding: 12,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#252525",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#252525",
  },
  transferButton: {
    flex: 1,
    backgroundColor: "#12956B",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  transferButtonDisabled: {
    backgroundColor: "#1E3A2F",
  },
  transferButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default TransferAdminScreen;