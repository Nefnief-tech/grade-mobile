import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { 
  Text, 
  FAB, 
  useTheme, 
  Searchbar,
  Card,
  ActivityIndicator,
  Button,
} from 'react-native-paper';

import { Material3SubjectCard } from '../components/Material3SubjectCard';
import { Material3Chip } from '../components/Material3Chip';
import { calculateSubjectAverage, calculateOverallAverage } from '../utils/gradeCalculations';
import AppwriteService from '../appwrite/service';
import { useAuth } from '../contexts/AuthContext';
import { Subject, Grade } from '../types';

// German localization
const text = {
  overview: 'Notenübersicht',
  searchSubjects: 'Fächer durchsuchen...',
  allSubjects: 'Alle Fächer',
  overallAverage: 'Gesamtdurchschnitt',
  totalGrades: 'Gesamte Noten',
  subjects: 'Fächer',
  addGrade: 'Note hinzufügen',
  noSubjectsFound: 'Keine Fächer gefunden',
  noSubjectsYet: 'Noch keine Fächer vorhanden',
  addSubject: 'Fach hinzufügen',
  statistics: 'Statistiken',
};

interface Material3OverviewScreenProps {
  navigation: any;
}

export const Material3OverviewScreen: React.FC<Material3OverviewScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subjectsData, gradesData] = await Promise.all([
        AppwriteService.getSubjects(),
        AppwriteService.getGrades(),
      ]);
      setSubjects(subjectsData);
      setGrades(gradesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !selectedSubjectFilter || subject.$id === selectedSubjectFilter;
    return matchesSearch && matchesFilter;
  });  const getSubjectGrades = (subjectId: string) => {
    return grades.filter(grade => grade.subjectId === subjectId);
  };

  const handleFABPress = () => {
    if (subjects.length === 0) {
      navigation.navigate('AddSubject');
    } else {
      navigation.navigate('AddGrade');
    }
  };

  const overallAverage = calculateOverallAverage(grades);
  const totalGrades = grades.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          {text.overview}
        </Text>
        
        {/* Search Bar */}
        <Searchbar
          placeholder={text.searchSubjects}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {/* Subject Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.chipContainer}
        >
          <Material3Chip
            label={text.allSubjects}
            selected={selectedSubjectFilter === null}
            onPress={() => setSelectedSubjectFilter(null)}
          />          {subjects.map(subject => (
            <Material3Chip
              key={subject.$id}
              label={subject.name}
              selected={selectedSubjectFilter === subject.$id}
              onPress={() => setSelectedSubjectFilter(
                selectedSubjectFilter === subject.$id ? null : subject.$id
              )}
            />
          ))}
        </ScrollView>
      </View>      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyLarge" style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            Lade Daten...
          </Text>
        </View>
      ) : (
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
            {text.statistics}
          </Text>
          
          <View style={styles.statsContainer}>
            {/* Overall Average Card */}
            <Card style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="labelMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  {text.overallAverage}
                </Text>
                <Text variant="displaySmall" style={[styles.statValue, { color: theme.colors.primary }]}>
                  {overallAverage > 0 ? overallAverage.toFixed(1) : '—'}
                </Text>
              </Card.Content>
            </Card>

            {/* Total Grades Card */}
            <Card style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="labelMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  {text.totalGrades}
                </Text>
                <Text variant="displaySmall" style={[styles.statValue, { color: theme.colors.secondary }]}>
                  {totalGrades}
                </Text>
              </Card.Content>
            </Card>

            {/* Subjects Count Card */}
            <Card style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Card.Content style={styles.statContent}>
                <Text variant="labelMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  {text.subjects}
                </Text>
                <Text variant="displaySmall" style={[styles.statValue, { color: theme.colors.tertiary }]}>
                  {subjects.length}
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Subjects Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            {text.subjects}
          </Text>
            {filteredSubjects.length > 0 ? (
            filteredSubjects.map(subject => {
              const subjectGrades = getSubjectGrades(subject.$id);
              const average = calculateSubjectAverage(subjectGrades);
              
              return (
                <Material3SubjectCard
                  key={subject.$id}
                  subject={subject}
                  average={average}
                  gradeCount={subjectGrades.length}
                  onPress={() => navigation.navigate('Details', { subjectId: subject.$id })}
                />
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text variant="headlineSmall" style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                {searchQuery ? text.noSubjectsFound : text.noSubjectsYet}
              </Text>
              {!searchQuery && (
                <>                    <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
                      Fügen Sie Ihr erstes Fach hinzu, um mit der Notenverwaltung zu beginnen.
                    </Text>
                    <Button
                      mode="contained"
                      onPress={() => navigation.navigate('AddSubject')}
                      style={styles.addSubjectButton}
                      contentStyle={styles.buttonContent}
                      icon="book-plus"
                    >
                      {text.addSubject}
                    </Button>
                </>
              )}
            </View>
          )}
        </View>        {/* Bottom Spacing for FAB */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      )}

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        label={text.addGrade}
        onPress={() => navigation.navigate('AddGrade')}
        style={[
          styles.fab,
          { backgroundColor: theme.colors.primary }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontWeight: '700',
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 16,
    borderRadius: 28,
    elevation: 0,
  },
  chipContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    elevation: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statLabel: {
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    elevation: 1,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  addSubjectButton: {
    marginTop: 16,
    alignSelf: 'center',
  },  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  quickActions: {
    marginTop: 8,
  },
  quickActionsTitle: {
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginBottom: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    elevation: 1,
  },
  quickActions: {
    padding: 16,
  },
  quickActionsTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});