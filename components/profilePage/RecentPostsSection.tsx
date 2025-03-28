import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, FlatList, TouchableOpacity, useWindowDimensions, Platform, Text } from 'react-native';
import TextScallingFalse from "~/components/CentralText";
import PostSmallCard from "components/Cards/PostSmallCard";
import { Post } from '~/types/post';
import { MaterialIcons } from '@expo/vector-icons';
import PostContainerSmall from '../Cards/postContainerSmall';



interface RecentPostsSectionProps {
  posts?: Post[];
  onSeeAllPress: () => void;
  scaleFactor: number;
}

const RecentPostsSection: React.FC<RecentPostsSectionProps> = ({ posts, onSeeAllPress, scaleFactor }) => {
  const { width: screenWidth2 } = useWindowDimensions();
  const gap = 20; // Space between posts
  const postWidth = (screenWidth2 - gap) / 1.3; // Width of each post

  const [currentIndex, setCurrentIndex] = useState(0);
  // console.log(posts);


  const postsWithImages = useMemo(() => posts?.filter(post => post.assets.length > 0) || [], [posts]);
  const displayedPosts = useMemo(() => postsWithImages.slice(0, 5), [postsWithImages]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
    }
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [posts]);

  const renderItem = ({ item }: { item: Post }) => (
    <View style={{ width: postWidth, marginRight: gap }}>
      <PostSmallCard post={item} />
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={{ width: screenWidth2, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <TextScallingFalse className="text-gray-500 text-[16px]">
        No recent posts
      </TextScallingFalse>
    </View>
  );


  const ListFooterComponent = useCallback(() => {
    if (postsWithImages.length < 1) return null;
    return (
        <View style={{alignItems:"center", flex:1, justifyContent:"center", flexDirection:"row", marginLeft:15}}>
          <View 
            style={{flex:1, flexDirection:"row", width: 'auto', padding: 75, marginTop:55 , marginBottom:35 ,justifyContent:'center', alignItems:'center',height:360*scaleFactor}}
            className="border-[#494949] border-[0.3px] rounded-[20px]"
          >
            <TouchableOpacity activeOpacity={0.3} style={{flex:1, flexDirection:"row", gap:5 ,}} onPress={onSeeAllPress}>
              <TextScallingFalse style={{color:"green", paddingLeft:15,}}>
                View more
              </TextScallingFalse>
              <MaterialIcons name='keyboard-double-arrow-right' size={22} color="green" />
            </TouchableOpacity>
          </View>
        </View>
    )
  }, [postsWithImages.length,scaleFactor,onSeeAllPress]);

  return (
    <View
      className="py-2 my-2 ml-4 w-auto border-[#494949] border-[0.3px] rounded-l-[20px] border-r-0"
      style={{ height: 630 * scaleFactor }}
    >
      {/* Header */}
      <View className="w-full h-12 justify-end pl-5">
        <TextScallingFalse className="text-gray-500 text-[18px] font-bold">
          POSTS
        </TextScallingFalse>
      </View>

      {/* Posts List */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={displayedPosts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          // snapToInterval={postWidth + gap}
          decelerationRate="normal"
          contentContainerStyle={{
            paddingRight: gap,
            paddingLeft: 20
          }}
          initialNumToRender={5}
          removeClippedSubviews={Platform.OS === 'android'}
          windowSize={11}
          bounces={false}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          onScroll={(event) => {
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(contentOffsetX / (postWidth + gap));
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
          ListFooterComponent={ListFooterComponent}
        />
        {/* dot carousel */}
        {displayedPosts.length > 0 && (
          <View className="flex-row justify-center my-2">
            {displayedPosts.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentIndex ? 'bg-white' : 'bg-gray-500'
                }`}
              />
            ))}
          </View>
        )}
      </View>

      {/* Footer */}
      <View className="w-auto h-[15%] justify-center items-center">
        <View className="h-[1px] w-[90%] bg-gray-500" />
        <TouchableOpacity activeOpacity={0.3} className="pt-4" onPress={onSeeAllPress}>
          <TextScallingFalse className="text-[#12956B] text-[13px] font-normal">
            See all posts...
          </TextScallingFalse>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecentPostsSection;