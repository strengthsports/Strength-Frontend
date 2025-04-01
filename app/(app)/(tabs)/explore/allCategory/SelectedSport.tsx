import { View, Text } from "react-native";
import React from "react";

interface SelectedSportProps {
  sport: string;
}

const SelectedSport: React.FC<SelectedSportProps> = ({ sport }) => {
  return (
    <View>
      <Text className="text-white">{sport}</Text>
    </View>
  );
};

export default SelectedSport;
