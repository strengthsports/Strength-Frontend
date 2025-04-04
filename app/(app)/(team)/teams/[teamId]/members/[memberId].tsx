import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import PageThemeView from "~/components/PageThemeView";
import Icon from "react-native-vector-icons/AntDesign";
import { Button,Divider } from "react-native-paper";
import Nopic from "../../../../../../assets/images/nopic.jpg"

const MemberDetails = () => {
  const { teamId, memberId, member } = useLocalSearchParams();
  const router = useRouter();

  // Parse the member object (since it was passed as a string)
  const parsedMember = member ? JSON.parse(member as string) : null;

  return (
    <PageThemeView>
      {/* Header Section */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-black">
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <Divider className="bg-gray-400" />

        {/* Member Name Centered */}
        <Text className="text-white text-5xl font-bold flex-1 text-center">
          {parsedMember?.firstName} {parsedMember?.lastName}
        </Text>

        {/* Invisible View for Spacing */}
        <View style={{ width: 28 }} />
      </View>
<Divider className="bg-slate-500"/>
      {/* Member Details */}
      <View className="  px-4 py-6 mt-3">
        <Image
          source={{
            uri: parsedMember?.profilePic || Nopic,
          }}
          className="w-20 h-20 rounded-full"
        />
        <View className="mt-3">
          <Text className="text-white text-5xl font-bold">
            {parsedMember?.firstName} {parsedMember?.lastName}
          </Text>
          <Text className="text-white text-lg">{parsedMember?.role}</Text>
        </View>
      </View>

      {/* Buttons: Following & View Profile */}
      <View className="flex-row justify-between px-4">
        <Button mode="contained" className="bg-gray-700" onPress={() => {}}>
          Following
        </Button>
        <Button mode="contained" className="bg-gray-700" onPress={() => {}}>
          View Profile
        </Button>
      </View>

      {/* Role Label with Button */}
      <View className="px-4 py-4">
        <Text className="text-gray-400 text-lg mb-2">Role</Text>
        <Button mode="outlined" className="border-white text-white">
          Batter
        </Button>
      </View>

      {/* Promote/Demote Buttons */}
      <View className="px-4 py-4">
        <Button mode="contained" className="bg-green-600 mb-2" onPress={() => {}}>
          Promote to Captain
        </Button>
        <Button mode="contained" className="bg-orange-600" onPress={() => {}}>
          Demote to Vice Captain
        </Button>
      </View>

      {/* Remove & Transfer Admin Buttons */}
      <View className="px-4 py-4">
        <Button mode="contained" className="bg-red-600 mb-2" onPress={() => {}}>
          Remove from Team
        </Button>
        <Button mode="contained" className="bg-blue-600" onPress={() => {}}>
          Transfer Admin
        </Button>
      </View>
    </PageThemeView>
  );
};

export default MemberDetails;

const styles = StyleSheet.create({});
