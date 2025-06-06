import {
    StyleSheet, Text, TouchableOpacity, View, FlatList,
    Platform, Animated, Easing, Keyboard, Image, KeyboardAvoidingView
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import TextScallingFalse from '~/components/CentralText'
import { TextInput } from 'react-native-gesture-handler'
import PageThemeView from '~/components/PageThemeView'
import { AntDesign, Ionicons } from "@expo/vector-icons";
import BackIcon from '~/components/SvgIcons/Common_Icons/BackIcon'
import { router } from 'expo-router'
import GradientText from '~/components/ui/GradientText'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import stamin from "../../../assets/images/Stamin4.png"

const index = () => {

    type Message = {
        id: string;
        type: 'user' | 'ai';
        text: string;
    };

    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const user = useSelector((state: RootState) => state.profile.user);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');



    // for Hello word animation
    useEffect(() => {
        const keyboardShow = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const keyboardHide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const onKeyboardShow = () => {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -50,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.exp),
                }),
                Animated.timing(scale, {
                    toValue: 0.75,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.exp),
                }),
            ]).start();
        };

        const onKeyboardHide = () => {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.exp),
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.exp),
                }),
            ]).start();
        };

        const showSub = Keyboard.addListener(keyboardShow, onKeyboardShow);
        const hideSub = Keyboard.addListener(keyboardHide, onKeyboardHide);

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);


    const simulateAiReply = () => {
        const fullText = "This is the AI's response with typewriter animation.";
        let index = 0;
        let currentText = '';

        const aiMessageId = Date.now().toString();
        const aiMessage: Message = {
            id: aiMessageId,
            type: 'ai',
            text: '',
        };
        setMessages(prev => [...prev, aiMessage]);

        const interval = setInterval(() => {
            index++;
            currentText = fullText.slice(0, index);

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiMessageId ? { ...msg, text: currentText } : msg
                )
            );

            if (index >= fullText.length) clearInterval(interval);
        }, 30); // Adjust speed here
    };


    const handleSend = () => {
        if (message.trim().length === 0) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            text: message.trim(),
        };

        setMessages(prev => [...prev, newUserMessage]);
        setMessage('');

        simulateAiReply(); // Trigger fake AI reply with animation
    };


    return (
        <PageThemeView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0} // adjust offset if needed
            >
                {/* header */}
                <View style={{ width: '100%', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity activeOpacity={0.4} onPress={() => router.back()} style={{ width: 60, height: 40, justifyContent: 'center' }}>
                        <BackIcon />
                    </TouchableOpacity>
                    <TextScallingFalse style={{ color: 'white', fontSize: 20, fontWeight: '500' }}>Stamin</TextScallingFalse>
                    <View style={{ width: 60 }} />
                </View>

                {/* body */}
                <FlatList
                    data={messages}  // Empty for now or use your data list
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                alignSelf: item.type === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: item.type === 'user' ? '#4A90E2' : '#444',
                                padding: 10,
                                borderRadius: 12,
                                marginVertical: 4,
                                maxWidth: '80%',
                            }}
                        >
                            <TextScallingFalse style={{ color: 'white' }}>{item.text}</TextScallingFalse>
                        </View>
                    )}
                    ListHeaderComponent={
                        <Animated.View style={{
                            transform: [{ translateY }, { scale }], justifyContent: 'center',
                            alignItems: 'center', paddingVertical: 70
                        }}>
                            <GradientText
                                text={`Hello, ${user?.firstName ?? 'User'}`}
                                style={{
                                    fontSize: 32,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                            />
                        </Animated.View>
                    }
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                />

                {/* Bottom chat box */}
                <View style={{ width: '100%', position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center', paddingBottom: 15 }}>
                    <View style={{ borderWidth: 1, borderColor: '#505050', width: '94%', borderRadius: 25, paddingBottom: 10 }}>
                        {/* Chatting bar */}
                        <View style={{ width: '100%', borderRadius: 20, paddingHorizontal: 20, paddingVertical: Platform.OS === 'ios' ? 20 : 10 }}>
                            <TextInput value={message} placeholder='Ask anything'
                                placeholderTextColor={'#CECECE'}
                                onChangeText={setMessage}
                                returnKeyType="send"
                                style={{ color: 'white', fontSize: 15, fontWeight: '400', }} />
                        </View>
                        {/* Chat options and tools */}
                        <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 13, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', gap: 7 }}>
                                <TouchableOpacity style={styles.ChatOptionButtons}>
                                    <AntDesign name="plus" size={15} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ChatOptionButtons}>
                                    {/* <AntDesign name="plus" size={15} color="white" /> */}
                                    <Image source={stamin} style={{ width: 20, height: 20 }} />
                                    <TextScallingFalse style={{ color: 'white', fontSize: 13, fontWeight: '400' }}>Info</TextScallingFalse>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity activeOpacity={0.7} onPress={handleSend} disabled={message.trim().length === 0}
                                style={{ padding: 8, borderRadius: '35%', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="send" size={20} color={message.trim().length > 0 ? 'white' : 'grey'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </PageThemeView>
    )
}

export default index

const styles = StyleSheet.create({
    ChatOptionButtons: {
        padding: 7,
        borderRadius: '35%',
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }
})