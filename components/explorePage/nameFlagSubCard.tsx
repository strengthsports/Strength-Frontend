import { View } from "moti";
import { StyleSheet, Text, Image } from "react-native";
import CountryFlag from "react-native-country-flag";
import { teamLogos } from "~/constants/teamLogos";

const NameFlagSubCard = ({
  flag,
  teamName,
}: {
  flag: string;
  teamName: string;
}) => {
  const teamLogo = teamLogos[flag]; // Fetch team logo if available
  const imgUrl = require("../../assets/images/IN.png");
  // console.log("teamName:", teamName);
  // console.log("teamLogo:", teamLogos[teamName]);

  return (
    <View style={styles.nameCard}>
      {/* Display country flag if it's not "Unknown", otherwise fallback to team logo */}
      {flag === teamName ? (
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: teamLogo }}
            style={styles.teamLogo}
            resizeMode="contain"
          />
        </View>
      ) : (
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: flag }}
            style={styles.teamLogo}
            resizeMode="contain"
          />
        </View>
      )}
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
  logoContainer: {
    width: 28,
    height: 21,
    borderRadius: 2,
  },
  teamLogo: {
    width: "100%",
    height: "100%",
  },
  teamName: {
    color: "white",
    fontSize: 13,
    textAlign: "center",
  },
  nameCard: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 2,
  },
});
