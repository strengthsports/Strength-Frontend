import { StyleSheet, View, Image, Dimensions, TouchableOpacity, Text, NativeSyntheticEvent, TextLayoutEventData} from 'react-native'
import React, { useRef, useState } from 'react'
import TextScallingFalse from '../CentralText'
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { AntDesign, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Post } from '~/types/post';
import { formatTimeAgo } from '~/utils/formatTime';
import Swiper from 'react-native-swiper';
import { router } from 'expo-router';


const PostSmallCard = ({ post, highlightedHashtag }: { post: Post; highlightedHashtag?: string }) => {
  // console.log("------------------------> ", post)
  const { width: screenWidth2 } = Dimensions.get('window');
  const scaleFactor = screenWidth2 / 410;


  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<Swiper>(null);
        
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = e.nativeEvent;
    const shouldShowSeeMore =
      lines.length > 2 || (lines as any).some((line: any) => line.truncated);
    setShowSeeMore(shouldShowSeeMore);
  };

  const imageUrls = post.assets.filter(asset => asset.url).map(asset => asset.url);
  // console.log(imageUrls)

  // const handleNext = () => {
  //   swiperRef.current?.scrollBy(1);
  // };

  // const handlePrev = () => {
  //   swiperRef.current?.scrollBy(-1);
  // };

  const renderCaptionWithHashtags = (caption: string) => {
      return caption?.split(/(\#[a-zA-Z0-9_]+)/g).map((word, index) => {
        if (word.startsWith("#")) {
          return (
            <Text
              key={index}
              onPress={() =>
                router.push(
                  `/(app)/(post)/hashtag/${word.substring(1, word.length)}`
                )
              }
              className={`text-xl text-[#12956B] ${
                highlightedHashtag?.toLowerCase() === word.toLowerCase() &&
                "font-semibold"
              }`}
            >
              {word}
            </Text>
          );
        }
      return word;
    });
  };


  return (
      <View style={{width: 301*scaleFactor}}>

       <View style={{width: '100%', flexDirection:'row', gap:'3%', position:'relative', top: '6%', zIndex: 100}}>
        <View style={{paddingLeft: '8%'}}>
        <View style={{height: 10}} />
         <Image source={{uri: post.postedBy?.profilePic}} style={{width: 50*scaleFactor, height: 50*scaleFactor, borderRadius:100, backgroundColor:'white'}} />
         </View>
         <View style={{ width: '60%', flex: 1, flexDirection:"column", gap:2}}>
         <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(1.64), fontWeight:'500', marginTop:8}}>{post.postedBy?.firstName} {post.postedBy?.lastName}</TextScallingFalse>
         <View style={{ position:'relative', top:-2*scaleFactor, width: '100%',}}>
         <TextScallingFalse numberOfLines={1} style={{color:'white', fontSize: responsiveFontSize(1.19), fontWeight:'200'}}>{post.postedBy?.headline}</TextScallingFalse>
         </View>
          <View className="flex flex-row  items-center">
              <TextScallingFalse className="text-base text-neutral-400">{formatTimeAgo(post.createdAt)} &bull;{" "}</TextScallingFalse>
              <MaterialIcons name="public" size={12} color="gray" />
          </View>
         </View>
        </View>

        {/* <View style={{ alignItems:'flex-end'}}>
        <View style={{width: '94%', backgroundColor:'#151515', paddingVertical: 15, paddingLeft:5, justifyContent:'center', alignItems:'center', borderTopLeftRadius: 45, borderTopRightRadius: 15}}>
            <View style={{ width: '85%', paddingLeft: '1%', paddingTop: '10%'}}>
              <MaterialIcons className="absolute right-0 top-0" name="more-horiz" size={18} color="#a3a3a3" />
              <TextScallingFalse
                style={{color:'white', fontSize: responsiveFontSize(1.29), fontWeight:'400'}}
                numberOfLines={isExpanded ? undefined : 2}
                ellipsizeMode="tail"
                onTextLayout={handleTextLayout}
              >
                {renderCaptionWithHashtags(post.caption)}
              </TextScallingFalse>
              
            
              {showSeeMore && !isExpanded && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsExpanded(true)}
                  className="mt-1"
                >
                  <TextScallingFalse style={styles.seeMore}>See more</TextScallingFalse>
                </TouchableOpacity>
              )}
            </View>
        </View>
        </View> */}

        
        <View className={`relative left-[5%] bottom-0 w-[95%] mt-3 min-h-16 h-auto rounded-tl-[45px] rounded-tr-[15px] pb-1 bg-[#151515]`}>
          <MaterialIcons className="absolute right-5 top-2" name="more-horiz" size={18} color="#a3a3a3" />
          <TextScallingFalse className=" pl-10 pr-6 pt-10 pb-3 text-sm text-white ">
            {renderCaptionWithHashtags(post.caption)}
          </TextScallingFalse>
          {showSeeMore && !isExpanded && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsExpanded(true)}
              className="mt-1"
            >
              <TextScallingFalse style={styles.seeMore}>See more</TextScallingFalse>
            </TouchableOpacity>
          )}
        </View>
        

        <View style={{height: 240 * scaleFactor,}}>
        {imageUrls.length > 0 && (
          <View style={{ position: "absolute" }}>
            <Swiper
              ref={swiperRef}
              loop={true}
              onIndexChanged={setCurrentSlide}
              showsPagination={false}
              style={{ height: 240 * scaleFactor, }}
            >
              {imageUrls.map((uri) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  style={{
                    width: '100%',
                    height: 240 * scaleFactor,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 22,
                    borderBottomLeftRadius: 22
                  }}
                />
              ))}
            </Swiper>

            {/* left right navigation button */}
            {/* {imageUrls.length > 1 && (
              <>
                {currentSlide > 0 && (
                  <TouchableOpacity
                    style={[styles.navButton, { left: 10 }]}
                    onPress={handlePrev}
                  >
                    <AntDesign name="left" size={20} color="white" />
                  </TouchableOpacity>
                )}


                {currentSlide < imageUrls.length - 1 && (
                  <TouchableOpacity
                    style={[styles.navButton, { right: 10 }]}
                    onPress={handleNext}
                  >
                    <AntDesign name="right" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </>
            )} */}

            
          </View>
        )}
        </View>

        <View style={{ width: '100%', alignItems:'flex-end',}}>
            <View style={{backgroundColor:'#151515', height: 30*scaleFactor, width:'94%', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal: 12}}>
            <TouchableOpacity activeOpacity={0.7} style={{flexDirection:'row'}}>
            <AntDesign name="like1" size={12 * scaleFactor} color="#FFC436" />
            <TextScallingFalse style={{fontSize: responsiveFontSize(1.25), color:'white', fontWeight:'300', paddingLeft: '2%'}}>{post.likesCount} Likes</TextScallingFalse>
            </TouchableOpacity>
            
            {/* <View style={{ width: '15%'}}></View> */}
            {/* dot carousel for multiple images */}
            <View className='pt-9'>
              {imageUrls.length > 1 && (
                <View style={styles.dotContainer}>
                  {imageUrls.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        index === currentSlide && styles.activeDot
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity activeOpacity={0.7}>
            <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(1.25), fontWeight:'300'}}>{post.commentsCount} Comments</TextScallingFalse>
            </TouchableOpacity>
            </View>
            <View style={{width: '94%', justifyContent:'center', alignItems:'center'}}>
            <View style={{backgroundColor:'#505050', height: 0.5, width: '85%'}}></View>
            </View>
            <View style={{width: '94%', gap: '6%', backgroundColor:'#151515', height: 57*scaleFactor, borderBottomLeftRadius: 45, borderBottomRightRadius: 15, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <View style={{width: '0.8%',}} />
                <TouchableOpacity activeOpacity={0.5} style={styles.ButtonsContainer}>
                <AntDesign name="like1" size={12*scaleFactor} color="#FFC436" />
                <TextScallingFalse style={{color:'white', fontSize: 10, fontWeight:'300'}}>Like</TextScallingFalse>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={styles.ButtonsContainer}>
                <Feather name="message-square" size={12*scaleFactor} color="white" />
                <TextScallingFalse style={{color:'white', fontSize: 10, fontWeight:'300'}}>Comment</TextScallingFalse>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={styles.ButtonsContainer}>
                <FontAwesome5  name="location-arrow" size={10*scaleFactor} color="white" />
                <TextScallingFalse style={{color:'white', fontSize: 10, fontWeight:'300'}}>Share</TextScallingFalse>
                </TouchableOpacity>
            </View>
            </View>

      </View>
  )
}

export default PostSmallCard

const styles = StyleSheet.create({
    ButtonsContainer:{
        backgroundColor:'black',
        paddingVertical:5,
        paddingHorizontal:8,
        // padding: 8,
        borderRadius: 25,
        width: "auto",
        flexDirection:"row",
        gap:5,
        justifyContent:'center',
        alignItems:'center',
    },
    seeMore: {
        color: 'grey',
        fontSize: responsiveFontSize(1.29),
        fontWeight: '400',
    },
    dotContainer: {
      position: 'absolute',
      bottom: 10,
      flexDirection: 'row',
      alignSelf: 'center'
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.4)',
      margin: 3
    },
    activeDot: {
      backgroundColor: 'white'
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 5,
      borderRadius: 20,
      transform: [{ translateY: -10 }]
    }
})