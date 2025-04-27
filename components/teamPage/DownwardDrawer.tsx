import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
} from "react-native";
import { BlurView } from "expo-blur";
import Captain from "../SvgIcons/teams/Captain";
import CaptainSq from "../SvgIcons/teams/CaptainSq";
import ViceCaptainSq from "../SvgIcons/teams/ViceCaptainSq";

const DownwardDrawer = ({ visible, onClose, member , team }: any) => {
  const screenHeight = Dimensions.get("window").height;
  const profilePic = member?.user?.profilePic || "https://via.placeholder.com/150";
  const [isFollowing, setIsFollowing] = useState(false);
  const translateY = new Animated.Value(0);
//  console.log("Member Model coming data ----->",member);
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  

  

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };



  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Blur Background */}
        <BlurView intensity={0} style={styles.blurBackground}>
          <TouchableOpacity style={styles.overlay} onPress={onClose} />
        </BlurView>

        {/* Drawer */}
        <Animated.View
          style={[styles.drawer, { height: screenHeight / 2, transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.profileContainer}>
            <Image source={{ uri: profilePic }} style={styles.profileImage} />
            
          </View>
          <View>
            <View className="flex-row">
              <Text style={styles.memberName} className="pr-3">
                {member?.user?.firstName} {member?.user?.lastName}
              </Text>
              
              {(member?.position == "Captain"|| member?.position == "captain") && <CaptainSq />}
              {(member?.position == "ViceCaptain"|| member?.position == "vicecaptain") && <ViceCaptainSq/>}
              </View>
              <Text style={styles.memberDescription}>
                {member?.user?.headline || "No description available"}
              </Text>
            </View>

          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            {/* Follow / Following Button */}
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={handleFollowToggle}
            >
              <Text
                style={[styles.followButtonText, isFollowing && styles.followingText]}
              >
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>

            {/* View Profile Button */}
            <TouchableOpacity style={styles.viewProfileButton}>
              <Text style={styles.viewProfileText}>View Profile</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Role</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>{member?.role}</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Position</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>{member?.position}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    // marginTop: 20,
    flex: 1,
    justifyContent: "flex-end",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawer: {
    width: "100%",
    backgroundColor: "#1C1D23",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop:10,
    marginBottom: 10,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    marginLeft:3,
    // borderWidth: 2,
    // borderColor: "white",
  },
  memberName: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  memberDescription: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  followButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: "#12956B",
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  followButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  followingButton: {
    backgroundColor: "#12956B",
  },
  followingText: {
    color: "white",
  },
  viewProfileButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: "#1C1D23",
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    borderColor: "#12956B",
  },
  viewProfileText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
    marginTop: 18,
    marginLeft:6
  },
  closeButton: {
    marginTop:3,
    marginLeft:0,
    padding: 18,
    paddingHorizontal:17,
    backgroundColor: "#141414",
    borderRadius: 8,
    alignItems: "flex-start",
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
});

export default DownwardDrawer;