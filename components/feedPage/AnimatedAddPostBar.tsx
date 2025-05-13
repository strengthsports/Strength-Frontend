import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import TextScallingFalse from "../CentralText";
import { Link, useRouter } from "expo-router";

const AnimatedAddPostBar = ({
  suggestionText = "What's on your mind...",
}: {
  suggestionText: string;
}) => {
  const router = useRouter();

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: "95%",
        }}
      >
        <Link
          style={{
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#141414",
            padding: 6,
            borderRadius: 12,
            height: 37,
            justifyContent: "space-between",
            paddingHorizontal: 6,
          }}
          href="/add-post"
          asChild
        >
          <TouchableOpacity>
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
                width: 25,
                height: 25,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "grey",
                borderRadius: 7,
              }}
            >
              <Feather name="plus" size={15} color="grey" />
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default AnimatedAddPostBar;
