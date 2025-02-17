import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import TextScallingFalse from '~/components/CentralText';
import { useRouter } from 'expo-router';
import AddPostHeader from '~/components/feedPage/addPostHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '~/constants/Colors';
import { Divider } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Swiper from 'react-native-swiper';
import { swiperConfig } from '~/utils/swiperConfig';
import { useAddPostMutation } from '~/reduxStore/api/feed/features/feedApi.addPost';

export default function AddPost() {
  const router = useRouter();
  const [postText, setPostText] = useState('');
  const [isImageRatioModalVisible, setIsImageRatioModalVisible] = useState(false);
  const [pickedImageUris, setPickedImageUris] = useState<string[]>([]); // Array to store multiple image URIs
  const [addPost, { isLoading }] = useAddPostMutation();

  const handlePostSubmit = async () => {
    if (!postText.trim() && pickedImageUris.length === 0) return;
  
    try {
      const formData = new FormData();
  
      // Append the caption
      formData.append("caption", postText.trim());
  
      // Append each image file
      pickedImageUris.forEach((uri, index) => {
        const file = {
          uri,
          name: `image_${index}.jpg`, // Generate a unique name
          type: "image/jpeg", // Adjust the type based on the actual file type
        };
        formData.append("assets", file);
      });
  
      // Log the FormData object
   
        console.log('formData',formData._parts);
   
  
      // Use the RTK Query mutation to send the request
      await addPost(formData).unwrap();
  
      // Reset the form and navigate
      setPostText('');
      setPickedImageUris([]);
      router.push('/(app)/(tabs)/home');
    } catch (error) {
      console.error('Failed to add post:', error);
      alert('Failed to add post. Please try again.');
    }
  };

  const pickImage = async (ratio: [number, number]) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access media library is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: ratio,
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrected media type
      allowsMultipleSelection: true, // Enable multiple image selection
    });

    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map((asset) => asset.uri);
      console.log('Picked Image :', result);
      setPickedImageUris(uris); // Update state with the new URIs
      setIsImageRatioModalVisible(false);
    }
  };

  return (
    <>
      <View className='flex flex-row items-center justify-between p-4'>
        <AddPostHeader />
        <TouchableOpacity
          className={`px-5 py-1 rounded-full ${postText.trim() || pickedImageUris.length > 0 ? 'bg-theme' : 'bg-neutral-600'}`}
          // disabled={(!postText.trim() && pickedImageUris.length === 0) || isLoading}
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
          autoFocus
          multiline
          placeholderTextColor='grey'
          placeholder='What is on your mind...'
          value={postText}
          onChangeText={setPostText}
          className='min-h-24 h-auto align-top text-white text-4xl'
        />

        {/* Display Multiple Images */}
        {pickedImageUris.length > 0 && (
          <Swiper {...swiperConfig} className='aspect-[3/2] w-full h-auto rounded-l-[20px] bg-slate-400'>
            {pickedImageUris.map((uri, index) => (
              <Image
                key={index}
                className='w-full h-full object-cover'
                source={{ uri }}
                resizeMode='cover'
              />
            ))}
          </Swiper>
        )}
      </ScrollView>

      {/* Bottom Section */}
      <View className='flex flex-row justify-between items-center py-2 px-4'>
        <TouchableOpacity className='flex flex-row gap-2 items-center pl-2 py-1 border border-theme rounded-md'>
          <MaterialCommunityIcons name='earth' size={20} color={Colors.themeColor} />
          <TextScallingFalse className='text-theme text-3xl'>Public</TextScallingFalse>
          <MaterialCommunityIcons name='menu-down' size={24} color={Colors.themeColor} />
        </TouchableOpacity>
        <View className='flex flex-row justify-between gap-2'>
          {/* Image Ratio Modal */}
          <TouchableOpacity onPress={() => setIsImageRatioModalVisible(true)}>
            <MaterialCommunityIcons name='image-multiple' size={24} color={Colors.themeColor} />
          </TouchableOpacity>
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
              <ImageRatioModal pickImage={pickImage} />
            </TouchableOpacity>
          </Modal>
          <MaterialCommunityIcons name='dots-horizontal' size={24} color={Colors.themeColor} />
        </View>
      </View>
    </>
  );
}

interface ImageRatioModalProps {
  pickImage: (ratio: [number, number]) => void;
}

const ImageRatioModal = ({ pickImage }: ImageRatioModalProps) => (
  <View className='h-1/3 w-[104%] bg-neutral-900 self-center rounded-t-[40px] p-4 border-t border-x border-neutral-700'>
    <Divider className='w-16 self-center rounded-full bg-neutral-700 my-1' width={4} />
    <TextScallingFalse className="text-white self-center text-4xl my-4">
      Select Aspect Ratio
    </TextScallingFalse>
    <View className='flex flex-row items-center'>
      <View className='flex gap-4 mx-4'>
        <Figure width={36} height={36} text='1:1' onPress={() => pickImage([1, 1])} />
        <Figure width={36} height={24} text='3:2' onPress={() => pickImage([3, 2])} />
        <Figure width={36} height={45} text='4:5' onPress={() => pickImage([4, 5])} />
      </View>
    </View>
  </View>
);

interface FigureProps {
  width: number;
  height: number;
  text: string;
  onPress: () => void;
}

const Figure = ({ width, height, text, onPress }: FigureProps) => (
  <TouchableOpacity className='flex flex-row items-center' onPress={onPress}>
    <View
      style={{ height, width }}
      className='bg-neutral-500 border border-neutral-100 rounded'
    />
    <TextScallingFalse className='text-white text-4xl ml-4'>{text}</TextScallingFalse>
  </TouchableOpacity>
);