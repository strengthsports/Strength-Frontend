import { Image } from "expo-image";
import debounce from "lodash.debounce";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { HASHTAG_CATEGORIES } from "~/data/hashtags";
import { RootState } from "~/reduxStore";
import { useSearchUsersMutation } from "~/reduxStore/api/explore/searchApi";

const TRENDING_HASHTAGS = [
  { id: "t1", name: "Strength", type: "Trending" },
  { id: "t2", name: "WorldOfSports", type: "Trending" },
  { id: "t3", name: "IAmOnStrength", type: "Trending" },
];

const MentionHashtagInput2 = ({
  text,
  setPostText,
  setTaggedUsers,
}: {
  text: string;
  setPostText: (text: string) => void;
  setTaggedUsers: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const userId = useSelector((state: RootState) => state.profile.user?._id);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionType, setSuggestionType] = useState<"@" | "#" | null>(null);
  const [suggestionQuery, setSuggestionQuery] = useState("");
  const [userResults, setUserResults] = useState<any[]>([]);
  const inputRef = useRef<TextInput>(null);

  // Combine all hashtags from categories
  const ALL_HASHTAGS = Object.values(HASHTAG_CATEGORIES).flatMap(
    (category) => category.hashtags
  );

  // RTK Query mutation for searching users
  const [searchUsers] = useSearchUsersMutation();

  // Debounced user search to prevent frequent re-renders
  const debouncedSearch = useRef(
    debounce((query: string) => {
      searchUsers({ username: query, limit: 5, page: 1, userId })
        .unwrap()
        .then((data) => {
          console.log(data);
          setUserResults(data);
        })
        .catch((error) => {
          console.log(error);
          setUserResults([]);
        });
    }, 300)
  ).current;

  useEffect(() => {
    if (suggestionType === "@" && suggestionQuery.trim()) {
      debouncedSearch(suggestionQuery);
    } else if (suggestionType === "@") {
      setUserResults([]);
    }
  }, [suggestionQuery, suggestionType, debouncedSearch]);

  const getFilteredHashtags = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      const trendingMatches = TRENDING_HASHTAGS.filter((h) =>
        h.name.toLowerCase().includes(lowerQuery)
      ).slice(0, 2);
      const categoryMatches = ALL_HASHTAGS.filter((h) =>
        h.name.toLowerCase().includes(lowerQuery)
      ).slice(0, 5 - trendingMatches.length);
      return [...trendingMatches, ...categoryMatches];
    },
    [ALL_HASHTAGS]
  );

  const parseText = useCallback((text: string) => {
    const segments: { text: string; type: "mention" | "hashtag" | "plain" }[] =
      [];
    let remainingText = text;

    while (remainingText.length > 0) {
      if (remainingText.startsWith("@")) {
        const endOfWord = remainingText.search(/[ \n]/);
        const mentionText =
          endOfWord === -1
            ? remainingText
            : remainingText.substring(0, endOfWord);
        segments.push({ text: mentionText, type: "mention" });
        remainingText =
          endOfWord === -1 ? "" : remainingText.substring(endOfWord);
      } else if (remainingText.startsWith("#")) {
        const endOfWord = remainingText.search(/[ \n]/);
        const hashtagText =
          endOfWord === -1
            ? remainingText
            : remainingText.substring(0, endOfWord);
        segments.push({ text: hashtagText, type: "hashtag" });
        remainingText =
          endOfWord === -1 ? "" : remainingText.substring(endOfWord);
      } else {
        const nextSpecialChar = remainingText.search(/[@#]/);
        const plainText =
          nextSpecialChar === -1
            ? remainingText
            : remainingText.substring(0, nextSpecialChar);
        if (plainText) segments.push({ text: plainText, type: "plain" });
        remainingText =
          nextSpecialChar === -1
            ? ""
            : remainingText.substring(nextSpecialChar);
      }
    }
    return segments;
  }, []);

  const onSelectionChange = useCallback((event: any) => {
    const { selection } = event.nativeEvent;
    setSelection(selection);
  }, []);

  useEffect(() => {
    if (selection.start !== selection.end) {
      setShowSuggestions(false);
      return;
    }

    const cursorPosition = selection.start;
    let wordStart = cursorPosition - 1;

    while (wordStart >= 0 && ![" ", "\n", "@", "#"].includes(text[wordStart])) {
      wordStart--;
    }

    const currentChar = text[wordStart];
    const isTrigger = currentChar === "@" || currentChar === "#";
    wordStart = isTrigger ? wordStart : wordStart + 1;

    const currentWord = text.substring(wordStart, cursorPosition);

    if (currentWord.startsWith("@")) {
      setSuggestionType("@");
      setSuggestionQuery(currentWord.substring(1));
      setShowSuggestions(true);
    } else if (currentWord.startsWith("#")) {
      setSuggestionType("#");
      setSuggestionQuery(currentWord.substring(1));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [selection, text]);

  const insertSuggestion = useCallback(
    (suggestion: any) => {
      const cursorPosition = selection.start;
      let wordStart = cursorPosition - 1;

      while (wordStart >= 0 && !["@", "#"].includes(text[wordStart])) {
        wordStart--;
      }
      if (wordStart < 0 || !["@", "#"].includes(text[wordStart])) return;

      const prefix = text.substring(0, wordStart + 1);
      const suffix = text.substring(cursorPosition);
      const insertText =
        suggestionType === "@"
          ? `${suggestion.username} `
          : `${suggestion.name} `;

      const newText = `${prefix}${insertText}${suffix}`;
      setPostText(newText);

      // compute new cursor position and update both native and state
      const newCursorPos = prefix.length + insertText.length;
      setTimeout(() => {
        inputRef.current?.setNativeProps({
          selection: { start: newCursorPos, end: newCursorPos },
        });
        setSelection({ start: newCursorPos, end: newCursorPos });
      }, 10);

      setShowSuggestions(false);
    },
    [selection, suggestionType, text]
  );

  const handleSetTaggedUser = (taggedUser: string) => {
    setTaggedUsers((prev) => [...prev, taggedUser]);
  };

  console.log("User results : ", userResults);

  const renderSuggestionItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => {
          insertSuggestion(item);
          handleSetTaggedUser(item._id);
        }}
      >
        {suggestionType === "@" ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image style={styles.avatarPlaceholder} source={item.profilePic} />
            <View>
              <Text style={styles.suggestionName}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.suggestionUsername}>@{item.username}</Text>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.hashtag}>#{item.name}</Text>
            <Text style={styles.hashtagType}>{item.type}</Text>
          </View>
        )}
      </TouchableOpacity>
    ),
    [suggestionType]
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: "transparent" }]}
          multiline
          value={text}
          onChangeText={setPostText}
          onSelectionChange={onSelectionChange}
          placeholder="What's on your mind?"
          placeholderTextColor="#999"
          selectionColor="#12956B"
          cursorColor="#12956B"
          autoCorrect={false}
        />
        <View style={styles.textOverlay} pointerEvents="none">
          <Text style={styles.inputOverlay}>
            {parseText(text).map((segment, index) => (
              <Text
                key={`segment-${index}`}
                style={[
                  styles.overlayText,
                  segment.type === "mention" && styles.mentionText,
                  segment.type === "hashtag" && styles.hashtagText,
                ]}
              >
                {segment.text}
              </Text>
            ))}
          </Text>
        </View>
      </View>

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={
              suggestionType === "@"
                ? userResults.filter((u) =>
                    u.username
                      ?.toLowerCase()
                      ?.includes(suggestionQuery?.toLowerCase())
                  )
                : getFilteredHashtags(suggestionQuery)
            }
            renderItem={renderSuggestionItem}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="always"
            maxToRenderPerBatch={5}
            windowSize={5}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    overflow: "hidden",
    minHeight: 100,
  },
  input: {
    minHeight: 100,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: "top",
  },
  textOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  inputOverlay: {
    fontSize: 16,
    lineHeight: 22,
    color: "#fff",
  },
  overlayText: {
    includeFontPadding: false,
  },
  mentionText: {
    color: "#12956B",
    fontWeight: "600",
  },
  hashtagText: {
    color: "#12956B",
    fontWeight: "600",
  },
  suggestionsContainer: {
    marginTop: 4,
    maxHeight: 500,
    borderTopWidth: 0.2,
    borderColor: "#eaeaea",
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingLeft: 16,
    borderBottomColor: "#eee",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    marginRight: 12,
  },
  suggestionName: {
    fontWeight: "bold",
    color: "#fff",
  },
  suggestionUsername: {
    color: "#666",
    fontSize: 12,
  },
  hashtag: {
    color: "#12956B",
    fontWeight: "500",
    fontSize: 16,
  },
  hashtagType: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
});

const mockUsers = [
  { id: "1", name: "John Doe", username: "johndoe" },
  { id: "2", name: "Jane Smith", username: "janesmith" },
  { id: "3", name: "Bob Johnson", username: "bobjohnson" },
];

export default MentionHashtagInput2;
