import { Pressable, View } from "react-native";
import TextScallingFalse from "../CentralText";
import { hashtagData } from "~/constants/hardCodedFiles";
import PageThemeView from "../PageThemeView";
import { useRouter } from "expo-router";

// Define type for a single hashtag item
interface HashtagItem {
  _id: number;
  hashtag: string;
  postCount: string;
}

// Define props type for Hashtag component
interface HashtagProps {
  data: HashtagItem[];
}

const Hashtag: React.FC<HashtagProps> = ({ data }) => {
  const router = useRouter();
  const hashtagDataLength = data.length;
  let count = 1;
  return (
    <>
      {data.map((hashData) => (
        <Pressable
          key={hashData._id}
          onPress={() =>
            router.push(`/(app)/(post)/hashtag/${hashData.hashtag}`)
          }
        >
          <View className="px-3 flex-row">
            {/* Index */}
            <TextScallingFalse className="text-theme text-5xl font-semibold mr-5 mt-0.5">
              {count++}
            </TextScallingFalse>

            {/* Hashtag and Posts Count */}
            <View className="flex-col justify-center">
              <TextScallingFalse className="text-[#CECECE] text-3xl font-semibold ">
                #{hashData.hashtag}
              </TextScallingFalse>
              <TextScallingFalse className="text-[#6E6E6E] text-2xl mt-1.5">
                {hashData.postCount} posts
              </TextScallingFalse>
            </View>
          </View>

          {/* Divider */}
          <View className=" h-[0.6px] bg-[#474747] my-3 ml-12 mr-6" />
        </Pressable>
      ))}
    </>
  );
};
export default Hashtag;
