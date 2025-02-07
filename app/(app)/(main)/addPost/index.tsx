import React, { useState } from 'react'
import { ActivityIndicator, Modal, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import TextScallingFalse from '~/components/CentralText'
import { useRouter } from "expo-router";
import AddPostHeader from '~/components/feedPage/addPostHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { Colors } from '~/constants/Colors';
import { Divider } from 'react-native-elements';

export default function addPost() {
    const router = useRouter();
    const [isImageRatioModalVisible, setIsImageRatioModalVisible] = useState(false);
    return (<>
        <View className='flex flex-row items-center justify-between p-4'>
            <AddPostHeader />
            {/* post button */}
            <TouchableOpacity className='bg-theme px-5 py-1 text-3xl rounded-full'>
                <TextScallingFalse className='text-white text-3xl'>Post</TextScallingFalse>
            </TouchableOpacity>
        </View>

        {/* Text Area */}
        <ScrollView className='p-6'>
            <TextInput
                autoFocus={true}
                multiline
                placeholderTextColor={'grey'}
                placeholder='What is on your mind...'
                className='min-h-24 h-auto align-top text-white text-4xl'
            />

        </ScrollView>
        {/* bottom section */}
        <View className='flex flex-row justify-between items-center py-2 px-4' >
            <TouchableOpacity className='flex flex-row gap-2 items-center pl-2 py-1 border border-theme rounded-md' >
                <MaterialCommunityIcons style={{ margin: 0, padding: 0 }} name="earth" size={20} color={Colors.themeColor} />
                <TextScallingFalse className='text-theme text-3xl  '>Public</TextScallingFalse>
                <MaterialCommunityIcons name="menu-down" size={24} color={Colors.themeColor} />
            </TouchableOpacity>
            <View className='flex flex-row justify-between gap-2' >
                {/* modal */}
                <TouchableOpacity onPress={() => setIsImageRatioModalVisible(true)} >
                    <Modal
                        visible={isImageRatioModalVisible}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setIsImageRatioModalVisible(false)}
                    >
                        <TouchableOpacity
                            className="flex-1 justify-end bg-black/50"
                            activeOpacity={1}
                            onPress={() => setIsImageRatioModalVisible(false)}
                        >
                            <ImageRatioModal />
                        </TouchableOpacity>
                    </Modal>
                    <MaterialCommunityIcons name="image-multiple" size={24} color={Colors.themeColor} />
                </TouchableOpacity>
                <MaterialCommunityIcons name="dots-horizontal" size={24} color={Colors.themeColor} />
            </View>
        </View>

    </>)
}

const ImageRatioModal = () => {
    return (
        <View className="h-28 w-[104%] bg-neutral-900 self-center rounded-t-[40px] p-4 border-t border-x border-neutral-700">
            <Divider
                className="w-16 self-center rounded-full bg-neutral-700 my-1"
                width={4}
            />

            <View className="flex-1 justify-evenly">
                <TouchableOpacity>

                    <MaterialCommunityIcons name="delete" size={20} color="red" />

                    <TextScallingFalse className="text-red-600 ml-4">
                        Delete
                    </TextScallingFalse>
                </TouchableOpacity>

            </View>
        </View>
    )
}