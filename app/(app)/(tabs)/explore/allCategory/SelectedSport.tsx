import { View, Text, FlatList } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";
import { useGetCricketMatchesQuery } from "~/reduxStore/api/explore/cricketApi";
import { useGetFootballMatchesQuery } from "~/reduxStore/api/explore/footballApi";
import CricketLiveMatch from "~/components/explorePage/liveMatch/CricketLiveMatch";
import CricketNextMatch from "~/components/explorePage/nextMatch/CricketNextMatch";
import FootballLiveMatch from "~/components/explorePage/liveMatch/FootballLiveMatch";
import FootballNextMatch from "~/components/explorePage/nextMatch/FootballNextMatch";
import SwiperTop from "~/components/explorePage/SwiperTop";

interface SelectedSportProps {
  sportsName: string;
}

const SelectedSport: React.FC<SelectedSportProps> = ({ sportsName }) => {
  const renderSwiper = () => {
    const {
      data: articles,
      error,
      isLoading,
    } = useGetSportArticleQuery(sportsName);
    if (isLoading) {
      return (
        <TextScallingFalse className="text-white self-center text-center pr-7">
          No swipper slides available
        </TextScallingFalse>
      );
    }

    if (error) {
      return (
        <TextScallingFalse className="text-white">
          Error loading articles.
        </TextScallingFalse>
      );
    }
    return <SwiperTop swiperData={articles ?? []} />;
  };

  const {
    data: cricketData,
    isFetching: isCricketFetching,
    refetch: refetchLiveCricket,
  } = useGetCricketMatchesQuery({});
  const { liveMatches: liveCricketMatches, nextMatch: nextCricketMatches } =
    cricketData || {};

  // const renderTrendingLiveMatches = () => {};

  const renderCricketLiveMatches = () => {
    return (
      <CricketLiveMatch
        liveMatches={liveCricketMatches}
        isFetching={isCricketFetching}
        onRefetch={refetchLiveCricket}
      />
    );
  };

  const renderCricketNextMatches = () => {
    return (
      <CricketNextMatch
        nextMatch={nextCricketMatches}
        isFetching={isCricketFetching}
      />
    );
  };

  const {
    data: footballData,
    isFetching: isFootballFetching,
    refetch: refetchFootball,
  } = useGetFootballMatchesQuery({});
  const { liveMatches: liveFootballMatches, nextMatch: nextFootballMatches } =
    footballData || {};

  const renderFootballLiveMatches = () => {
    return (
      <FootballLiveMatch
        liveMatches={liveFootballMatches}
        isFetching={isFootballFetching}
        onRefetch={refetchFootball}
      />
    );
  };

  const renderFootballNextMatches = () => {
    return <FootballNextMatch />;
  };

  // one imporvement can be done is using useMemo for sections to avoid re-render first consult about it
  //also can use configMap for reusing if/else statements
  const sections = [{ type: "swiper", content: renderSwiper() }];

  if (sportsName === "Cricket") {
    sections.push({
      type: "CricketLiveMatches",
      content: renderCricketLiveMatches(),
    });
    sections.push({
      type: "CricketNextMatches",
      content: renderCricketNextMatches(),
    });
  } else if (sportsName === "Football") {
    sections.push({
      type: "FootballLiveMatches",
      content: renderFootballLiveMatches(),
    });
    sections.push({
      type: "FootballNextMatches",
      content: renderFootballNextMatches(),
    });
  }

  return (
    <View>
      <Text className="text-white">{sportsName}</Text>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.type}
        // keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => item.content}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <View>{/* Add any additional header content here if needed */}</View>
        }
      />
    </View>
  );
};

export default SelectedSport;
