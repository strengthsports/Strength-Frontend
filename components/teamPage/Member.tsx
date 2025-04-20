import React from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

interface MemberCardProps {
  imageUrl: string; // URL of the profile image
  name: string; // Name of the member
  description: string; // Description of the member
  // If the member is the vice-captain
  isAdmin?: boolean; // If the user is an admin
  onRemove?: () => void; // Function to remove the member (if admin)
  onPress: () => void; // Function when the card is pressed
}

const MemberCard: React.FC<MemberCardProps> = ({
  imageUrl,
  name,
  description,
  isAdmin,
  onRemove,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-black p-4 h-[200px] rounded-lg  items-center shadow-lg border border-[#515151] relative"
      style={{
        width: 170, 
        
        marginHorizontal: 6,
        marginBottom: 6,
      }}
    >
      {/* Profile Image */}
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          className="h-20 w-20 rounded-full mb-3 mt-6"
          resizeMode="cover"
        />
      )}
      {/* Name */}
      <Text className="text-white text-2xl font-semibold mb-1">{name}</Text>

      {/* Description */}
      <Text className="text-gray-400 text-lg text-center">{description}</Text>

      {/* Remove Button (Visible only if the user is an admin) */}
      {isAdmin && onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          className="absolute top-2 right-2 rounded-full p-1"
        >
          <Icon name="cross" size={20} color="white" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default MemberCard;
