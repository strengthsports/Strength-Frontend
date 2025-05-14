import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet
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
import {
  toggleIsSupporting,
  toggleSupporterCount,
} from "~/reduxStore/slices/team/teamSlice";
import BackIcon from "../SvgIcons/Common_Icons/BackIcon";
import UserList from "../ui/UserList";

const { height } = Dimensions.get('window');

const About = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { user } = useSelector((state: RootState) => state.profile);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    team: teamDetails,
    supporterCount,
    isSupporting,
  } = useSelector((state: RootState) => state.team);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [descriptionLines, setDescriptionLines] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { followUser, unFollowUser } = useFollow();

  const modalAnim = useRef(new Animated.Value(height)).current;

  const toggleModal = () => {
    if (isModalVisible) {
      Animated.timing(modalAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsModalVisible(false));
    } else {
      setIsModalVisible(true);
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSupportPress = async () => {
    if (!teamDetails?._id || !user?._id || isProcessing) return;
    
    setIsProcessing(true);
    const wasSupporting = isSupporting;
    
    try {
      dispatch(toggleIsSupporting(!wasSupporting));
      dispatch(toggleSupporterCount(wasSupporting ? -1 : 1));
      
      const followData: FollowUser = {
        followingId: teamDetails._id,
        followingType: "Team",
      };

      if (wasSupporting) {
        await unFollowUser(followData, true);
      } else {
        await followUser(followData, true);
      }
    } catch (err) {
      // Revert state if there's an error
      dispatch(toggleIsSupporting(wasSupporting));
      dispatch(toggleSupporterCount(wasSupporting ? 1 : -1));
      console.error("Support toggle error:", err);
    } finally {
      setIsProcessing(false);
    }
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
    <View style={{ flex: 1 }}>
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
            <TouchableOpacity 
              className="flex flex-row items-center"
              onPress={toggleModal}
            >
              <Supporters />
              <Text className="text-white text-3xl ml-3 font-bold">
                {supporterCount || 0}
              </Text>
              <Text className="text-[#9C9C9C] text-4xl font-medium ml-1">
                Supporters
              </Text>
            </TouchableOpacity>

            <CustomButton
              buttonName={isSupporting ? "✓ Supporting" : "+ Support"}
              onPress={handleSupportPress}
              disabled={isProcessing}
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

        <View className="p-2 ml-4 bg-[#0B0B0B] flex flex-row items-center">
          <Members />
          <Text className="text-[#CECECE] text-3xl ml-3">
            Members - {teamDetails?.members?.length || 0}
          </Text>
        </View>

        <View className="p-2 ml-4 bg-[#0B0B0B] flex flex-row items-center">
          <EstabilishedOn />
          <Text className="text-[#CECECE] text-3xl ml-3">
            Established On - {handleEstablished()}
          </Text>
        </View>

        <View className="p-2 ml-4 flex flex-row items-center">
          <TeamId />
          <Text className="text-[#CECECE] text-3xl ml-2">
            Team unique ID - {handleTeamUniqueId()}
          </Text>
          <CopyCode code={handleTeamUniqueId()} onCopy={handleCopySuccess} />
        </View>
      </ScrollView>

      {/* Full Screen Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalAnim }] }
            ]}
          >
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={toggleModal}
            >
              <BackIcon width={24} height={24} fill="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Team Supporters</Text>
            
            <ScrollView style={styles.supporterList}>
              <UserList targetId={teamDetails?._id} type="Followers" />
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: 'black',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  supporterList: {
    flex: 1,
  },
});

export default About;