import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Easing } from "react-native";
import { Image } from "expo-image";
import TextScallingFalse from "../CentralText";
import { Link, useRouter } from "expo-router";
import stamin from "@/assets/images/Stamin4.gif"

const AnimatedAddPostBar = ({
  suggestionText = "Curious about sports ask Stamin...",
}: {
  suggestionText: string;
}) => {
  const router = useRouter();

  const rotateValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 6000, // 60 seconds for a full rotation
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: "95%",
        }}
      >
        <Link href={"/(app)/Stamin" as any} asChild>
        <TouchableOpacity
          style={{
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#141414",
            padding: 6,
            borderRadius: 12,
            height: 37,
            justifyContent: "space-between",
            paddingHorizontal: 5,
          }} activeOpacity={0.7}
          >
            <TextScallingFalse
              style={{
                color: "grey",
                fontSize: 14,
                fontWeight: "400",
                marginLeft: 6,
                flex: 1,
              }}
            >
              {suggestionText}
            </TextScallingFalse>
            <View
              style={{
                width: 27,
                height: 27,
                justifyContent: "center",
                alignItems: "center",
                borderColor: "grey",
                borderRadius: 8,
              }}
            >
              {/* <Feather name="plus" size={15} color="grey" /> */}
              <Image
                source={stamin}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
            </View>
          </TouchableOpacity>
          </Link>
      </View>
    </View>
  );
};

export default AnimatedAddPostBar;
