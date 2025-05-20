import React, { useState, useMemo} from "react";
import { View, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import TextScallingFalse from "../CentralText";
import SportsIndicator from "../SvgIcons/SideMenu/SportsIndicator";

const { width: screenWidth } = Dimensions.get("window");

const CARD_WIDTH = 320;

type Article = {
  _id: number;
  title: string;
  sportsName: string;
   date?: string;
   createdAt: string;
  imageUrl: string;
};

  // 🟡 Replace 'Article' with your actual type if different
  type SuggestedArticlesCardProps = {
    swiperData: Article[];
  };


  const formatDateTime = (isoString: string) => {
  const dateObj = new Date(isoString);
  const formattedDate = dateObj
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
    .replace(",", "");

  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { date: formattedDate, time: formattedTime };
};


const SuggestedArticlesCard = ({ swiperData }: SuggestedArticlesCardProps) => {

  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / CARD_WIDTH);
    setActiveIndex(newIndex);
  };

 const formattedArticles = useMemo(() => {
  return swiperData.map((article) => {
    if (article.createdAt) {
      const { date } = formatDateTime(article.createdAt);
      return { ...article, date };
    }
    return article;
  });
}, [swiperData]);


  return (
    <View
      style={{
        width: "100%",
        height: 220,
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "#202020",
        borderBottomWidth: 1,
        borderTopColor: "#202020",
        paddingVertical: 20,
      }}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View>
          <TextScallingFalse
            style={{ color: "white", fontSize: 16, fontWeight: "500" }}
          >
            Trending Articles
          </TextScallingFalse>
          {/* Dots */}
          <View
            style={{
              flexDirection: "row",
              paddingTop: 12,
              paddingBottom: 8,
            }}
          >
            {swiperData.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 6,
                  width: 6,
                  borderRadius: 4,
                  marginHorizontal: 5,
                  backgroundColor:
                    index === activeIndex ? "#D9D9D9" : "#454545",
                }}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
           router.push('/(app)/(tabs)/explore/articleCategory/TrendingArticle')
          }}
        >
          <TextScallingFalse
            style={{
              fontSize: 14,
              color: "#12956B",
              fontWeight: "500",
              paddingBottom: 18,
            }}
          >
            View all
          </TextScallingFalse>
        </TouchableOpacity>
      </View>

      {/* Scrollable Cards */}
      <ScrollView
        horizontal
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 20,
        }}
      >
        {formattedArticles.map((article, index) => (
          <TouchableOpacity  onPress={() => {
              router.push({
                pathname: `/(app)/articlePage`,
                params: {
                  id: article._id,
                  sportsName: article.sportsName,
                },
              });
            }} activeOpacity={0.7}
            key={article._id}
            style={{
              width: CARD_WIDTH,
              height: 107,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#2B2B2B",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 15,
              marginRight: index === formattedArticles.length - 1 ? 0 : 12,
            }}
          >
            {/* Left content */}
            <View style={{ width: '58%', height: 75 }}>
              <View style={{ width: '100%', height: 60}}>
                <TextScallingFalse
                numberOfLines={3}
                ellipsizeMode="tail"
                  style={{ color: "white", fontSize: 14, fontWeight: "400" }}
                >
                  {article.title}
                </TextScallingFalse>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <SportsIndicator />
                <TextScallingFalse
                  style={{ fontSize: 12, color: "#12956B", fontWeight: "500" }}
                >
                  {article.sportsName}
                </TextScallingFalse>
                <TextScallingFalse
                  style={{ fontSize: 11, color: "gray", fontWeight: "400" }}
                >
                  {"•"}   {article.date}
                </TextScallingFalse>
              </View>
            </View>

            {/* Right image */}
            <View
              style={{
                width: 100,
                height: 80,
                borderRadius: 6,
                overflow: "hidden",
                backgroundColor: "black",
                borderWidth: 1,
                borderColor: '#202020'
              }}
            >
              <Image
                source={{ uri: article.imageUrl }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SuggestedArticlesCard;
