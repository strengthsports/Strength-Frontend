import { AntDesign, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  BackHandler,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import PageThemeView from "~/components/PageThemeView";
import nopic from "@/assets/images/pro.jpg";
import {
  useGetBlockedUsersQuery,
  useUnblockUserMutation,
} from "~/reduxStore/api/profile/profileApi.block";

const BlockedUsersList = () => {
  const router = useRouter();

  const { data, isLoading, error } = useGetBlockedUsersQuery();
  const [unblockUser] = useUnblockUserMutation();

  useEffect(() => {
    const onBackPress = () => {
      router.push("/(app)/(main)/settings?accountSettingsModal=false");
      // Return true to indicate we've handled the back press
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [router]);

  //handle unblock
  const handleUnblock = async (blockedId: string, blockedType: string) => {
    try {
      // Perform the block action via mutation
      await unblockUser({
        blockedId: blockedId,
        blockedType: blockedType,
      }).unwrap();
      console.log("Unblocked Successfully!");
    } catch (err) {
      console.error("Unblocking error:", err);
    }
  };

  const renderBlockedUsers = ({ item }: { item: any }) => {
    const serializedUser = encodeURIComponent(
      JSON.stringify({ id: item._id, type: item.type })
    );
    console.log(item);
    return (
      <View className="flex-row justify-between items-center mt-2">
        <TouchableOpacity
          className="flex-row items-center justify-center"
          onPress={() => router.push(`/(app)/(main)/profile/${serializedUser}`)}
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
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-3 py-1 rounded-lg bg-[#12956B]"
          activeOpacity={0.5}
          onPress={() => handleUnblock(item._id, item.type)}
        >
          <TextScallingFalse className="text-white font-semibold">
            Unblock
          </TextScallingFalse>
        </TouchableOpacity>
      </View>
    );
  };

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
          <TextScallingFalse className="text-white text-5xl font-light">
            Blocked Users
          </TextScallingFalse>
        </View>
      </View>

      {/* Blocked users List */}
      <View
        style={styles.container}
        className="relative w-[360px] lg:w-[600px] mx-auto"
      >
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#12956B"
            style={styles.loader}
          />
        )}

        {error && (
          <Text style={styles.errorText}>
            Failed to load blocked users! Please try again!
          </Text>
        )}

        {!isLoading && !error && data?.length === 0 && (
          <Text style={styles.emptyText}>No users found.</Text>
        )}

        <FlatList
          data={data}
          renderItem={renderBlockedUsers}
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

export default BlockedUsersList;
