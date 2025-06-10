import React from 'react';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';
import { ViewStyle, TextStyle } from 'react-native';
import { ExpressiveColorPalette, MaterialElevation } from '../theme/materialTheme';

interface MaterialButtonProps extends Omit<ButtonProps, 'style'> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const MaterialButton: React.FC<MaterialButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  fullWidth = false,
  style,
  textStyle,
  children,
  ...props
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 24, // Material Design 3 button radius
      marginVertical: 4,
    };

    // Size-specific styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingHorizontal: 16,
        paddingVertical: 8,
      },
      medium: {
        paddingHorizontal: 24,
        paddingVertical: 12,
      },
      large: {
        paddingHorizontal: 32,
        paddingVertical: 16,
      },
    };

    // Variant-specific styles
    const variantStyles: Record<string, ViewStyle> = {
      filled: {
        backgroundColor: ExpressiveColorPalette.primary,
      },
      elevated: {
        backgroundColor: ExpressiveColorPalette.surface,
        ...MaterialElevation.level1,
      },
      tonal: {
        backgroundColor: ExpressiveColorPalette.secondaryContainer,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: ExpressiveColorPalette.outline,
      },
      text: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
    };
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'filled':
        return ExpressiveColorPalette.onPrimary;
      case 'elevated':
        return ExpressiveColorPalette.primary;
      case 'tonal':
        return ExpressiveColorPalette.onSecondaryContainer;
      case 'outlined':
        return ExpressiveColorPalette.primary;
      case 'text':
        return ExpressiveColorPalette.primary;
      default:
        return ExpressiveColorPalette.onPrimary;
    }
  };

  return (
    <PaperButton
      mode={variant === 'outlined' ? 'outlined' : variant === 'text' ? 'text' : 'contained'}
      buttonColor={variant === 'filled' ? ExpressiveColorPalette.primary : 
                   variant === 'elevated' ? ExpressiveColorPalette.surface :
                   variant === 'tonal' ? ExpressiveColorPalette.secondaryContainer : undefined}
      textColor={getTextColor()}
      style={[getButtonStyle(), style]}
      labelStyle={[
        {
          fontWeight: '600',
          fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
        },
        textStyle,
      ]}
      {...props}
    >
      {children}
    </PaperButton>
  );
};
