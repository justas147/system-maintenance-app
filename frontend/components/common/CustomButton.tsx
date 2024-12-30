import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type CustomButtonProps = {
  onPress: () => void;
  title: string;
  style?: object;
  disabled?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title, style }) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress} disabled={false}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default CustomButton;