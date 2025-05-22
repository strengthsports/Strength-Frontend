import { router } from "expo-router";
import TextScallingFalse from "~/components/CentralText";

// Currently this is for small usecases

// Function to render caption with clickable hashtags and mention tags
type TaggedUser = {
  _id: string;
  username: string;
  type: string;
};

const goToHashtag = (tag: string) => {
  // string version is faster than object
  router.push(`/hashtag/${tag}/top`);
};

const goToUser = (serializedUser: any, userId: string, currUserId: string) => {
  userId === currUserId
    ? router.push("/(app)/(tabs)/profile")
    : router.push(`/(app)/(profile)/profile/${serializedUser}`);
};

export default function renderCaptionWithTags(
  caption: string,
  color: string,
  fontSize: number
) {
  if (!caption) return null;

  const parts = caption.split(/(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g);
  const elements = [];
  let remainingChars = 94;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    // if (!part || remainingChars <= 0) continue;

    if (part.startsWith("#")) {
      // if (part.length > remainingChars) {
      //   showSeeMore = true;
      //   return;
      // }
      const tag = part.slice(1);
      elements.push(
        <TextScallingFalse
          key={i}
          className={`active:bg-gray-600`}
          style={{ color: "#12956B", fontSize: fontSize }}
          onPress={() => goToHashtag(tag)}
        >
          {part}
        </TextScallingFalse>
      );
    } else if (part.startsWith("@")) {
      const uname = part.slice(1);
      // const user = taggedUsers.find((u) => u.username === uname);
      // if (!user || part.length > remainingChars) {
      //   showSeeMore = true;
      //   return;
      // }
      elements.push(
        <TextScallingFalse
          key={i}
          className="active:bg-gray-600"
          style={{ color: "#12956B", fontSize: fontSize }}
        >
          {part}
        </TextScallingFalse>
      );
      remainingChars -= part.length;
    } else {
      const allowed = Math.min(remainingChars, part.length);
      const visibleText = part.slice(0, allowed);
      if (visibleText) {
        elements.push(
          <TextScallingFalse
            key={i}
            style={{ color: color, fontSize: fontSize }}
          >
            {visibleText}
          </TextScallingFalse>
        );
        remainingChars -= allowed;

        // // Add see more immediately if we're truncating
        // if (allowed < part.length) {
        //   showSeeMore = true;
        //   break;
        // }
      }
    }
  }

  return elements;
}
