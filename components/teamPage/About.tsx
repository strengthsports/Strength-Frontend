import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Animated, Easing, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import Supporters from "~/components/SvgIcons/teams/Supporters";
import CustomButton from "~/constants/CustomButton";
import Members from "~/components/SvgIcons/teams/Members";
import EstabilishedOn from "~/components/SvgIcons/teams/EstabilishedOn";
import TeamId from "~/components/SvgIcons/teams/TeamId";
import CopyCode from "./CopyCode";
import TextScallingFalse from "../CentralText";
import { 
  supportTeam, 
  unsupportTeam, 
  checkSupportStatus,
  clearSupportError
} from "../../reduxStore/slices/team/teamSlice";
import { selectIsSupporting, selectSupporterCount, selectSupportError } from "../../reduxStore/slices/team/teamSlice";
import { useFollow } from "~/hooks/useFollow";
import { FollowUser } from "~/types/user";

interface AboutProps {
  teamDetails: any;
}

const About: React.FC<AboutProps> = ({ teamDetails }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { user } = useSelector((state: RootState) => state.profile);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [descriptionLines, setDescriptionLines] = useState(0);
  const { followUser, unFollowUser } = useFollow();
  
  // Redux state
  const isSupporting = useSelector(selectIsSupporting);
  const supporterCount = useSelector(selectSupporterCount);
  const supportError = useSelector(selectSupportError);
  
  // Local UI state for instant updates
  const [instantSupportState, setInstantSupportState] = useState({
    isSupporting: teamDetails?.isSupporting,
    count: supporterCount
  });

  //handle follow
    const handleFollow = async () => {
      try {
        const followData: FollowUser = {
          followingId: teamDetails._id,
          followingType: "Team",
        };
  
        await followUser(followData,true);
      } catch (err) {
        console.error("Follow error:", err);
      }
    };
  
    //handle unfollow
    const handleUnfollow = async () => {
      try {
        const unfollowData: FollowUser = {
          followingId: teamDetails._id,
          followingType: "Team",
        };
  
        await unFollowUser(unfollowData,true);
      } catch (err) {
        console.error("Unfollow error:", err);
      }
    };

  useEffect(() => {
    if (teamDetails?._id && user?._id) {
      dispatch(checkSupportStatus(teamDetails._id));
    }
  }, [teamDetails?._id, user?._id, dispatch]);

  useEffect(() => {
    // Sync with Redux when data changes
    setInstantSupportState({
      isSupporting: teamDetails?.isSupporting,
      count: supporterCount
    });
  }, [teamDetails?.isSupporting, supporterCount]);

  useEffect(() => {
    if (supportError) {
      console.error("Support Error:", supportError);
      // Revert if error occurs
      setInstantSupportState({
        isSupporting: !instantSupportState.isSupporting,
        count: instantSupportState.isSupporting ? 
          instantSupportState.count - 1 : 
          instantSupportState.count + 1
      });
      dispatch(clearSupportError());
    }
  }, [supportError, dispatch]);

  const handleSupportPress = () => {
    if (!teamDetails?._id || !user?._id) return;
    
    // Instant UI update
    const newSupportState = !instantSupportState.isSupporting;
    setInstantSupportState({
      isSupporting: newSupportState,
      count: newSupportState ? 
        instantSupportState.count + 1 : 
        instantSupportState.count - 1
    });

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
              {instantSupportState.count || 0}
            </Text>
            <Text className="text-[#9C9C9C] text-4xl font-medium ml-1">
              Supporters
            </Text>
          </View>
          
          <CustomButton
            buttonName={instantSupportState.isSupporting || teamDetails?.isSupporting ? "✓ Supporting" : "+ Support"}
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
        <Text className="text-[#CECECE] text-3xl ml-3">Members - {teamDetails?.members?.length || 0}</Text>
      </View>

      <View className="p-2 ml-3 bg-[#0B0B0B] flex flex-row items-center">
        <EstabilishedOn />
        <Text className="text-[#CECECE] text-3xl ml-3">
          Established On - {handleEstablished()}
        </Text>
      </View>

      <View className="p-2 ml-3 flex flex-row items-center">
        <TeamId />
        <Text className="text-[#CECECE] text-3xl ml-2"> Team unique ID - {handleTeamUniqueId()}</Text>
        <CopyCode code={handleTeamUniqueId()} onCopy={handleCopySuccess} />
      </View>
    </ScrollView>
  );
};

export default About;