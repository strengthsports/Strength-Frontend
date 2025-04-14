import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type VideoControlsProps = {
  isPlaying: boolean;
  isBuffering: boolean;
  positionMillis: number;
  durationMillis: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onSeek: (value: number) => void;
  onToggleMute: () => void;
  onFullscreen?: () => void;
};

const VideoControls = ({
  isPlaying,
  isBuffering,
  positionMillis,
  durationMillis,
  isMuted,
  onPlayPause,
  onSeek,
  onToggleMute,
  onFullscreen,
}: VideoControlsProps) => {
  const formatTime = (timeMillis: number) => {
    if (!timeMillis) return "0:00";
    const totalSeconds = Math.floor(timeMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      {/* Play/Pause Button */}
      {!isBuffering && (
        <TouchableOpacity style={styles.centerPlayButton} onPress={onPlayPause}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={16}
            color="#fff"
          />
        </TouchableOpacity>
      )}

      {/* Bottom Controls */}
      <View style={styles.controlsContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={durationMillis || 0}
          value={positionMillis || 0}
          onSlidingComplete={onSeek}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="rgba(255,255,255,0.4)"
          thumbTintColor="#fff"
        />

        <Text style={styles.timeText}>
          {formatTime(positionMillis)} / {formatTime(durationMillis)}
        </Text>

        {/* Mute Button */}
        <TouchableOpacity onPress={onToggleMute}>
          <Ionicons
            name={isMuted ? "volume-mute" : "volume-high"}
            size={16}
            color="#fff"
          />
        </TouchableOpacity>

        {/* Fullscreen Button (optional) */}
        {onFullscreen && (
          <TouchableOpacity onPress={onFullscreen}>
            <MaterialCommunityIcons name="fullscreen" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "85%",
    marginHorizontal: "auto",
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "yellow",
  },
  centerPlayButton: {
    borderRadius: 30,
  },
  controlsContainer: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    flex: 1,
    height: 20,
  },
  timeText: {
    color: "#fff",
    marginRight: 10,
    fontWeight: "400",
    fontSize: 12,
  },
});

export default VideoControls;
