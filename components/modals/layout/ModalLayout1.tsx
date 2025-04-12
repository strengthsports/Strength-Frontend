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
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  heightValue?: number;
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
            styles.drawer,
            {
              height: screenHeight / (heightValue || 2),
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Drag handle area */}
          <View
            {...panResponder.panHandlers}
            style={styles.dragHandleContainer}
          >
            <Divider
              color="#545454"
              marginVertical={2}
              thickness={4.5}
              style={{
                width: "20%",
                marginHorizontal: "auto",
                borderRadius: 20,
              }}
            />
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
  drawer: {
    width: "100%",
    backgroundColor: "#1C1D23",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
  // New style: drag area for the pan responder
  dragHandleContainer: {
    paddingVertical: 5,
    // Optionally add a backgroundColor or other styling to indicate the drag area
  },
  contentContainer: {
    flex: 1,
  },
});

export default ModalLayout1;
