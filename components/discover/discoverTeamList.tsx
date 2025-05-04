import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useGetTeamsToSupportQuery } from "~/reduxStore/api/community/communityApi";
import TeamSuggestionCard from "../Cards/TeamSuggestionCard";
import { useRouter } from "expo-router";
import nopic from "~/assets/images/nopic.jpg";
import { SuggestTeam } from "~/types/team";

const DiscoverTeams = ({ sport }: { sport?: string }) => {
  const router = useRouter();
  const { data: allTeams, isLoading } = useGetTeamsToSupportQuery({
    limit: 10,
    sport,
    start: 0,
  });
  const { data: popularTeams, isLoading: isPopularTeamsLoading } =
    useGetTeamsToSupportQuery({
      limit: 2,
      city: "kolkata",
      start: 0,
    });

  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const removeSuggestion = (id: string) => {
    setRemovedIds((prev) => new Set([...prev, id]));
  };

  const { horizontalTeams, overflowTeams, verticalTeams } = useMemo(() => {
    const teams = allTeams?.teams || [];
    const filtered = teams.filter((u) => !removedIds.has(u._id));
    return {
      horizontalTeams: filtered.slice(0, 10),
      overflowTeams: filtered.slice(10, 13),
      verticalTeams: filtered.slice(14, 16),
    };
  }, [allTeams, removedIds]);

  const renderVerticalItem = ({ item }: { item: any }) => (
    <TeamSuggestionCard
      team={item}
      removeSuggestion={removeSuggestion}
      size="regular"
    />
  );

  const renderPopularTeams = ({ item }: { item: SuggestTeam }) => (
    <TeamSuggestionCard
      team={item}
      removeSuggestion={removeSuggestion}
      size="regular"
    />
  );

  const renderHorizontalSection = () => (
    <FlatList
      data={[
        ...horizontalTeams,
        { _id: "custom-card", isCustomCard: true } as any,
      ]}
      keyExtractor={(item) => item._id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        columnGap: 10,
        marginLeft: 10,
        paddingTop: 10,
      }}
      renderItem={({ item }) => {
        if (item.isCustomCard) {
          return (
            <View className="bg-black justify-center items-center gap-y-2 rounded-xl pb-4 relative border w-[320px] h-[200px] border-[#80808085] overflow-hidden">
              <View className="flex-row justify-center items-center">
                {overflowTeams.map((team, index) => (
                  <TouchableOpacity
                    key={team._id}
                    onPress={() =>
                      router.push(`/(app)/(team)/teams/${team._id}`)
                    }
                  >
                    <Image
                      source={team.logo.url ? { uri: team.logo.url } : nopic}
                      className="size-12 rounded-full border-4 border-black"
                      style={{
                        marginLeft: index === 0 ? 0 : -20,
                        zIndex: 3 - index,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(app)/(tabs)/community")}
              >
                <Text className="text-2xl text-[#12956B] text-center">
                  See all
                </Text>
              </TouchableOpacity>
            </View>
          );
        }
        return (
          <View style={{ width: 320 }}>
            <TeamSuggestionCard
              team={item}
              removeSuggestion={removeSuggestion}
              size="regular"
            />
          </View>
        );
      }}
      snapToAlignment="start"
      decelerationRate="fast"
    />
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#12956B" />;
  }

  return (
    <FlatList
      data={verticalTeams}
      keyExtractor={(item) => item._id}
      renderItem={renderVerticalItem}
      ListHeaderComponent={
        <View>
          {renderHorizontalSection()}
          <Text className="text-white text-4xl ml-5 my-2 font-semibold">
            Teams to Follow
          </Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 120,
        borderBottomWidth: 1,
        borderColor: "#242424",
      }}
      ListFooterComponent={
        <View>
          <TouchableOpacity
            className="mt-4 self-center rounded-full"
            onPress={() => router.push("/(app)/(tabs)/community")}
          >
            <Text className="text-[#E9E9E9] text-2xl font-medium">
              See more {`>`}
            </Text>
          </TouchableOpacity>
          <Text className="text-white text-4xl ml-5 my-2 font-semibold">
            Popular Teams
          </Text>
          {isPopularTeamsLoading ? (
            <ActivityIndicator size="large" color="#12956B" />
          ) : (
            <>
              <FlatList
                data={popularTeams?.teams}
                keyExtractor={(item) => item._id}
                renderItem={renderPopularTeams}
                scrollEnabled={false} // important to avoid nested scroll conflict
                contentContainerStyle={{ paddingVertical: 10 }}
              />
              <TouchableOpacity
                className="mt-4 self-center rounded-full"
                onPress={() => router.push("/(app)/(tabs)/community")}
              >
                <Text className="text-[#E9E9E9] text-2xl font-medium">
                  See more {`>`}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      }
    />
  );
};

export default DiscoverTeams;
