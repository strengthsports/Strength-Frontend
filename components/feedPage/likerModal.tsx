import React, { memo } from "react";
import { View, Text } from "react-native";
import { Divider } from "react-native-elements";
import { useFetchLikersQuery } from "~/reduxStore/api/likerApi";

interface LikersListProps {
  targetId: string;
  targetType: string;
}

const LikerModal = memo(({targetId, targetType} : LikersListProps) => {
  const { data, error, isLoading } = useFetchLikersQuery({ targetId, targetType });

  if (isLoading) return <Text className="text-white">Loading...</Text>;
  if (error){
      console.log(error)
      return <Text className="text-white">Error fetching likers</Text>;
  }

  // Console log the likers list
  if (data) {
    console.log("Likers List:", data.data);
  }

  return (
    <View className="h-80 w-full bg-neutral-900 rounded-t-3xl p-4">
    <Divider
      className="w-16 self-center rounded-full bg-neutral-700 my-1"
      width={4}
    />      {data?.data.map((item) => (
        <Text className="text-white" key={item.liker._id}>
          {item.liker.firstName} {item.liker.lastName}
        </Text>
      ))}
    </View>
  );
});

export default LikerModal;