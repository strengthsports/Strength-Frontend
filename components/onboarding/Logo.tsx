import React from "react";
import { View, Text, Image } from "react-native";

const NavigationLogo: React.FC = () => {
    return (
        <View className="items-center pt-16">
            <Image
                source={require("../../assets/images/onboarding/logo2.png")}
                className="w-14 h-16"
            />
            <Text className="text-white text-xs mt-2">Strength</Text>
        </View>
    );
};

export default NavigationLogo;
