import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Modal,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import AlertModal from "~/components/modals/AlertModal";
import RequestSuccessfulModal from "./RequestSuccessModal";
import TextScallingFalse from "../CentralText";
import BackIcon from "../SvgIcons/Common_Icons/BackIcon";

interface RequestSportModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: (sportsList: string[]) => void;
}

const RequestSportModal: React.FC<RequestSportModalProps> = ({
    visible,
    onClose,
    onSuccess,
}) => {
    const [sportInput, setSportInput] = useState<string>("");
    const [sportsList, setSportsList] = useState<string[]>([]);
    const [prevInput, setPrevInput] = useState<string>("");
    const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false); // Alert Modal state

    const handleSportInput = (text: string) => {
        if (prevInput.length > text.length && prevInput === "") {
            console.log("Backspace detected! Removing last sport...");
            setSportsList((prev) => prev.slice(0, -1));
        }

        if (text.endsWith(",")) {
            const newSport = text.slice(0, -1).trim();
            if (newSport && !sportsList.includes(newSport)) {
                setSportsList([...sportsList, newSport]);
            }
            setSportInput("");
        } else {
            setSportInput(text);
        }

        setPrevInput(text);
    };

    const removeSport = (sportToRemove: string) => {
        setSportsList(sportsList.filter((sport) => sport !== sportToRemove));
    };

    const handleSendRequest = () => {
        console.log("Sending request for sports:", sportsList);
        onSuccess(sportsList);
    };

    useEffect(() => {
        if (visible) {
            setIsAlertVisible(false); // Reset alert modal every time modal opens
            setSportsList([]);
        }
    }, [visible]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={() => setIsAlertVisible(true)}
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
                {/* Back Button */}
                <View style={{ padding: 20}}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setIsAlertVisible(true)} style={{width: 80, height: 30}}>
                        <BackIcon />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, padding: 16, paddingHorizontal: 30}}>
                    <TextScallingFalse style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
                        Request a Sport
                    </TextScallingFalse>
                    <TextScallingFalse style={{ color: "#A5A5A5", fontSize: 12, marginTop: 8 }}>
                        We'd love to support more sports. Help us out by letting us know
                        which sport we should focus on rolling out.
                    </TextScallingFalse>

                    <View
                        style={{
                            marginTop: 40,
                            borderWidth: 1,
                            borderColor: "white",
                            borderRadius: 8,
                            minHeight: 150,
                            padding: 16,
                            flexWrap: "wrap",
                        }}
                    >
                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            {sportsList.map((sport, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        borderRadius: 20,
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        marginRight: 8,
                                        marginBottom: 8,
                                        borderWidth: 1,
                                        borderColor: "#424242",
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    <TextScallingFalse style={{ color: "white", fontSize: 14 }}>{sport}</TextScallingFalse>
                                    <TouchableOpacity onPress={() => removeSport(sport)}>
                                        <Icon
                                            name="close"
                                            size={16}
                                            color="#fff"
                                            style={{ marginLeft: 8 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        <TextInput
                            style={{
                                color: "white",
                                width: "100%",
                                marginTop: 8,
                                minHeight: 50,
                            }}
                            placeholder=""
                            placeholderTextColor="#888"
                            multiline
                            value={sportInput}
                            onChangeText={handleSportInput}
                        />
                    </View>

                    <TextScallingFalse style={{ color: "#A2A2A2", fontSize: 14, opacity: 0.6, padding: 5}}>
                        Enter a comma after each sport.
                    </TextScallingFalse>

                    <TouchableOpacity
                        style={{
                            marginTop: 24,
                            backgroundColor: "#12956B",
                            borderRadius: 24,
                            paddingVertical: 14,
                            alignItems: "center",
                        }}
                        onPress={handleSendRequest} activeOpacity={0.7}
                    >
                        <TextScallingFalse style={{ color: "white", fontWeight: "bold" }}>
                            Send request
                        </TextScallingFalse>
                    </TouchableOpacity>
                </View>

                {/* Alert Modal */}
                {isAlertVisible && (
                    <AlertModal
                        alertConfig={{
                            title: "Discard Request?",
                            message:
                                "Are you sure you want to go back? Your request data will be lost.",
                            discardAction: () => setIsAlertVisible(false),
                            confirmAction: onClose,
                            confirmMessage: "Yes, Exit",
                            cancelMessage: "Cancel",
                        }}
                        isVisible={isAlertVisible}
                    />
                )}

                <RequestSuccessfulModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                />
            </SafeAreaView>
        </Modal>
    );
};

export default RequestSportModal;
