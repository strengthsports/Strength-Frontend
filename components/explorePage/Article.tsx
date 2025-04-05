import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";

const Article = () => {
  const { data: articles, error, isLoading } = useGetSportArticleQuery();
  return (
    <View>
      <Text>Article</Text>
    </View>
  );
};

export default Article;

const styles = StyleSheet.create({});
