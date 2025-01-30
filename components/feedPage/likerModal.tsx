import React, { memo, useEffect } from "react";
import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import { Divider } from "react-native-elements";
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
      <Text className="text-neutral-400 text-sm mt-1 w-5/6" ellipsizeMode="tail" numberOfLines={1}>
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

  if (error) {
    console.log("api response", error)

    // return <Text className="text-red-500 text-center mt-4"> Error fetching likers</Text>
  }
  // if (!data?.data?.length) return <Text className="text-white text-center mt-4">No Likes</Text>;

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <View className="h-3/4 w-[104%] self-center bg-black rounded-t-[40px] p-4 border-t border-x  border-neutral-700		 ">
      <Divider
        className="w-16 self-center rounded-full bg-neutral-700 my-1"
        width={4}
      />
      <Text className="text-white self-center text-2xl my-4">Likes</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#12956B" />
      ) : data?.data?.length > 0 ? (
        <FlatList
          data={data?.data}
          keyExtractor={(item) => item.liker._id}
          renderItem={({ item }) => <LikerCard liker={item.liker} />}
          contentContainerStyle={{ padding: 10 }}
          getItemLayout={getItemLayout}
          initialNumToRender={18}
        />
      ) : (
        <Text className="text-white text-center">No Likes found.</Text>
      )}
    </View>
  );
});

export default LikerModal;
