import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const NavigationLogo: React.FC = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/images/onboarding/logo2.png")}
                style={styles.image}
            />
            <Text style={styles.text}>Strength</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: 60,
    },
    image: {
        width: 55,
        height: 66,
    },
    text: {
        color: 'white',
        fontSize: 13,
        marginTop: 8,
    },
});

export default NavigationLogo;
