import { View, Text } from "react-native";
import React from "react";
import ComingSoon from "~/components/explorePage/comingSoon";

interface SelectedSportProps {
  sportsName: string;
}

const SelectedSport: React.FC<SelectedSportProps> = ({ sportsName }) => {
  const commingSoontext = `${sportsName} clips`;
  return (
    <View>
      <ComingSoon text={commingSoontext} />
    </View>
  );
};

export default SelectedSport;
