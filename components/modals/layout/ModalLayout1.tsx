import React, { ReactNode } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
  PanResponder,
} from "react-native";
import { BlurView } from "expo-blur";
import TextScallingFalse from "~/components/CentralText";
import Divider from "~/components/ui/CustomDivider";

const ModalLayout1 = ({
  visible,
  onClose,
  children,
  heightValue,
  bgcolor,
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  heightValue?: number;
  bgcolor?: string;
}) => {
  const screenHeight = Dimensions.get("window").height;
  const translateY = new Animated.Value(0);

  // Create a pan responder only for the drag handle area
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Blur Background */}
        <BlurView intensity={0} style={styles.blurBackground}>
          <TouchableOpacity style={styles.overlay} onPress={onClose} />
        </BlurView>

        {/* Drawer */}
        <Animated.View
          style={[
            styles.bottomsheet,
            {
              height: screenHeight / (heightValue || 2),
              transform: [{ translateY }],
              backgroundColor: bgcolor || "#1C1D23",
            },
          ]}
        >
          {/* Drag handle area */}
          <View {...panResponder.panHandlers}>
            <View style={styles.dragHandle}>
              <View style={styles.handle} />
            </View>
          </View>
          {/* Content area */}
          <View style={styles.contentContainer}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomsheet: {
    width: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  contentContainer: {
    flex: 1,
  },
  dragHandle: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#555",
    borderRadius: 3,
  },
});

export default ModalLayout1;
