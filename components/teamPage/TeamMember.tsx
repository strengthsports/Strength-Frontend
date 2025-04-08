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
            {isCaptain ? "C" : "VC"}
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

      {/* Remove Button */}
      {isAdmin && onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Icon name="cross" size={16} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0004",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
    width: 170,
    height: 200,
    borderWidth: 0.2,
    borderColor: "#4B5563", // Tailwind: border-gray-700
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  image: {
    height: 94,
    width: 94,
    borderRadius: 100,
    marginTop: 8,
    marginBottom: 8,
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
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
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  description: {
    color: "#9CA3AF",
    fontSize: 12,
    textAlign: "center",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
    borderRadius: 9999,
    backgroundColor: "#1F2937", // Tailwind: bg-gray-800
  },
});

export default TeamMember;
