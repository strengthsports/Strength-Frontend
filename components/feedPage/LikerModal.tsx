import React, { memo, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Divider } from "react-native-elements";
import { useFetchLikersQuery } from "~/reduxStore/api/feed/features/feedApi.getLiker";
import nopic from "@/assets/images/nopic.jpg";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import TextScallingFalse from "../CentralText";

interface LikersListProps {
  targetId: string;
  targetType: string;
}

const ITEM_HEIGHT = 60; // Fixed height of each item in pixels

export const LikerCard = ({ liker }: { liker: any }) => {
  const router = useRouter();
  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: liker._id, type: liker.type })
  );
  return (
    <>
      <View className="flex-row items-center p-2 mt-1 h-[60px]">
        <TouchableOpacity
          onPress={() =>
            router.push(`/(app)/(profile)/profile/${serializedUser}`)
          }
        >
          <Image
            source={liker.profilePic ? { uri: liker.profilePic } : nopic}
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
              marginRight: 16,
            }}
            placeholder={require("../../assets/images/nopic.jpg")}
            placeholderContentFit="cover"
            transition={500}
            cachePolicy="memory-disk"
          />
        </TouchableOpacity>
        <View className="flex-1">
          <TextScallingFalse className="text-white font-semibold text-xl">
            {liker.firstName} {liker.lastName}
          </TextScallingFalse>
          <TextScallingFalse
            className="text-neutral-400 text-base mt-[2px] w-5/6"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {liker.username} | {liker.headline}
          </TextScallingFalse>
        </View>
      </View>
    </>
  );
};

const LikerModal = memo(({ targetId, targetType }: LikersListProps) => {
  const { data, error, isLoading, refetch } = useFetchLikersQuery({
    targetId,
    targetType,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (error) {
    console.log("api response", error);
  }

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <View
      onStartShouldSetResponder={() => true}
      className="h-full w-[104%] self-center bg-black rounded-t-[40px] p-4 border-t border-x  border-neutral-700"
    >
      <Divider
        className="w-16 self-center rounded-full bg-neutral-700 my-1"
        width={4}
      />
      <TextScallingFalse className="text-white self-center text-4xl my-4">
        Likes
      </TextScallingFalse>

      {isLoading ? (
        <ActivityIndicator size="large" color="#12956B" />
      ) : (
        <FlatList
          data={data?.data}
          keyExtractor={(item) => item.liker._id}
          renderItem={({ item }) => <LikerCard liker={item.liker} />}
          contentContainerStyle={{ padding: 10 }}
          getItemLayout={getItemLayout}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListEmptyComponent={
            <TextScallingFalse className="text-white text-center">
              No Likes Found!
            </TextScallingFalse>
          }
        />
      )}
    </View>
  );
});

export default LikerModal;
