// components/UploadProgressBar.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  View,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "~/reduxStore";
import { resetUploadProgress } from "~/reduxStore/slices/post/postSlice";
import TextScallingFalse from "./CentralText";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import * as VideoThumbnails from "expo-video-thumbnails";
import PollUploadBar from "./SvgIcons/addpost/PollUploadBar";
import ThoughtsUploadBar from "./SvgIcons/addpost/ThoughtsUploadBar";
import ClipsIcon from "./SvgIcons/addpost/ClipsIcon";
import ClipsIconMedia from "./SvgIcons/profilePage/ClipsIconMedia";

const PREVIEW_ICON_SIZE = 20;
const PREVIEW_IMAGE_SIZE = 24;
const PREVIEW_ICON_COLOR = "#A9A9A9";

const UploadProgressBar: React.FC = () => {
  const dispatch = useDispatch();
  const { progress, isLoading, uploadPreviewData } = useSelector(
    (s: RootState) => s.post
  );

  const widthAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  const [videoThumbnailUri, setVideoThumbnailUri] = useState<string | null>(
    null
  );
  const startTime = useRef<number>(0);

  // Start / stop sequence
  useEffect(() => {
    if (isLoading) {
      // show immediately
      setVisible(true);
      startTime.current = Date.now();
      widthAnim.setValue(0);
      fadeAnim.setValue(1);

      // animate up to whatever progress the thunk has already emitted
      Animated.timing(widthAnim, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else if (visible) {
      // ensure at least 800ms visible
      const elapsed = Date.now() - startTime.current;
      const wait = Math.max(0, 800 - elapsed);

      setTimeout(() => {
        // fill → fade → hide
        Animated.sequence([
          Animated.timing(widthAnim, {
            toValue: 100,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setVisible(false);
          dispatch(resetUploadProgress());
        });
      }, wait);
    }
  }, [isLoading, visible, dispatch, progress]);

  // Bump the bar along if progress changes mid‑upload
  useEffect(() => {
    if (isLoading) {
      Animated.timing(widthAnim, {
        toValue: progress,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, isLoading, visible]);

  useEffect(() => {
    const generateThumbnail = async () => {
      if (uploadPreviewData?.type === "video" && uploadPreviewData.uri) {
        try {
          const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(
            uploadPreviewData.uri,
            {
              time: 1000,
              quality: 0.5,
            }
          );
          setVideoThumbnailUri(thumbUri);
        } catch (e) {
          console.warn("Error generating video thumbnail:", e);
          setVideoThumbnailUri(null);
        }
      } else {
        if (videoThumbnailUri) {
          setVideoThumbnailUri(null);
        }
      }
    };

    if (isLoading && visible) {
      generateThumbnail();
    }
    return () => {
      setVideoThumbnailUri(null);
    };
  }, [uploadPreviewData, isLoading, visible]);

  if (!visible) return null;

  const renderPreview = () => {
    if (!uploadPreviewData) return null;

    switch (uploadPreviewData.type) {
      case "image":
        return (
          <Image
            source={{ uri: uploadPreviewData.uri }}
            style={styles.previewImage}
          />
        );
      case "video":
        if (videoThumbnailUri) {
          return (
            <ImageBackground
              source={{ uri: videoThumbnailUri }}
              style={styles.previewImage}
              imageStyle={styles.previewImageStyle}
              onError={(e) =>
                console.warn(
                  "Error loading video thumbnail:",
                  e.nativeEvent.error
                )
              }
            >
              <View style={styles.videoIconOverlay}>
                <ClipsIconMedia size={12} />
              </View>
            </ImageBackground>
          );
        }
        return <ClipsIcon size={PREVIEW_ICON_SIZE} />;
      case "text":
        return (
          <View style={styles.previewSvg}>
            <ThoughtsUploadBar />
          </View>
        );
      case "poll":
        return (
          <View style={styles.previewSvg}>
            <PollUploadBar />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.messageContainer}>
        {renderPreview()}
        <TextScallingFalse style={styles.messageText}>
          Your post going live --- keep Strength open...
        </TextScallingFalse>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.bar,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // position: "absolute",   // so top:60 actually works
    top: 60,
    width: "100%",
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 1000,
  },
  messageContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  messageText: {
    color: "#9c9c9c",
    fontSize: 14,
    fontWeight: "300",
    flexShrink: 1,
  },
  track: {
    width: "100%",
    height: 4,
    backgroundColor: "#333",
  },
  bar: {
    height: "100%",
    backgroundColor: "#12956B",
  },
  previewImage: {
    width: PREVIEW_IMAGE_SIZE,
    height: PREVIEW_IMAGE_SIZE,
    borderRadius: 3,
    marginRight: 8,
  },
  previewIcon: {
    marginRight: 8,
    opacity: 0.8,
  },
  previewImageStyle: {
    borderRadius: 3,
  },
  videoIconOverlay: {
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: PREVIEW_ICON_SIZE / 2,
    padding: 2,
  },
  previewSvg: {
    width: 20,
    height: 20,
    marginRight: 8,
    marginLeft: 6,
  },
});

export default UploadProgressBar;
