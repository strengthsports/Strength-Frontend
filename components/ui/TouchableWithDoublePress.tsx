import React, { useRef, ReactNode } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

const DOUBLE_PRESS_DELAY = 300; // milliseconds

interface TouchableWithDoublePressProps extends TouchableOpacityProps {
  onSinglePress?: () => void;
  onDoublePress?: () => void;
  children: ReactNode;
}

const TouchableWithDoublePress: React.FC<TouchableWithDoublePressProps> = ({
  onSinglePress,
  onDoublePress,
  children,
  ...props
}) => {
  const lastPress = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  const handlePress = () => {
    const now = Date.now();
    if (now - lastPress.current < DOUBLE_PRESS_DELAY) {
      // If within threshold, it's a double press.
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      onDoublePress && onDoublePress();
    } else {
      // Set up a timer to wait for a potential second press.
      timerRef.current = setTimeout(() => {
        onSinglePress && onSinglePress();
      }, DOUBLE_PRESS_DELAY) as unknown as number;
    }
    lastPress.current = now;
  };

  return (
    <TouchableOpacity onPress={handlePress} {...props}>
      {children}
    </TouchableOpacity>
  );
};

export default TouchableWithDoublePress;
