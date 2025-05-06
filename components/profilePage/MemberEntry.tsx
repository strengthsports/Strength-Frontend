import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Member } from "~/types/user";
import { Image } from "react-native";
import nopic from "~/assets/images/nopic.jpg";
import TextScallingFalse from "../CentralText";
import RightArrow from "../Arrows/RightArrow";
import { useAssociate } from "~/context/UseAssociate";
import Icon from "react-native-vector-icons/AntDesign";
import { RelativePathString, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";
import CaptainSq from "../SvgIcons/teams/CaptainSq";
import ViceCaptainSq from "../SvgIcons/teams/ViceCaptainSq";

const MemberEntry = ({
  member,
  isLast,
  isEditView,
  isAdmin,
}: {
  member: Member;
  isLast: boolean;
  isEditView?: boolean;
  isAdmin?: boolean;
}) => {
  const {
    openModal,
    isSelectModeEnabled,
    toggleMemberSelection,
    selectedMembers,
  } = useAssociate();

  const router = useRouter();
  const teamId = useSelector((state: RootState) => state.team.team?._id);

  const handleTeamClick = () => {
    router.push({
      pathname: `/teams/${teamId}/members/${member._id}` as RelativePathString,
      params: {
        member: JSON.stringify(member),
        role: JSON.stringify(member.role),
      },
    });
  };

  const handleSelectMember = () => {
    toggleMemberSelection({
      memberId: member._id,
      memberUsername: member.username,
    });
  };

  const isCaptain = member.position?.toLowerCase() === "captain";
  const isViceCaptain = member.position?.toLowerCase() === "vicecaptain";

  return (
    <>
      <TouchableOpacity
        onPress={() => (isAdmin ? handleTeamClick() : openModal(member))}
        activeOpacity={0.8}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 5,
        }}
      >
        {/* Member Profile Pic */}
        <Image
          source={member.profilePic ? { uri: member.profilePic } : nopic}
          style={{
            width: 40,
            height: 40,
            borderRadius: 100,
            borderWidth: 1.5,
            borderColor: "#1C1C1C",
          }}
        />
        {/* Member Details */}
        <View
          className={`flex-1 flex-row ml-2 items-center justify-between gap-2 ${
            !isLast && "border-b-[0.5px] border-[#3B3B3B]"
          } py-5`}
        >
          <View className="flex flex-col">
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextScallingFalse
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {member.firstName} {member.lastName}
              </TextScallingFalse>
              {isCaptain && (
                <View className="ml-2 mt-1">
                  <CaptainSq />
                </View>
              )}
              {isViceCaptain && (
                <View className="ml-2 mt-1">
                  <ViceCaptainSq />
                </View>
              )}
            </View>
            <TextScallingFalse
              style={{
                color: "#B2B2B2",
                fontSize: 12,
                width: 230,
                fontWeight: "300",
              }}
            >
              {"@"}
              {member.username}
              {" | "}
              {member.headline}
            </TextScallingFalse>
          </View>
          {isEditView && !isSelectModeEnabled && <RightArrow />}

          {isSelectModeEnabled && (
            <TouchableOpacity
              className={`w-8 h-8 rounded-md border ${
                selectedMembers.some((m) => m.memberId === member._id)
                  ? "border-[#12956B] bg-[#12956B]"
                  : "border-[#4B5563]"
              } items-center justify-center`}
              onPress={handleSelectMember}
            >
              {selectedMembers.some((m) => m.memberId === member._id) && (
                <Icon name="check" size={20} color="white" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

export default MemberEntry;

const styles = StyleSheet.create({});
