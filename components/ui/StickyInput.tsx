import React, { memo, useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Keyboard,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import TextScallingFalse from "../CentralText";
import { Colors } from "~/constants/Colors";
import nopic from "@/assets/images/nopic.jpg";

interface StickyInputProps {
  user?: {
    profilePic?: string;
  };
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isPosting?: boolean;
  replyingTo?: {
    name: string;
  } | null;
  placeholder?: string;
  progress?: Animated.Value;
  autoFocus?: boolean;
}

const MAX_HEIGHT = 80;

const StickyInput = memo(
  ({
    user,
    value,
    onChangeText,
    onSubmit,
    isPosting = false,
    replyingTo = null,
    placeholder = "Type your comment here",
    progress,
    autoFocus = false,
  }: StickyInputProps) => {
    const [inputHeight, setInputHeight] = useState(40);
    // For the progress bar, interpolate if provided
    const widthInterpolated = progress
      ? progress.interpolate({
          inputRange: [0, 1],
          outputRange: ["0%", "100%"],
        })
      : "0%";

    // Animated value for keyboard animations
    const translateY = useRef(new Animated.Value(0)).current;

    // Reference to the TextInput to call focus manually
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
      // On mount, if autoFocus is true, call focus
      if (autoFocus) {
        inputRef.current?.focus();
      }
    }, [autoFocus]);

    // useEffect(() => {
    //   const keyboardShowEvent =
    //     Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    //   const keyboardHideEvent =
    //     Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    //   const keyboardShowListener = Keyboard.addListener(
    //     keyboardShowEvent,
    //     (e) => {
    //       Animated.timing(translateY, {
    //         toValue: -e.endCoordinates.height,
    //         duration: 250,
    //         useNativeDriver: true,
    //       }).start();
    //     }
    //   );
    //   const keyboardHideListener = Keyboard.addListener(
    //     keyboardHideEvent,
    //     () => {
    //       Animated.timing(translateY, {
    //         toValue: 0,
    //         duration: 250,
    //         useNativeDriver: true,
    //       }).start();
    //     }
    //   );

    //   return () => {
    //     keyboardShowListener.remove();
    //     keyboardHideListener.remove();
    //   };
    // }, [translateY]);

    return (
      <View style={[styles.animatedContainer]}>
        <View style={styles.container}>
          <Divider style={styles.divider} width={0.3} />
          {isPosting && progress && (
            <Animated.View
              style={[styles.progressBar, { width: widthInterpolated }]}
            />
          )}
          <View
            className={`mt-1.5 w-full flex-row ${
              inputHeight <= 40
                ? "items-center rounded-full"
                : "items-end rounded-2xl"
            } bg-neutral-900 px-4 py-1.5`}
          >
            <Image
              source={
                user && user.profilePic ? { uri: user.profilePic } : nopic
              }
              style={styles.profilePic}
              resizeMode="cover"
            />
            {replyingTo && (
              <View style={styles.replyTag}>
                <TextScallingFalse style={styles.replyText}>
                  {replyingTo.name}
                </TextScallingFalse>
              </View>
            )}
            <TextInput
              ref={inputRef}
              style={[styles.textInput, { height: Math.max(40, inputHeight) }]}
              multiline={true}
              textAlignVertical="top"
              onContentSizeChange={(event) =>
                setInputHeight(event.nativeEvent.contentSize.height)
              }
              scrollEnabled={inputHeight >= MAX_HEIGHT}
              placeholder={placeholder}
              placeholderTextColor="grey"
              value={value}
              onChangeText={onChangeText}
              cursorColor={Colors.themeColor}
            />
            <TouchableOpacity onPress={onSubmit} disabled={isPosting}>
              <MaterialIcons
                name="send"
                size={22}
                color={
                  isPosting ? "#292A2D" : value ? Colors.themeColor : "grey"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  animatedContainer: {
    width: "100%",
  },
  container: {
    backgroundColor: "black",
    padding: 8,
  },
  divider: {
    marginBottom: 1,
    backgroundColor: "#333",
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.themeColor,
  },
  inputContainer: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#171717",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  replyTag: {
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  replyText: {
    color: Colors.themeColor,
    fontWeight: "600",
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    color: "white",
  },
});

export default StickyInput;
