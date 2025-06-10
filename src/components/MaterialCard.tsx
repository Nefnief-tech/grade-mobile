import React from 'react';
import { Card as PaperCard, CardProps } from 'react-native-paper';
import { ViewStyle } from 'react-native';
import { MaterialElevation, ExpressiveColorPalette } from '../theme/materialTheme';

interface MaterialCardProps extends Omit<CardProps, 'style'> {
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  variant?: 'elevated' | 'filled' | 'outlined';
  style?: ViewStyle;
  children: React.ReactNode;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  elevation = 2,
  variant = 'elevated',
  style,
  children,
  ...props
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16, // Material Design 3 corner radius
      marginVertical: 8,
      marginHorizontal: 16,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: ExpressiveColorPalette.elevation[`level${elevation}`],
          ...MaterialElevation[`level${elevation}`],
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: ExpressiveColorPalette.surfaceVariant,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: ExpressiveColorPalette.surface,
          borderWidth: 1,
          borderColor: ExpressiveColorPalette.outline,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <PaperCard
      style={[getCardStyle(), style]}
      {...props}
    >
      {children}
    </PaperCard>
  );
};
