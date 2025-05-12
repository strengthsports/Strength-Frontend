import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useRef } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler'
import TextScallingFalse from '~/components/CentralText'
import logo from '@/assets/images/logo2.png'
import Cross from '~/components/SvgIcons/Common_Icons/Cross'
import updateProfile from '@/assets/images/FTU/UpdateProfile.png'
import startFollow from '@/assets/images/FTU/StartFollow.png'
import addOverview from '@/assets/images/FTU/AddOverview.png'
import { useRouter } from "expo-router";
import { setFirstTimeUseFlag } from '~/reduxStore/slices/user/profileSlice';
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";


const SCREEN_WIDTH = Dimensions.get('window').width;

const FeedTopFtu = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.profile.user);
    const profile = useSelector((state: RootState) => state.profile);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);



    const ftuItems = [
        {
            key: 'editProfile',
            visible: !profile?.hasVisitedEditProfile,
            image: updateProfile,
            text: "Add some Professional details to your profile",
            buttonText: "Update profile",
            onPress: () => {
                console.log('Button pressed for');
                dispatch(setFirstTimeUseFlag({ field: "hasVisitedEditProfile" }));
                router.push("/(app)/(profile)/edit-profile");
            }
        },
        {
            key: 'overview',
            visible: !profile?.hasVisitedEditOverview,
            image: addOverview,
            text: "Add sports overview your passion, achievement & journey.",
            buttonText: "Update Overview",
            onPress: () => {
                dispatch(setFirstTimeUseFlag({ field: "hasVisitedEditOverview" }));
                router.push("/(app)/(profile)/edit-overview");
            }
        },
        {
            key: 'community',
            visible: !profile?.hasVisitedCommunity,
            image: startFollow,
            text: "Follow Like Minded Sports Enthusiasts",
            buttonText: "Start following",
            onPress: () => {
                dispatch(setFirstTimeUseFlag({ field: "hasVisitedCommunity" }));
                router.push("/(app)/(tabs)/community");
            }
        }
    ];

    // cross button
    const handleCrossClick = () => {
        // Dispatch all three actions when the cross button is pressed
        dispatch(setFirstTimeUseFlag({ field: "hasVisitedEditProfile" }));
        dispatch(setFirstTimeUseFlag({ field: "hasVisitedEditOverview" }));
        dispatch(setFirstTimeUseFlag({ field: "hasVisitedCommunity" }));

        // You can log or perform other actions as needed
        console.log('All three dispatches executed');
    };

    // Filter visible containers
    const visibleFtuItems = ftuItems.filter(item => item.visible);

    // Handle scroll to update `activeIndex`
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        setActiveIndex(index);
    };

    const ITEM_WIDTH = 300;
    const GAP = 20;

    if (user) {
        console.log("user.hasVisitedEditProfile-", profile?.hasVisitedEditProfile);
        console.log("user.hasVisitedEditOverview-", profile?.hasVisitedEditOverview);
        console.log("user.hasVisitedCommunity-", profile?.hasVisitedCommunity);
    }

    const totalTasks = 3;
    // Function to calculate the progress percentage
    const calculateProgress = () => {
        const completedTasks = [profile?.hasVisitedEditProfile, profile?.hasVisitedEditOverview, profile?.hasVisitedCommunity].filter(Boolean).length;
        return completedTasks; // Returns a value between 0 and 100
    };

    // Calculate progress dynamically
    const completedTasks = calculateProgress();
    const progressPercentage = (completedTasks / totalTasks) * 100;
    const progressWidth = `${progressPercentage}%`;

    return (
        <View style={styles.containermain}>
            <View style={{ width: '100%' }}>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    gap: 10, paddingVertical: 10, paddingHorizontal: 20, paddingTop: 22,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                        <Image style={{ width: 29, height: 29 }} source={logo} />
                        <TextScallingFalse style={{ color: 'white', fontSize: 15, fontWeight: '400' }}>
                            Get set up on Strength!
                        </TextScallingFalse>
                    </View>
                    <TouchableOpacity onPress={handleCrossClick}
                        style={{ width: 60, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Cross />
                    </TouchableOpacity>
                </View>
                {/* //progressive bar */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                    <View style={{
                        width: '69%',
                        height: 14,
                        borderWidth: 0.5,
                        borderColor: '#353535',
                        borderRadius: 20,
                        backgroundColor: '#191919',
                        overflow: 'hidden'
                    }}>
                        <View
                            style={{
                                height: '100%',
                                backgroundColor: '#12965B',
                                width: progressWidth, // Dynamic width based on progress
                            }}
                        />
                    </View>
                    <View style={{
                        width: 73,
                        height: 24,
                        backgroundColor: '#2E2E2E',
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TextScallingFalse style={{ color: 'white', fontSize: 11, fontWeight: '400' }}>
                            {`${completedTasks}/${totalTasks} Done`}
                        </TextScallingFalse>
                    </View>
                </View>
            </View>
            <ScrollView
                horizontal
                onScroll={handleScroll}
                scrollEventThrottle={16}
                ref={scrollRef}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: (Dimensions.get('window').width - ITEM_WIDTH) / 7,
                    flexDirection: 'row',
                    columnGap: GAP,
                    paddingVertical: 15
                }}
            >
                {visibleFtuItems.map((item, index) => (
                    <TouchableOpacity onPress={item.onPress} activeOpacity={0.9} key={item.key} style={styles.container}>
                        <Image source={item.image} style={styles.banner} />
                        <View style={styles.ContainerContent}>
                            <TextScallingFalse style={styles.text}>{item.text}</TextScallingFalse>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={item.onPress}
                                style={styles.button}
                            >
                                <TextScallingFalse style={[styles.text, styles.buttonText]}>
                                    {item.buttonText}
                                </TextScallingFalse>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Scrolling Indicator */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 22, paddingTop: 8 }}>
                {visibleFtuItems.map((_, i) => (
                    <View
                        key={i}
                        style={{
                            height: 6,
                            width: 6,
                            borderRadius: 4,
                            marginHorizontal: 4,
                            backgroundColor: activeIndex === i ? 'white' : '#7F7F7F',
                        }}
                    />
                ))}
            </View>

        </View>
    )
}

export default FeedTopFtu
const ITEM_WIDTH = (374 / 410) * SCREEN_WIDTH;
const styles = StyleSheet.create({
    containermain: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        zIndex: 100,
        borderBottomColor: '#202020',
        borderBottomWidth: 5,
    },
    container: {
        height: 221,
        width: ITEM_WIDTH,
        borderWidth: 1,
        borderColor: '#3F3F3F',
        borderRadius: 14,
    },
    banner: {
        width: '100%',
        height: 137,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14
    },
    ContainerContent: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 10
    },
    button: {
        backgroundColor: '#12956B',
        borderRadius: 21,
        height: 31,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontSize: 12,
        fontWeight: '300'
    },
    buttonText: {
        fontSize: 13,
        fontWeight: '500'
    }
})