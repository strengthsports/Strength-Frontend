import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Pressable,
  Dimensions,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import { useEvent } from "expo";
import Slider from "@react-native-community/slider";
import ClipsIconRP from "../SvgIcons/profilePage/ClipsIconRP";
import PauseIcon from "../SvgIcons/clips/PauseIcon";
import TextScallingFalse from "../CentralText";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const DEFAULT_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function YouTubeStyleVideoPlayer({
  videoSource = DEFAULT_VIDEO,
  onRemove,
  editable = false,
  title = "Big Buck Bunny",
}: any) {
  // Player state
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);

  const playerRef = useRef<VideoView>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const controlsTimer = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  // Create video player instance
  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
    player.loop = true;
    player.volume = 1.0;
    player.muted = isMuted;

    return () => {
      player.pause();
    };
  });

  // Safety check
  const isPlayerValid = () => {
    try {
      const _ = player.status;
      return true;
    } catch (e) {
      console.log("Player is no longer valid:", e);
      return false;
    }
  };

  // Player status
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  // Initialize player
  useEffect(() => {
    if (!isPlayerValid()) return;

    const updateDuration = () => {
      if (player.duration > 0) {
        setDuration(player.duration);
      }
    };

    player.timeUpdateEventInterval = 0.1; // More frequent updates for smoother progress
    updateDuration();

    return () => {
      if (isPlayerValid()) {
        player.timeUpdateEventInterval = 0;
      }
    };
  }, [player]);

  // Track current time
  useEffect(() => {
    const updateProgress = () => {
      if (isPlayerValid() && !seeking) {
        const time = player.currentTime;
        setCurrentTime(time);
        setSeekValue(time);
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [player, seeking]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      startControlsTimer();
    } else {
      clearControlsTimer();
    }

    return () => clearControlsTimer();
  }, [showControls, isPlaying]);

  const startControlsTimer = () => {
    clearControlsTimer();
    controlsTimer.current = setTimeout(() => {
      fadeOutControls();
    }, 3000); // 3 seconds timeout like YouTube
  };

  const clearControlsTimer = () => {
    if (controlsTimer.current) {
      clearTimeout(controlsTimer.current);
      controlsTimer.current = null;
    }
  };

  const fadeOutControls = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setControlsVisible(false);
      }
    });
  };

  const fadeInControls = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    startControlsTimer();
  };

  // Format time
  const formatTime = (timeInSeconds: number) => {
    if (!timeInSeconds) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!isPlayerValid()) return;
    if (isPlaying) {
      clearControlsTimer();
      player.pause();
    } else {
      clearControlsTimer();
      player.play();
    }
    fadeInControls(); // Always show controls when interacting
  };

  // Toggle mute
  const toggleMute = () => {
    if (!isPlayerValid()) return;
    setIsMuted(!isMuted);
    player.muted = !isMuted;
    fadeInControls();
  };

  const handleFullScreen = async () => {
    try {
      setIsFullscreen(true);

      // Enter fullscreen
      await playerRef.current?.enterFullscreen();
    } catch (error) {
      console.error("Error in fullscreen:", error);
    }
  };

  // Handle seeking
  const handleSeekStart = () => {
    if (!isPlayerValid()) return;
    setSeeking(true);
    clearControlsTimer();
  };

  const handleSeekChange = (value: number) => {
    setSeekValue(value);
  };

  const handleSeekComplete = (value: number) => {
    if (!isPlayerValid()) return;
    player.currentTime = value;
    setCurrentTime(value);
    setSeeking(false);
    startControlsTimer();
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Pressable
        style={[styles.videoContainer]}
        onPress={togglePlayPause}
        onStartShouldSetResponder={() => false}
      >
        <VideoView
          ref={playerRef}
          style={[
            styles.video,
            {
              borderTopLeftRadius: editable ? 16 : 0,
              borderBottomLeftRadius: editable ? 16 : 0,
              marginLeft: editable ? 8 : 0,
            },
          ]}
          player={player}
          contentFit={isFullscreen ? "cover" : "contain"}
          nativeControls={isFullscreen ? true : false}
          allowsFullscreen
          onFullscreenExit={() => setIsFullscreen(false)}
        />

        {/* Controls overlay */}
        <Animated.View
          style={[styles.controlsContainer, { opacity: fadeAnim }]}
        >
          {/* Center controls */}
          <View style={styles.centerControls}>
            {isPlaying ? <PauseIcon /> : <ClipsIconRP />}
          </View>
          {!editable && (
            <View style={styles.rightControls}>
              <TouchableOpacity
                onPress={handleFullScreen}
                style={styles.controlButton}
              >
                <MaterialCommunityIcons
                  name="fullscreen"
                  size={24}
                  color="#E6E6E6"
                />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {editable && !isFullscreen && (
          <TouchableOpacity
            onPress={onRemove}
            style={styles.removeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="close" size={20} color="white" />
          </TouchableOpacity>
        )}
      </Pressable>
      {/* Bottom Controls */}
      <View className="items-end justify-between">
        {/* Progress bar */}
        <View style={styles.progressRow}>
          <MaterialCommunityIcons
            name={isPlaying ? "pause" : "play"}
            size={20}
            color="#EAEAEA"
          />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={player.duration}
            value={seeking ? seekValue : currentTime}
            minimumTrackTintColor="#EAEAEA"
            maximumTrackTintColor="#E6E6E6"
            thumbTintColor="#EAEAEA"
            onSlidingStart={handleSeekStart}
            onValueChange={handleSeekChange}
            onSlidingComplete={handleSeekComplete}
          />
          {/* Bottom time display */}
          <View style={styles.timeContainer}>
            <TextScallingFalse style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(player.duration)}
            </TextScallingFalse>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  fullscreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 100,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  fullscreenVideo: {
    width: SCREEN_HEIGHT,
    height: SCREEN_WIDTH,
    transform: [{ rotate: "90deg" }],
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 16,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  rightControls: {
    position: "absolute",
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    padding: 8,
    marginLeft: 8,
  },
  centerControls: {
    flexDirection: "row",
    columnGap: 20,
    alignItems: "center",
    alignSelf: "center",
    paddingTop: 70,
  },
  playButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
  },
  skipButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: 30,
    height: 30,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  timeText: {
    color: "#E6E6E6",
    fontSize: 12,
  },
  // New YouTube-style progress bar
  progressBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#12956B",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    height: 20,
    marginHorizontal: 8,
  },
});
