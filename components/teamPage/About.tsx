import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import Supporters from "~/components/SvgIcons/teams/Supporters";
import CustomButton from "~/constants/CustomButton";
import Members from "~/components/SvgIcons/teams/Members";
import EstabilishedOn from "~/components/SvgIcons/teams/EstabilishedOn";
import TeamId from "~/components/SvgIcons/teams/TeamId";
import CopyCode from "./CopyCode";
import TextScallingFalse from "../CentralText";
import { useFollow } from "~/hooks/useFollow";
import { FollowUser } from "~/types/user";

interface AboutProps {
  teamDetails: any;
}

const About: React.FC<AboutProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { user } = useSelector((state: RootState) => state.profile);
  const teamDetails = useSelector((state: RootState) => state.team.team);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [descriptionLines, setDescriptionLines] = useState(0);
  const { followUser, unFollowUser } = useFollow();

  //handle follow
  const handleFollow = async () => {
    try {
      const followData: FollowUser = {
        followingId: teamDetails?._id as string,
        followingType: "Team",
      };

      await followUser(followData, true);
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  //handle unfollow
  const handleUnfollow = async () => {
    try {
      const unfollowData: FollowUser = {
        followingId: teamDetails?._id as string,
        followingType: "Team",
      };

      await unFollowUser(unfollowData, true);
    } catch (err) {
      console.error("Unfollow error:", err);
    }
  };

  const handleSupportPress = () => {
    if (!teamDetails?._id || !user?._id) return;

    teamDetails.isSupporting ? handleUnfollow() : handleFollow();
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const onTextLayout = (e: any) => {
    setDescriptionLines(e.nativeEvent.lines.length);
  };

  const handleEstablished = () => {
    if (!teamDetails?.establishedOn) return "Not specified";

    const date = new Date(teamDetails.establishedOn);
    return date.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  };

  const handleTeamUniqueId = () => {
    const name = teamDetails?.name || "";
    const id = teamDetails?._id || "";
    return `${name.substring(0, 2).toUpperCase()}${id.slice(-4).toUpperCase()}`;
  };

  const handleCopySuccess = () => {
    setShowCopiedMessage(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCopiedMessage(false));
  };

  return (
    <ScrollView className="pb-[500px] bg-[#0B0B0B]">
      {/* Copied Message Animation */}
      {showCopiedMessage && (
        <Animated.View
          className="absolute top-20 left-0 right-0 items-center z-50"
          style={{ opacity: fadeAnim }}
        >
          <View className="bg-green-500 px-6 py-3 rounded-full">
            <Text className="text-white font-bold">Copied to clipboard!</Text>
          </View>
        </Animated.View>
      )}

      <View className="p-6 bg-[#0B0B0B] rounded-lg">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center">
            <Supporters />
            <Text className="text-white text-3xl ml-3 font-bold">
              {teamDetails?.supporterCount || 0}
            </Text>
            <Text className="text-[#9C9C9C] text-4xl font-medium ml-1">
              Supporters
            </Text>
          </View>

          <CustomButton
            buttonName={
              teamDetails?.isSupporting ? "✓ Supporting" : "+ Support"
            }
            onPress={handleSupportPress}
          />
        </View>

        <TextScallingFalse className="text-[#CECECE] pt-8 text-5xl font-bold mb-2">
          Description
        </TextScallingFalse>
        <View>
          <TextScallingFalse
            className="text-[#CECECE] text-[14px] mr-3"
            numberOfLines={showFullDescription ? undefined : 4}
            onTextLayout={onTextLayout}
          >
            {teamDetails?.description || "No description available"}
          </TextScallingFalse>
          {!showFullDescription && descriptionLines > 3 && (
            <TouchableOpacity onPress={toggleDescription}>
              <Text className="text-[#818181] text-xl mt-1">See More</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="p-2 ml-3 bg-[#0B0B0B] flex flex-row items-center">
        <Members />
        <Text className="text-[#CECECE] text-3xl ml-3">
          Members - {teamDetails?.members?.length || 0}
        </Text>
      </View>

      <View className="p-2 ml-3 bg-[#0B0B0B] flex flex-row items-center">
        <EstabilishedOn />
        <Text className="text-[#CECECE] text-3xl ml-3">
          Established On - {handleEstablished()}
        </Text>
      </View>

      <View className="p-2 ml-3 flex flex-row items-center">
        <TeamId />
        <Text className="text-[#CECECE] text-3xl ml-2">
          {" "}
          Team unique ID - {handleTeamUniqueId()}
        </Text>
        <CopyCode code={handleTeamUniqueId()} onCopy={handleCopySuccess} />
      </View>
    </ScrollView>
  );
};

export default About;
