import TextScallingFalse from "../CentralText";
import CountryFlag from "react-native-country-flag";
import { Image, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { countryCodes } from "~/constants/countryCodes";

interface MatchCardProps {
  match: {
    id: string;
    series: string;
    matchType: string;
    t1: string;
    t1s: string;
    t2: string;
    t2s: string;
    status: string;
    tournamentImg?: string;
  };
  isLive?: boolean;
}

const NextMatchCard = ({ match }: MatchCardProps) => {
  const [numberOfLinesTitle, setNumberOfLinesTitle] = useState(1);
  const toggleNumberOfLines = () => {
    setNumberOfLinesTitle((prev) => (prev === 1 ? 2 : 1));
  };
  const convertToIST = (gmtDateTime : string | Date) => {
    const gmtDate = new Date(gmtDateTime);

    if (isNaN(gmtDate.getTime())) {
      return "Match time loading...";
    }

    // Calculate IST offset (+5 hours 30 minutes in milliseconds)
    const istOffset = 5.5 * 60 * 60 * 1000;

    // Convert GMT to IST by adding the offset
    const istDate = new Date(gmtDate.getTime() + istOffset);

    // Get the current date in IST for comparison
    const currentDate = new Date();
    const currentISTDate = new Date(currentDate.getTime() + istOffset);

    // Reset time for date comparison
    const today = new Date(currentISTDate.setHours(0, 0, 0, 0));
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Extract components of the IST date
    const hours = istDate.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = String(istDate.getMinutes()).padStart(2, "0");
    const amPm = istDate.getHours() >= 12 ? "PM" : "AM";

    const day = String(istDate.getDate()).padStart(2, "0");
    const month = String(istDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = istDate.getFullYear();

    // Determine if the date is today, tomorrow, or beyond
    let dateLabel;
    if (istDate >= today && istDate < tomorrow) {
      dateLabel = "Today";
    } else if (
      istDate >= tomorrow &&
      istDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
    ) {
      dateLabel = "Tomorrow";
    } else {
      dateLabel = `${day}/${month}/${year}`;
    }

    return `${dateLabel} • ${hours}:${minutes} ${amPm}`;
  };
  const getCountryCode = (teamName: string) => countryCodes[teamName as keyof typeof countryCodes] || "Unknown";
  return (<>
    {/* <View className="w-full h-full rounded-t-2xl bg-neutral-700" > */}

    {/* Title Section */}
    <View className="px-4 pt-4 mt-[0.7] pb-2 w-full h-20 rounded-t-2xl bg-neutral-800">
      <TouchableOpacity
        className="flex-row items-center w-4/5 gap-2"
        onPress={toggleNumberOfLines}
      >
        {match?.tournamentImg && (
          <View className="p-1 rounded-md">
            <Image
              source={{ uri: match?.tournamentImg }}
              className="w-8 h-8 rounded-md self-center"
            />
          </View>
        )}
        <TextScallingFalse
          className="text-white text-3xl w-4/5"
          numberOfLines={numberOfLinesTitle}
          ellipsizeMode="tail"
        >
          {match.series}
        </TextScallingFalse>
      </TouchableOpacity>

      {/* Game Type and Round */}
      <View className="flex-row items-center p-1">
        <TextScallingFalse className="text-theme text-base font-bold">
          {"\u25B6"} Cricket </TextScallingFalse>
        <TextScallingFalse className="text-[#9E9E9E] text-base uppercase">{" \u2022 "} {match.matchType}
        </TextScallingFalse>
      </View>
    </View>

      <View className=" h-36 flex-row justify-center items-center pb-4">
        {/* view 1 */}
        <View className="items-center justify-center flex-1">
          {getCountryCode(match?.t1) !== "Unknown" && (
            <CountryFlag
              isoCode={getCountryCode(match?.t1)}
              size={24}
              className="rounded mb-2"
            // style={{ borderRadius: 2, marginBottom: 12 }}
            />
          )}
          <TextScallingFalse className="text-white w-24 text-center text-base">{match?.t1}</TextScallingFalse>
          {/* <TextScallingFalse className="text-white text-center text-base">{match?.t1}</TextScallingFalse> */}
        </View>

        {/* view 2 */}
        <View className="items-center flex-1">
          <TextScallingFalse className="text-white font-bold text-7xl">VS</TextScallingFalse>
          <TextScallingFalse className="absolute top-[64px]  text-neutral-300 text-center text-base">{convertToIST(match?.dateTimeGMT)}</TextScallingFalse>
        </View>

        {/* view 3 */}
        <View className="items-center flex-1">
          {getCountryCode(match?.t2) !== "Unknown" && (
            <CountryFlag
              isoCode={getCountryCode(match?.t2)}
              size={24}
              className="rounded mb-2"
            // style={{ borderRadius: 2, marginBottom: 12 }}
            />
          )}
          <TextScallingFalse className="text-white w-24 text-center text-base">{match?.t2}</TextScallingFalse>
        </View>
      </View>

    {/* <TextScallingFalse className="text-white text-center text-base mb-2">{match?.t1}</TextScallingFalse> */}


  </>)
}
export default NextMatchCard