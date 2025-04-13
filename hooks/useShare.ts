import { useCallback } from "react";
import * as FileSystem from "expo-file-system";
import { Share, Platform } from "react-native";
import { showFeedback } from "~/utils/feedbackToast";

export const useShare = () => {
  const sharePost = useCallback(
    async ({
      imageUrl,
      caption,
      link,
    }: {
      imageUrl?: string;
      caption: string;
      link?: string;
    }) => {
      try {
        const message = `${caption}${
          link ? `\n\nTo know more, download the app...\n${link}` : ""
        }`;

        if (Platform.OS === "ios") {
          await Share.share({ message });
        } else if (Platform.OS === "android" && imageUrl) {
          // Download the image
          const fileUri = `${FileSystem.cacheDirectory}${Date.now()}.jpg`;
          await FileSystem.downloadAsync(imageUrl, fileUri);

          // Android supports image URI + text
          await Share.share({
            message,
            url: fileUri,
          });
        } else {
          await Share.share({ message });
        }
      } catch (err) {
        console.error("Sharing failed", err);
        showFeedback("Failed to share post.");
      }
    },
    []
  );

  return { sharePost };
};
