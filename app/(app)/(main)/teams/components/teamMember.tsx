import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { ThemedText } from "~/components/ThemedText";

type TeamMemberProps = {
  imageUrl?: string; // URL for the profile image (optional)
  name: string; // Name of the person (required)
  description: string; // Description or subtitle (required)
  isCaptain?: boolean; // Indicates if the person is a captain (optional)
  isViceCaptain?: boolean; // Indicates if the person is a vice-captain (optional)
  isAdmin?: boolean; // Indicates if the current user is an admin (optional)
  onRemove?: () => void; // Callback for removing the member (optional)
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
    <View
      className="bg-black p-4 rounded-lg items-center shadow-md border border-gray-700 relative"
      style={{
        width: 170, // Fixed width for each card
        height: 180, // Adjusted height for the card
        justifyContent: "space-between", // Space out the content
      }}
    >
      {/* Profile Image */}
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          className="h-20 w-20 rounded-full mb-3"
          resizeMode="cover"
        />
      )}

      {/* Captain or Vice-Captain Badge */}
      {(isCaptain || isViceCaptain) && (
        <Text className="absolute top-2 left-2 bg-[#303030] text-[#fff] px-2 py-1 rounded-lg text-xs font-bold">
          {isCaptain ? "C" : "VC"}
        </Text>
      )}

      {/* Name */}
      <Text className="text-white text-lg font-semibold mb-1">{name}</Text>

      {/* Description */}
      <Text className="text-gray-400 text-sm text-center">{description}</Text>

      {/* Remove Button */}
      {isAdmin && onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          className="absolute top-2 right-2 rounded-full p-1"
        >
          <Icon name="cross" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TeamMember;
