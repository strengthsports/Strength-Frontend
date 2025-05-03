import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useMemo, useState } from "react";
import PageThemeView from "~/components/PageThemeView";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";
import SearchBar from "~/components/search/searchbar";
import MembersSection from "~/components/profilePage/MembersSection";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import { Member } from "~/types/user";
import { AssociateProvider, useAssociate } from "~/context/UseAssociate";
import Divider from "~/components/ui/CustomDivider";
import AlertModal from "~/components/modals/AlertModal";
import UserInfoModal from "~/components/modals/UserInfoModal";
import AssociatesInviteModal from "~/components/modals/AssociatesInviteModal";
import { removeAssociates } from "~/reduxStore/slices/user/profileSlice";

const alertConfig = {
  title: "Remove Associates",
  message: "Remove @mrinal and 2 others?",
  confirmMessage: "Remove",
  cancelMessage: "Cancel",
};

const AssociateContent = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  // Get associates list
  const associates = useSelector(
    (state: RootState) => (state.profile.user?.associates as Member[]) || []
  );
  const {
    setSelectMode,
    isSelectModeEnabled,
    selectedMembers,
    openInviteModal,
    isModalOpen,
    selectedMember,
    isInviteModalOpen,
    closeModal,
    closeInviteModal,
  } = useAssociate();

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isAlertModalVisible, setAlertModalVisible] = useState(false);
  const [alertConfigSet, setAlertConfig] = useState(alertConfig);
  const [searchText, setSearchText] = useState("");

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible);
  };

  // Handle invite
  const handleInviteAssociates = () => {
    // Handle first button action here
    console.log("Invite Associates clicked");
    openInviteModal();
    setTooltipVisible(false);
  };

  // Handle select associates
  const handleSelectAssociates = () => {
    setTooltipVisible(false);
    setSelectMode(true);
  };

  // Handle cancel action
  const handleCancelSelect = () => {
    setSelectMode(false);
    // Add any additional cleanup logic
  };

  // Handle remove action 1
  const handleRemoveSelected = () => {
    // Implement removal logic here
    console.log("Selected member IDs to remove : ", selectedMembers);
    // setSelectMode(false);
    setAlertConfig({
      ...alertConfig,
      message: `Remove @${selectedMembers[0].memberUsername} ${
        selectedMembers.length > 1
          ? `${selectedMembers.length - 1}` + ` and others`
          : ""
      }`,
    });
    setAlertModalVisible(true);
  };

  // Handle remove action 2
  const handleRemoveAssociates = async () => {
    const users = selectedMembers.map((member) => member.memberId);
    await dispatch(removeAssociates(users));
    setSelectMode(false);
    handleCloseAlertModal();
  };

  // Handle close alert modal
  const handleCloseAlertModal = () => {
    setAlertModalVisible(false);
  };

  // Memoized athlete and coach data
  const athletes = useMemo(
    () => associates.filter((member) => member?.role === "Athlete"),
    [associates]
  );

  const coaches = useMemo(
    () => associates.filter((member) => member?.role === "Coach"),
    [associates]
  );

  // Apply search filter on coaches and athletes based on searchText
  const filteredCoaches = useMemo(
    () =>
      coaches.filter((member) =>
        `${member.firstName} ${member.lastName}`
          .toLowerCase()
          .includes(searchText.toLowerCase())
      ),
    [coaches, searchText]
  );

  const filteredAthletes = useMemo(
    () =>
      athletes.filter((member) =>
        `${member.firstName} ${member.lastName}`
          .toLowerCase()
          .includes(searchText.toLowerCase())
      ),
    [athletes, searchText]
  );

  return (
    <>
      <PageThemeView>
        {/* Header */}
        <View className="flex-row justify-between items-center h-16 px-5 border-b border-[#2B2B2B]">
          <View className="flex-row items-center">
            {isSelectModeEnabled ? (
              <TouchableOpacity onPress={handleCancelSelect}>
                <TextScallingFalse className="text-4xl text-[#D44044]">
                  Cancel
                </TextScallingFalse>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <TextScallingFalse className="text-white text-5xl">
            Associates
          </TextScallingFalse>
          {isSelectModeEnabled ? (
            <TouchableOpacity
              onPress={handleRemoveSelected}
              disabled={selectedMembers.length === 0}
            >
              <TextScallingFalse
                className={`text-4xl ${
                  selectedMembers.length === 0
                    ? "text-[#d440459d]"
                    : "text-[#D44044]"
                }`}
              >
                Remove
              </TextScallingFalse>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={toggleTooltip}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          )}
        </View>

        <View>
          <SearchBar
            mode="search"
            placeholder="Search associated members..."
            searchText={searchText}
            onChangeSearchText={setSearchText}
          />
          {filteredCoaches.length > 0 && (
            <>
              <TextScallingFalse
                className="text-[#8A8A8A]"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "600",
                  fontSize: 16,
                  marginLeft: 20,
                  marginBottom: 10,
                }}
              >
                Coaches
              </TextScallingFalse>
              <MembersSection members={filteredCoaches} isEditView={true} />
            </>
          )}
          {filteredAthletes.length > 0 && (
            <>
              <TextScallingFalse
                className="text-[#8A8A8A]"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "600",
                  fontSize: 16,
                  marginLeft: 20,
                  marginBottom: 10,
                }}
              >
                Athletes
              </TextScallingFalse>
              <MembersSection members={filteredAthletes} isEditView={true} />
            </>
          )}
        </View>
      </PageThemeView>

      {/* Blackish overlay with tooltip */}
      {tooltipVisible && (
        <View style={styles.overlay}>
          {/* Pressing the overlay (outside the tooltip) dismisses it */}
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={toggleTooltip}
          />
          <View style={styles.tooltipContainer}>
            <TouchableOpacity
              style={styles.tooltipButton}
              onPress={handleInviteAssociates}
            >
              <TextScallingFalse style={styles.tooltipButtonText}>Invite Associates</TextScallingFalse>
            </TouchableOpacity>
            <Divider color="#434343" marginVertical={0} />
            <TouchableOpacity
              style={styles.tooltipButton}
              onPress={handleSelectAssociates}
            >
              <TextScallingFalse style={styles.tooltipButtonText}>Select</TextScallingFalse>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Alert modal */}
      {isAlertModalVisible && (
        <AlertModal
          alertConfig={{
            ...alertConfigSet,
            confirmAction: handleRemoveAssociates,
            discardAction: handleCloseAlertModal,
          }}
          isVisible={isAlertModalVisible}
        />
      )}

      <UserInfoModal
        visible={isModalOpen}
        onClose={closeModal}
        member={selectedMember}
      />

      <AssociatesInviteModal
        visible={isInviteModalOpen}
        onClose={closeInviteModal}
      />
    </>
  );
};

const Associates = () => {
  return (
    <PageThemeView>
      <AssociateProvider>
        <AssociateContent />
      </AssociateProvider>
    </PageThemeView>
  );
};

export default Associates;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100, // Make sure overlay is on top
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  overlayBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Blackish background with opacity
  },
  tooltipContainer: {
    width: 180,
    backgroundColor: "#333333",
    borderRadius: 16,
    // padding: 10,
    // Optional: add shadow for a nicer look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tooltipButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "200",
  },
});
