import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

export type IconSymbolName = string;

/**
 * A simplified icon component that uses MaterialCommunityIcons directly.
 */
export function IconSymbol({
  name,
  size = 26,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <MaterialCommunityIcons
      color={color}
      size={size}
      name={name as any} // Directly use the name prop
      style={style}
    />
  );
}
