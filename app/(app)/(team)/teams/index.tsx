import { router } from "expo-router";
import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import SignupButton from "~/components/SignupButton";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";
import { ThemedText } from "~/components/ThemedText";

const InitiateCreateTeam = () => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;

  const handleCreateTeam = () => {
    // console.log("Join Team Link Clicked");
    router.push("../teams/create-team");
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: insets.top,
        flex: 1,
        backgroundColor: "black",
      }}
    >
      {/* Back Button */}
      <View style={{ paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
         <BackIcon/>
        </TouchableOpacity>
      </View>

      {/* Image/Animation */}
      <View
        style={{
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Image
          source={require("~/assets/images/teams/initiateteam.gif")}
          style={{
            height: 300,
            width: screenWidth,
            resizeMode: "contain",
          }}
        />
      </View>

      {/* Action Buttons */}
      <View
        style={{
          marginTop: 30,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        {/* Create Team Button */}
        <SignupButton onPress={handleCreateTeam} disabled={false}>
          <ThemedText
            style={{ color: "white", fontSize: 16, fontWeight: "500" }}
          >
            Create Team
          </ThemedText>
        </SignupButton>

        <View style={{ height: 20 }} />
        {/* Join Team Link */}
        <TouchableOpacity>
          <ThemedText
            style={{ color: "#A0AEC0", textAlign: "center", fontSize: 16 }}
          >
            Join an existing team
          </ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default InitiateCreateTeam;
