import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassButton } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { Grade, Subject } from '../types';
import { DatabaseService } from '../appwrite/database';
import { calculateAverage, getGradeColor, getGradeDescription } from '../utils/gradeCalculations';
import { TEXTS } from '../localization/de';

const databaseService = new DatabaseService();

export const OverviewScreen = ({ navigation }: any) => {
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();

  const loadData = async () => {
    try {
      if (!user) return;
      
      const [subjectsData, gradesData] = await Promise.all([
        databaseService.getSubjects(user.$id),
        databaseService.getGrades(user.$id)
      ]);
      
      setSubjects(subjectsData);
      setGrades(gradesData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert(TEXTS.ERROR, 'Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const overallAverage = calculateAverage(grades);

  const handleLogout = () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Abmelden', onPress: logout }
      ]
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>{TEXTS.LOADING}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1, padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <View>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
              Hallo, {user?.name}!
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 16 }}>
              {TEXTS.OVERVIEW}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 16 }}>
              {TEXTS.LOGOUT}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Overall Average */}
        <GlassCard style={{ marginBottom: 24 }}>
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 8
          }}>
            Gesamtdurchschnitt
          </Text>
          <Text style={{
            color: getGradeColor(overallAverage),
            fontSize: 36,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 4
          }}>
            {overallAverage.toFixed(2)}
          </Text>
          <Text style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 14,
            textAlign: 'center'
          }}>
            {getGradeDescription(overallAverage)}
          </Text>
        </GlassCard>

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', marginBottom: 24, gap: 12 }}>
          <GlassButton
            title={TEXTS.ADD_GRADE}
            onPress={() => navigation.navigate('AddGrade')}
            style={{ flex: 1 }}
            size="small"
          />
          <GlassButton
            title="Fach hinzufügen"
            onPress={() => navigation.navigate('AddSubject')}
            style={{ flex: 1 }}
            size="small"
            gradient={['rgba(34, 197, 94, 0.6)', 'rgba(16, 185, 129, 0.6)']}
          />
        </View>

        {/* Subjects */}
        <Text style={{
          color: 'white',
          fontSize: 20,
          fontWeight: '600',
          marginBottom: 16
        }}>
          Ihre Fächer
        </Text>

        {subjects.length === 0 ? (
          <GlassCard>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              fontSize: 16
            }}>
              Noch keine Fächer angelegt.
            </Text>
            <GlassButton
              title="Erstes Fach hinzufügen"
              onPress={() => navigation.navigate('AddSubject')}
              style={{ marginTop: 16 }}
              size="small"
            />
          </GlassCard>
        ) : (
          subjects.map((subject) => {
            const subjectGrades = grades.filter(g => g.subjectId === subject.$id);
            const average = calculateAverage(subjectGrades);
            
            return (
              <TouchableOpacity
                key={subject.$id}
                onPress={() => navigation.navigate('SubjectDetail', { subjectId: subject.$id })}
              >
                <GlassCard style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: subject.color,
                      marginRight: 12
                    }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        color: 'white',
                        fontSize: 18,
                        fontWeight: '600'
                      }}>
                        {subject.name}
                      </Text>
                      <Text style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: 14
                      }}>
                        {subjectGrades.length} {subjectGrades.length === 1 ? 'Note' : 'Noten'}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{
                        color: getGradeColor(average),
                        fontSize: 20,
                        fontWeight: 'bold'
                      }}>
                        {average > 0 ? average.toFixed(2) : '-'}
                      </Text>
                      <Text style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: 12
                      }}>
                        ∅
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </LinearGradient>
  );
};
