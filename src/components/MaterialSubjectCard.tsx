import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { MaterialCard } from './MaterialCard';
import { MaterialGradeChip } from './MaterialGradeChip';
import { ExpressiveColorPalette, MaterialElevation } from '../theme/materialTheme';
import { Subject, Grade } from '../types';

interface MaterialSubjectCardProps {
  subject: Subject;
  grades: Grade[];
  average?: number;
  onPress?: () => void;
  onEditPress?: () => void;
  style?: ViewStyle;
}

export const MaterialSubjectCard: React.FC<MaterialSubjectCardProps> = ({
  subject,
  grades,
  average,
  onPress,
  onEditPress,
  style,
}) => {
  const latestGrades = grades.slice(-3); // Show last 3 grades
  
  return (
    <Pressable onPress={onPress}>      <MaterialCard
        elevation={2}
        variant="elevated"
        style={{
          borderLeftWidth: 4,
          borderLeftColor: subject.color || ExpressiveColorPalette.primary,
          ...MaterialElevation.level2,
          ...style,
        }}
      >
        <View style={{ padding: 16 }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
          }}>
            <View style={{ flex: 1 }}>
              <Text
                variant="titleLarge"
                style={{
                  color: ExpressiveColorPalette.onSurface,
                  fontWeight: '700',
                  marginBottom: 4,
                }}
              >
                {subject.name}
              </Text>
              
              {average !== undefined && (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <Text
                    variant="bodyMedium"
                    style={{
                      color: ExpressiveColorPalette.onSurfaceVariant,
                      marginRight: 8,
                    }}
                  >
                    Durchschnitt:
                  </Text>
                  <MaterialGradeChip
                    grade={average}
                    size="small"
                  />
                </View>
              )}
            </View>
            
            {onEditPress && (
              <IconButton
                icon="pencil"
                size={20}
                iconColor={ExpressiveColorPalette.primary}
                onPress={onEditPress}
                style={{
                  margin: 0,
                  backgroundColor: ExpressiveColorPalette.primaryContainer,
                }}
              />
            )}
          </View>
          
          {/* Grades Summary */}
          <View>
            <Text
              variant="bodyMedium"
              style={{
                color: ExpressiveColorPalette.onSurfaceVariant,
                marginBottom: 8,
                fontWeight: '500',
              }}
            >
              Letzte Noten ({grades.length} gesamt)
            </Text>
            
            {latestGrades.length > 0 ? (
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                {latestGrades.map((grade, index) => (
                  <MaterialGradeChip
                    key={index}
                    grade={grade.value}
                    gradeType={grade.type}
                    size="small"
                    showType
                  />
                ))}
              </View>
            ) : (
              <View style={{
                padding: 16,
                borderRadius: 12,
                backgroundColor: ExpressiveColorPalette.surfaceVariant,
                alignItems: 'center',
              }}>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: ExpressiveColorPalette.onSurfaceVariant,
                    textAlign: 'center',
                  }}
                >
                  Noch keine Noten vorhanden
                </Text>
              </View>
            )}
          </View>
          
          {/* Grade Count */}
          <View style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: ExpressiveColorPalette.outlineVariant,
          }}>
            <Text
              variant="bodySmall"
              style={{
                color: ExpressiveColorPalette.onSurfaceVariant,
                textAlign: 'center',
              }}
            >
              {grades.length} {grades.length === 1 ? 'Note' : 'Noten'} eingetragen
            </Text>
          </View>
        </View>
      </MaterialCard>
    </Pressable>
  );
};
