import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { MaterialIcons } from "@expo/vector-icons";
import { useEvent } from "expo";

// Default sample video - replace with actual user video
const DEFAULT_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function VideoPlayer({
  videoSource = DEFAULT_VIDEO,
  editable = false,
}) {
  // State for the post text/caption
  const [isMuted, setIsMuted] = useState(false);

  // Create video player instance with proper cleanup
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.volume = 1.0;
    player.muted = isMuted;

    // Return cleanup function
    return () => {
      // Make sure player is properly disposed
      player.pause();
    };
  });

  // Safety check to prevent operations on released player
  const isPlayerValid = () => {
    try {
      // Access a property to test if player is valid
      const _ = player.status;
      return true;
    } catch (e) {
      console.log("Player is no longer valid:", e);
      return false;
    }
  };

  // Video player state using events with safety checks
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });
  const { currentTime, duration } = useEvent(player, "timeUpdate", {
    currentTime: 0,
    duration: player.duration || 0,
  });

  // Configure time updates with proper cleanup
  React.useEffect(() => {
    if (isPlayerValid()) {
      player.timeUpdateEventInterval = 0.25; // Update 4 times a second
    }

    return () => {
      // Important cleanup to prevent the "shared object released" error
      if (isPlayerValid()) {
        player.timeUpdateEventInterval = 0;
      }
    };
  }, [player]);

  // Convert progress to percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Add component unmount handler
  useEffect(() => {
    return () => {
      // Final cleanup when component unmounts
      if (isPlayerValid()) {
        try {
          player.pause();
          // Reset any other player properties as needed
        } catch (error) {
          console.log("Cleanup error:", error);
        }
      }
    };
  }, []);

  // Toggle mute with safety check
  const handleToggleMute = () => {
    if (isPlayerValid()) {
      setIsMuted(!isMuted);
      player.muted = !isMuted;
    }
  };

  // Safe method to toggle play/pause
  const togglePlayPause = () => {
    if (!isPlayerValid()) return;

    try {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  // Safe method to replay video
  const handleReplay = () => {
    if (!isPlayerValid()) return;

    try {
      player.replay();
    } catch (error) {
      console.error("Error replaying video:", error);
    }
  };

  // Safe method to change playback rate
  const togglePlaybackRate = () => {
    if (!isPlayerValid()) return;

    try {
      player.playbackRate = player.playbackRate === 1.0 ? 1.5 : 1.0;
    } catch (error) {
      console.error("Error changing playback rate:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Video container with 16:9 aspect ratio */}
        <View style={styles.videoContainer}>
          <VideoView
            style={styles.video}
            player={player}
            contentFit="cover"
            nativeControls={false}
          />

          {/* Video progress bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${progressPercentage}%` }]}
            />
          </View>

          {/* Overlay controls that appear on video */}
          <View style={styles.videoOverlay}>
            {/* Play/Pause button in center */}
            <TouchableOpacity onPress={togglePlayPause}>
              <View>
                {isPlaying ? (
                  <View style={styles.pauseIcon}>
                    <View style={styles.pauseBar} />
                    <View style={styles.pauseBar} />
                  </View>
                ) : (
                  <View style={styles.playIcon} />
                )}
              </View>
            </TouchableOpacity>

            {/* Bottom controls */}
            <View style={styles.videoControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleToggleMute}
              >
                {isMuted ? (
                  <MaterialIcons name="volume-off" size={20} color="white" />
                ) : (
                  <MaterialIcons name="volume-up" size={20} color="white" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleReplay}
              >
                <MaterialIcons name="replay" size={20} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={togglePlaybackRate}
              >
                <MaterialIcons name="fast-forward" size={20} color="white" />
                <Text style={styles.speedText}>
                  {player.playbackRate === 1.0 ? "1x" : "1.5x"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9, // 16:9 aspect ratio
    position: "relative",
    backgroundColor: "#000",
    marginBottom: 10,
  },
  video: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderLeftColor: "white",
    borderTopWidth: 15,
    borderTopColor: "transparent",
    borderBottomWidth: 15,
    borderBottomColor: "transparent",
    marginLeft: 6,
  },
  pauseIcon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    height: 24,
  },
  pauseBar: {
    width: 6,
    height: 20,
    backgroundColor: "white",
    marginHorizontal: 3,
  },
  progressBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    zIndex: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#12956B",
  },
  videoControls: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    padding: 2,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  controlButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  speedText: {
    color: "white",
    fontSize: 10,
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 2,
    borderRadius: 4,
  },
});
