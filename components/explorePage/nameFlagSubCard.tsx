import { View } from "moti";
import { StyleSheet, Text, Image } from "react-native";
import CountryFlag from "react-native-country-flag";
import teamLogos from "~/constants/teamLogos";

const NameFlagSubCard = ({
  flag,
  teamName,
}: {
  flag: string;
  teamName: string;
}) => {
  const teamLogo = teamLogos[teamName]; // Fetch team logo if available

  return (
    <View style={styles.nameCard}>
      {/* Display country flag if it's not "Unknown", otherwise fallback to team logo */}
      {flag !== "Unknown" ? (
        <CountryFlag isoCode={flag} size={14} style={styles.countryFlag} />
      ) : teamLogo ? (
        <Image source={teamLogo} style={styles.teamLogo} resizeMode="contain" />
      ) : null}
      <Text style={styles.teamName}>{teamName}</Text>
    </View>
  );
};

export default NameFlagSubCard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  countryFlag: { borderRadius: 2 },
  teamLogo: {
    width: 26,
    height: 26,
    borderRadius: 12,
  },
  teamName: {
    color: "white",
    fontSize: 11,
    textAlign: "center",
  },
  nameCard: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
