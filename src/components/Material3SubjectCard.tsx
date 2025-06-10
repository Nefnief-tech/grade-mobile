import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import { Subject } from '../types';
import { formatGrade } from '../utils/gradeCalculations';

interface Material3SubjectCardProps {
  subject: Subject;
  average: number;
  gradeCount: number;
  onPress: () => void;
}

export const Material3SubjectCard: React.FC<Material3SubjectCardProps> = ({
  subject,
  average,
  gradeCount,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderLeftColor: subject.color,
          },
        ]}
      >
        <Card.Content style={styles.content}>
          {/* Subject Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.colorIndicator,
                { backgroundColor: subject.color },
              ]}
            />
            <Text
              variant="titleMedium"
              style={[styles.title, { color: theme.colors.onSurface }]}
            >
              {subject.name}
            </Text>
          </View>

          {/* Grade Info */}
          <View style={styles.gradeInfo}>
            <View style={styles.averageContainer}>
              <Text
                variant="displaySmall"
                style={[
                  styles.average,
                  { color: theme.colors.primary },
                ]}
              >
                {average > 0 ? formatGrade(average) : '—'}
              </Text>
              <Text
                variant="bodySmall"
                style={[
                  styles.averageLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Durchschnitt
              </Text>
            </View>

            <View style={styles.countContainer}>
              <Text
                variant="bodyMedium"
                style={[
                  styles.gradeCount,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {gradeCount} {gradeCount === 1 ? 'Note' : 'Noten'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    borderRadius: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontWeight: '600',
  },
  gradeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  averageContainer: {
    alignItems: 'flex-start',
  },
  average: {
    fontWeight: '700',
    lineHeight: 40,
  },
  averageLabel: {
    marginTop: -4,
  },
  countContainer: {
    alignItems: 'flex-end',
  },
  gradeCount: {
    opacity: 0.8,
  },
});