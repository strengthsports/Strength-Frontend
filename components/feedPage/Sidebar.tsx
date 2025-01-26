import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const SIDEBAR_WIDTH = 300;
const SWIPE_VELOCITY_THRESHOLD = 800;
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 100,
};

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, children }) => {
  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const isInteracting = useSharedValue(false);

  const animateSidebar = useCallback((visible: boolean) => {
    translateX.value = withSpring(
      visible ? 0 : -SIDEBAR_WIDTH,
      SPRING_CONFIG,
      (finished) => {
        if (finished && !visible) {
          runOnJS(onClose)();
        }
      }
    );
  }, []);

  useEffect(() => {
    if (isVisible) {
      translateX.value = withTiming(0, { duration: 300 });
    } else {
      translateX.value = withTiming(-SIDEBAR_WIDTH, { duration: 300 });
    }
  }, [isVisible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: (translateX.value / -SIDEBAR_WIDTH) * -1,
    display: translateX.value === -SIDEBAR_WIDTH ? 'none' : 'flex',
  }));

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isInteracting.value = true;
    })
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = Math.max(-SIDEBAR_WIDTH, e.translationX);
      } else {
        translateX.value = Math.min(0, e.translationX);
      }
    })
    .onEnd((e) => {
      const shouldClose =
        e.translationX < -SIDEBAR_WIDTH / 3 ||
        e.velocityX < -SWIPE_VELOCITY_THRESHOLD;
      
      if (shouldClose) {
        animateSidebar(false);
      } else {
        animateSidebar(true);
      }
      isInteracting.value = false;
    });

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      {/* Overlay with high zIndex */}
      <Animated.View style={[
        styles.overlay, 
        overlayStyle,
        { zIndex: 9998, elevation: 9998 }
      ]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={() => animateSidebar(false)}
          accessibilityRole="button"
          accessibilityLabel="Close sidebar"
          activeOpacity={1}
        />
      </Animated.View>

      {/* Sidebar with highest zIndex */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[
          styles.sidebar, 
          sidebarStyle,
          { zIndex: 9999, elevation: 9999 }
        ]}>
          <View style={styles.header}>
            <Text style={styles.title}>Navigation</Text>
            <TouchableOpacity
              onPress={() => animateSidebar(false)}
              accessibilityRole="button"
              accessibilityLabel="Close sidebar"
            >
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>
          
          {/* Scrollable Content */}
          <Animated.ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            accessibilityRole="menu"
          >
            {children}
          </Animated.ScrollView>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#1c1c1c',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  closeIcon: {
    color: 'white',
    fontSize: 32,
    lineHeight: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default React.memo(Sidebar);