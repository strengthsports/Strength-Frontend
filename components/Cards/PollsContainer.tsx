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
import { LinearGradient } from 'expo-linear-gradient';
import PollsTickIcon from "../SvgIcons/addpost/PollsTickIcon";

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
    const [localOptions, setLocalOptions] = useState(
      mode === "create" ? (options.length > 0 ? options : ["", ""]) : options
   );

   //state for optimistic UI updates
   const [localUserVoted, setLocalUserVoted] = useState(userVoted);
    const [localSelectedOption, setLocalSelectedOption] = useState(selectedOption);
    const [localVoteCounts, setLocalVoteCounts] = useState(() =>
      (voteCounts && voteCounts.length === options.length) ? [...voteCounts] : Array(options.length).fill(0)
    );
    
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const MAX_OPTION_LENGTH = 25;

    useEffect(() => {
      setLocalUserVoted(userVoted);
    }, [userVoted]);
  
    useEffect(() => {
      setLocalSelectedOption(selectedOption);
    }, [selectedOption]);

    useEffect(() => {
      if (voteCounts && voteCounts.length === localOptions.length) {
          if (JSON.stringify(voteCounts) !== JSON.stringify(localVoteCounts)) {
               setLocalVoteCounts([...voteCounts]);
          }
      } else if (localOptions.length > 0 && (!voteCounts || voteCounts.length === 0)) {
          setLocalVoteCounts(Array(localOptions.length).fill(0));
      }
  }, [JSON.stringify(voteCounts), localOptions.length]);
  
    

    // Memoized total votes calculation
    const totalVotes = useMemo(
      () => localVoteCounts.reduce((acc, curr) => acc + curr, 0),
      [localVoteCounts]
    );

    // Memoized percentage calculations
    const optionPercentages = useMemo(
      () =>
        localVoteCounts.map((count) =>
          totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
        ),
      [localVoteCounts, totalVotes]
    );
  
    useEffect(() => {
      if (mode === "create") {
        setLocalOptions(options.length > 0 ? options : ["", ""]);
      }else {
        if (JSON.stringify(options) !== JSON.stringify(localOptions)) {
          setLocalOptions(options);
          setLocalVoteCounts(voteCounts && voteCounts.length === options.length ? [...voteCounts] : Array(options.length).fill(0));
        }
      }
    }, [options, mode, voteCounts]);

    // useEffect(()=>{
    //  if (localOptions.length > 1) {
    //   set
    //  }
    // })

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

    // *** optimistic vote handler ***
    const handleVote = useCallback(
      (index: number) => {
        if (!localUserVoted && index >= 0 && index < localVoteCounts.length) {
          const optimisticCounts = [...localVoteCounts];
          optimisticCounts[index] += 1;
          const optimisticVoted = true;
          const optimisticSelection = index;

          setLocalVoteCounts(optimisticCounts);
          setLocalUserVoted(optimisticVoted);
          setLocalSelectedOption(optimisticSelection);

          onVote?.(index);
        }
      },
      [localUserVoted, localVoteCounts, onVote]
    );

    return (
      <View
        style={styles.container}
        className={`${mode === "create" && "mt-[-30px] ml-3 mr-1 pt-5 pb-8 rounded-2xl"}`}
      >
        {(mode === "create" || onClose) && (
          <View style={styles.header}>
            <TextScallingFalse style={styles.title}>
              Poll
            </TextScallingFalse>
            {onClose && (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.closeButton}
                onPress={onClose}
              >
                <AntDesign name="close" size={14} color="white" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ width: "100%", paddingVertical: 10 }}>
        {localOptions.map((option, index) => {
            const percentage = optionPercentages[index] / 100;

            const baseBackgroundColor = '#181818';
            const fillColor = '#353535';
  
            const gradientLocations = [0, percentage, Math.min(percentage + 0.0001, 1), 1] as const;
            const gradientColors = [
              fillColor,
              fillColor,
              baseBackgroundColor,
              baseBackgroundColor,
            ] as const;
  
            const gradientDisabledColors = [
              baseBackgroundColor,
              baseBackgroundColor,
            ] as const;
  
            const gradientDisabledLocations = [0, 1] as const;

            return (
              <View key={index} style={styles.optionContainer}>
                {mode === "create" ? (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      placeholder={index < 2 ? `Option ${index + 1}` : `Option ${index + 1} (Optional)`}
                      placeholderTextColor="grey"
                      value={option}
                      onChangeText={(text) => updateOption(text, index)}
                      style={styles.optionInput}
                      editable={mode === "create"}
                      maxLength={MAX_OPTION_LENGTH}
                    />
                    <TextScallingFalse style={styles.charCountText}>
                      {MAX_OPTION_LENGTH - option.length}
                    </TextScallingFalse>
                  </View>
                ) : (
                  <TouchableOpacity
                     style={[
                       styles.optionInputBase,
                       localSelectedOption === index && styles.selectedOptionBorder,
                     ]}
                     disabled={localUserVoted}
                     onPress={() => handleVote(index)}
                  >
                    <LinearGradient
                      style={styles.resultBarContainer}
                      colors={localUserVoted ? gradientColors : gradientDisabledColors}
                      locations={localUserVoted ? gradientLocations : gradientDisabledLocations}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                    >
                      <TextScallingFalse style={styles.optionText}>
                        {option}
                        {localSelectedOption === index && (
                          <View style={{paddingLeft: 5}}>
                            <PollsTickIcon/>
                          </View>
                        )}
                      </TextScallingFalse>
                        {localUserVoted && (
                          <TextScallingFalse style={styles.percentageText}>
                             {optionPercentages[index]}%
                          </TextScallingFalse>
                        )}
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            )
          })}
        </View>

        {mode === "create"
          ? localOptions.length < 4 && (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.addButton}
                onPress={addOption}
              >
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                  <TextScallingFalse style={styles.addButtonText}>
                    Add Option
                  </TextScallingFalse>
                  <MaterialCommunityIcons
                    name="plus"
                    color="white"
                    size={18}
                  />
                </View>
              </TouchableOpacity>
            )
          : (
              <TextScallingFalse style={styles.totalVotesText}>
                {totalVotes>1 ? `Votes: ${totalVotes}` : `Vote: ${totalVotes}`}
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
    width: "95%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
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
    // paddingVertical: 8,
    marginVertical: 5,
  },
  optionInputBase: {
    fontSize: 16,
    color: "white",
    height: 45,
    borderWidth: 1,
    borderColor: "#363636",
    borderRadius: 10,
    justifyContent: 'center',
    overflow: 'hidden',
    // backgroundColor: BASE_BACKGROUND_COLOR,
  },
  selectedOptionBorder: {
    borderColor: "#5F5F5F",
  },
  // resultBarAnimated: {
  //   position: 'absolute',
  //   left: 0,
  //   top: 0,
  //   bottom: 0,
  // },
  // contentOverlay: {
  //   position: 'relative',
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   height: "100%",
  //   paddingHorizontal: 16,
  //   backgroundColor: 'transparent',
  // },
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
  optionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 8,
    // backgroundColor: 'transparent',
  },
  optionText: {
    color: "white",
    fontSize: 16,
    zIndex: 2,
    // backgroundColor: 'transparent',
  },
  tickIconContainer: {
    paddingLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  //  backgroundColor: 'transparent',
  },
  optionContainer: {
    position: "relative",
    marginVertical: 5,
  },
  resultBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    paddingHorizontal: 16,
  },
  // resultBar: {
  //   position: "absolute",
  //   left: 0,
  //   top: 0,
  //   bottom: 0,
  //   backgroundColor: "#353535",
  //   borderRadius: 10,
  // },
  percentageText: {
    color: "grey",
    fontSize: 14,
    fontWeight: '500',
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  totalVotesText: {
    color: "grey",
    fontSize: 14,
    textAlign: "left",
    paddingRight: 8,
    marginTop: 8,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  charCountText: {
    position: 'absolute',
    right: 20,
    top: 20,
    color: 'grey',
    fontSize: 10,
    fontWeight:700
  },
});
