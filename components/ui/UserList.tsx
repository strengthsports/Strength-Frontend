import React, { memo, useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { useFetchLikersQuery } from "~/reduxStore/api/feed/features/feedApi.getLiker";
import {
  useLazyFindFollowersQuery,
  useLazyFindFollowingsQuery,
} from "~/reduxStore/api/profile/profileApi.follow"; // Replace with your actual path
import TextScallingFalse from "../CentralText";
import UserCard from "../Cards/UserCard";

export type PageType = "Likers" | "Followers" | "Followings";

interface UserListProps {
  targetId: string;
  targetType: string;
  type: PageType;
}

const ITEM_HEIGHT = 60;

const UserList = memo(({ targetId, targetType, type }: UserListProps) => {
  console.log(targetId, targetType, type);
  const [
    fetchFollowers,
    { data: followers, isLoading: isFollowersLoading, isError: followersError },
  ] = useLazyFindFollowersQuery();
  const [
    fetchFollowings,
    {
      data: followings,
      isLoading: isFollowingsLoading,
      isError: followingsError,
    },
  ] = useLazyFindFollowingsQuery();
  const {
    data: likers,
    isLoading: isLikersLoading,
    error: likersError,
    refetch,
  } = useFetchLikersQuery({ targetId, targetType });

  const [userData, setUserData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (type === "Likers") {
      refetch(); // refresh likers data
    } else if (type === "Followers") {
      console.log("Called");
      fetchFollowers({ targetUserId: targetId, targetUserType: targetType });
    } else if (type === "Followings") {
      fetchFollowings({ targetUserId: targetId, targetUserType: targetType });
    }
  }, [type, targetId]);

  useEffect(() => {
    if (type === "Likers" && likers?.data) {
      setUserData(likers.data.map((item: any) => item.liker));
      setIsLoading(isLikersLoading);
    } else if (type === "Followers" && followers) {
      setUserData(followers.map((item: any) => item));
      setIsLoading(isFollowersLoading);
    } else if (type === "Followings" && followings) {
      setUserData(followings.map((item: any) => item));
      setIsLoading(isFollowingsLoading);
    }
  }, [likers, followers, followings]);

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <View onStartShouldSetResponder={() => true} className="h-full bg-black">
      {isLoading ? (
        <ActivityIndicator size="large" color="#12956B" />
      ) : (
        <FlatList
          data={userData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <UserCard user={item} />}
          contentContainerStyle={{ padding: 10 }}
          getItemLayout={getItemLayout}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListEmptyComponent={
            <TextScallingFalse className="text-white text-center">
              No {type} Found!
            </TextScallingFalse>
          }
        />
      )}
    </View>
  );
});

export default UserList;
