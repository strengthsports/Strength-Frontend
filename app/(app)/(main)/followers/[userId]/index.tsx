import { AntDesign, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import PageThemeView from "~/components/PageThemeView";
import {
  useLazyFindFollowersQuery,
  useLazyFindFollowingsQuery,
} from "~/reduxStore/api/profile/profileApi.follow";
import { TargetUser } from "~/types/user";
import nopic from "@/assets/images/nopic.jpg";
import { useSelector } from "react-redux";

const FollowersPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useSelector((state: any) => state?.auth || {});

  const type = useMemo(() => {
    if (typeof params.pageType === "string") {
      return params.pageType.charAt(0).toUpperCase() + params.pageType.slice(1);
    }
    return "";
  }, [params.pageType]);

  const userId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params.userId as string))
      : null;
  }, [params.userId]);
  console.log(userId, type);
  const [
    findFollowers,
    { data: followers, isLoading: isFollowersLoading, isError: followersError },
  ] = useLazyFindFollowersQuery();

  const [
    findFollowings,
    {
      data: followings,
      isLoading: isFollowingsLoading,
      isError: followingsError,
    },
  ] = useLazyFindFollowingsQuery();

  useEffect(() => {
    if (userId) {
      const targetUser: TargetUser = {
        targetUserId: userId?.id,
        targetUserType: userId?.type,
      };

      if (params.pageType === "followers") {
        findFollowers(targetUser)
          .unwrap()
          .catch((err: any) =>
            console.error("Error finding followers list:", err)
          );
      } else if (params.pageType === "followings") {
        findFollowings(targetUser)
          .unwrap()
          .catch((err: any) =>
            console.error("Error finding followings list:", err)
          );
      }
    }
  }, [userId, params.pageType]);

  const renderFollowerItem = ({ item }: { item: any }) => {
    const serializedUser = encodeURIComponent(
      JSON.stringify({ id: item._id, type: item.type })
    );
    console.log(item);
    return (
      <TouchableOpacity
        className="flex-row mt-5 items-center"
        onPress={() =>
          item._id === user._id
            ? router.push("/(app)/(tabs)/profile")
            : router.push(`/(app)/(main)/profile/${serializedUser}`)
        }
      >
        <View className="w-12 h-12 rounded-full overflow-hidden">
          {item.profilePic ? (
            <Image
              source={{ uri: item.profilePic }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Image
              source={nopic}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          )}
        </View>
        <View className="ml-3">
          <Text
            className="text-white text-2xl font-medium"
            numberOfLines={1}
            allowFontScaling={false}
          >
            {item.firstName} {item.lastName}
          </Text>
          <Text
            className="text-white text-sm font-light"
            numberOfLines={1}
            allowFontScaling={false}
          >
            {item.headline}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const isLoading =
    params.pageType === "followers" ? isFollowersLoading : isFollowingsLoading;
  const error =
    params.pageType === "followers" ? followersError : followingsError;
  const data = params.pageType === "followers" ? followers : followings;

  return (
    <PageThemeView>
      {/* Header */}
      <View className="flex-row w-full justify-start items-center p-5 pb-3 relative text-center">
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => router.back()}
          className="mr-4"
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <TextScallingFalse className="text-white text-4xl font-light">
            {type}
          </TextScallingFalse>
        </View>
      </View>

      {/* Search for followers */}
      <View className="w-[350px] lg:w-[600px] h-[45px] bg-[#121212] mt-5 mx-auto rounded-lg flex-row items-center">
        <TextInput
          placeholder={`Search for ${type.toLowerCase()}...`}
          placeholderTextColor="grey"
          className="flex-1 text-white rounded-lg text-lg font-normal h-full bg-[#121212] pl-4"
          allowFontScaling={false}
          cursorColor="#12956B"
        />
        <Feather name="search" size={23} color="grey" className="mr-4" />
      </View>

      {/* Followers List */}
      <View
        style={styles.container}
        className="relative w-[360px] lg:w-[600px] mx-auto"
      >
        <TextScallingFalse
          className="text-base top-2 right-7 absolute"
          style={{ color: "grey" }}
        >
          {data?.length || 0} {type.toLowerCase()}
        </TextScallingFalse>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#12956B"
            style={styles.loader}
          />
        )}

        {error && (
          <Text style={styles.errorText}>
            Failed to load {type.toLowerCase()}. Please try again.
          </Text>
        )}

        {!isLoading && !error && data?.length === 0 && (
          <Text style={styles.emptyText}>No {type.toLowerCase()} found.</Text>
        )}

        <FlatList
          data={data}
          renderItem={renderFollowerItem}
          keyExtractor={(item) => item.id?.toString()}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </PageThemeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
  emptyText: {
    color: "gray",
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default FollowersPage;
