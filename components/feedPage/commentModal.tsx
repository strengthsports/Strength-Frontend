// CommentModal.js
import React, { memo, useState } from 'react';
import { ImageStyle, ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import { Input } from '../ui/input';
import { MaterialIcons } from '@expo/vector-icons';
import { usePostCommentMutation } from '~/reduxStore/api/postCommentApi';

interface CommentModalProps {
  autoFocusKeyboard?: boolean;
  targetId: string;
//   targetType: string;
}

const LikerCard = () => (
  <View className="pl-12 pr-1 py-2 my-2 relative">
    <TouchableOpacity className="w-14 h-14 absolute left-4 top-0 z-10 aspect-square rounded-full bg-slate-400">
      <Image
        className="w-full h-full rounded-full"
        source={{
          uri: "https://images.unsplash.com/photo-1738070593158-9e84a49e7e60?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={{
          elevation: 8,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
        } as ImageStyle}
      />
    </TouchableOpacity>

    <View className="relative w-full bg-neutral-900 rounded-xl py-2 px-10">
      <View className="absolute right-3 top-2 flex flex-row items-center gap-2 ">
        <Text className="text-xs text-neutral-300">1w </Text>
        <MaterialIcons name="more-horiz" size={16} color="white" />
      </View>
      <View>
        <Text className="font-bold text-white text-lg">Prathik Jha</Text>
        <Text className="text-xs text-neutral-200">Cricketer | Unstoppable #07</Text>
      </View>
      <Text className="text-xl text-white my-4">So the this was absolute best the very a performance</Text>
    </View>
    <View className="flex-row gap-2 items-center ml-10 mt-1">
      <TouchableOpacity>
        <Text className="text-white text-lg">Like</Text>
      </TouchableOpacity>
      <Text className="text-xs text-white">|</Text>
      <TouchableOpacity>
        <Text className="text-white text-lg">Reply</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const CommentModal = memo(({ autoFocusKeyboard = false, targetId }: CommentModalProps) => {
  const [commentText, setCommentText] = useState('');
  const [postComment] = usePostCommentMutation();

  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    const commentData = {
      targetId, // Replace with actual target ID
      targetType: 'Post', // Replace with actual target type
      text: commentText,
    };

    console.log('trying Comment')
    try {
      console.log('starting Comment')
      await postComment(commentData).unwrap();
      console.log('comment sent')
      setCommentText('');
      // Optionally, you can refetch comments or update the UI here
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  return (
    <View className="h-3/4 w-[104%] self-center bg-black rounded-t-[40px] p-4 border-t border-x border-neutral-700">
      <Divider className="w-16 self-center rounded-full bg-neutral-700 my-1" width={4} />
      <Text className="text-white self-center text-2xl my-4">Comments</Text>

      <ScrollView>
        <LikerCard />
        <LikerCard />
        <LikerCard />
        <LikerCard />
      </ScrollView>

      <Divider className="w-full self-center rounded-full bg-neutral-900" width={0.3} />
      <View className="bg-black p-2">
        <View className="w-full self-center flex items-center flex-row justify-around rounded-full bg-neutral-900">
          <Input
            autoFocus={autoFocusKeyboard}
            placeholder="Add a comment"
            className="w-3/4 px-4 bg-neutral-900 border-0 color-white"
            placeholderTextColor="grey"
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity onPress={handlePostComment}>
            <MaterialIcons className="" name="send" size={22} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default CommentModal;