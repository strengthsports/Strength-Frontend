import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import TextScallingFalse from "~/components/CentralText";
import Divider from "../CustomDivider";

export type TooltipOption = {
  label: string;
  onPress: () => void;
  type?: "text" | "radio";
  selected?: boolean;
};

type TooltipBoxProps = {
  config: TooltipOption[];
  onDismiss: () => void;
};

const TooltipBox = ({ config, onDismiss }: TooltipBoxProps) => {
  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.overlayBackground}
        activeOpacity={1}
        onPress={onDismiss}
      />
      <View style={styles.tooltipContainer}>
        {config.map((item, index) => (
          <React.Fragment key={item.label}>
            <TouchableOpacity
              style={styles.tooltipButton}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              {item.type === "radio" ? (
                <View style={styles.radioContainer}>
                  <TextScallingFalse style={styles.tooltipButtonText}>
                    {item.label}
                  </TextScallingFalse>
                  <View
                    style={[
                      styles.radioOuter,
                      item.selected && styles.radioOuterSelected,
                    ]}
                  >
                    {item.selected && <View style={styles.radioInner} />}
                  </View>
                </View>
              ) : (
                <TextScallingFalse style={styles.tooltipButtonText}>
                  {item.label}
                </TextScallingFalse>
              )}
            </TouchableOpacity>
            {index !== config.length - 1 && (
              <Divider color="#434343" marginVertical={0} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export default TooltipBox;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 5,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  overlayBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  tooltipContainer: {
    width: 180,
    backgroundColor: "#333333",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tooltipButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "200",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  radioOuter: {
    height: 10,
    width: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: "#35A700",
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 6,
    backgroundColor: "#35A700",
  },
});
