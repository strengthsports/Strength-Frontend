import { MaterialIcons } from "@expo/vector-icons";
import React, { memo, useEffect } from "react";
import { ImageStyle, ScrollView, TextInput } from "react-native";
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";
import { useFetchLikersQuery } from "~/reduxStore/api/likerApi";
import TextInputSection from "../TextInputSection";
import { Input } from "../ui/input";

interface LikersListProps {
    targetId: string;
    targetType: string;
}

const ITEM_HEIGHT = 60; // Fixed height of each item in pixels

const LikerCard = () => (<>


    <View className="pl-12 pr-1 py-2 my-2 relative">
        <TouchableOpacity
        className="w-14 h-14 absolute left-4 top-0 z-10 aspect-square rounded-full bg-slate-400"
        // onPress={{}}
        >
        <Image
            className="w-full h-full rounded-full"
            source={{
            uri:"https://images.unsplash.com/photo-1738070593158-9e84a49e7e60?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={
            {
                elevation: 8,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.8,
                shadowRadius: 4,
            } as ImageStyle
            }
        />
        </TouchableOpacity>
        {/* grey box */}
        <View className="relative w-full bg-neutral-900 rounded-xl py-2 px-10">
            {/* time and more dot */}
            <View className="absolute right-3 top-2 flex flex-row items-center gap-2 ">
                <Text className="text-xs text-neutral-300">1w </Text>
                <MaterialIcons name="more-horiz" size={16} color="white" />
            </View>
            {/* name and headline */}
            <View >
                <Text className="font-bold text-white text-lg">Prathik Jha</Text>
                <Text className="text-xs text-neutral-200">Cricketer | Unstoppable #07</Text>
            </View>
            {/* caption */}
            <Text className="text-xl  text-white my-4">So the this was absolute best the very  a a perfoemance </Text>
        </View>
        <View className="flex-row gap-2 items-center ml-10 mt-1">
            <TouchableOpacity className="">
                <Text className="text-white text-lg">Like</Text>
            </TouchableOpacity>
            <Text className="text-xs  text-white ">|</Text>
            <TouchableOpacity className="">
                <Text className="text-white text-lg">Reply</Text>
            </TouchableOpacity>
        </View>
    </View>
</>);

const CommentModal = memo(() => {
    //   const { data, error, isLoading, refetch } = useFetchLikersQuery({
    //     targetId,
    //     targetType,
    //   });

    //   useEffect(() => {
    //     refetch();
    //   }, [refetch]);

    //   if (error) {
    //     console.log("api response", error)

    //     // return <Text className="text-red-500 text-center mt-4"> Error fetching likers</Text>
    //   }
    // if (!data?.data?.length) return <Text className="text-white text-center mt-4">No Likes</Text>;

    const getItemLayout = (_: any, index: number) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    });

    return (
        <View className="h-3/4 w-[104%] self-center bg-black rounded-t-[40px] p-4 border-t border-x border-neutral-700">
            
            <Divider
                className="w-16 self-center rounded-full bg-neutral-700 my-1"
                width={4}
            />
                <Text className="text-white self-center text-2xl my-4">Like</Text>

            {/* {isLoading && <ActivityIndicator color="#12956B" className="mt-4" />}
    {/* {!data && <Text className="text-white text-center mt-4">No Likes</Text>} */}
            {/* {error && <Text className="text-red-500 text-center mt-4"> Error fetching likers</Text>} */} 

            {/* {!isLoading && !error && data?.data?.length > 0 ? ( */}
            {/* <FlatList
        //   data={data?.data}
          keyExtractor={(item) => item.liker._id}
          renderItem={({ item }) => <LikerCard liker={item.liker} />}
          contentContainerStyle={{ padding: 10 }}
          getItemLayout={getItemLayout}
          initialNumToRender={18}
        /> */}
        <ScrollView >

            <LikerCard />
            <LikerCard />
            <LikerCard />
            <LikerCard />
            <LikerCard />
            <LikerCard />
            <LikerCard />
            <LikerCard />
        </ScrollView>
            {/* ) : ( */}
            {/* !isLoading && !error && (
          <Text className="text-white text-center mt-4">No Likes</Text>
        )
      )} */}
              <Divider
                className="w-full self-center rounded-full bg-neutral-900 "
                width={0.3}
            />
            <View className="bg-black  p-2">
                <View className="w-full self-center flex items-center flex-row justify-around rounded-full bg-neutral-900">
                    <Input 
                    placeholder="Add a comment"
                    className="w-3/4 px-4 bg-neutral-900 border-0 color-white  "
                    placeholderTextColor='grey'
                    
                    />
                    <TouchableOpacity>
                        <MaterialIcons className="" name="send" size={22} color="grey" />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
});

export default CommentModal;
