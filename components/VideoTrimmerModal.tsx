import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  PanResponder,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { ResizeMode, Video } from "expo-av";

const SCRUBBER_WIDTH = 20;
const TRACK_PADDING = 20;

interface VideoTrimmerModalProps {
  videoUri: string;
  onTrimComplete: (trimmedUri: string) => void;
  onCancel: () => void;
}

const VideoTrimmerModal: React.FC<VideoTrimmerModalProps> = ({
  videoUri,
  onTrimComplete,
  onCancel,
}) => {
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isTrimming, setIsTrimming] = useState(false);
  const [trackWidth, setTrackWidth] = useState(
    Dimensions.get("window").width - 2 * TRACK_PADDING
  );
  const [trackX, setTrackX] = useState(0);
  const [initialStartPosition, setInitialStartPosition] = useState(0);
  const [initialEndPosition, setInitialEndPosition] = useState(0);

  const videoRef = useRef(null);
  const startHandleRef = useRef(null);
  const endHandleRef = useRef(null);

  // When video loads, set duration and default endTime
  const handleVideoLoad = (status: any) => {
    if (status.durationMillis) {
      const dur = status.durationMillis / 1000;
      setDuration(dur);
      if (endTime === 0) setEndTime(dur);
    }
  };

  // Convert time value to position on track
  const timeToPosition = (time: number) => {
    if (duration === 0) return 0;
    return (time / duration) * trackWidth;
  };

  // Convert position on track to time value
  const positionToTime = (position: number) => {
    if (trackWidth === 0) return 0;
    return (position / trackWidth) * duration;
  };

  // Start handle PanResponder using relative dx movement
  const startPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Record the initial position relative to the track when the drag starts.
        setInitialStartPosition(timeToPosition(startTime));
      },
      onPanResponderMove: (_, gestureState) => {
        // Use the stored initial position plus the change in x to compute the new handle position.
        const newPosition = initialStartPosition + gestureState.dx;
        const clampedPosition = Math.max(
          0,
          Math.min(newPosition, timeToPosition(endTime) - SCRUBBER_WIDTH)
        );
        const newTime = positionToTime(clampedPosition);
        setStartTime(newTime);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  // End handle PanResponder using relative dx movement
  const endPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setInitialEndPosition(timeToPosition(endTime));
      },
      onPanResponderMove: (_, gestureState) => {
        const newPosition = initialEndPosition + gestureState.dx;
        const clampedPosition = Math.max(
          timeToPosition(startTime) + SCRUBBER_WIDTH,
          Math.min(newPosition, trackWidth)
        );
        const newTime = positionToTime(clampedPosition);
        setEndTime(newTime);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  // Update track width on orientation changes
  useEffect(() => {
    const updateLayout = () => {
      setTrackWidth(Dimensions.get("window").width - 2 * TRACK_PADDING);
    };

    if (Dimensions.addEventListener) {
      try {
        const subscription = Dimensions.addEventListener(
          "change",
          updateLayout
        );
        return () => {
          if (subscription && typeof subscription.remove === "function") {
            subscription.remove();
          }
        };
      } catch (e) {
        Dimensions.addEventListener("change", updateLayout);
        return () => Dimensions.removeEventListener("change", updateLayout);
      }
    }
  }, []);

  // Simulated trim function. In a real app you might use an FFmpeg library
  const trimVideo = async () => {
    setIsTrimming(true);
    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // For demo purposes we return the original URI.
      onTrimComplete(videoUri);
    } catch (error) {
      console.error("Video trimming failed:", error);
      Alert.alert("Error", "Failed to trim video. Please try again.");
    } finally {
      setIsTrimming(false);
    }
  };

  return (
    <Modal visible={true} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "#1F2937", // dark background similar to neutral-900
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
          }}
        >
          <TextScallingFalse
            style={{
              color: "white",
              fontSize: 32,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Trim Video
          </TextScallingFalse>

          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={{ width: "100%", height: 200, backgroundColor: "#000" }}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={false}
            onLoad={({ naturalSize, durationMillis }) =>
              handleVideoLoad({ durationMillis })
            }
            useNativeControls
          />

          {/* Trim controls */}
          <View style={{ marginTop: 24 }}>
            <TextScallingFalse style={{ color: "white", marginBottom: 8 }}>
              Drag handles to trim: {startTime.toFixed(1)} -{" "}
              {endTime.toFixed(1)} sec
            </TextScallingFalse>

            {/* Timeline track */}
            <View
              style={{
                position: "relative",
                height: 48,
                marginHorizontal: TRACK_PADDING,
              }}
              onLayout={(e) => {
                setTrackWidth(e.nativeEvent.layout.width);
                setTrackX(e.nativeEvent.layout.x);
              }}
            >
              {/* Track background */}
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "#374151", // similar to neutral-700
                  width: "100%",
                  height: 40,
                  borderRadius: 8,
                }}
              />

              {/* Selected area */}
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "#2563EB", // theme color
                  height: 40,
                  borderRadius: 8,
                  left: timeToPosition(startTime),
                  width: timeToPosition(endTime) - timeToPosition(startTime),
                }}
              />

              {/* Start handle */}
              <View
                ref={startHandleRef}
                {...startPanResponder.panHandlers}
                style={{
                  position: "absolute",
                  width: SCRUBBER_WIDTH,
                  height: 48,
                  backgroundColor: "white",
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 4,
                  left: timeToPosition(startTime) - SCRUBBER_WIDTH / 2,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    right: 1,
                    top: 16,
                    width: 1,
                    height: 16,
                    backgroundColor: "#374151",
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    right: 2,
                    top: 16,
                    width: 1,
                    height: 16,
                    backgroundColor: "#374151",
                  }}
                />
              </View>

              {/* End handle */}
              <View
                ref={endHandleRef}
                {...endPanResponder.panHandlers}
                style={{
                  position: "absolute",
                  width: SCRUBBER_WIDTH,
                  height: 48,
                  backgroundColor: "white",
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                  left: timeToPosition(endTime) - SCRUBBER_WIDTH / 2,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: 1,
                    top: 16,
                    width: 1,
                    height: 16,
                    backgroundColor: "#374151",
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    left: 2,
                    top: 16,
                    width: 1,
                    height: 16,
                    backgroundColor: "#374151",
                  }}
                />
              </View>
            </View>
          </View>

          {/* Action buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 24,
            }}
          >
            <TouchableOpacity
              onPress={onCancel}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 4,
              }}
            >
              <TextScallingFalse style={{ color: "white", fontSize: 24 }}>
                Cancel
              </TextScallingFalse>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={trimVideo}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: "#2563EB",
                borderRadius: 4,
              }}
              disabled={isTrimming}
            >
              {isTrimming ? (
                <ActivityIndicator color="white" />
              ) : (
                <TextScallingFalse style={{ color: "white", fontSize: 24 }}>
                  Trim Video
                </TextScallingFalse>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VideoTrimmerModal;
