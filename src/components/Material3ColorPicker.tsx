import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ColorPickerProps {
  color: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Material3ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  selected = false,
  onPress,
  style,
}) => {
  const theme = useTheme() as MD3Theme;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.colorOption,
        {
          backgroundColor: color,
          borderColor: selected ? theme.colors.onSurface : 'transparent',
          borderWidth: selected ? 3 : 0,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      {selected && (
        <Icon 
          name="check" 
          size={20} 
          color={theme.colors.surface} 
          style={styles.checkIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  checkIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});