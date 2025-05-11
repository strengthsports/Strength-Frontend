import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const RunningLoader = () => {
  const bounce = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(withTiming(-10, { duration: 150 }), -1, true);
    rotate.value = withRepeat(withTiming(5, { duration: 100 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounce.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <FontAwesome5 name="running" size={48} color="gray" solid />
      </Animated.View>
    </View>
  );
};

export default RunningLoader;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
