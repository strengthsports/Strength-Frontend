import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

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
        width: 170,
        height: 180,
        justifyContent: "space-between",
      }}
    >
      {/* Profile Image */}
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          className="h-16 w-16 rounded-full mb-2"
          resizeMode="cover"
        />
      )}

      {/* Captain or Vice-Captain Badge */}
      {(isCaptain || isViceCaptain) && (
        <View className="absolute top-2 left-2 bg-[#303030] px-2 py-1 rounded-lg">
          <Text className="text-white text-xs font-bold">
            {isCaptain ? "C" : "VC"}
          </Text>
        </View>
      )}

      {/* Name - with numberOfLines to prevent overflow */}
      <Text
        className="text-white text-3xl font-semibold text-center"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {name}
      </Text>

      {/* Description - with numberOfLines to prevent overflow */}
      <Text
        className="text-gray-400 text-lg text-center"
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {description}
      </Text>

      {/* Remove Button */}
      {isAdmin && onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          className="absolute top-2 right-2 rounded-full p-1 bg-gray-800"
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Icon name="cross" size={16} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TeamMember;
