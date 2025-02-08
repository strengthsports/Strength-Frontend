import React, { useState } from 'react';
import { ActivityIndicator, Modal, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import TextScallingFalse from '~/components/CentralText';
import { useRouter } from 'expo-router';
import AddPostHeader from '~/components/feedPage/addPostHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '~/constants/Colors';
import { Divider } from 'react-native-elements';
import { useAddPostMutation } from '~/reduxStore/api/addPostApi';

export default function AddPost() {
  const router = useRouter();
  const [postText, setPostText] = useState('');
  const [isImageRatioModalVisible, setIsImageRatioModalVisible] = useState(false);
  const [addPost, { isLoading }] = useAddPostMutation();

  const handlePostSubmit = async () => {
    if (!postText.trim()) return; // Prevent empty post submission

    try {
      await addPost({ assets: [], caption: postText.trim() }).unwrap();
      setPostText('');
      console.log('Post added successfully!');
    //   router.push('/feed'); // Navigate back to feed or another screen
    } catch (error) {
      console.log('Failed to add post. Please try again.');
    }
  };

  return (
    <>
      <View className='flex flex-row items-center justify-between p-4'>
        <AddPostHeader />
        {/* Post button */}
        <TouchableOpacity
          className={`px-5 py-1 rounded-full ${postText.trim() ? 'bg-theme' : 'bg-gray-500'}`}
          disabled={!postText.trim() || isLoading}
          onPress={handlePostSubmit}
        >
          {isLoading ? (
            <ActivityIndicator color='white' />
          ) : (
            <TextScallingFalse className='text-white text-3xl'>Post</TextScallingFalse>
          )}
        </TouchableOpacity>
      </View>

      {/* Text Area */}
      <ScrollView className='p-6'>
        <TextInput
          autoFocus={true}
          multiline
          placeholderTextColor='grey'
          placeholder='What is on your mind...'
          value={postText}
          onChangeText={setPostText}
          className='min-h-24 h-auto align-top text-white text-4xl'
        />
      </ScrollView>

      {/* Bottom Section */}
      <View className='flex flex-row justify-between items-center py-2 px-4'>
        <TouchableOpacity className='flex flex-row gap-2 items-center pl-2 py-1 border border-theme rounded-md'>
          <MaterialCommunityIcons name='earth' size={20} color={Colors.themeColor} />
          <TextScallingFalse className='text-theme text-3xl'>Public</TextScallingFalse>
          <MaterialCommunityIcons name='menu-down' size={24} color={Colors.themeColor} />
        </TouchableOpacity>
        <View className='flex flex-row justify-between gap-2'>
          {/* Modal */}
          <TouchableOpacity onPress={() => setIsImageRatioModalVisible(true)}>
            <Modal
              visible={isImageRatioModalVisible}
              transparent
              animationType='slide'
              onRequestClose={() => setIsImageRatioModalVisible(false)}
            >
              <TouchableOpacity
                className='flex-1 justify-end bg-black/50'
                activeOpacity={1}
                onPress={() => setIsImageRatioModalVisible(false)}
              >
                <ImageRatioModal />
              </TouchableOpacity>
            </Modal>
            <MaterialCommunityIcons name='image-multiple' size={24} color={Colors.themeColor} />
          </TouchableOpacity>
          <MaterialCommunityIcons name='dots-horizontal' size={24} color={Colors.themeColor} />
        </View>
      </View>
    </>
  );
}

const ImageRatioModal = () => {
  return (
    <View className='h-28 w-[104%] bg-neutral-900 self-center rounded-t-[40px] p-4 border-t border-x border-neutral-700'>
      <Divider className='w-16 self-center rounded-full bg-neutral-700 my-1' width={4} />
      <View className='flex-1 justify-evenly'>
        <TouchableOpacity>
          <MaterialCommunityIcons name='delete' size={20} color='red' />
          <TextScallingFalse className='text-red-600 ml-4'>Delete</TextScallingFalse>
        </TouchableOpacity>
      </View>
    </View>
  );
};
