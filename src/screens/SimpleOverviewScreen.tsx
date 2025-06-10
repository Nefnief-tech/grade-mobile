import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useTheme, Text, Card, ActivityIndicator } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

import { Subject, Grade } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../appwrite/database';
import { text } from '../localization/german';

interface OverviewScreenProps {
  navigation: any;
}

export const SimpleOverviewScreen: React.FC<OverviewScreenProps> = ({ navigation }) => {
  const theme = useTheme() as MD3Theme;
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const databaseService = new DatabaseService();

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const [subjectsData, gradesData] = await Promise.all([
        databaseService.getSubjects(user.$id),
        databaseService.getGrades(user.$id),
      ]);
      setSubjects(subjectsData);
      setGrades(gradesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyMedium" style={{ marginTop: 16, color: theme.colors.onBackground }}>
          Lade Daten...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          {text.overview}
        </Text>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {text.overallAverage}
            </Text>
            <Text variant="headlineSmall" style={{ color: theme.colors.primary, marginTop: 8 }}>
              {grades.length > 0 ? '2.1' : '--'}
            </Text>
          </Card.Content>
        </Card>

        <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          {text.subjects}
        </Text>

        {subjects.length === 0 ? (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="outlined">
            <Card.Content>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, textAlign: 'center' }}>
                {text.noSubjects}
              </Text>
            </Card.Content>
          </Card>
        ) : (
          subjects.map((subject) => (
            <Card 
              key={subject.$id}
              style={[styles.card, { backgroundColor: theme.colors.surface }]} 
              mode="elevated"
            >
              <Card.Content>
                <View style={styles.subjectHeader}>
                  <View style={[styles.colorIndicator, { backgroundColor: subject.color }]} />
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                    {subject.name}
                  </Text>
                </View>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  Durchschnitt: 2.0
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60, // Account for status bar
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
    fontWeight: '600',
  },
  card: {
    marginBottom: 12,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
});

// Export as default for now to avoid import issues
export default SimpleOverviewScreen;