import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";
import { Divider } from "react-native-elements";
import Swiper from "react-native-swiper";
import { swiperConfig } from "~/utils/swiperConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import nopic from "@/assets/images/nopic.jpg";

const PostDetails = () => {
  const { image, details } = useLocalSearchParams();
  //   console.log("details : ", JSON.parse(details));
  const postDetails = JSON.parse(details as any);
  const router = useRouter();

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
            className={`text-xl text-[#12956B]`}
          >
            {word}
          </Text>
        );
      }
      return word;
    });
  };

  return (
    <SafeAreaView className="h-screen">
      <View className="w-full z-50 absolute top-0 left-0 right-0 bg-black/80 py-4 flex-row justify-between items-center px-5">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row justify-center items-center gap-x-4">
          <View className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              source={
                postDetails?.postedBy?.profilePic
                  ? { uri: postDetails.postedBy.profilePic }
                  : nopic
              }
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <TextScallingFalse className="text-white font-light text-4xl">
            {postDetails?.postedBy?.firstName} {postDetails?.postedBy?.lastName}
          </TextScallingFalse>
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="more-horiz" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 80, // Match top bar height
          paddingBottom: 120, // Match interaction bar height
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-col h-full justify-center items-center gap-y-6">
          {/* Image section */}
          <View
            className="relative w-full"
            style={{
              aspectRatio: postDetails.aspectRatio
                ? postDetails.aspectRatio[0] / postDetails.aspectRatio[1]
                : 3 / 2,
            }}
          >
            {postDetails.assets && postDetails.assets.length > 0 && (
              <Swiper {...swiperConfig} className="w-full h-auto bg-slate-400">
                {postDetails.assets.map((asset: { url: string }) => (
                  <Image
                    key={asset.url}
                    source={{ uri: asset.url }}
                    className="size-full"
                  />
                ))}
              </Swiper>
            )}
          </View>
          {/* Caption Section */}
          <View className="mx-auto w-[90%]">
            <View>
              <Text className="text-2xl text-neutral-200">
                {renderCaptionWithHashtags(postDetails.caption)} Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Impedit, iure.
                Dolor doloribus mollitia qui repellendus corrupti perferendis
                dolores suscipit, illo delectus sed quasi quisquam natus
                voluptas ut voluptates sit. Commodi expedita officiis ratione
                excepturi? Nobis iste perspiciatis exercitationem earum
                explicabo, minus inventore deserunt natus, expedita dicta labore
                minima nostrum ipsa tempore, excepturi amet quis repellendus
                corrupti ratione dolore ex nam?
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Interaction Bar */}
      <View className="w-full absolute bottom-0 left-0 right-0 bg-black/80 pt-4">
        <View className="w-full px-8 pr-6 py-3 flex flex-row justify-between items-center">
          {/* like */}
          <TouchableOpacity className="flex flex-row items-center gap-2">
            <FontAwesome name="thumbs-up" size={16} color="gray" />
            <TextScallingFalse className="text-base text-white">
              {postDetails?.likesCount}{" "}
              {postDetails?.likesCount > 1 ? "Likes" : "Like"}
            </TextScallingFalse>
          </TouchableOpacity>

          {/* comment count */}
          <TouchableOpacity className="flex flex-row items-center gap-2">
            <TextScallingFalse className="text-base text-white">
              {postDetails?.commentsCount} Comments
            </TextScallingFalse>
          </TouchableOpacity>
        </View>

        <Divider
          style={{ marginHorizontal: "auto", width: "90%" }}
          width={0.2}
          color="grey"
        />

        <View className="w-full px-6 py-5 mb-1 flex flex-row justify-evenly items-center">
          <TouchableOpacity>
            <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
              <FontAwesome
                name={postDetails?.isLiked ? "thumbs-up" : "thumbs-o-up"}
                size={16}
                color={postDetails?.isLiked ? "#FABE25" : "gray"}
              />
              <TextScallingFalse
                className={`text-base ${
                  postDetails?.isLiked ? "text-amber-400" : "text-white"
                }`}
              >
                {postDetails?.isLiked ? "Liked" : "Like"}
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
          {/* comment now */}
          <TouchableOpacity className="flex flex-row items-center gap-2">
            <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
              <FontAwesome name="comment" size={16} color="grey" />
              <TextScallingFalse className="text-base text-white">
                Comment
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
              <FontAwesome name="paper-plane" size={16} color="grey" />
              <TextScallingFalse className="text-base text-white">
                Share
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PostDetails;
