// app/hashtag/[hashtag]/_layout.tsx
import { View, ScrollView } from "react-native";
import SearchBar from "~/components/search/searchbar";
import { Slot } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import PageThemeView from "~/components/PageThemeView";

export default function HashtagLayout() {
  const { hashtagId } = useLocalSearchParams();

  return (
    <PageThemeView>
      <SearchBar searchText={`#${hashtagId.toString()}`} marginBottom={0} />
      <Slot />
    </PageThemeView>
  );
}
