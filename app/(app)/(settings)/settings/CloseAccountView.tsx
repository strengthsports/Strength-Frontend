import React, { useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { AntDesign, Octicons } from '@expo/vector-icons';
import TextScallingFalse from '~/components/CentralText';
import PageThemeView from '~/components/PageThemeView';
import ConfirmCloseAccountView from "./ConfirmCloseAccountView";
import { useDispatch, useSelector } from "react-redux";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";

type Props = {
    onClose: () => void;
};

const CloseAccountView: React.FC<Props> = ({ onClose }) => {
    const [showConfirmCloseAccountView, setShowConfirmCloseAccountView] = useState(false);
    const { user } = useSelector((state: any) => state?.profile);

    return (
        <PageThemeView>
            <View style={styles.TopBarView}>
                <TouchableOpacity style={{ width: 60, height: 30, justifyContent: 'center' }} activeOpacity={0.5} onPress={onClose}>
                    <BackIcon />
                </TouchableOpacity>
                <TextScallingFalse style={styles.HeaderText}>
                    Close account
                </TextScallingFalse>
                <View style={{ width: 60}} />
            </View>

            <View style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <Image style={styles.ProfileImage} source={{ uri: user?.profilePic }} />
                    <View>
                        <TextScallingFalse style={styles.NameText}>
                            {user?.firstName} {user?.lastName}
                        </TextScallingFalse>
                        <TextScallingFalse style={styles.HeadlineText}>
                            @{user?.username} {user?.headline}
                        </TextScallingFalse>
                    </View>
                </View>

                <View style={{ paddingVertical: 40, gap: 5 }}>
                    <TextScallingFalse style={styles.SectionHeader}>
                        We’re sad to see you go
                    </TextScallingFalse>
                    <TextScallingFalse style={styles.DescriptionText}>
                        You're about to close your Strength account. Once closed, your public profile will no
                        longer be visible on the Strength app.
                    </TextScallingFalse>
                </View>

                <View style={{ gap: 5 }}>
                    <TextScallingFalse style={styles.SectionHeader}>
                        What you Should Know
                    </TextScallingFalse>

                    <View style={styles.BulletRow}>
                        <Octicons name="dot-fill" size={12} color="grey" />
                        <TextScallingFalse style={styles.DescriptionText}>
                            Some of your account information may still be visible to users you've interacted with,
                            such as in their follower or following lists.
                        </TextScallingFalse>
                    </View>

                    <View style={styles.BulletRow}>
                        <Octicons name="dot-fill" size={12} color="grey" />
                        <TextScallingFalse style={styles.DescriptionText}>
                            If you only want to change your @username or date of birth, there's no need to close
                            your account—you can update those details in your settings.
                        </TextScallingFalse>
                    </View>
                </View>

                <View style={styles.ButtonContainer}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.NextButton} onPress={() => { setShowConfirmCloseAccountView(true); }}>
                        <TextScallingFalse style={styles.NextButtonText}>Next</TextScallingFalse>
                    </TouchableOpacity>
                </View>
            </View>

            {showConfirmCloseAccountView && (
                <Modal
                    visible={showConfirmCloseAccountView}
                    transparent={true}
                >
                    <ConfirmCloseAccountView
                        onSuccess={() => {
                            setShowConfirmCloseAccountView(false);
                            // Optionally trigger a success modal or toast
                        }}
                        onCancel={() => setShowConfirmCloseAccountView(false)}
                    />
                </Modal>
            )}
        </PageThemeView>
    );
};

export default CloseAccountView;

const styles = StyleSheet.create({
    TopBarView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
    },
    HeaderText: {
        color: "white",
        fontSize: 20,
        fontWeight: "300",
    },
    ProfileImage: {
        backgroundColor: 'orange',
        borderRadius: 100,
        width: 40,
        height: 40,
    },
    NameText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    HeadlineText: {
        color: 'white',
        fontSize: 9,
        fontWeight: '300',
    },
    SectionHeader: {
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
    },
    DescriptionText: {
        fontSize: 13,
        fontWeight: '300',
        color: '#ccc',
        lineHeight: 18,
        flex: 1,
    },
    BulletRow: {
        flexDirection: 'row',
        gap: 10,
        paddingTop: 10,
    },
    ButtonContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 75,
    },
    NextButton: {
        backgroundColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 90,
        borderRadius: 25,
    },
    NextButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});
