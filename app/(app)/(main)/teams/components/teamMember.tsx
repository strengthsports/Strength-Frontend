import React from "react";
import { View, Text, Image } from "react-native";

type TeamMemberProps = {
  imageUrl?: string; // URL for the profile image (optional)
  name: string; // Name of the person (required)
  description: string; // Description or subtitle (required)
};

const TeamMember: React.FC<TeamMemberProps> = ({
  imageUrl,
  name,
  description,
}) => {
  return (
    <View
      className="bg-black p-4 rounded-lg items-center shadow-md border border-gray-700"
      style={{
        width: 160, // Fixed width for each card
        height: 200, // Fixed height for each card
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

      {/* Name */}
      <Text className="text-white text-lg font-semibold mb-1">{name}</Text>

      {/* Description */}
      <Text className="text-gray-400 text-sm text-center">{description}</Text>
    </View>
  );
};

export default TeamMember;
