import { Slot } from "expo-router";
import React from "react";
import PageThemeView from "~/components/PageThemeView";
import HomeLayout from "~/components/feedPage/HomeLayout";
import { View } from "moti";

const HomeLayoutPage = () => {
  return (
    <HomeLayout>
      <Slot />
    </HomeLayout>
  );
};

export default HomeLayoutPage;
