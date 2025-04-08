import { View, Text } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import ComingSoon from "~/components/explorePage/comingSoon";

interface SelectedSportProps {
  sportsName: string;
}

const SelectedSport: React.FC<SelectedSportProps> = ({ sportsName }) => {
  return (
    <View className="flex-1 items-center">
      <ComingSoon text="Teams" />
    </View>
  );
};

export default SelectedSport;
