import { View, Text } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import ComingSoon from "~/components/explorePage/comingSoon";
import DiscoverTeams from "~/components/discover/discoverTeamList";

interface SelectedSportProps {
  sportsName: string;
}

const SelectedSport: React.FC<SelectedSportProps> = ({ sportsName }) => {
  return <DiscoverTeams sport="6771941c77a19c8141f2f1b7" />;
};

export default SelectedSport;
