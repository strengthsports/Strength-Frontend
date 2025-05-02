import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import TextScallingFalse from "~/components/CentralText";
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";
import SwiperTop from "~/components/explorePage/SwiperTop";
import ArticleContent from "~/components/explorePage/article/ArticleContent";

// import { ExploreSportsCategoryHeader } from '~/components/explorePage/exploreHeader';

const TrendingArticle = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: articles,
    error,
    isLoading,
    refetch: refetchSportArticles,
  } = useGetSportArticleQuery();
  const topFiveArticles = articles?.slice(0, 5);
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

    return <SwiperTop swiperData={topFiveArticles ?? []} />;
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

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchSportArticles()]);
    } catch (error) {
      console.error("Refresh failed", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View className="flex-1">
      <FlatList
        data={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => item.content}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#12956B", "#6E7A81"]}
            tintColor="#6E7A81"
            progressViewOffset={60}
            progressBackgroundColor="#181A1B"
          />
        }
        ListHeaderComponent={
          <View>{/* Add any additional header content here if needed */}</View>
        }
      />
    </View>
  );
};

export default TrendingArticle;
