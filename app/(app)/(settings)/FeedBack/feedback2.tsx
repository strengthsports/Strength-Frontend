import { StyleSheet, Text, TouchableOpacity, View, Modal, Animated, Image } from 'react-native'
import React, { useState, useEffect, useRef, } from 'react';
import PageThemeView from '~/components/PageThemeView'
import BackIcon from '~/components/SvgIcons/Common_Icons/BackIcon'
import TextScallingFalse from '~/components/CentralText'
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import logo from "@/assets/images/Slogo.png";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { AppDispatch, RootState } from "~/reduxStore";
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import {
    useGetFeedbackQuestionsQuery,
    useSubmitFeedbackResponsesMutation,
    useGetFeedbackCountByUsernameQuery
} from '~/reduxStore/api/feedback/feedbackApi';
import { Audio } from 'expo-av';

const feedback2 = () => {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const { data, error } = useGetFeedbackQuestionsQuery();
    const onClose = () => setVisible(false);
    const soundRef = useRef<Audio.Sound | null>(null);
    const slideAnim = useRef(new Animated.Value(100)).current; // Start 100px down
    const fadeAnim = useRef(new Animated.Value(1)).current; // For fade in/out
    const [step, setStep] = useState(0); // 0-based index for feedbackSteps
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const [userResponses, setUserResponses] = useState<
        { questionId: string; questionText: string; answer: string }[]>([]);
    const user = useSelector((state: RootState) => state.profile.user);
    const [submitFeedbackResponses] = useSubmitFeedbackResponsesMutation();
    const username = useSelector((state: RootState) => state.profile.user?.username);
    const { data: feedbackCountData, refetch: refetchFeedbackCount, } = useGetFeedbackCountByUsernameQuery(
        username ?? skipToken
    );




    useEffect(() => {
        const timer = setTimeout(() => {
            playSound(); // Play sound
            setVisible(true);
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }, 500);

        return () => {
            clearTimeout(timer);
            if (soundRef.current) {
                soundRef.current.unloadAsync(); // Cleanup sound
            }
        };
    }, []);

    const playSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('@/assets/sounds/feedback.wav') // path to your sound
            );
            soundRef.current = sound;
            await sound.playAsync();
        } catch (error) {
            console.log("Error playing sound:", error);
        }
    };

    const handleNextStep = () => {
        // Animate slide down and fade out simultaneously
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 50, // slide down
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0, // fade out
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // After hiding, set modal invisible
            setVisible(false);

            // Wait before reopening
            setTimeout(() => {
                // Reset values before showing again
                slideAnim.setValue(300);
                fadeAnim.setValue(0);
                setVisible(true);
                playSound();

                // Animate slide up and fade in
                Animated.parallel([
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start();

                const currentStep = feedbackSteps[step];

                // ✅ Save the current answer locally before moving on
                if (selectedOption) {
                    setUserResponses(prev => [
                        ...prev,
                        {
                            questionId: currentStep._id,
                            questionText: currentStep.question,
                            answer: selectedOption,
                        },
                    ]);
                }
                console.log('userResponses-', userResponses)

                // Go to next step or finish
                if (step < feedbackSteps.length - 1) {
                    setStep(prev => prev + 1);
                    setSelectedOption(null);
                } else {
                    // Handle final step or exit
                    console.log("Feedback completed");
                    router.back();
                }
            }, 300);
        });
    };


    const handleFinalSubmit = async (finalResponses: {
        questionId: string;
        questionText: string;
        answer: string;
    }[]) => {
        if (!user || !user.firstName || !user.lastName || !user.username) {
            console.warn("⚠️ Incomplete user info, cannot submit feedback.");
            return;
        }

        try {
            await submitFeedbackResponses({
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                },
                responses: finalResponses,
            }).unwrap();
            refetchFeedbackCount();
            console.log("✅ Feedback submitted successfully!");
            handleNextStep(); // Or navigate wherever you want
        } catch (error) {
            console.error("❌ Failed to submit feedback:", error);
        }
    };

    const feedbackSteps = data || [];


    const progressAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const progress = (step + 1) / feedbackSteps.length;

        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false, // because we're animating width
        }).start();
    }, [step]);


    return (
        <PageThemeView>
            <View style={{ height: '100%', width: '100%', backgroundColor: '#220322' }}>
                {/* header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' }}>
                    <TouchableOpacity style={{ width: 100, height: 60, justifyContent: 'center' }} onPress={() => router.back()}>
                        <BackIcon />
                    </TouchableOpacity>
                    <TextScallingFalse style={{ color: 'white', fontSize: 17, fontWeight: '500' }}>Feedback</TextScallingFalse>
                    <View style={{ width: 100, height: 40, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <TextScallingFalse style={{
                            color: 'grey', fontSize: 14, fontWeight: '400'
                        }}>
                            Counts: {feedbackCountData?.count ?? 0}
                        </TextScallingFalse>
                    </View>
                </View>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}>
                    <TextScallingFalse style={{ color: 'white', fontSize: 25, fontWeight: '600' }}>Hey {user?.firstName}</TextScallingFalse>
                    <TextScallingFalse style={{ color: 'white', fontSize: 20, fontWeight: '500', paddingTop: 5 }}>Hope you are doing great!</TextScallingFalse>
                </View>

                {/* background Loop pattern */}
                {visible && (
                    <View style={{ flex: 1, paddingTop: '20%' }} pointerEvents="box-none">
                        <View style={styles.centeredContainer} pointerEvents="box-none">
                            {/* Animated Card */}
                            <Animated.View
                                style={[
                                    styles.blurCard,
                                    {
                                        transform: [{ translateY: slideAnim }],
                                        opacity: fadeAnim, // Apply fade animation
                                        gap: step > 1 ? 10 : 0,
                                    }
                                ]}
                                pointerEvents="auto" // So buttons behind are still clickable
                            >
                                {/* Glowing Background */}
                                <LinearGradient
                                    colors={[
                                        "rgba(18, 10, 20, 0)",
                                        "rgba(101, 21, 107, 0.4)",
                                        "rgba(116, 20, 111, 0.7)"
                                    ]}
                                    start={{ x: 0.5, y: 1 }}
                                    end={{ x: 0.5, y: 0 }}
                                    style={styles.gradientFlare}
                                    pointerEvents="none"
                                />
                                <BlurView
                                    intensity={300}
                                    tint="dark"
                                    style={StyleSheet.absoluteFill}
                                />
                                <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 30, paddingVertical: 40 }}>
                                    <View style={{ flexDirection: 'row', width: '100%', gap: 10, alignItems: 'center' }}>
                                        <Image source={logo} style={{ width: 22, height: 22, }} />
                                        <TextScallingFalse style={{ color: 'white', fontSize: 25, fontWeight: '700' }}>Strength</TextScallingFalse>
                                    </View>
                                    <TextScallingFalse style={{ color: 'white', fontSize: 20, fontWeight: '500', lineHeight: 27, width: '100%', paddingVertical: 30 }}>
                                        {!feedbackSteps[step]?.question ? 'Loading...' : feedbackSteps[step].question}
                                    </TextScallingFalse>
                                    <View style={{
                                        flexDirection: 'row', flexWrap: 'wrap', gap: '3%', rowGap: 10, paddingBottom: step === 3 ? 30 : 0,
                                        justifyContent: 'center', alignItems: 'center',
                                    }}>
                                        {feedbackSteps[step]?.options?.map((opt, index) => {
                                            const label = typeof opt === 'string' ? opt : opt.label;
                                            const icon = typeof opt === 'string' ? null : opt.icon;

                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    key={index}
                                                    style={{
                                                        paddingVertical: 6,
                                                        paddingHorizontal: 13,
                                                        borderRadius: 8,
                                                        backgroundColor: selectedOption === label ? 'rgba(114, 33, 124, 0.84)' : 'transparent',
                                                        borderWidth: 1,
                                                        borderColor: 'rgba(255, 255, 255, 0.32)',
                                                        zIndex: 100,
                                                        alignItems: 'center',
                                                    }}
                                                    onPress={() => {
                                                        setSelectedOption(label);

                                                        if (step < feedbackSteps.length - 2) {
                                                            setUserResponses(prev => {
                                                                const updatedResponses = [
                                                                    ...prev,
                                                                    {
                                                                        questionId: feedbackSteps[step]._id,
                                                                        questionText: feedbackSteps[step].question,
                                                                        answer: label,
                                                                    }
                                                                ];
                                                                console.log('userResponses after update:', updatedResponses);
                                                                return updatedResponses;
                                                            });

                                                            handleNextStep();
                                                        } else {
                                                            // Compose final responses manually to include the latest answer
                                                            const finalResponses = [
                                                                ...userResponses,
                                                                {
                                                                    questionId: feedbackSteps[step]._id,
                                                                    questionText: feedbackSteps[step].question,
                                                                    answer: label,
                                                                }
                                                            ];
                                                            console.log('finalResponses to submit:', finalResponses);
                                                            handleFinalSubmit(finalResponses);
                                                        }
                                                    }}

                                                >
                                                    {icon}
                                                    <TextScallingFalse style={{ color: 'white', fontSize: 12, fontWeight: '400', textAlign: 'center', marginTop: icon ? 4 : 0 }}>
                                                        {label}
                                                    </TextScallingFalse>
                                                </TouchableOpacity>
                                            );
                                        })}

                                    </View>
                                </View>
                            </Animated.View>
                        </View>
                    </View>
                )}
                <View style={{ position: 'absolute', width: '100%', justifyContent: 'center', alignItems: 'center', bottom: '22%' }}>
                    {step === 0 || step === 6 ? (
                        <TouchableOpacity activeOpacity={0.7}
                            onPress={() => {
                                if (step === 0) {
                                    handleNextStep();
                                } else {
                                    router.back();
                                }
                            }}
                            style={{ width: '75%', borderRadius: 30, paddingVertical: 10, zIndex: 100, borderColor: '#6F377F', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TextScallingFalse style={{ color: 'white', fontSize: 20, fontWeight: '500' }}>{step === 0 ? "Let's Go" : 'Thank You'}</TextScallingFalse>
                        </TouchableOpacity>
                    ) :
                        <View style={{ width: '70%', alignSelf: 'center' }}>
                            {/* Percentage Text */}
                            <TextScallingFalse style={{ color: 'white', fontSize: 13, fontWeight: '400', marginBottom: 10, textAlign: 'center' }}>
                                {Math.round(((step + 1) / feedbackSteps.length) * 100)}%
                            </TextScallingFalse>

                            {/* Progress Bar */}
                            <View style={{ width: '100%', height: 10, borderRadius: 5, backgroundColor: '#3e2e3e' }}>
                                <Animated.View
                                    style={{
                                        height: '100%',
                                        borderRadius: 5,
                                        backgroundColor: '#b754ff',
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%'],
                                        }),
                                    }}
                                />
                            </View>
                        </View>
                    }
                </View>
                <LinearGradient
                    colors={["rgba(0, 0, 0, 0)", "rgba(rgba(225, 0, 255, 0.84))", "rgb(255, 3, 200)"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 7.5 }}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '37%', // 28 * 4 (since Tailwind unit is 4px by default)
                    }}
                />
            </View>
        </PageThemeView>
    )
}

export default feedback2
const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: '50%',
    },
    gradientFlare: {
        width: '100%',
        position: 'absolute',
        shadowColor: 'rgba(64, 18, 68, 0.7)',
        shadowOpacity: 1,
        height: 250,
        shadowRadius: 30,
        elevation: 200,
    },
    blurCard: {
        position: 'absolute',
        width: '85%',
        borderRadius: 30,
        overflow: 'hidden',
        borderColor: 'rgba(255, 255, 255, 0.16)',
        borderWidth: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
})