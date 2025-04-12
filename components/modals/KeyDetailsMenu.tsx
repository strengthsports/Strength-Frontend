import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import TextScallingFalse from '../CentralText';

interface KeyDetailsMenuProps {
    isVisible: boolean;
    keyOptions: string[];
    handleKeyValueSelect: (option: string) => void;
    handleClose: () => void;
}

const KeyDetailsMenu: React.FC<KeyDetailsMenuProps> = ({
    isVisible,
    keyOptions,
    handleKeyValueSelect,
    handleClose,
}) => {
    const scrollRef = useRef<ScrollView>(null); // ✅ Move inside

    useEffect(() => {
        if (isVisible) {
          const timeout = setTimeout(() => {
            scrollRef.current?.scrollTo({ y: 200, animated: true });
          }, 50); // ⏱️ Adjust delay if needed (100ms is usually fine)
      
          return () => clearTimeout(timeout); // Clean up timeout on unmount or effect re-run
        }
      }, [isVisible]);
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.overlay}
            onPress={handleClose}
        >
            <ScrollView
                ref={scrollRef}
                style={{ flex: 1 }}
                indicatorStyle="black"
                showsVerticalScrollIndicator={true}
            >
                <View style={styles.modalContent}>
                    {keyOptions?.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.option}
                            onPress={() => handleKeyValueSelect(option)}
                            activeOpacity={0.5}
                        >
                            <TextScallingFalse style={styles.optionText} allowFontScaling={false}>
                                {option}
                            </TextScallingFalse>
                        </TouchableOpacity>
                    ))}

                    {/* Unselect button */}
                    <TouchableOpacity
                        style={[styles.option, styles.unselectOption]}
                        onPress={() => handleKeyValueSelect('')}
                        activeOpacity={0.5}
                    >
                        <TextScallingFalse style={[styles.optionText, { color: 'red' }]} allowFontScaling={false}>
                            Unselect Option
                        </TextScallingFalse>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        zIndex: 100,
        paddingHorizontal: 50,
        paddingVertical: 135,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        elevation: 5,
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    unselectOption: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        marginTop: 5,
    },
    optionText: {
        fontSize: 16,
    },
});

export default KeyDetailsMenu;
