import { SafeAreaView, View, TouchableOpacity, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router"; // Import the router for navigation
import TextScallingFalse from "~/components/CentralText";
import PostContainer from "~/components/feedPage/postContainer";
import { useState } from "react";
import PostSmallCard from "~/components/Cards/PostSmallCard";

export default function Home() {
  const router = useRouter();

  const user = { id: "67667870ba4cfa5c24a3dc0b", type: "User" }; // Example object
  const serializedUser = encodeURIComponent(JSON.stringify(user)); //
  const posts = [
    {
      id: 1,
      firstName: "Sebastian",
      lastName: "Cilb",
      profilepic:
        "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8",
      headline:
        "Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precesion, Power, and Calmness",
      caption:
        "Another day, another ride. Focus, train,repeat. Pursing Peformance one mile at a time. The journey countinues",
      image:
        "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2Fec810ca3-96d1-4101-981e-296240d60437.jpg?alt=media&token=da6e81af-e2d0-49c0-8ef0-fe923f837a07",
      likes: ["harshal_123", "Miraj_123"],
      comments: [
        {
          id: 1,
          firstName: "harshl",
          lastName: "mishra",
          description: "kjaskjdashdkasjndjansjndjan",
          comment: "amazing",
        },
        {
          id: 2,
          firstName: "harshl",
          lastName: "mishra",
          description: "kjaskjdashdkasjndjansjndjan",
          comment: "agg laga deya",
        },
      ],
    },
    {
      id: 2,
      firstName: "Sebastian",
      lastName: "Cilb",
      profilepic:
        "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8",
      headline:
        "Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precesion, Power, and Calmness",
      caption:
        "Another day, another ride. Focus, train,repeat. Pursing Peformance one mile at a time. The journey countinues",
      image:
        "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F409857d8-56c3-465f-9cac-dffddf0575e2.jpeg?alt=media&token=f3aa7516-8dac-4de5-90a5-b057c5d8703c",
      likes: ["harshal_123", "Miraj_123"],
      comments: [
        {
          id: 1,
          firstName: "harshl",
          lastName: "mishra",
          description: "kjaskjdashdkasjndjansjndjan",
          comment: "amazing",
        },
        {
          id: 2,
          firstName: "harshl",
          lastName: "mishra",
          description: "kjaskjdashdkasjndjansjndjan",
          comment: "agg laga deya",
        },
      ],
    },
  ];
  return (
    <SafeAreaView className="pt-16">
      <TouchableOpacity
        onPress={() => router.push(`../(main)/profile/${serializedUser}`)}
      >
        <TextScallingFalse className="p-6 self-center text-2xl text-white">
          Chats
        </TextScallingFalse>
      </TouchableOpacity>

      {/* Container */}
      <ScrollView className="w-screen pl-8 mt-8" >

      <PostContainer  />

      {/* <PostContainer /> */}
      <TextScallingFalse className="p-6  text-xl text-white">
          Old Container
        </TextScallingFalse>
      <PostSmallCard post={posts} />
      </ScrollView>

    </SafeAreaView>
  );
}
