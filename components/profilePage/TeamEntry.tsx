import { TouchableOpacity, useWindowDimensions, View } from "react-native";
import TextScallingFalse from "../CentralText";
import { Image } from "react-native";
import { router } from "expo-router";

const textColor = "#FFFFFF";
const secondaryTextColor = "#B2B2B2";
const dividerColor = "#454545";

const TeamEntry = ({ team }: any) => {
  const { width } = useWindowDimensions();
  // Dynamic scaling for responsiveness
  const containerWidth = width > 768 ? "50%" : "96%";
  const { width: screenWidth2 } = useWindowDimensions();
  const scaleFactor = screenWidth2 / 410;
  const isCaptain = team.position === "Captain";
  const isVC = team.position === "ViceCaptain";
  // console.log("team entry ---->", team.team._id);
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
      onPress={() => {
        router.push(`/(app)/(team)/teams/${team.team._id}`);
      }}
      activeOpacity={0.7}
    >
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
          marginTop: 2,
        }}
      />

      {/* Team Details */}
      <View className="flex flex-col ml-5 items-start gap-2 justify-between py-3">
        <View className="flex flex-col" style={{ maxWidth: 250 }}>
          <TextScallingFalse
            style={{
              color: textColor,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {team.team.name}
            {/* Kolkata Knight Riders */}
          </TextScallingFalse>
          <TextScallingFalse
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: secondaryTextColor,
              marginTop: 2,
              fontSize: 12,
              fontWeight: "400",
              overflow: "hidden",
            }}
          >
            {team.team.address.city}
            {", "}
            {team.team.address.state}
            {", "}
            {team.team.address.country}
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
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 2,
              alignItems: "flex-start",
            }}
          >
            <TextScallingFalse
              style={{ color: textColor, fontSize: 12, fontWeight: "semibold" }}
            >
              Position:{" "}
            </TextScallingFalse>
            <TextScallingFalse
              style={{ color: secondaryTextColor, fontSize: 12 }}
            >
              {team.role.slice(0, -1) || "NA"}{" "}
            </TextScallingFalse>
            {isCaptain && (
              <TextScallingFalse
                style={{ color: secondaryTextColor, fontSize: 12 }}
              >
                [ C ]
              </TextScallingFalse>
            )}
            {isVC && (
              <TextScallingFalse
                style={{ color: secondaryTextColor, fontSize: 12 }}
              >
                [ VC ]
              </TextScallingFalse>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TeamEntry;
