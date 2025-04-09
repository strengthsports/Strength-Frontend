import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatusSuccess } from "expo-av";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function CustomVideoPlayer({
  videoUri,
  autoPlay,
}: {
  videoUri: string;
  autoPlay: boolean;
}) {
  const videoRef = useRef<Video | null>(null);

  const [status, setStatus] = useState<AVPlaybackStatusSuccess>({
    isLoaded: false,
    isPlaying: false,
    durationMillis: 0,
    positionMillis: 0,
    isBuffering: true,
    // Dummy defaults for required fields (can be ignored during actual runtime)
    didJustFinish: false,
    isLooping: false,
    rate: 1,
    shouldCorrectPitch: false,
    pitchCorrectionQuality: undefined,
    volume: 1,
    isMuted: false,
    isLoopingMuted: false,
    progressUpdateIntervalMillis: 1000,
    shouldPlay: false,
    isPlaybackAllowed: true,
    isPlayingBackward: false,
    androidImplementation: "MediaPlayer",
    uri: videoUri,
  });

  const [loading, setLoading] = useState(true);
  const [isControllerVisible, setIsControllerVisble] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      if (autoPlay) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [autoPlay]);

  const formatTime = (timeMillis: number) => {
    if (!timeMillis) return "0:00";
    const totalSeconds = Math.floor(timeMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatusSuccess) => {
    setStatus(playbackStatus);

    if (playbackStatus.isBuffering || !playbackStatus.isLoaded) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  const handlePlayPause = async () => {
    if (status.isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
  };

  const handleSeek = async (value: number) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value);
    }
  };

  const handleConrollersVisibility = () => {
    setIsControllerVisble((prev) => !prev);
  };

  return (
    <Pressable style={styles.container} onPress={handleConrollersVisibility}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={(status) =>
          onPlaybackStatusUpdate(status as AVPlaybackStatusSuccess)
        }
        useNativeControls={false}
        isLooping
      />

      {loading && (
        <ActivityIndicator style={styles.loader} size="large" color="#fff" />
      )}

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
          {formatTime(status.durationMillis as number)}
        </Text>
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
    flex: 7.5,
    height: 20,
  },
  timeText: {
    flex: 2,
    color: "#fff",
    textAlign: "right",
    fontWeight: "400",
    fontSize: 13,
  },
  fullscreen: {
    flex: 0.5,
    alignItems: "center",
  },
});
