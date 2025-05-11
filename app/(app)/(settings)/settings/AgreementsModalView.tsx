import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Linking,
    GestureResponderEvent,
    StyleSheet
} from "react-native";

type AgreementsModalViewProps = {
    onClose: (event?: GestureResponderEvent) => void;
};

const AgreementsModalView: React.FC<AgreementsModalViewProps> = ({ onClose }) => {
    return (
        <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={onClose}
        >
            <View style={styles.agreementsModalContainer}>
                <View style={styles.agreementsModal}>
                    <View style={styles.agreementsModalHeader}>
                        <Text style={styles.agreementsModalTitle}>Agreements & Policy</Text>
                        <View style={styles.agreementsModalDivider} />
                    </View>

                    <View style={styles.agreementsModalContent}>
                        <TouchableOpacity
                            onPress={() =>
                                Linking.openURL(
                                    "https://www.yourstrength.in/user-agreement"
                                )
                            }
                            activeOpacity={0.5}
                            style={styles.agreementItem}
                        >
                            <View style={styles.agreementDot} />
                            <Text style={styles.agreementText}>User Agreement</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                Linking.openURL("https://www.yourstrength.in/privacy-policy")
                            }
                            activeOpacity={0.5}
                            style={styles.agreementItem}
                        >
                            <View style={styles.agreementDot} />
                            <Text style={styles.agreementText}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        alignItems: "center",
    },
    agreementsModalContainer: {
        width: "100%",
        alignItems: "center",
        position: "absolute",
        bottom: 10,
      },
      agreementsModal: {
        width: "100%",
        backgroundColor: "#1D1D1D",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
      },
      agreementsModalHeader: {
        marginTop: 25,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      },
      agreementsModalTitle: {
        color: "white",
        fontSize: 15,
        fontWeight: "300",
      },
      agreementsModalDivider: {
        height: 0.2,
        width: 180,
        backgroundColor: "grey",
        marginTop: 6.5,
      },
      agreementsModalContent: {
        marginTop: 15,
        paddingHorizontal: 25,
      },
      agreementItem: {
        flexDirection: "row",
        marginTop: 15,
        alignItems: "center",
        gap: 20,
      },
      agreementDot: {
        backgroundColor: "#12956B",
        width: 10,
        height: 10,
        borderRadius: 10,
        marginTop: 1,
      },
      agreementText: {
        color: "white",
        fontSize: 14,
        fontWeight: "400",
      },
})

export default AgreementsModalView;