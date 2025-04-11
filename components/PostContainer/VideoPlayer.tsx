import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Video, ResizeMode, AVPlaybackStatusSuccess } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { RelativePathString } from "expo-router";

type VideoPlayerProps = {
  videoUri: string;
  postId?: string;
  autoPlay: boolean;
  isFeedPage?: boolean;
  onPlaybackStatusUpdate?: (status: AVPlaybackStatusSuccess) => void;
};

export type VideoPlayerHandle = {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  toggleMute: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  getStatus: () => AVPlaybackStatusSuccess | null;
};

const CustomVideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  (
    { videoUri, postId, autoPlay, isFeedPage = false, onPlaybackStatusUpdate },
    ref
  ) => {
    const videoRef = useRef<Video | null>(null);
    const router = useRouter();
    const [status, setStatus] = useState<AVPlaybackStatusSuccess | null>(null);
    const [loading, setLoading] = useState(true);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      play: async () => {
        await videoRef.current?.playAsync();
      },
      pause: async () => {
        await videoRef.current?.pauseAsync();
      },
      toggleMute: async () => {
        if (videoRef.current && status) {
          await videoRef.current.setIsMutedAsync(!status.isMuted);
        }
      },
      seek: async (position: number) => {
        if (videoRef.current) {
          await videoRef.current.setPositionAsync(position);
        }
      },
      getStatus: () => status,
    }));

    useEffect(() => {
      if (videoRef.current) {
        if (autoPlay) {
          videoRef.current.playAsync();
        } else {
          videoRef.current.pauseAsync();
        }
      }
    }, [autoPlay]);

    const handlePlaybackStatusUpdate = (
      playbackStatus: AVPlaybackStatusSuccess
    ) => {
      setStatus(playbackStatus);

      const isBuffering =
        playbackStatus.isBuffering || !playbackStatus.isLoaded;
      setLoading(isBuffering);

      if (onPlaybackStatusUpdate) {
        onPlaybackStatusUpdate(playbackStatus);
      }
    };

    const renderFeedControls = () => (
      <TouchableOpacity
        style={styles.muteButton}
        onPress={async () => {
          if (videoRef.current && status) {
            await videoRef.current.setIsMutedAsync(!status.isMuted);
          }
        }}
      >
        <Ionicons
          name={status?.isMuted ? "volume-mute" : "volume-high"}
          size={12}
          color="#fff"
        />
      </TouchableOpacity>
    );

    return (
      <TouchableOpacity
        style={styles.container}
        className={isFeedPage ? "ml-2" : "ml-0"}
        activeOpacity={0.7}
        onPress={() => {
          isFeedPage &&
            postId &&
            router.push({
              pathname: `/post-view/${postId}` as RelativePathString,
            });
        }}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={[
            styles.video,
            isFeedPage
              ? {
                  borderTopLeftRadius: 16,
                  borderBottomLeftRadius: 16,
                  borderTopWidth: 0.5,
                  borderBottomWidth: 0.5,
                  borderLeftWidth: 0.5,
                  borderColor: "#2F2F2F",
                }
              : {},
          ]}
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status) =>
            handlePlaybackStatusUpdate(status as AVPlaybackStatusSuccess)
          }
          useNativeControls={false}
          isLooping
        />

        {loading && (
          <ActivityIndicator style={styles.loader} size="large" color="#fff" />
        )}

        {isFeedPage && renderFeedControls()}
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000000",
    position: "relative",
  },
  video: {
    flex: 1,
  },
  loader: {
    position: "absolute",
    alignSelf: "center",
    top: "45%",
  },
  muteButton: {
    position: "absolute",
    bottom: 10,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
});

export default CustomVideoPlayer;
