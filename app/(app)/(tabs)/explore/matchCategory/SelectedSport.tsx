import { View, Text } from "react-native";
import React from "react";

interface SelectedSportProps {
  sportsName: string;
}

const SelectedSport: React.FC<SelectedSportProps> = ({ sportsName }) => {
  return (
    <View>
      <Text className="text-white">{sportsName}</Text>
    </View>
  );
};

export default SelectedSport;
