import { View } from "moti";
import { StyleSheet, Text } from "react-native";
import CountryFlag from "react-native-country-flag";

const NameFlagSubCard = ({ flag, teamName }) => {
  return (
    <View style={styles.badmintonScores}>
      {flag !== "Unknown" ? (
        <CountryFlag
          isoCode={flag}
          size={18}
          style={{ borderRadius: 2 }}
        />
      ) : (
        <></>
      )}
      <Text style={styles.otherSportsTeamName}>{teamName}</Text>
    </View>
  );
};

export default NameFlagSubCard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  exploreText: {
    marginLeft: 20,
    marginTop: 5,
    fontSize: 22,
    color: "white",
    fontWeight: "500",
  },
  plusIcon: {
    marginLeft: 230,
    marginTop: 11,
  },
  messageIcon: {
    marginTop: 11,
    marginLeft: 8,
  },
  centeredScrollView: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  scrollViewContent: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  categoryText: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    fontSize: 12,
    overflow: "hidden",
  },
  underline: {
    width: "68%",
    height: 4,
    backgroundColor: "#12956B",
    marginHorizontal: 20,
    alignSelf: "center",
    borderRadius: 5,
  },
  contentSection: {
    marginTop: 20,
  },
  comingSoonContainer: {
    alignItems: "center",
    marginVertical: "30%",
  },
  gradientCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#181818",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#12956B",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  comingSoonText: {
    width: 350,
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    paddingEnd: 22,
    marginTop: 13,
  },

  teamName: {
    color: "white",
    fontSize: 11,
    textAlign: "center",
  },
  otherSportsTeamName: {
    color: "white",
    fontSize: 12,
  },
  otherSportsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginLeft: 16,
    marginRight: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  badmintonScores: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  cricketNextMatchInteriorColoumn: {
    alignItems: 'center',
    flex: 1,
    marginTop: 12
  },
  footballInteriorColoumn: {
    alignItems: 'center',
    flex: 1,
  },
  scoreText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  halfText: {
    color: "grey",
    fontSize: 8,
    marginTop: 4,
  },
  timeText: {
    color: "grey",
    fontSize: 8,
  },
});