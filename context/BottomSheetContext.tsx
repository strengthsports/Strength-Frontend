// BottomSheetContext.js - Updated to support React components as children
import React, { createContext, useState, useContext, useCallback } from "react";

type BottomState = {
  isVisible: boolean;
  content: any;
  height: string | number;
  bgcolor?: string;
  border?: boolean;
  draggableDirection?: string;
  maxHeight: string | number;
  heading?: string;
};

// Define the initial bottom sheet state
const initialState: BottomState = {
  isVisible: false,
  content: null, // This will hold any React component
  height: "30%",
  bgcolor: "#151515",
  border: false,
  draggableDirection: "down",
  maxHeight: "30%",
  heading: "",
};

// Context type
export type BottomSheetContextType = {
  bottomSheetState: BottomState;
  openBottomSheet: (config: BottomState) => void;
  closeBottomSheet: () => void;
};

// Create the context
export const BottomSheetContext = createContext<
  BottomSheetContextType | undefined
>(undefined);

// Create a provider component
export const BottomSheetProvider = ({ children }: { children: any }) => {
  const [bottomSheetState, setBottomSheetState] = useState(initialState);

  // Function to open the bottom sheet with content (React component or items array)
  const openBottomSheet = (config: BottomState) => {
    setBottomSheetState({
      isVisible: true,
      content: config.content,
      height: config.height || "30%",
      bgcolor: config.bgcolor || "#151515",
      border: config.border || false,
      draggableDirection: config.draggableDirection,
      maxHeight: config.maxHeight,
      heading: config.heading,
    });
  };

  // Function to close the bottom sheet
  const closeBottomSheet = useCallback(() => {
    console.log("Closing bottom sheet");
    setBottomSheetState((prevState) => ({
      ...prevState,
      isVisible: false,
    }));
  }, []);

  const contextValue = {
    bottomSheetState,
    openBottomSheet,
    closeBottomSheet,
  };

  return (
    <BottomSheetContext.Provider value={contextValue}>
      {children}
    </BottomSheetContext.Provider>
  );
};

// Custom hook to use the bottom sheet context
export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
};
