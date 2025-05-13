import { Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import User from "@/assets/images/card.png";
import page from "@/assets/images/pages.png";
import PageThemeView from "@/components/PageThemeView";
import TextScallingFalse from "@/components/CentralText";
import Logo from "@/components/logo";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const option = () => {
  const router = useRouter();

  return (
    <PageThemeView>
      <View className="gap-[130px]">
        {/* Header */}
        <View className="w-full flex-row items-center mt-[30px] justify-between px-4">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.5}>
            <MaterialIcons name="keyboard-backspace" size={30} color="white" />
          </TouchableOpacity>
          <Logo />
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.5}>
            <AntDesign name="close" size={25} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main Buttons */}
        <View className="w-full items-center gap-[50px]">
          <TouchableOpacity
            onPress={() => router.push("/Signup/signupEmail1")}
            activeOpacity={0.7}
            className="bg-white w-[71%] h-[90px] rounded-md flex-row items-center justify-center gap-[48px]"
          >
            <Image source={User} className="w-[45px] h-[45px]" />
            <TextScallingFalse className="text-black text-[18px]">
              Join as a user
            </TextScallingFalse>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/Signup/page-signup")}
            activeOpacity={0.7}
            className="bg-white w-[71%] h-[90px] rounded-md flex-row items-center justify-center gap-[45px]"
          >
            <Image source={page} className="w-[45px] h-[45px]" />
            <View>
              <TextScallingFalse className="text-black text-[18px]">
                Create a page
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="flex-row w-full justify-center">
          <TextScallingFalse
            className="text-white text-[13px] font-medium"
            allowFontScaling={false}
          >
            Already on Strength?
          </TextScallingFalse>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            activeOpacity={0.5}
          >
            <TextScallingFalse className="text-[13px] font-medium text-[#12956B]">
              {" "}
              Sign in
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </View>
    </PageThemeView>
  );
};

export default option;
