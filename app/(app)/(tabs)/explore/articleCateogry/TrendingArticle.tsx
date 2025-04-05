import { View, Text, FlatList } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import { useGetCricketMatchesQuery } from "~/reduxStore/api/explore/cricketApi";
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";
import SwiperTop from "~/components/explorePage/SwiperTop";

// import { ExploreSportsCategoryHeader } from '~/components/explorePage/exploreHeader';

const TrendingArticle = () => {
  const renderSwiper = () => {
    const { data: articles, error, isLoading } = useGetSportArticleQuery();
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
  const sections = [{ type: "swiper", content: renderSwiper() }];

  return (
    <View>
      <FlatList
        data={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => item.content}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <View>{/* Add any additional header content here if needed */}</View>
        }
      />
    </View>
  );
};

export default TrendingArticle;
