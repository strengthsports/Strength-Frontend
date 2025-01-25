import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  PanGestureHandler,
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.7;
const THRESHOLD = SIDEBAR_WIDTH / 3;

type SidebarProps = {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onProfile: () => void;
};

type ContextType = {
  x: number;
};

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, onLogout, onProfile }) => {
  const translateX = useSharedValue(SIDEBAR_WIDTH);
  const context = useSharedValue<ContextType>({ x: 0 });

React.useEffect(() => {
  if (isVisible) {
    console.log('Opening sidebar...');
    translateX.value = withSpring(0, { damping: 15 });
  } else {
    console.log('Closing sidebar...');
    translateX.value = withSpring(SIDEBAR_WIDTH, { damping: 15 });
  }
}, [isVisible]);

const animatedStyle = useAnimatedStyle(() => {
  console.log('translateX.value:', translateX.value);
  return {
    transform: [{ translateX: translateX.value }],
  };
});

  const panGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, ctx) => {
      ctx.x = translateX.value;
    },
    onActive: (event, ctx) => {
      const newTranslateX = ctx.x + event.translationX;
      if (newTranslateX >= 0) {
        translateX.value = newTranslateX;
      }
    },
    onEnd: (event) => {
      if (event.translationX > THRESHOLD) {
        translateX.value = withSpring(SIDEBAR_WIDTH, { damping: 15 });
        runOnJS(onClose)();
      } else {
        translateX.value = withSpring(0, { damping: 15 });
      }
    },
  });

  // const animatedStyle = useAnimatedStyle(() => ({
  //   transform: [{ translateX: translateX.value }],
  // }));

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, SIDEBAR_WIDTH], [0.5, 0]);
    return {
      opacity,
      display: opacity === 0 ? 'none' : 'flex',
    };
  });

  const closeSidebar = () => {
    translateX.value = withSpring(SIDEBAR_WIDTH, { damping: 15 });
    onClose();
  };

  if (!isVisible) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar}>
        <Animated.View style={[styles.overlay, overlayAnimatedStyle]} />
        <PanGestureHandler onGestureEvent={panGestureHandler}>
          <Animated.View style={[styles.sidebarContainer, animatedStyle]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  onProfile();
                  closeSidebar();
                }}
              >
                <MaterialCommunityIcons name="account" size={24} color="white" />
                <Text style={styles.buttonText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  onLogout();
                  closeSidebar();
                }}
              >
                <MaterialCommunityIcons name="logout" size={24} color="white" />
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </Pressable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: -SIDEBAR_WIDTH,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#1a1a1a',
    borderLeftWidth: 1,
    borderLeftColor: '#333',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#2a2a2a',
  },
  buttonText: {
    color: 'white',
    marginLeft: 15,
    fontSize: 16,
  },
});

export default Sidebar;
