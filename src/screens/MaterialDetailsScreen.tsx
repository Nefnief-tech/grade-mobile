import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, FAB, useTheme, Button, ActivityIndicator } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';

import AppwriteService from '../appwrite/service';
import { useAuth } from '../contexts/AuthContext';
import { Subject, Grade } from '../types';
import { GradeProgressChart } from '../components/GradeProgressChart';
import { calculateSubjectAverage } from '../utils/gradeCalculations';

interface MaterialDetailsScreenProps {
  route: RouteProp<{ Details: { subjectId: string } }, 'Details'>;
  navigation: any;
}

const MaterialDetailsScreen: React.FC<MaterialDetailsScreenProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { subjectId } = route.params;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated && subjectId) {
      loadData();
    }
  }, [isAuthenticated, subjectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all subjects to find the current one
      const [allSubjects, subjectGrades] = await Promise.all([
        AppwriteService.getSubjects(),
        AppwriteService.getGradesBySubject(subjectId),
      ]);

      const currentSubject = allSubjects.find(s => s.$id === subjectId);
      setSubject(currentSubject || null);
      setGrades(subjectGrades);
    } catch (error) {
      console.error('Error loading subject details:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddGrade = () => {
    navigation.navigate('AddGrade', { subjectId });
  };

  const getGradeDisplayText = (value: number) => {
    if (value <= 1.5) return 'Sehr gut';
    if (value <= 2.5) return 'Gut';
    if (value <= 3.5) return 'Befriedigend';
    if (value <= 4.5) return 'Ausreichend';
    if (value <= 5.5) return 'Mangelhaft';
    return 'Ungenügend';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyLarge" style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            Lade Fach-Details...
          </Text>
        </View>
      </View>
    );
  }

  if (!subject) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall" style={[styles.errorTitle, { color: theme.colors.onSurface }]}>
            Fach nicht gefunden
          </Text>
          <Text variant="bodyMedium" style={[styles.errorSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Das angeforderte Fach konnte nicht geladen werden.
          </Text>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Zurück
          </Button>
        </View>
      </View>
    );
  }

  const average = calculateSubjectAverage(grades);
  const bestGrade = grades.length > 0 ? Math.min(...grades.map(g => g.value)) : 0;
  const worstGrade = grades.length > 0 ? Math.max(...grades.map(g => g.value)) : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          <View style={[styles.colorIndicator, { backgroundColor: subject.color }]} />
          <View style={styles.headerText}>
            <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
              {subject.name}
            </Text>
            <Text variant="bodyMedium" style={[styles.gradeCount, { color: theme.colors.onSurfaceVariant }]}>
              {grades.length} {grades.length === 1 ? 'Note' : 'Noten'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      >
        {/* Statistics Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Statistiken
          </Text>
          
          <View style={styles.statsContainer}>
            {/* Average Card */}
            <Card style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="labelMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Durchschnitt
                </Text>
                <Text variant="displaySmall" style={[styles.statValue, { color: theme.colors.primary }]}>
                  {average > 0 ? average.toFixed(1) : '—'}
                </Text>
                {average > 0 && (
                  <Text variant="bodySmall" style={[styles.statDescription, { color: theme.colors.onSurfaceVariant }]}>
                    {getGradeDisplayText(average)}
                  </Text>
                )}
              </Card.Content>
            </Card>

            {/* Best Grade Card */}
            <Card style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="labelMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Beste Note
                </Text>
                <Text variant="displaySmall" style={[styles.statValue, { color: theme.colors.tertiary }]}>
                  {bestGrade > 0 ? bestGrade.toFixed(1) : '—'}
                </Text>
                {bestGrade > 0 && (
                  <Text variant="bodySmall" style={[styles.statDescription, { color: theme.colors.onSurfaceVariant }]}>
                    {getGradeDisplayText(bestGrade)}
                  </Text>
                )}
              </Card.Content>
            </Card>

            {/* Worst Grade Card */}
            <Card style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="labelMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Schlechteste Note
                </Text>
                <Text variant="displaySmall" style={[styles.statValue, { color: theme.colors.error }]}>
                  {worstGrade > 0 ? worstGrade.toFixed(1) : '—'}
                </Text>
                {worstGrade > 0 && (
                  <Text variant="bodySmall" style={[styles.statDescription, { color: theme.colors.onSurfaceVariant }]}>
                    {getGradeDisplayText(worstGrade)}
                  </Text>
                )}
              </Card.Content>
            </Card>
          </View>        </View>

        {/* Grade Progress Chart */}
        {grades.length > 0 && (
          <View style={styles.section}>
            <GradeProgressChart grades={grades} />
          </View>
        )}

        {/* Grades Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Noten
          </Text>
          
          {grades.length > 0 ? (
            grades.map((grade) => (
              <Card key={grade.$id} style={[styles.gradeCard, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Card.Content>
                  <View style={styles.gradeItem}>
                    <View style={styles.gradeInfo}>
                      <Text variant="bodyLarge" style={[styles.gradeType, { color: theme.colors.onSurface }]}>
                        {grade.type}
                      </Text>
                      <Text variant="bodyMedium" style={[styles.gradeDate, { color: theme.colors.onSurfaceVariant }]}>
                        {formatDate(grade.date)}
                      </Text>
                      <Text variant="bodySmall" style={[styles.gradeMeta, { color: theme.colors.onSurfaceVariant }]}>
                        Gewichtung: {grade.weight}x • {grade.semester}
                      </Text>
                    </View>
                    <View style={styles.gradeValueContainer}>
                      <Text variant="headlineSmall" style={[
                        styles.gradeValue, 
                        { 
                          color: grade.value <= 2.5 ? theme.colors.tertiary : 
                                 grade.value <= 4.0 ? theme.colors.primary : 
                                 theme.colors.error 
                        }
                      ]}>
                        {grade.value.toFixed(1)}
                      </Text>
                      <Text variant="bodySmall" style={[styles.gradeText, { color: theme.colors.onSurfaceVariant }]}>
                        {getGradeDisplayText(grade.value)}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card style={[styles.emptyCard, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Card.Content style={styles.emptyContent}>
                <Text variant="headlineSmall" style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                  Noch keine Noten
                </Text>
                <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
                  Fügen Sie die erste Note für dieses Fach hinzu.
                </Text>
                <Button
                  mode="contained"
                  onPress={handleAddGrade}
                  style={styles.addGradeButton}
                  icon="plus"
                >
                  Erste Note hinzufügen
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Actions Section */}
        {grades.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Aktionen
            </Text>
            
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={handleAddGrade}
                style={styles.actionButton}
                contentStyle={styles.buttonContent}
                icon="plus"
              >
                Note hinzufügen
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => console.log('Edit subject', subjectId)}
                style={styles.actionButton}
                contentStyle={styles.buttonContent}
                icon="pencil"
              >
                Fach bearbeiten
              </Button>
            </View>
          </View>
        )}

        {/* Bottom Spacing for FAB */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        onPress={handleAddGrade}
        style={[
          styles.fab,
          { backgroundColor: theme.colors.primary }
        ]}
        label="Note hinzufügen"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  backButton: {
    alignSelf: 'center',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
  },
  gradeCount: {
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    elevation: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statLabel: {
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  statDescription: {
    textAlign: 'center',
    opacity: 0.8,
  },
  gradeCard: {
    borderRadius: 16,
    elevation: 1,
    marginBottom: 12,
  },
  gradeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeInfo: {
    flex: 1,
    marginRight: 16,
  },
  gradeType: {
    fontWeight: '600',
    marginBottom: 4,
  },
  gradeDate: {
    marginBottom: 2,
  },
  gradeMeta: {
    opacity: 0.7,
  },
  gradeValueContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  gradeValue: {
    fontWeight: '700',
    marginBottom: 2,
  },
  gradeText: {
    textAlign: 'center',
    fontSize: 11,
    opacity: 0.8,
  },
  emptyCard: {
    borderRadius: 16,
    elevation: 1,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  addGradeButton: {
    alignSelf: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  bottomSpacing: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});

export default MaterialDetailsScreen;
