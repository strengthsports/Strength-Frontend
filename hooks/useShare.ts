import { useCallback } from "react";
import * as FileSystem from "expo-file-system";
import { Share, Platform } from "react-native";
import { showFeedback } from "~/utils/feedbackToast";

const LINK = "https://www.yourstrength.in/";
const APP_NAME = "Strength";

export const useShare = () => {
  const sharePost = useCallback(
    async ({
      imageUrl,
      caption,
      link,
      sport,
    }: {
      imageUrl?: string;
      caption?: string;
      link?: string;
      sport?: string;
    }) => {
      try {
        const message =
          `${
            caption || "Check out this sports update!"
          }\n\n🏆 Join ${APP_NAME} - The ultimate sports community!\n\n` +
          `• Follow ${sport ? sport + " content" : "your favorite sports"}\n` +
          `• Connect with athletes worldwide\n` +
          `• Share your own highlights\n\n` +
          `Download now: ${link || LINK}`;

        if (Platform.OS === "ios") {
          await Share.share({ message });
        } else if (Platform.OS === "android" && imageUrl) {
          const fileUri = `${FileSystem.cacheDirectory}${Date.now()}.jpg`;
          await FileSystem.downloadAsync(imageUrl, fileUri);
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

  const shareProfile = useCallback(
    async ({
      imageUrl,
      fullname,
      link,
      sports = [], // Array of sports for users
      isAthlete = false,
      gender,
      isPage = false, // Flag for page profiles
    }: {
      imageUrl?: string;
      fullname: string;
      link?: string;
      sports?: string[];
      isAthlete?: boolean;
      gender?: string;
      isPage?: boolean;
    }) => {
      try {
        // Gender pronoun handling
        const pronoun =
          gender === "male" ? "him" : gender === "female" ? "her" : "them";

        let message: string;

        if (isPage) {
          // Page profile message (teams/clubs/orgs)
          message =
            `🏟️ ${fullname} is on ${APP_NAME}!\n\n` +
            `${
              sports.length > 0 ? `🏆 Sports: ${sports.join(", ")}\n\n` : ""
            }` +
            `Follow to:\n` +
            `• Get latest updates and news\n` +
            `• Connect with members\n` +
            `• Never miss an event\n\n` +
            `Official link: ${link || LINK}`;
        } else {
          // User profile message
          const sportsText =
            sports.length > 0
              ? `🔥 ${sports.length > 1 ? "Sports" : "Sport"}: ${sports.join(
                  ", "
                )}\n\n`
              : "";

          message =
            `${
              isAthlete ? "🏅 Pro Athlete" : "🙌 Meet"
            } ${fullname} on ${APP_NAME}!\n\n` +
            sportsText +
            `Join ${pronoun} to:\n` +
            `• ${
              isAthlete ? "Follow their journey" : "Connect with the community"
            }\n` +
            `• Discuss games and strategies\n` +
            `• Find teams, players, events and more\n\n` +
            `Download ${APP_NAME} now: ${link || LINK}`;
        }

        if (Platform.OS === "ios") {
          await Share.share({ message });
        } else if (Platform.OS === "android" && imageUrl) {
          const fileUri = `${FileSystem.cacheDirectory}${Date.now()}.jpg`;
          await FileSystem.downloadAsync(imageUrl, fileUri);
          await Share.share({
            message,
            url: fileUri,
          });
        } else {
          await Share.share({ message });
        }
      } catch (err) {
        console.error("Sharing failed", err);
        showFeedback("Failed to share profile.");
      }
    },
    []
  );

  //   const shareArticles = useCallback(
  //   async ({
  //     tittle,
  //     content,
  //     banner,
  //     sportsName = [], // Array of sports for users
  //     isAthlete = false,
  //     gender,
  //     isPage = false, // Flag for page profiles
  //   }: {
  //     content?: string;
  //     tittle?: string;
  //     banner?: string;
  //     sportsName?: string[];
  //     isAthlete?: boolean;
  //     gender?: string;
  //     isPage?: boolean;
  //   }) => {
  //     try {
  //       // Gender pronoun handling
  //       const pronoun =
  //         gender === "male" ? "him" : gender === "female" ? "her" : "them";

  //       let message: string;

  //       if (isPage) {
  //         // Page profile message (teams/clubs/orgs)
  //         message =
  //           `🏟️ ${fullname} is on ${APP_NAME}!\n\n` +
  //           `${
  //             sports.length > 0 ? `🏆 Sports: ${sports.join(", ")}\n\n` : ""
  //           }` +
  //           `Follow to:\n` +
  //           `• Get latest updates and news\n` +
  //           `• Connect with members\n` +
  //           `• Never miss an event\n\n` +
  //           `Official link: ${link || LINK}`;
  //       } else {
  //         // User profile message
  //         const sportsText =
  //           sports.length > 0
  //             ? `🔥 ${sports.length > 1 ? "Sports" : "Sport"}: ${sports.join(
  //                 ", "
  //               )}\n\n`
  //             : "";

  //         message =
  //           `${
  //             isAthlete ? "🏅 Pro Athlete" : "🙌 Meet"
  //           } ${fullname} on ${APP_NAME}!\n\n` +
  //           sportsText +
  //           `Join ${pronoun} to:\n` +
  //           `• ${
  //             isAthlete ? "Follow their journey" : "Connect with the community"
  //           }\n` +
  //           `• Discuss games and strategies\n` +
  //           `• Find teams, players, events and more\n\n` +
  //           `Download ${APP_NAME} now: ${link || LINK}`;
  //       }

  //       if (Platform.OS === "ios") {
  //         await Share.share({ message });
  //       } else if (Platform.OS === "android" && imageUrl) {
  //         const fileUri = `${FileSystem.cacheDirectory}${Date.now()}.jpg`;
  //         await FileSystem.downloadAsync(imageUrl, fileUri);
  //         await Share.share({
  //           message,
  //           url: fileUri,
  //         });
  //       } else {
  //         await Share.share({ message });
  //       }
  //     } catch (err) {
  //       console.error("Sharing failed", err);
  //       showFeedback("Failed to share profile.");
  //     }
  //   },
  //   []
  // );

  return { sharePost, shareProfile};
};
