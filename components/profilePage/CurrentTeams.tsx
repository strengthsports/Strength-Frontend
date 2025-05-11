import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import TempLogo from "@/assets/images/teams/dummyteam.png";
import TextScallingFalse from "../CentralText";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";
import BackIcon from "../SvgIcons/Common_Icons/BackIcon";

// Type definitions
interface SportType {
  _id: string;
  name: string;
  logo: string;
}

interface TeamType {
  _id: string;
  name: string;
  logo: {
    url: string;
  };
  location?: string;
  role: string;
  position?: string;
  isCreator?: boolean;
  createdBy?: string;
}

interface AssociateType {
  team: TeamType;
  role: string;
  position?: string;
  location?: string;
}

interface SportIconProps {
  name: string;
  logo: string;
  selected: boolean;
  onPress: () => void;
}

interface TeamItemProps {
  name: string;
  location: string;
  role: string;
  isCaptain: boolean;
  logo: ImageSourcePropType;
  isVC: boolean;
}

const CurrentTeamsScreen = () => {
  const { user } = useSelector((state: RootState) => state.profile);

  // Define getFilteredTeams first
  const getFilteredTeams = (sportName: string): AssociateType[] => {
    const sport = user?.selectedSports?.find(
      (s: any) => s.sport?.name === sportName
    );
    if (!sport?.teams) return [];
    return sport.teams.filter((team: any) => {
      const isAdmin = team.role?.toLowerCase() === "admin";
      const isCreator = team.isCreator || team.createdBy === user?._id;
      return !isAdmin && !isCreator;
    });
  };

  // Process sports data
  const sportsData: SportType[] =
    user?.selectedSports
      ?.filter((sport: any) => {
        const teams = getFilteredTeams(sport.sport?.name);
        return teams.length > 0;
      })
      .map((sport: any) => ({
        id: sport.sport?._id,
        name: sport.sport?.name,
        logo: sport.sport?.logo,
      })) || [];

  // State management
  const [selectedSport, setSelectedSport] = useState<string>(
    sportsData[0]?.name || ""
  );

  // Get filtered teams for selected sport
  const filteredTeams = getFilteredTeams(selectedSport);

  // console.log("from current teams -------->", filteredTeams);

  // Sport Icon Component
  const SportIcon = ({ name, logo, selected, onPress }: SportIconProps) => {
    return (
      <TouchableOpacity
        style={[
          styles.sportIconContainer,
          selected && styles.selectedSportIcon,
        ]}
        onPress={onPress}
      >
        <View style={selected && styles.logoContainer}>
          <Image
            source={{ uri: logo }}
            style={[styles.sportLogo, selected && styles.selectedSportLogo]}
            resizeMode="contain"
          />
        </View>
        {selected && (
          <TextScallingFalse style={styles.sportText}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </TextScallingFalse>
        )}
      </TouchableOpacity>
    );
  };

  // Team Item Component
  const TeamItem = ({
    name,
    location,
    role,
    isCaptain,
    logo,
    isVC,
  }: TeamItemProps) => {
    return (
      <View style={styles.teamItem}>
        <Image source={logo} style={styles.teamLogo} />
        <View style={styles.teamInfo}>
          <TextScallingFalse style={styles.teamName}>{name}</TextScallingFalse>
          <TextScallingFalse style={styles.teamLocation}>
            {location}
          </TextScallingFalse>
          <View style={styles.roleContainer}>
            <TextScallingFalse style={styles.roleLabel}>
              Position:{" "}
            </TextScallingFalse>
            <TextScallingFalse style={styles.roleValue}>
              {role}
              {isCaptain && (
                <TextScallingFalse style={styles.positionLabel}>
                  {" "}
                  [ C ]
                </TextScallingFalse>
              )}
              {isVC && (
                <TextScallingFalse style={styles.positionLabel}>
                  {" "}
                  [ VC ]
                </TextScallingFalse>
              )}
            </TextScallingFalse>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.doneButton}>
    <TextScallingFalse style={styles.doneText}>Done</TextScallingFalse>
  </TouchableOpacity> */}
          </View>

          {/* Title */}
          <TextScallingFalse style={styles.title}>
            Current Teams
          </TextScallingFalse>
          <TextScallingFalse style={styles.subtitle}>
            Show your current teams, celebrate your sporting affiliations, and
            let the world know where you belong in the game.
          </TextScallingFalse>

          <View style={styles.contentContainer}>
            {/* Sport Selection */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.sportsContainer}
              contentContainerStyle={styles.sportsContentContainer}
            >
              {sportsData.map((sport) => (
                <SportIcon
                  key={sport._id}
                  name={sport.name}
                  logo={sport.logo}
                  selected={selectedSport === sport.name}
                  onPress={() => setSelectedSport(sport.name)}
                />
              ))}
              {sportsData.length === 0 && (
                <TextScallingFalse style={styles.noTeamsText}>
                  No sports with teams available
                </TextScallingFalse>
              )}
            </ScrollView>

            {/* Teams List */}
            <View style={styles.teamsContainer}>
              {filteredTeams.map((team, index) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/(app)/(team)/teams/${team.team._id}`)
                  }
                  activeOpacity={0.7}
                >
                  <React.Fragment key={team.team._id}>
                    <TeamItem
                      name={team.team.name}
                      logo={{ uri: team.team.logo.url }}
                      location={team.location || "Location Not Available"}
                      role={team.role.slice(0, -1) || "NA"}
                      isCaptain={team.position?.toLowerCase() === "captain"}
                      isVC={team.position?.toLowerCase() === "vicecaptain"}
                    />
                    {index < filteredTeams.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        {/* Add Button */}
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/(app)/(team)/teams")}
          >
            <TextScallingFalse style={styles.addButtonText}>
              Add{" "}
            </TextScallingFalse>
            <Ionicons name="add" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "auto",
    backgroundColor: "#000",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  doneButton: {
    padding: 4,
  },
  doneText: {
    color: "#2ecc71",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#A5A5A5",
    fontSize: 12,
    marginBottom: 24,
  },
  contentContainer: {
    backgroundColor: "#171717",
    borderRadius: 12,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  sportsContainer: {
    flexDirection: "row",
  },
  sportsContentContainer: {
    paddingBottom: 5,
  },
  sportIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#303030",
    backgroundColor: "transparent",
    marginRight: 12,
  },
  selectedSportIcon: {
    flexDirection: "row",
    width: "auto",
    borderRadius: 25,
    paddingHorizontal: 6,
    backgroundColor: "#313131",
  },
  logoContainer: {
    backgroundColor: "#171717",
    borderRadius: 50,
    padding: 8,
  },
  sportLogo: {
    width: 20,
    height: 20,
  },
  selectedSportLogo: {
    width: 15,
    height: 15,
  },
  sportText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "400",
    paddingRight: 5,
  },
  teamsContainer: {
    borderRadius: 12,
    marginTop: 14,
    marginBottom: 18,
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#303030",
  },
  teamItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 1,
  },
  teamLocation: {
    color: "#A7A7A7",
    fontSize: 12,
    marginBottom: 5,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleLabel: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  roleValue: {
    color: "#A7A7A7",
    fontSize: 12,
  },
  positionLabel: {
    color: "#A7A7A7",
    fontSize: 12,
  },
  divider: {
    height: 0.5,
    backgroundColor: "#3B3B3B",
    marginVertical: 10,
  },
  addButtonContainer: {
    marginTop: 15,
    alignItems: "flex-end",
    paddingHorizontal: 18,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  noTeamsText: {
    color: "#666",
    fontSize: 14,
    paddingHorizontal: 16,
  },
});

export default CurrentTeamsScreen;
