import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import TextScallingFalse from "../CentralText";
import { Feather } from "@expo/vector-icons";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Member } from "~/types/user";
import MemberEntry from "./MemberEntry";
import EditIcon from "../SvgIcons/profilePage/EditIcon";
import { useRouter } from "expo-router";
import { FlatList } from "react-native";

const MembersList = ({
  members,
  isEditView,
  limit = 4,
}: {
  members: Member[];
  isEditView?: boolean;
  limit?: number;
}) => {
  const data = members.slice(0, limit);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item, index }) => (
        <MemberEntry
          member={item}
          isLast={index === data.length - 1}
          isEditView={isEditView}
        />
      )}
    />
  );
};

const MembersSection = ({
  members,
  sectionHeader,
  moreText,
  isOwnProfile,
  isEditView,
}: {
  members: Member[];
  sectionHeader?: string;
  moreText?: string;
  isOwnProfile?: boolean;
  isEditView?: boolean;
}) => {
  const router = useRouter();
  return (
    <View className="bg-[#121212] w-[93%] mx-auto px-5 py-4 rounded-xl mb-3">
      {/* Header */}
      {!isEditView && (
        <View className="flex-row justify-between items-center mb-3">
          <TextScallingFalse
            className="text-[#8A8A8A]"
            style={{
              fontFamily: "Montserrat",
              fontWeight: 600,
              fontSize: responsiveFontSize(1.8),
            }}
          >
            {sectionHeader?.toUpperCase()} {`[${members.length}]`}
          </TextScallingFalse>
        </View>
      )}

      {/* Members Mapping */}
      <MembersList
        members={members}
        isEditView={isEditView}
        limit={isEditView ? members.length : 4}
      />

      {/* Show more button */}
      {members.length >= 5 && (
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() =>
            router.push("/(app)/(profile)/edit-overview/associates")
          }
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 20,
          }}
        >
          <TextScallingFalse
            style={{
              color: "#808080",
              fontSize: 15,
              fontWeight: "700", // Bold
            }}
          >
            {moreText}
          </TextScallingFalse>
          <Feather
            name="arrow-right"
            size={20}
            color={"#808080"}
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>
      )}

      {/* edit button */}
      {isOwnProfile && (
        <TouchableOpacity
          className="absolute top-5 right-5"
          activeOpacity={0.7}
          onPress={() =>
            router.push("/(app)/(profile)/edit-overview/associates")
          }
        >
          <EditIcon />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MembersSection;

const styles = StyleSheet.create({});
