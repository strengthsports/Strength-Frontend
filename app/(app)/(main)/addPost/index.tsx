import React from 'react'
import { TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import TextScallingFalse from '~/components/CentralText'
import { useRouter } from "expo-router";
import AddPostHeader from '~/components/feedPage/addPostHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { Colors } from '~/constants/Colors';

export default function addPost() {
    const router = useRouter();

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
        <View className='flex flex-row justify-between items-center py-2 px-4' >
            <TouchableOpacity className='flex flex-row gap-2 items-center pl-2 py-1 border border-theme rounded-md' >
                <MaterialCommunityIcons style={{margin:0, padding:0}} name="earth" size={20} color={Colors.themeColor} />
                <TextScallingFalse className='text-theme text-3xl  '>Public</TextScallingFalse>
                <MaterialCommunityIcons name="menu-down" size={24} color={Colors.themeColor} />
            </TouchableOpacity>
            <View className='flex flex-row justify-between gap-2' >
                <MaterialCommunityIcons name="image-multiple" size={24} color={Colors.themeColor} />
                <MaterialCommunityIcons name="dots-horizontal" size={24} color={Colors.themeColor} />

            </View>
        </View>
        
    </>)
}
