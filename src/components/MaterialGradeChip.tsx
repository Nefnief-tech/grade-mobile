import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Chip as PaperChip, Text } from 'react-native-paper';
import { ExpressiveColorPalette, getGradeColor } from '../theme/materialTheme';

interface MaterialGradeChipProps {
  grade: number;
  gradeType?: string;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  showType?: boolean;
}

export const MaterialGradeChip: React.FC<MaterialGradeChipProps> = ({
  grade,
  gradeType,
  style,
  size = 'medium',
  showType = false,
}) => {
  const gradeColor = getGradeColor(grade);
  
  const getGradeDescription = (value: number): string => {
    if (value <= 1.5) return 'Sehr gut';
    if (value <= 2.5) return 'Gut';
    if (value <= 3.5) return 'Befriedigend';
    if (value <= 4.0) return 'Ausreichend';
    if (value <= 5.0) return 'Mangelhaft';
    return 'Ungenügend';
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: 24,
          paddingHorizontal: 8,
          fontSize: 12,
        };
      case 'large':
        return {
          height: 40,
          paddingHorizontal: 16,
          fontSize: 16,
        };
      default:
        return {
          height: 32,
          paddingHorizontal: 12,
          fontSize: 14,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[{ alignItems: 'flex-start' }, style]}>
      <PaperChip
        mode="flat"
        style={{
          backgroundColor: gradeColor,
          height: sizeStyles.height,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        }}
        textStyle={{
          color: '#FFFFFF',
          fontSize: sizeStyles.fontSize,
          fontWeight: '600',
        }}
      >
        {grade.toFixed(1)}
      </PaperChip>
      
      {showType && gradeType && (
        <Text
          variant="bodySmall"
          style={{
            color: ExpressiveColorPalette.onSurfaceVariant,
            marginTop: 4,
            fontSize: 11,
          }}
        >
          {gradeType}
        </Text>
      )}
      
      <Text
        variant="bodySmall"
        style={{
          color: ExpressiveColorPalette.onSurfaceVariant,
          marginTop: 2,
          fontSize: 10,
          fontWeight: '500',
        }}
      >
        {getGradeDescription(grade)}
      </Text>
    </View>
  );
};
