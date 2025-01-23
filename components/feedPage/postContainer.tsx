import {
  View,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { MaterialIcons } from '@expo/vector-icons';
import Swiper from "react-native-swiper";
import { Divider } from "react-native-elements";

export default function PostContainer() {
  return (
// Outer Div
    <View className="relative w-full max-w-xl self-center min-h-48 h-auto my-8  ">
      <View className="absolute left-[6%] flex flex-row gap-3 z-20">        
        <Image
            className="w-16 h-16 rounded-full "
            src={
            "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8"
            }
        />
        <View>
            <TextScallingFalse className="text-white font-bold">Rahul Sharma</TextScallingFalse>
            <TextScallingFalse className="text-white text-xs">Cricketer | Right hand batsman</TextScallingFalse>
        </View>
      </View>

{/* grey div */}
        <View className="relative left-[6%] bottom-0 w-[94%] min-h-36 h-auto mt-11 rounded-l-[60px] rounded-r-[30px] pb-4 bg-neutral-900">
          
          <View className="w-full pl-16 pt-3 flex flex-row justify-between items-center ">
            <View className="flex flex-row justify-center items-center">
              <TextScallingFalse className="text-xs ml-3 text-neutral-400">8 h ago  &bull;  </TextScallingFalse>
              <MaterialIcons name="public" size={12} color="gray" />
            </View>
            <MaterialIcons className="mr-6" name="more-horiz" size={20} color="white" />
          </View>
          {/* Caption */}
          <View className="pl-12 pr-4 py-8">            
            <TextScallingFalse className="text-sm text-white ">A long para of text to show on s UI asd asd sdas so tha the best of us may be as thje leavemealine</TextScallingFalse>
          </View>
          {/* Image */}
          {/* <View className=""> */}
      {/* Image */}
      <Swiper
        autoplay={false}
        autoplayTimeout={3}
        showsPagination={true}
        loop={false}
        paginationStyle={{ bottom: -24 }}
        dotStyle={{
          backgroundColor: 'grey',
          width: 4,
          height: 4,
          marginHorizontal: 20,
        }}
        activeDotStyle={{
          backgroundColor: "white",
          width: 5,
          height: 5,
          marginHorizontal: 20,
        }}
        // style={{ height: 250, marginTop: 0.5 }}
        className="aspect-[3/2] w-[106%] h-auto rounded-l-[20px]  ml-[-6%] bg-slate-400 " 

      >
       <Image
            className="w-full h-full object-cover" 
            src={
            "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2Fec810ca3-96d1-4101-981e-296240d60437.jpg?alt=media&token=da6e81af-e2d0-49c0-8ef0-fe923f837a07"
            }
            resizeMode="cover"
        />
          <Image
            className="w-full h-full object-cover" 
            src={
            "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8"
            }
            resizeMode="cover"
        />

      </Swiper>

          <View className="w-full pl-8 pr-6 py-3  flex flex-row justify-between items-center">
            <View className="flex flex-row justify-between items-center gap-2" >
              <MaterialIcons name="thumb-up" size={16} color="yellow" />
              <TextScallingFalse className="text-sm text-white ">40 likes</TextScallingFalse>
            </View>
            <TextScallingFalse className="text-sm text-white ">3 Comments</TextScallingFalse>
          </View>

          <Divider  style={{ marginLeft:'12%',  width:'80%'}} width={0.2}/>

          <View className="w-full pl-16 pr-6 py-3  flex flex-row justify-between items-center ">
            <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
              <MaterialIcons name="thumb-up-off-alt" size={16} color="gray" />
              <TextScallingFalse className="text-sm text-white ">like</TextScallingFalse>
            </View>
            <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
              <MaterialIcons name="comment" size={16} color="gray" />
              <TextScallingFalse className="text-sm text-white ">Comment</TextScallingFalse>
            </View>
            <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
              <MaterialIcons name="share" size={16} color="gray" />
              <TextScallingFalse className="text-sm text-white ">Share</TextScallingFalse>
            </View>
          </View>


        </View>

    </View>
  );
}
