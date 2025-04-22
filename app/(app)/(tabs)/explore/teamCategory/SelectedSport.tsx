import { View, Text } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import ComingSoon from "~/components/explorePage/comingSoon";
import DiscoverTeams from "~/components/discover/discoverTeamList";

interface SelectedSportProps {
  sportsName: string;
}

const SelectedSport: React.FC<SelectedSportProps> = ({ sportsName }) => {
  return <DiscoverTeams sport={sportsName} />;
};

export default SelectedSport;
