import { View, Text } from "react-native";
import React from "react";
import ComingSoon from "~/components/explorePage/comingSoon";

interface SelectedSportProps {
  sportsName: string;
}

const SelectedSport: React.FC<SelectedSportProps> = ({ sportsName }) => {
  return (
    <View className="flex-1">
      <ComingSoon text="Groups" />
    </View>
  );
};

export default SelectedSport;
