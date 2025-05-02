import React, { useEffect, useRef } from "react";
import { View, FlatList, TouchableOpacity, Platform, KeyboardAvoidingView, Dimensions, Animated } from "react-native";
import TextScallingFalse from "../CentralText"; // Adjust the import path
import TextInputSection from "../TextInputSection";   // Adjust the import path
import BackIcon from "../SvgIcons/Common_Icons/BackIcon";

interface Prediction {
    place_id: string;
    description: string;
}

interface LocationSuggestionViewProps {
    addressPickup: string;
    handleAddressChange: (text: string) => void;
    handlePlaceSelect: (item: Prediction) => void;
    predictions: Prediction[];
    setShowSuggestions: (value: boolean) => void;
}
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const LocationSuggestionView: React.FC<LocationSuggestionViewProps> = ({
    addressPickup,
    handleAddressChange,
    handlePlaceSelect,
    predictions,
    setShowSuggestions,
}) => {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current; // Start off-screen (bottom)

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0, // Slide to top (position 0)
            duration: 300, // 300ms for smoothness
            useNativeDriver: true,
        }).start();
    }, []);
    const handleCloseModal = () => {
        Animated.timing(slideAnim, {
            toValue: SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowSuggestions(false);
        });
    };
    
    return (
        <Animated.View
            style={{
                transform: [{ translateY: slideAnim }],
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                position: 'absolute',
                zIndex: 100,
                paddingTop: '10%'
            }}
        >
            <View style={{
                flexDirection: 'row', width: '100%', 
                alignItems: 'center', paddingHorizontal: 12, paddingBottom: 10
            }}>
                <TouchableOpacity style={{ width: 40, height: 40, justifyContent:'center'}} onPress={handleCloseModal} activeOpacity={0.5}>
                    <BackIcon />
                </TouchableOpacity>
                <TextInputSection
                    placeholder="Enter location"
                    value={addressPickup}
                    onChangeText={handleAddressChange}
                    autoCapitalize="none"
                    autoFocus={true}
                    style={{
                        backgroundColor: "#2A2A2A",
                        padding: 12,
                        borderRadius: 10,
                        color: "white",
                        marginBottom: 15,
                    }}
                />
            </View>

            <View style={{ width: '100%', height:'100%'}}>
                <FlatList
                    data={predictions}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                                handlePlaceSelect(item);
                                handleCloseModal();
                            }}
                            style={{
                                paddingHorizontal: 22, paddingVertical: 14,
                                borderBottomWidth: index === predictions.length - 1 ? 0 : 0.5,
                                borderBottomColor: "#404040",
                            }}
                        >
                            <TextScallingFalse style={{ color: "white" }}>
                                {item.description}
                            </TextScallingFalse>
                        </TouchableOpacity>
                    )}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={true}
                    indicatorStyle="white"
                />
            </View>
        </Animated.View>
    );
};

export default LocationSuggestionView;
