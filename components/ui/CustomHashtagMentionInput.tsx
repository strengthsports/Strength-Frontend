import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const CustomHashtagMentionInput = ({
  value,
  onChangeText,
  placeholder = "Type something...",
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) => {
  const [displayText, setDisplayText] = useState<any>([]);
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });

  useEffect(() => {
    // Format text for display whenever the value changes
    formatText(value);
  }, [value]);

  const formatText = (text: string) => {
    if (!text) {
      setDisplayText([]);
      return;
    }

    // Simple line-by-line processing
    const lines = text.split("\n");
    const formattedLines = lines.map((line, lineIndex) => {
      // Process each word in the line
      const words = line.split(" ");
      const formattedWords = words.map((word, wordIndex) => {
        if (word.startsWith("#") || word.startsWith("@")) {
          return (
            <Text
              key={`${lineIndex}-${wordIndex}`}
              style={{ color: "#12956B" }}
            >
              {word}
              {wordIndex < words.length - 1 ? " " : ""}
            </Text>
          );
        } else {
          return (
            <Text key={`${lineIndex}-${wordIndex}`}>
              {word}
              {wordIndex < words.length - 1 ? " " : ""}
            </Text>
          );
        }
      });

      return (
        <Text key={`line-${lineIndex}`}>
          {formattedWords}
          {lineIndex < lines.length - 1 ? "\n" : ""}
        </Text>
      );
    });

    setDisplayText(formattedLines);
  };

  const handleSelectionChange = (event: any) => {
    setCursorPosition(event.nativeEvent.selection);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.displayLayer}>
        {displayText.length > 0 ? (
          displayText
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
      </Text>
      <TextInput
        style={[
          styles.input,
          { color: "transparent" }, // Make the text invisible
        ]}
        value={value}
        onChangeText={onChangeText}
        multiline
        caretHidden={false}
        // selection={{ start: value.length, end: value.length }}
        // selectionColor="#333"
        cursorColor="#12956B"
        selection={cursorPosition}
        onSelectionChange={handleSelectionChange}
        selectionColor="rgba(0,0,0,0.3)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingHorizontal: 16,
  },
  displayLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: 16,
    paddingTop: 0,
    paddingHorizontal: 22,
    zIndex: 1,
    color: "#fff",
  },
  input: {
    minHeight: 100,
    fontSize: 16,
    paddingTop: 0,
    textAlignVertical: "top",
    zIndex: 2,
  },
  placeholder: {
    color: "#aaa",
  },
});

export default CustomHashtagMentionInput;
