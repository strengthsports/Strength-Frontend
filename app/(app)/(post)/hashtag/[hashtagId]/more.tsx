import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Hashtag from "~/components/explorePage/hashtag";
import { hashtagData } from "~/constants/hardCodedFiles";

const More = () => {
  // Render each hashtag item using the Hashtag component
  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof hashtagData)[0];
    index: number;
  }) => (
    <Hashtag
      index={index + 1}
      hashtag={item.hashtag}
      postsCount={item.postsCount}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={hashtagData}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
    marginTop: 7,
  },
});
