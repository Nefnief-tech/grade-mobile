import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { Button, FAB, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { MotionTokens } from '../theme/materialTheme';

interface Material3ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'elevated' | 'filled' | 'filledTonal' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Material3Button: React.FC<Material3ButtonProps> = ({
  title,
  onPress,
  variant = 'filled',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const theme = useTheme() as MD3Theme;

  const getButtonMode = () => {
    switch (variant) {
      case 'elevated':
        return 'elevated';
      case 'filled':
        return 'contained';
      case 'filledTonal':
        return 'contained-tonal';
      case 'outlined':
        return 'outlined';
      case 'text':
        return 'text';
      default:
        return 'contained';
    }
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 20, // Material 3 full shape for buttons
    };

    switch (size) {
      case 'small':
        return {
          ...baseStyle,
          height: 32,
          paddingHorizontal: 12,
        };
      case 'large':
        return {
          ...baseStyle,
          height: 56,
          paddingHorizontal: 24,
        };
      case 'medium':
      default:
        return {
          ...baseStyle,
          height: 40,
          paddingHorizontal: 16,
        };
    }
  };

  const buttonStyle = getButtonStyle();

  return (
    <Button
      mode={getButtonMode() as any}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      style={[buttonStyle, style]}
      labelStyle={textStyle}
      contentStyle={{ height: buttonStyle.height }}
    >
      {title}
    </Button>
  );
};

interface Material3FABProps {
  icon: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  extended?: boolean;
  label?: string;
  style?: ViewStyle;
}

export const Material3FAB: React.FC<Material3FABProps> = ({
  icon,
  onPress,
  variant = 'primary',
  size = 'medium',
  extended = false,
  label,
  style,
}) => {
  const theme = useTheme() as MD3Theme;

  const getFABColor = () => {
    switch (variant) {
      case 'secondary':
        return theme.colors.secondary;
      case 'tertiary':
        return theme.colors.tertiary;
      case 'primary':
      default:
        return theme.colors.primary;
    }
  };

  const getFABSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      case 'medium':
      default:
        return 'medium';
    }
  };
  if (extended && label) {
    return (
      <FAB
        icon={icon}
        label={label}
        onPress={onPress}
        style={[
          {
            backgroundColor: getFABColor(),
            borderRadius: 16,
          },
          style,
        ]}
      />
    );
  }

  return (
    <FAB
      icon={icon}
      onPress={onPress}
      size={getFABSize() as any}
      style={[
        {
          backgroundColor: getFABColor(),
        },
        style,
      ]}
    />
  );
};