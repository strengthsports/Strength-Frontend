import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Nopic from "@/assets/images/nopic.jpg";
import Captain from "../SvgIcons/teams/Captain";
import ViceCaptain from "../SvgIcons/teams/ViceCaptain";

type TeamMemberProps = {
  imageUrl?: string;
  name: string;
  description: string;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  isAdmin?: boolean;
  onRemove?: () => void;
};

const TeamMember: React.FC<TeamMemberProps> = ({
  imageUrl,
  name,
  description,
  isCaptain = false,
  isViceCaptain = false,
  isAdmin = false,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <Image
        source={imageUrl ? { uri: imageUrl } : Nopic}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Badge */}
      {(isCaptain || isViceCaptain) && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {isCaptain ? <Captain/> : <ViceCaptain/>}
          </Text>
        </View>
      )}

      {/* Name */}
      <Text
        style={styles.name}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {name}
      </Text>

      {/* Description */}
      <Text
        style={styles.description}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {description}
      </Text>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "space-between",
    width: 170,
    height: 202,
    borderWidth: 1,
    borderColor: "#272727",
  
    position: "relative",
    // shadowColor: "#000",
    // shadowOpacity: 1,
    // shadowRadius: 4,
    // shadowOffset: { width: 0, height: 2 },
    // elevation: 4,
  },
  image: {
    height: 92,
    width: 92,
    borderRadius: 100,
    marginTop: 8,
    marginBottom: 8,
  },
  badge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#00000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  name: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom:-10,
    
  },
  description: {
    color: "#717171",
    fontSize: 12,
    textAlign: "center",

    
  },
  
});

export default TeamMember;
