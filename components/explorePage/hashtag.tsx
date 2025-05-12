import { Pressable, TouchableOpacity, View } from "react-native";
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
  setModalVisible: (visible: boolean) => void;
}

const Hashtag: React.FC<HashtagProps> = ({ data, setModalVisible }) => {
  const router = useRouter();
  const hashtagDataLength = data.length;
  let count = 1;
  return (
    <>
      {data.map((hashData) => (
        <TouchableOpacity
          activeOpacity={0.7}
          key={hashData._id}
          onPress={() => {
            router.push(`/home/hashtag/${hashData.hashtag}/top`);
            setModalVisible(false);
          }}
        >
          <View className="px-3 flex-row">
            {/* Index */}
            <TextScallingFalse className="text-theme text-5xl font-semibold mr-6 mt-0.5">
              {count++}
            </TextScallingFalse>

            {/* Hashtag and Posts Count */}
            <View className="flex-col justify-center">
              <TextScallingFalse
                className="text-white text-4xl"
                style={{ fontWeight: "500" }}
              >
                #{hashData.hashtag}
              </TextScallingFalse>
              <TextScallingFalse className="text-[#6E6E6E] text-2xl">
                {hashData.postCount} posts
              </TextScallingFalse>
            </View>
          </View>

          {/* Divider */}
          <View className=" h-[0.6px] bg-[#303030] my-4 ml-12 mr-6" />
        </TouchableOpacity>
      ))}
    </>
  );
};
export default Hashtag;
