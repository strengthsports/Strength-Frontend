import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import TextScallingFalse from '~/components/CentralText'
import { useRouter } from "expo-router";
import { useSelector } from 'react-redux';
import defaultPic from "../../assets/images/nopic.jpg";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AddPostHeader() {
    const router = useRouter();
    const { user } = useSelector((state: any) => state?.auth);

    return (
        <View className='flex flex-row items-center gap-4'>
            <TouchableOpacity onPress={() => router.back()}>
                <MaterialCommunityIcons name="keyboard-backspace" size={24} color="white" />
            </TouchableOpacity>
            <Image
                source={user.profilePic ? { uri: user.profilePic } : defaultPic}
                style={{ width: 40, height: 40, borderRadius: 20 }}
            />
            <TextScallingFalse className='text-white text-3xl' >{user.firstName} {user.lastName}</TextScallingFalse>
            
        </View>
    )
}
