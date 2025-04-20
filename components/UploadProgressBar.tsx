import { Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";

const UploadProgressBar = () => {
  const { progress, isLoading } = useSelector((state: RootState) => state.post);

  const widthAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let minDisplayTimer: NodeJS.Timeout;

    if (isLoading) {
      setVisible(true);

      Animated.timing(widthAnim, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();

      // Keep progress bar visible for at least 800ms
      minDisplayTimer = setTimeout(() => {}, 800);
    } else {
      // Force the progress bar to fill to 100% before fade out
      Animated.timing(widthAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        // Fade out after forced 100% complete
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setVisible(false); // Completely remove from view
          widthAnim.setValue(0); // Reset for next upload
          fadeAnim.setValue(1); // Reset fade
        });
      });
    }

    return () => {
      clearTimeout(minDisplayTimer);
    };
  }, [isLoading, progress]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        top: 60,
        width: "100%",
        height: 4,
        opacity: fadeAnim,
        backgroundColor: "#000",
      }}
    >
      <Animated.View
        style={{
          height: "100%",
          width: widthAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
          backgroundColor: "#12956B",
        }}
      />
    </Animated.View>
  );
};

export default UploadProgressBar;
