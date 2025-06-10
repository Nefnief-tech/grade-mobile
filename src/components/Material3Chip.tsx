import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface Material3ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export const Material3Chip: React.FC<Material3ChipProps> = ({
  label,
  selected = false,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: selected
            ? theme.colors.primaryContainer
            : theme.colors.surfaceVariant,
          borderColor: selected ? theme.colors.primary : theme.colors.outline,
        },
      ]}
      onPress={onPress}
    >
      <Text
        variant="labelMedium"
        style={[
          styles.label,
          {
            color: selected
              ? theme.colors.onPrimaryContainer
              : theme.colors.onSurfaceVariant,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginVertical: 4,
  },
  label: {
    fontWeight: '500',
  },
});

interface GradeChipProps {
  grade: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export const GradeChip: React.FC<GradeChipProps> = ({
  grade,
  onPress,
  style,
}) => {
  const theme = useTheme() as MD3Theme;

  const getGradeColor = (grade: number): string => {
    if (grade <= 1.5) return GradeColors.excellent;
    if (grade <= 2.5) return GradeColors.good;
    if (grade <= 3.5) return GradeColors.satisfactory;
    if (grade <= 4.0) return GradeColors.sufficient;
    if (grade <= 5.0) return GradeColors.poor;
    return GradeColors.insufficient;
  };

  const getGradeText = (grade: number): string => {
    if (grade <= 1.5) return 'Sehr gut';
    if (grade <= 2.5) return 'Gut';
    if (grade <= 3.5) return 'Befriedigend';
    if (grade <= 4.0) return 'Ausreichend';
    if (grade <= 5.0) return 'Mangelhaft';
    return 'Ungenügend';
  };

  return (
    <Chip
      onPress={onPress}
      style={[
        {
          backgroundColor: getGradeColor(grade),
          marginHorizontal: 4,
          marginVertical: 2,
        },
        style,
      ]}
      textStyle={{
        color: theme.colors.onPrimary,
        fontWeight: '600',
      }}
    >
      {grade.toFixed(1)} • {getGradeText(grade)}
    </Chip>
  );
};