import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import TextScallingFalse from "./CentralText";

function TopBar({
  backRoute,
  backHandler,
  heading,
  children,
}: {
  backRoute?: any;
  backHandler?: () => void;
  heading: string;
  children?: ReactNode;
}) {
  const router = useRouter();

  return (
    <View className="h-[45px] w-full flex-row justify-between items-center px-5 border-b-[0.5px] border-[#404040]">
      <TouchableOpacity
        onPress={() => {
          if (backHandler) {
            backHandler();
          } else {
            router.push(backRoute);
          }
        }}
        className="basis-[15%]"
      >
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <TextScallingFalse className="flex-grow text-center text-white font-light text-5xl">
        {heading}
      </TextScallingFalse>
      <View className="basis-[15%]">{children}</View>
    </View>
  );
}

export default TopBar;
