import React, { memo, useState, useEffect } from 'react';
import { ImageStyle, ScrollView, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Divider } from 'react-native-elements';
import { Input } from '../ui/input';
import { MaterialIcons } from '@expo/vector-icons';
import { useFetchCommentsQuery, usePostCommentMutation } from '~/reduxStore/api/postCommentApi';

interface CommentModalProps {
    autoFocusKeyboard?: boolean;
    targetId: string; // Ensure targetId is passed as a prop
}

const CommenterCard = ({ comment }) => (
    <View className="pl-12 pr-1 py-2 my-2 relative">
        <TouchableOpacity className="w-14 h-14 absolute left-4 top-0 z-10 aspect-square rounded-full bg-slate-400">
            <Image
                className="w-full h-full rounded-full"
                source={{
                    uri: comment?.commenter?.profilePic || 'https://via.placeholder.com/150', // Fallback image
                }}
                style={{
                    elevation: 8,
                    shadowColor: 'black',
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
                <Text className="font-bold text-white text-lg">
                    {comment?.commenter?.firstName} {comment?.commenter?.lastName}
                </Text>
                <Text className="text-xs text-neutral-200">{comment?.commenter?.headline}</Text>
            </View>
            <Text className="text-xl text-white my-4">{comment?.text}</Text>
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

    // Fetch comments for the target
    const {
        data: comments,
        error: fetchError,
        isLoading: isFetching,
        refetch: refetchComments,
    } = useFetchCommentsQuery({ targetId, targetType: 'Post' });

    // console.log('comments array:', comments?.data)

    // Mutation for posting a comment
    const [postComment, { isLoading: isPosting }] = usePostCommentMutation();


    const handlePostComment = async () => {
        if (!commentText.trim()) return;

        const commentData = {
            targetId,
            targetType: 'Post',
            text: commentText,
        };
        console.log('post Comment:', commentData)

        try {
            await postComment(commentData).unwrap(); // Post the comment
            setCommentText(''); 
            refetchComments(); // Refetch comments to update the list
        } catch (error) {
            console.log('Failed to post comment:', error);
        }
    };

    // Log errors if fetching comments fails
    useEffect(() => {
        if (fetchError) {
            console.error('Failed to fetch comments:', fetchError);
        }
    }, [fetchError]);

    return (
        <View className="h-3/4 w-[104%] self-center bg-black rounded-t-[40px] p-4 border-t border-x border-neutral-700">
            <Divider className="w-16 self-center rounded-full bg-neutral-700 my-1" width={4} />
            <Text className="text-white self-center text-2xl my-4">Comments</Text>
            <View className='mb-32'>
                {isFetching ? (
                    <ActivityIndicator size="large" color="#12956B" />
                ) : comments?.data?.length > 0 ? (
                    <FlatList
                        data={comments.data}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <CommenterCard comment={item}
                        />}
                    />
                ) : (
                    <Text className="text-white text-center">No comments found.</Text>
                )}
            </View>
            <View className='absolute bottom-0 self-center w-full'>
                <Divider className="w-full self-center rounded-full bg-neutral-900 mb-[1px]" width={0.4} />
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
                        <TouchableOpacity onPress={handlePostComment} disabled={isPosting}>
                            <MaterialIcons name="send" size={22} color={isPosting ? 'gray' : 'grey'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
});

export default CommentModal;