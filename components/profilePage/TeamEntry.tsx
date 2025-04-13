import { useWindowDimensions, View } from "react-native";
import TextScallingFalse from "../CentralText";
import { Image } from "react-native";

const textColor = "#FFFFFF";
const secondaryTextColor = "#B2B2B2";
const dividerColor = "#454545";

const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const TeamEntry = ({ team }: any) => {
  const { width } = useWindowDimensions();
  // Dynamic scaling for responsiveness
  const containerWidth = width > 768 ? "50%" : "96%";
  const { width: screenWidth2 } = useWindowDimensions();
  const scaleFactor = screenWidth2 / 410;
  // console.log(team);
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      {/* Team Logo */}
      <Image
        source={{ uri: team.team.logo.url }}
        // source={{uri: "https://logowik.com/content/uploads/images/kolkata-knight-riders6292.jpg"}}
        style={{
          width: 60 * scaleFactor,
          height: 60 * scaleFactor,
          borderRadius: 100,
          borderWidth: 1.5,
          borderColor: "#1C1C1C",
          // marginRight: 10,
          marginBottom: 18,
        }}
      />
      {/* Team Details */}
      <View className="flex flex-col ml-5 items-start justify-between gap-2 py-3">
        <View className="flex flex-col">
          <TextScallingFalse
            style={{
              color: textColor,
              fontSize: 16,
              fontWeight: "700", // Bold
            }}
          >
            {team.team.name}
            {/* Kolkata Knight Riders */}
          </TextScallingFalse>
          <TextScallingFalse
            style={{
              color: secondaryTextColor,
              fontSize: 12,
              fontWeight: "300", // Regular
            }}
          >
            {team.location || "Location Not Available"}
            {/* Kolkata, West Bengal, India */}
          </TextScallingFalse>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            // gap:20,
            marginTop: 5,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              gap: 2,
              alignItems: "flex-start",
            }}
          >
            <TextScallingFalse
              style={{ color: textColor, fontSize: 12, fontWeight: "700" }}
            >
              Joined:{" "}
            </TextScallingFalse>
            <TextScallingFalse
              style={{ color: secondaryTextColor, fontSize: 12 }}
            >
              {team.creationDate || team.joiningDate
                ? `${
                    month[
                      new Date(team.creationDate || team.joiningDate).getMonth()
                    ]
                  }, ${new Date(
                    team.creationDate || team.joiningDate
                  ).getFullYear()}`
                : "NA"}
            </TextScallingFalse>
          </View>
          <View
            style={{
              width: 1,
              height: 30,
              backgroundColor: dividerColor,
              marginHorizontal: 20,
            }}
          />
          <View
            style={{
              flexDirection: "column",
              gap: 2,
              alignItems: "flex-start",
            }}
          >
            <TextScallingFalse
              style={{ color: textColor, fontSize: 12, fontWeight: "700" }}
            >
              Role:{" "}
            </TextScallingFalse>
            <TextScallingFalse
              style={{ color: secondaryTextColor, fontSize: 12 }}
            >
              {team.role || "NA"}
            </TextScallingFalse>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TeamEntry;
