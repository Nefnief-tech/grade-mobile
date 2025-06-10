import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Grade } from '../types';

interface GradeProgressChartProps {
  grades: Grade[];
}

export const GradeProgressChart: React.FC<GradeProgressChartProps> = ({ grades }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width - 64; // Account for padding
  const chartHeight = 200;
  const chartPadding = 40;

  if (grades.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyMedium" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
          Noch keine Noten für das Diagramm verfügbar
        </Text>
      </View>
    );
  }

  // Sort grades by date
  const sortedGrades = [...grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Transform grades for chart (invert values so better grades create peaks)
  // German scale: 1.0 = best, 6.0 = worst
  // Chart scale: 1.0 becomes high point (5), 6.0 becomes low point (0)
  const chartWidth = screenWidth - (chartPadding * 2);
  const chartInnerHeight = chartHeight - (chartPadding * 2);
  
  const points = sortedGrades.map((grade, index) => {
    const x = chartPadding + (index * chartWidth) / Math.max(sortedGrades.length - 1, 1);
    const invertedValue = 7 - grade.value; // Invert: 1.0->6, 6.0->1
    const y = chartPadding + chartInnerHeight - (invertedValue / 6) * chartInnerHeight;
    return { x, y, grade, index };
  });

  // Create path for line chart
  const pathData = points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      } else {
        // Create smooth curves using quadratic bezier
        const prevPoint = points[index - 1];
        const controlX = (prevPoint.x + point.x) / 2;
        return `Q ${controlX} ${prevPoint.y} ${point.x} ${point.y}`;
      }
    })
    .join(' ');

  const getGradeColor = (value: number) => {
    if (value <= 2.5) return theme.colors.tertiary; // Good grades
    if (value <= 4.0) return theme.colors.primary; // Average grades
    return theme.colors.error; // Poor grades
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          Notenverlauf
        </Text>
        <Text variant="bodySmall" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Entwicklung über Zeit • Peaks = bessere Noten
        </Text>
      </View>

      <View style={[styles.chartContainer, { backgroundColor: theme.colors.surface }]}>
        <Svg width={screenWidth} height={chartHeight}>
          {/* Grid lines */}
          {[1, 2, 3, 4, 5, 6].map((grade) => {
            const y = chartPadding + chartInnerHeight - ((7 - grade) / 6) * chartInnerHeight;
            return (
              <Line
                key={grade}
                x1={chartPadding}
                y1={y}
                x2={screenWidth - chartPadding}
                y2={y}
                stroke={theme.colors.outline}
                strokeWidth={0.5}
                strokeOpacity={0.3}
              />
            );
          })}

          {/* Y-axis labels (grade values) */}
          {[1, 2, 3, 4, 5, 6].map((grade) => {
            const y = chartPadding + chartInnerHeight - ((7 - grade) / 6) * chartInnerHeight;
            return (
              <SvgText
                key={grade}
                x={chartPadding - 10}
                y={y + 4}
                fontSize="10"
                fill={theme.colors.onSurfaceVariant}
                textAnchor="end"
              >
                {grade.toFixed(1)}
              </SvgText>
            );
          })}

          {/* Line chart path */}
          {points.length > 1 && (
            <Path
              d={pathData}
              stroke={theme.colors.primary}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points */}
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={6}
              fill={getGradeColor(point.grade.value)}
              stroke={theme.colors.surface}
              strokeWidth={2}
            />
          ))}

          {/* X-axis labels */}
          {points.map((point, index) => {
            // Show every nth label to avoid crowding
            const showLabel = sortedGrades.length <= 5 || index % Math.ceil(sortedGrades.length / 5) === 0;
            if (!showLabel) return null;

            return (
              <SvgText
                key={`label-${index}`}
                x={point.x}
                y={chartHeight - 10}
                fontSize="9"
                fill={theme.colors.onSurfaceVariant}
                textAnchor="middle"
              >
                {sortedGrades.length <= 4 ? point.grade.type.substring(0, 4) : formatDate(point.grade.date)}
              </SvgText>
            );
          })}
        </Svg>
      </View>

      {/* Statistics */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text variant="bodySmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
            Trend
          </Text>
          <Text variant="bodyMedium" style={[styles.statValue, { color: getTrendColor() }]}>
            {getTrendText()}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text variant="bodySmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
            Letzte Note
          </Text>
          <Text variant="bodyMedium" style={[styles.statValue, { color: getGradeColor(sortedGrades[sortedGrades.length - 1].value) }]}>
            {sortedGrades[sortedGrades.length - 1].value.toFixed(1)}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text variant="bodySmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
            Noten
          </Text>
          <Text variant="bodyMedium" style={[styles.statValue, { color: theme.colors.onSurface }]}>
            {sortedGrades.length}
          </Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.tertiary }]} />
          <Text variant="bodySmall" style={[styles.legendText, { color: theme.colors.onSurfaceVariant }]}>
            Sehr gut / Gut
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
          <Text variant="bodySmall" style={[styles.legendText, { color: theme.colors.onSurfaceVariant }]}>
            Befriedigend / Ausreichend
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.error }]} />
          <Text variant="bodySmall" style={[styles.legendText, { color: theme.colors.onSurfaceVariant }]}>
            Mangelhaft / Ungenügend
          </Text>
        </View>
      </View>
    </View>
  );

  function getTrendText(): string {
    if (sortedGrades.length < 2) return '—';
    
    const recent = sortedGrades.slice(-3); // Last 3 grades
    const older = sortedGrades.slice(-6, -3); // Previous 3 grades
    
    if (older.length === 0) return '—';
    
    const recentAvg = recent.reduce((sum, g) => sum + g.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, g) => sum + g.value, 0) / older.length;
    
    const diff = olderAvg - recentAvg; // Positive = improvement (lower numbers)
    
    if (Math.abs(diff) < 0.2) return 'Stabil';
    return diff > 0 ? 'Verbesserung ↗' : 'Verschlechterung ↘';
  }

  function getTrendColor(): string {
    const trendText = getTrendText();
    if (trendText.includes('Verbesserung')) return theme.colors.tertiary;
    if (trendText.includes('Verschlechterung')) return theme.colors.error;
    return theme.colors.onSurfaceVariant;
  }
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
  chartContainer: {
    borderRadius: 16,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 4,
    opacity: 0.7,
  },
  statValue: {
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
  },
});