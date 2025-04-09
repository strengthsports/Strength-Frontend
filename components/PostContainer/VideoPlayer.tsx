import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function CustomVideoPlayer({ videoUri }: { videoUri: string }) {
  const videoRef = useRef(null);

  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [isControllerVisible, setIsControllerVisble] = useState(true);

  // Format milliseconds into "MM:SS"
  const formatTime = (timeMillis: any) => {
    if (!timeMillis) return "0:00";
    const totalSeconds = Math.floor(timeMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Update state whenever playback status changes
  const onPlaybackStatusUpdate = (playbackStatus) => {
    setStatus(playbackStatus);

    // Show loader if buffering or not yet loaded
    if (playbackStatus.isBuffering || !playbackStatus.isLoaded) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  // Toggle between play and pause
  const handlePlayPause = async () => {
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  // Seek the video to a certain position (in ms)
  const handleSeek = async (value) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value);
    }
  };

  const handleConrollersVisibility = () => {
    setIsControllerVisble((prev) => !prev);
  };

  return (
    <Pressable style={styles.container} onPress={handleConrollersVisibility}>
      {/* VIDEO */}
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        useNativeControls={false} // Turn off native controls
        isLooping
      />

      {/* LOADER */}
      {loading && (
        <ActivityIndicator style={styles.loader} size="large" color="#fff" />
      )}

      {/* Centered Play/Pause Button */}
      {!loading && (
        <TouchableOpacity
          style={styles.centerPlayButton}
          className={`${isControllerVisible ? "opacity-1" : "opacity-0"}`}
          onPress={handlePlayPause}
        >
          <Ionicons
            name={status.isPlaying ? "pause" : "play"}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      )}

      {/* Gradient Control Bar */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
        style={styles.controlsContainer}
        className={`${isControllerVisible ? "opacity-1" : "opacity-0"}`}
      >
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={status.durationMillis || 0}
          value={status.positionMillis || 0}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="rgba(255,255,255,0.4)"
          thumbTintColor="#fff"
        />
        <Text style={styles.timeText}>
          {formatTime(status.positionMillis)} /{" "}
          {formatTime(status.durationMillis)}
        </Text>
        {/* Fullscreen Button (Bottom Right) */}
        <TouchableOpacity
          style={styles.fullscreen}
          onPress={() => videoRef.current?.presentFullscreenPlayer()}
        >
          <MaterialCommunityIcons name="fullscreen" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
    </Pressable>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000000",
    position: "relative",
    marginLeft: 8,
  },
  video: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
    borderColor: "#2F2F2F",
  },
  loader: {
    position: "absolute",
    alignSelf: "center",
    top: "45%",
  },
  centerPlayButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 30,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
  },
  slider: {
    flex: 7.5, // 75%
    height: 20,
  },
  timeText: {
    flex: 2, // 20%
    color: "#fff",
    textAlign: "right",
    fontWeight: "400",
    fontSize: 13,
  },
  fullscreen: {
    flex: 0.5, // 5%
    alignItems: "center",
  },
});
