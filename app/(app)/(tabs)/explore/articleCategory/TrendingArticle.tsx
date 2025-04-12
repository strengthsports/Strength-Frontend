import { View, Text, FlatList } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import { useGetCricketMatchesQuery } from "~/reduxStore/api/explore/cricketApi";
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";
import SwiperTop from "~/components/explorePage/SwiperTop";
import ArticleContent from "~/components/explorePage/article/ArticleContent";

// import { ExploreSportsCategoryHeader } from '~/components/explorePage/exploreHeader';

const TrendingArticle = () => {
  const { data: articles, error, isLoading } = useGetSportArticleQuery();
  const renderSwiper = () => {
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
          Error loading swipper slides.
        </TextScallingFalse>
      );
    }
    return <SwiperTop swiperData={articles ?? []} />;
  };

  const renderArticles = () => {
    if (isLoading) {
      return (
        <TextScallingFalse className="text-white self-center text-center pr-7">
          No articles available
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
    return <ArticleContent articleData={articles ?? []} />;
  };

  const sections = [
    { type: "swiper", content: renderSwiper() },
    { type: "article", content: renderArticles() },
  ];

  return (
    <View className="flex-1">
      <FlatList
        data={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => item.content}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>{/* Add any additional header content here if needed */}</View>
        }
      />
    </View>
  );
};

export default TrendingArticle;
