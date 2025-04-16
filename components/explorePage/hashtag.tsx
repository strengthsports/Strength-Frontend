import { View } from "react-native";
import TextScallingFalse from "../CentralText";
import { hashtagData } from "~/constants/hardCodedFiles";

// Define type for a single hashtag item
interface HashtagItem {
  id: number;
  hashtag: string;
  postsCount: string;
}

// Define props type for Hashtag component
interface HashtagProps {
  data: HashtagItem[];
}

const Hashtag: React.FC<HashtagProps> = ({ data }) => {
  return (
    <>
      {data.map((hashData) => (
        <View key={hashData.id}>
          <View className="px-5 flex-row">
            {/* Index */}
            <TextScallingFalse className="text-theme text-5xl font-semibold mr-5 mt-0.5">
              {hashData.id}
            </TextScallingFalse>

            {/* Hashtag and Posts Count */}
            <View className="flex-col justify-center">
              <TextScallingFalse className="text-[#CECECE] text-3xl font-semibold ">
                {hashData.hashtag}
              </TextScallingFalse>
              <TextScallingFalse className="text-[#6E6E6E] text-2xl mt-1.5">
                {hashData.postsCount} posts
              </TextScallingFalse>
            </View>
          </View>

          {/* Divider */}
          <View className=" h-[0.6px] bg-[#474747] my-3 ml-12 mr-6" />
        </View>
      ))}
    </>
  );
};
export default Hashtag;
