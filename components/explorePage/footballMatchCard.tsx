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

const FootballNextMatchCard = ({ match }: MatchCardProps) => {
  const [numberOfLinesTitle, setNumberOfLinesTitle] = useState(1);
  const toggleNumberOfLines = () => {
    setNumberOfLinesTitle((prev) => (prev === 1 ? 2 : 1));
  };
  const getCountryCode = (teamName: string) => countryCodes[teamName as keyof typeof countryCodes] || "Unknown";
  return (<>
    {/* <View className="w-full h-full rounded-t-2xl bg-neutral-700" > */}

    {/* Title Section */}
    <View className="px-4 pt-4 mt-[0.7] pb-2 w-full h-20 rounded-t-2xl bg-transparent">
      <TouchableOpacity
        className="flex-row items-center w-4/5 gap-2"
        onPress={toggleNumberOfLines}
      >
        {match?.tournamentImg && (
          <View className="p-1 rounded-md">
            <Image
              source={{ uri: match?.competition?.emblem }}
              className="w-8 h-8 rounded-md self-center"
            />
          </View>
        )}
        <View className="w-4/5 flex-row items-center ">
            <TextScallingFalse className="text-white text-3xl uppercase">{match.area.name} - </TextScallingFalse>
            <TextScallingFalse
            className="text-white text-3xl w-4/5"
            numberOfLines={numberOfLinesTitle}
            ellipsizeMode="tail"
            >{match.competition.name} </TextScallingFalse>
            
        </View>
      </TouchableOpacity>

      {/* Game Type and Round */}
      <View className="flex-row items-center p-1">
        <TextScallingFalse className="text-theme text-base font-bold">
          {"\u25B6"} Football </TextScallingFalse>
        <TextScallingFalse className="text-[#9E9E9E] text-base uppercase">{" \u2022 "} {match.competition.type}
        </TextScallingFalse>
      </View>
    </View>
            <View className="h-[0.8] bg-neutral-700" />

      <View className=" h-36 flex-row justify-center items-center pb-4">
        {/* view 1 */}
        <View className="items-center justify-center flex-1">
          <Image
                source={{uri: match.homeTeam.crest}}
                style={{ width: 32, height: 32, marginBottom:8 }}
              />
          <TextScallingFalse className="text-white w-24 text-center text-base">{match.homeTeam.name}</TextScallingFalse>
          {/* <TextScallingFalse className="text-white text-center text-base">{match?.t1}</TextScallingFalse> */}
        </View>

        {/* view 2 */}
        <View className="items-center flex-1">
          <TextScallingFalse className="text-white font-bold text-7xl">VS</TextScallingFalse>
          <TextScallingFalse className="absolute top-[64px]  text-neutral-300 text-center self-center text-base"> 
            {match.score?.fullTime?.home !== null && match.score?.fullTime?.away !== null
                ? 'FULL TIME'
                : match.score?.halfTime?.home !== null && match.score?.halfTime?.away !== null
                ? '1ST HALF'
                : 'NO SCORE'}
            </TextScallingFalse>
        </View>

        {/* view 3 */}
        <View className="items-center flex-1">
        <Image
                source={{uri: match.awayTeam.crest}}
                style={{ width: 32, height: 32, marginBottom:8 }}
              />
          <TextScallingFalse className="text-white w-24 text-center text-base">{match.awayTeam.name}</TextScallingFalse>
        </View>
      </View>

    {/* <TextScallingFalse className="text-white text-center text-base mb-2">{match?.t1}</TextScallingFalse> */}


  </>)
}
export default FootballNextMatchCard