import { View } from "react-native";
import TextScallingFalse from "../CentralText";

const Hashtag = ({ hashtag, postsCount, index }: {hashtag : string, postsCount : string, index : number}) => {
    return (
      <>
        <View className="px-5 flex-row">
          {/* Index */}
          <TextScallingFalse className="text-theme text-5xl mt-1 font-bold mr-5">
            {index}
          </TextScallingFalse>
  
          {/* Hashtag and Posts Count */}
          <View className="flex-col justify-center">
            <TextScallingFalse className="text-white text-4xl font-bold ">{hashtag}</TextScallingFalse>
            <TextScallingFalse className="text-[#ABABAB] text-2xl mt-1">{postsCount} posts</TextScallingFalse>
          </View>
        </View>
  
        {/* Divider */}
        <View
          className=" h-[0.6px] bg-neutral-500 my-3 ml-14 mr-6"
        />
  
      </>
    );
  };
  export default Hashtag