import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../TopBar";
import { useRouter } from "expo-router";
import PostContainer from "../Cards/postContainer";
import { Post } from "~/types/post";

const PostDetailsModal = ({ details }: { details: any }) => {
  const router = useRouter();
  return (
    <SafeAreaView>
      <TopBar backHandler={() => router.push("..")} heading="" />
      {/* <PostContainer item={details} /> */}
    </SafeAreaView>
  );
};

export default PostDetailsModal;

const styles = StyleSheet.create({});
