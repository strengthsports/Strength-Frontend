import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";

type ViewHeadLineProps = {
  fullName: string;
  username: string;
  headline: string;
  size?: string;
  numberOfLines?: number;
  leftAlign?: boolean;
};

const UserInfo = ({
  fullName,
  username,
  headline,
  size = "regular",
  numberOfLines = 3,
  leftAlign = false,
}: ViewHeadLineProps) => {
  return (
    <TextScallingFalse
      className={`${leftAlign ? "text-left" : "text-center"}`}
      numberOfLines={numberOfLines}
    >
      <TextScallingFalse
        className={`text-white ${
          size === "small" ? "text-xl" : "text-2xl"
        } font-semibold`}
      >
        {fullName}
        {"\n"}
      </TextScallingFalse>
      <TextScallingFalse
        className={`text-[#919191] ${size === "small" ? "text-sm" : "text-sm"}`}
      >
        @{username} <TextScallingFalse className="text-lg">|</TextScallingFalse>{" "}
        {headline}
      </TextScallingFalse>
    </TextScallingFalse>
  );
};

export default UserInfo;

const styles = StyleSheet.create({});
