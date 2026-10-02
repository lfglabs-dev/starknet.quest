import { Slot } from 'expo-router/build/Slot';
import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

type TChipProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
};

const TChip = ({ children, style, textStyle, onPress }: TChipProps) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#222',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      gap: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      fontSize: 12,
      fontWeight: '500',
      color: 'white',
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default TChip;
