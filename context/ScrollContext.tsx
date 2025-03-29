// contexts/ScrollContext.tsx
import React, { createContext, useContext, useRef } from "react";
import { Animated } from "react-native";

type ScrollContextType = { scrollY: Animated.Value };

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  return (
    <ScrollContext.Provider value={{ scrollY }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};
