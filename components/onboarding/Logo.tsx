import React from "react";
import { View, Text, Image, SafeAreaView, Dimensions } from "react-native";

const NavigationLogo: React.FC = () => {
  const { height } = Dimensions.get("window"); // Get screen height
  const topPadding = height * 0.07; // Adjust the padding dynamically (e.g., 2% of screen height)

  return (
    <SafeAreaView>
      <View style={{ paddingTop: topPadding, alignItems: "center" }}>
        <Image
          source={require("../../assets/images/onboarding/logoHeader.png")}
          style={{ width: 66, height: 55 }} // Use exact dimensions for the image
          resizeMode="contain" // Ensure the image scales properly
        />
      </View>
    </SafeAreaView>
  );
};

export default NavigationLogo;
