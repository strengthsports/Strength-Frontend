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
  const imgUrl = require("../../assets/images/IN.png");

  return (
    <View style={styles.nameCard}>
      {/* Display country flag if it's not "Unknown", otherwise fallback to team logo */}
      {flag === "" ? (
        <View style={styles.logoContainer}>
          <Image source={imgUrl} style={styles.teamLogo} resizeMode="contain" />
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
    width: 27,
    height: 20,
    borderRadius: 2,
  },
  teamLogo: {
    width: "100%",
    height: "100%",
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
