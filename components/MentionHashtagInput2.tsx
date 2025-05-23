import { Image } from "expo-image";
import debounce from "lodash.debounce";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { HASHTAG_CATEGORIES } from "~/data/hashtags";
import { RootState } from "~/reduxStore";
import { useSearchUsersMutation } from "~/reduxStore/api/explore/searchApi";
import ParsedText from "react-native-parsed-text";
import TextScallingFalse from "./CentralText";

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

  // Debounced user search
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

      const newCursorPos = prefix.length + insertText.length;
      setTimeout(() => {
        inputRef.current?.setNativeProps({
          selection: { start: newCursorPos, end: newCursorPos },
        });
        setSelection({ start: newCursorPos, end: newCursorPos });
      }, 10);

      setShowSuggestions(false);
    },
    [selection, suggestionType, text, setPostText]
  );

  const handleSetTaggedUser = (taggedUser: string) => {
    setTaggedUsers((prev) => [...prev, taggedUser]);
  };

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
              <TextScallingFalse style={styles.suggestionName}>
                {item.firstName} {item.lastName}
              </TextScallingFalse>
              <TextScallingFalse style={styles.suggestionUsername}>
                @{item.username}
              </TextScallingFalse>
            </View>
          </View>
        ) : (
          <View>
            <TextScallingFalse style={styles.hashtag}>
              #{item.name}
            </TextScallingFalse>
            <TextScallingFalse style={styles.hashtagType}>
              {item.type}
            </TextScallingFalse>
          </View>
        )}
      </TouchableOpacity>
    ),
    [suggestionType, insertSuggestion]
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
          <ParsedText
            style={styles.inputOverlay}
            parse={[
              { pattern: /@[\w]+/, style: styles.mentionText },
              { pattern: /#[\w]+/, style: styles.hashtagText },
            ]}
          >
            {text}
          </ParsedText>
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

export default MentionHashtagInput2;
