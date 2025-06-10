import React from 'react';
import { ViewStyle } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

interface Material3TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  variant?: 'filled' | 'outlined';
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  style?: ViewStyle;
}

export const Material3TextInput: React.FC<Material3TextInputProps> = ({
  label,
  value,
  onChangeText,
  variant = 'outlined',
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error = false,
  errorText,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
}) => {
  const theme = useTheme() as MD3Theme;

  const getInputStyle = (): ViewStyle => {
    return {
      marginVertical: 8,
      backgroundColor: variant === 'filled' ? theme.colors.surfaceVariant : 'transparent',
    };
  };

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode={variant}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      error={error}
      disabled={disabled}
      left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
      right={rightIcon ? (
        <TextInput.Icon
          icon={rightIcon}
          onPress={onRightIconPress}
        />
      ) : undefined}
      style={[getInputStyle(), style]}
      theme={{
        colors: {
          primary: theme.colors.primary,
          error: theme.colors.error,
          surface: theme.colors.surface,
          onSurfaceVariant: theme.colors.onSurfaceVariant,
        },
      }}
    />
  );
};