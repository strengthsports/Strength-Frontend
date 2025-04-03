import React, {
  memo,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import TextScallingFalse from "../CentralText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface PollsContainerProps {
  mode?: "create" | "view";
  options: string[];
  voteCounts?: number[];
  userVoted?: boolean;
  selectedOption?: number;
  onClose?: () => void;
  onOptionsChange?: (options: string[]) => void;
  onVote?: (optionIndex: number) => void;
}

const PollsContainer: React.FC<PollsContainerProps> = memo(
  ({
    mode = "create",
    options,
    voteCounts = [],
    userVoted = false,
    selectedOption = -1,
    onClose,
    onOptionsChange,
    onVote,
  }) => {
    const [localOptions, setLocalOptions] = useState(options);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    // Memoized total votes calculation
    const totalVotes = useMemo(
      () => voteCounts.reduce((acc, curr) => acc + curr, 0),
      [voteCounts]
    );

    // Memoized percentage calculations
    const optionPercentages = useMemo(
      () =>
        voteCounts.map((count) =>
          totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
        ),
      [voteCounts, totalVotes]
    );

    useEffect(() => {
      if (mode === "create") {
        setLocalOptions(options.length > 0 ? options : ["", ""]);
      }
    }, [options, mode]);

    const addOption = useCallback(() => {
      if (localOptions.length < 4) {
        const newOptions = [...localOptions, ""];
        setLocalOptions(newOptions);
        onOptionsChange?.(newOptions);
      }
    }, [localOptions, onOptionsChange]);

    const updateOption = useCallback(
      (text: string, index: number) => {
        const newOptions = [...localOptions];
        newOptions[index] = text;
        setLocalOptions(newOptions);
        onOptionsChange?.(newOptions);
      },
      [localOptions, onOptionsChange]
    );

    return (
      <View
        style={styles.container}
        className={`${mode === "create" && "ml-5 pt-5 pb-10 rounded-2xl"}`}
      >
        {(mode === "create" || onClose) && (
          <View style={styles.header}>
            <TextScallingFalse style={styles.title}>
              {mode === "create" ? "Create Poll" : "Poll"}
            </TextScallingFalse>
            {onClose && (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.closeButton}
                onPress={onClose}
              >
                <AntDesign name="close" size={14} color="grey" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ width: "100%", paddingVertical: 10 }}>
          {localOptions.map((option, index) => (
            <View key={index} style={styles.optionContainer}>
              {mode === "create" ? (
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor="grey"
                  value={option}
                  onChangeText={(text) => updateOption(text, index)}
                  style={styles.optionInput}
                  editable={mode === "create"}
                />
              ) : (
                <TouchableOpacity
                  style={[
                    styles.optionInput,
                    userVoted && { backgroundColor: "#353535" },
                    selectedOption === index && { borderColor: "#5F5F5F" },
                  ]}
                  disabled={userVoted}
                  onPress={() => onVote?.(index)}
                >
                  <View style={styles.resultBarContainer}>
                    {userVoted && (
                      <View
                        style={[
                          styles.resultBar,
                          { width: `${optionPercentages[index]}%` },
                        ]}
                      />
                    )}
                    <TextScallingFalse style={styles.optionText}>
                      {option}
                      {selectedOption === index && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={14}
                          className="ml-3"
                        />
                      )}
                    </TextScallingFalse>
                    {userVoted && (
                      <TextScallingFalse style={styles.percentageText}>
                        {optionPercentages[index]}%
                      </TextScallingFalse>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {mode === "create"
          ? localOptions.length < 4 && (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.addButton}
                onPress={addOption}
              >
                <TextScallingFalse style={styles.addButtonText}>
                  Add Option
                </TextScallingFalse>
              </TouchableOpacity>
            )
          : userVoted && (
              <TextScallingFalse style={styles.totalVotesText}>
                Votes : {totalVotes}
              </TextScallingFalse>
            )}
      </View>
    );
  }
);

// Custom comparison function for memoization
const areEqual = (
  prevProps: PollsContainerProps,
  nextProps: PollsContainerProps
) => {
  return (
    prevProps.mode === nextProps.mode &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options) &&
    JSON.stringify(prevProps.voteCounts) ===
      JSON.stringify(nextProps.voteCounts) &&
    prevProps.userVoted === nextProps.userVoted &&
    prevProps.selectedOption === nextProps.selectedOption &&
    prevProps.onClose === nextProps.onClose &&
    prevProps.onOptionsChange === nextProps.onOptionsChange &&
    prevProps.onVote === nextProps.onVote
  );
};

export default memo(PollsContainer, areEqual);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#181818",
    paddingHorizontal: 35,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.2)",
    width: 27,
    height: 27,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  optionInput: {
    fontSize: 16,
    color: "white",
    paddingHorizontal: 16,
    height: 45,
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#363636",
    borderRadius: 10,
    paddingVertical: 8,
    marginVertical: 5,
  },
  addButton: {
    padding: 12,
    backgroundColor: "#181818",
    borderWidth: 0.8,
    borderColor: "grey",
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 15,
  },
  optionContainer: {
    position: "relative",
    // marginVertical: 5,
  },
  resultBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    paddingHorizontal: 8,
  },
  resultBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#353535",
    borderRadius: 10,
  },
  optionText: {
    flexDirection: "row",
    alignItems: "center",
    color: "white",
    fontSize: 16,
    zIndex: 1,
  },
  percentageText: {
    color: "grey",
    fontSize: 14,
    zIndex: 1,
  },
  totalVotesText: {
    color: "grey",
    fontSize: 14,
    textAlign: "left",
    paddingRight: 8,
    marginTop: 8,
  },
});
