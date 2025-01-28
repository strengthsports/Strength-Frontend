import React, { memo, useEffect } from "react";
import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import { useFetchLikersQuery } from "~/reduxStore/api/likerApi";

interface LikersListProps {
  targetId: string;
  targetType: string;
}

const ITEM_HEIGHT = 60; // Fixed height of each item in pixels

const LikerCard = ({ liker }: { liker: any }) => (<>
  <View className="flex-row items-center p-2 my-1 h-[60px]">
    <Image
      source={{ uri: liker.profilePic }}
      className="w-12 h-12 rounded-full mr-4"
    />
    <View className="flex-1">
      <Text className="text-white font-semibold text-base">
        {liker.firstName} {liker.lastName}
      </Text>
      <Text className="text-gray-400 text-sm mt-1 w-5/6" ellipsizeMode="tail" numberOfLines={1}>
        {liker.headline}
      </Text>
    </View>
  </View>
  </>);

const LikerModal = memo(({ targetId, targetType }: LikersListProps) => {
  const { data, error, isLoading, refetch } = useFetchLikersQuery({
    targetId,
    targetType,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <ActivityIndicator color="#12956B" className="mt-4" />;
  if (error) return <Text className="text-red-500 text-center mt-4">Error fetching likers</Text>;
  if (!data?.data?.length) return <Text className="text-white text-center mt-4">No Likes</Text>;

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <FlatList
      data={data?.data}
      keyExtractor={(item) => item.liker._id}
      renderItem={({ item }) => <LikerCard liker={item.liker} />}
      contentContainerStyle={{ padding: 10 }}
      getItemLayout={getItemLayout}
      initialNumToRender={18} // Optional: Improve initial load
    />
  );
});

export default LikerModal;
