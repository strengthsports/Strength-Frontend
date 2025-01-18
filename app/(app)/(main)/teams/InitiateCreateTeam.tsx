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
import { ThemedText } from "~/components/ThemedText";

const InitiateCreateTeam = () => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;

  const handleCreateTeam = () => {
    console.log("Join Team Link Clicked");
    router.push("../teams/createTeam");
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
        <TouchableOpacity onPress={() => console.log("Back Button Clicked")}>
          <Icon
            name="arrow-back" // Ionicons back arrow icon
            size={30} // Icon size
            color="white" // Icon color
          />
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
          source={require("~/assets/images/teams/initiatecreateteam.png")}
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
        <SignupButton onPress={() => console.log("Create Team Button Clicked")}>
          <ThemedText
            style={{ color: "white", fontSize: 16, fontWeight: "500" }}
          >
            Create Team
          </ThemedText>
        </SignupButton>

        <View style={{ height: 20 }} />
        {/* Join Team Link */}
        <TouchableOpacity onPress={handleCreateTeam}>
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
