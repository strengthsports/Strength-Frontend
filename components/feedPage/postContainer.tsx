import {
  View,
  TouchableOpacity,
  Text,
  Image,
  LayoutChangeEvent,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { MaterialIcons } from '@expo/vector-icons';
import Swiper from "react-native-swiper";
import { Divider } from "react-native-elements";
import { useCallback, useState, memo, useMemo } from "react";

// Type definitions for components
interface ActionButtonProps {
  iconName: keyof typeof MaterialIcons.glyphMap; // Correct type for icon names
  text: string;
  parentWidth: number;
}

interface SwiperImageProps {
  uri: string;
}

// Memoized components with proper typing
const ActionButton = memo<ActionButtonProps>(({ iconName, text, parentWidth }) => (
  <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
    <MaterialIcons name={iconName} size={16} color="gray" />
    {parentWidth >= 300 && (
      <TextScallingFalse className="text-sm text-white">{text}</TextScallingFalse>
    )}
  </View>
));

const SwiperImage = memo<SwiperImageProps>(({ uri }) => (
  <Image
    className="w-full h-full object-cover"
    source={{ uri }}
    resizeMode="cover"
  />
));

export default function PostContainer() {
  
  const [parentWidth, setParentWidth] = useState<number>(0);
  
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (Math.abs(parentWidth - width) > 5) {
      setParentWidth(width);
    }
  }, [parentWidth]);

  const imageUris = useMemo<string[]>(() => [
    "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2Fec810ca3-96d1-4101-981e-296240d60437.jpg?alt=media&token=da6e81af-e2d0-49c0-8ef0-fe923f837a07",
    "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8"
  ], []);

  const swiperConfig = useMemo(() => ({
    autoplay: false,
    autoplayTimeout: 3,
    showsPagination: true,
    loop: false,
    paginationStyle: { bottom: -22, zIndex:20 },
    dotStyle: {
      backgroundColor: 'grey',
      width: 4,
      height: 4,
      marginHorizontal: 20,
    },
    activeDotStyle: {
      backgroundColor: "white",
      width: 5,
      height: 5,
      marginHorizontal: 20,
      zIndex: 30
    }
  }), []);
  // console.log(parentWidth)

  return (
    <View className="relative w-full max-w-xl self-center min-h-48 h-auto my-8"
    onLayout={handleLayout}>
      <View className="flex">

        {/* Profile Section */}
        <View className={`ml-[6%] flex flex-row gap-3 z-20  ${
      parentWidth >= 300 ? 'pb-0' : 'pb-3'}`}>
          <Image
            className="w-[18%] h-[18%] aspect-square rounded-full bg-slate-400"
            source={{ uri: imageUris[1] }}
          />
          <View>
            <TextScallingFalse className="text-white font-bold">Rahul Sharma</TextScallingFalse>
            <TextScallingFalse className="text-white text-xs">Cricketer | Right hand batsman</TextScallingFalse>
          </View>
        </View>

        {/* Grey Top Caption Div */}
        <View className={`relative left-[6%] bottom-0 w-[94%] min-h-16 h-auto mt-[-20] ${
      parentWidth >= 300 ? 'rounded-tl-[72px] rounded-tr-[20px]' : 'rounded-tl-[44px] rounded-tr-[15px]'}  pb-3 bg-neutral-900`}>
          <View className={`w-full pl-[17%] ${ parentWidth >= 300 ? 'pt-1' : 'pt-0'} flex flex-row justify-between items-center `}>
            <View className="flex flex-row justify-center items-center">
              <TextScallingFalse className="text-xs ml-3 text-neutral-400">8 h ago  &bull;  </TextScallingFalse>
              <MaterialIcons name="public" size={12} color="gray" />
            </View>
            <MaterialIcons className="mr-6" name="more-horiz" size={20} color="white" />
          </View>
          
          <View className="pl-10 pr-4 py-4">
            <TextScallingFalse className="text-sm text-white ">
              A lon asd asd asd  iksad fsafjkakj sfjh hja  h    j a asdss jhasd jhasd hja sdh asd hjaksdkjh 
            </TextScallingFalse>
          </View>
        </View>

        {/* Swiper Section */}
        <Swiper {...swiperConfig} className="aspect-[3/2] w-full h-auto rounded-l-[20px] bg-slate-400">
          {imageUris.map((uri) => (
            <SwiperImage key={uri} uri={uri} />
          ))}
        </Swiper>

        {/* Bottom Grey Div */}
        <View className={`relative left-[6%] bottom-0 w-[94%] min-h-12 h-auto ${
      parentWidth >= 300 ? 'rounded-bl-[72px] rounded-br-[20px]' : 'rounded-bl-[44px] rounded-br-[15px]'}  bg-neutral-900`}>
          <View className="w-full pl-8 pr-6 py-3 flex flex-row justify-between items-center">
            <View className="flex flex-row justify-between items-center gap-2">
              <MaterialIcons name="thumb-up" size={16} color="yellow" />
              <TextScallingFalse className="text-sm text-white ">40 likes</TextScallingFalse>
            </View>
            <TextScallingFalse className="text-sm text-white ">3 Comments</TextScallingFalse>
          </View>

          <Divider style={{ marginLeft: '12%', width: '80%' }} width={0.2} color="grey" />

          <View 
            className="w-full pl-16 pr-6 py-5 mb-1 flex flex-row justify-between items-center" 
          >
            <ActionButton iconName="thumb-up-off-alt" text="Like" parentWidth={parentWidth} />
            <ActionButton iconName="comment" text="Comment" parentWidth={parentWidth} />
            <ActionButton iconName="share" text="Share" parentWidth={parentWidth} />
          </View>
        </View>

      </View>
    </View>
  );
}