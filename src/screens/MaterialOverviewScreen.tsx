import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Animated, Dimensions } from 'react-native';
import { Text, FAB, Appbar, Portal, Modal, IconButton } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCard, MaterialButton, MaterialGradeChip, MaterialSubjectCard } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { Subject, Grade } from '../types';
import { DatabaseService } from '../appwrite/database';
import { calculateAverage } from '../utils/gradeCalculations';
import { ExpressiveColorPalette, MaterialElevation, MaterialMotion } from '../theme/materialTheme';
import { TEXTS } from '../localization/de';

const { width } = Dimensions.get('window');

export const MaterialOverviewScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Animated values for expressive animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  const databaseService = new DatabaseService();

  useEffect(() => {
    loadData();
    
    // Android 16 Expressive entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: MaterialMotion.duration.medium2,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: MaterialMotion.duration.medium3,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: MaterialMotion.duration.medium2,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
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
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getSubjectAverage = (subjectId: string): number | undefined => {
    const subjectGrades = grades.filter(grade => grade.subjectId === subjectId);
    return subjectGrades.length > 0 ? calculateAverage(subjectGrades) : undefined;
  };

  const overallAverage = grades.length > 0 ? calculateAverage(grades) : undefined;

  const renderHeader = () => (
    <View style={{
      backgroundColor: ExpressiveColorPalette.surface,
      paddingBottom: 16,
      ...MaterialElevation.level2,
    }}>
      <Appbar.Header
        style={{
          backgroundColor: ExpressiveColorPalette.surface,
          elevation: 0,
        }}
      >
        <Appbar.Content
          title="Noten-Tracker"
          titleStyle={{
            color: ExpressiveColorPalette.onSurface,
            fontSize: 24,
            fontWeight: '700',
          }}
        />
        <Appbar.Action
          icon="account-circle"
          iconColor={ExpressiveColorPalette.primary}
          onPress={() => setModalVisible(true)}
        />
      </Appbar.Header>
      
      {/* Welcome Message with Expressive Typography */}
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <Text
          variant="headlineSmall"
          style={{
            color: ExpressiveColorPalette.onSurface,
            fontWeight: '700',
            marginBottom: 4,
          }}
        >
          Hallo, {user?.name}! 👋
        </Text>
        <Text
          variant="bodyLarge"
          style={{
            color: ExpressiveColorPalette.onSurfaceVariant,
            marginBottom: 16,
          }}
        >
          Hier ist deine Notenübersicht
        </Text>
      </View>
    </View>
  );

  const renderOverallStats = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <MaterialCard
        elevation={3}
        variant="elevated"
        style={{
          marginHorizontal: 16,
          marginTop: 8,
          marginBottom: 16,
          backgroundColor: ExpressiveColorPalette.primaryContainer,
          borderRadius: 20,
        }}
      >
        <View style={{ padding: 20 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text
              variant="titleLarge"
              style={{
                color: ExpressiveColorPalette.onPrimaryContainer,
                fontWeight: '700',
              }}
            >
              Gesamtdurchschnitt
            </Text>
            <IconButton
              icon="chart-line"
              iconColor={ExpressiveColorPalette.onPrimaryContainer}
              size={24}
            />
          </View>
          
          {overallAverage !== undefined ? (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MaterialGradeChip
                grade={overallAverage}
                size="large"
              />
            </View>
          ) : (
            <Text
              variant="bodyLarge"
              style={{
                color: ExpressiveColorPalette.onPrimaryContainer,
                textAlign: 'center',
                fontStyle: 'italic',
              }}
            >
              Noch keine Noten vorhanden
            </Text>
          )}
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: ExpressiveColorPalette.outline,
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text
                variant="headlineSmall"
                style={{
                  color: ExpressiveColorPalette.onPrimaryContainer,
                  fontWeight: '700',
                }}
              >
                {subjects.length}
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: ExpressiveColorPalette.onPrimaryContainer,
                }}
              >
                Fächer
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text
                variant="headlineSmall"
                style={{
                  color: ExpressiveColorPalette.onPrimaryContainer,
                  fontWeight: '700',
                }}
              >
                {grades.length}
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: ExpressiveColorPalette.onPrimaryContainer,
                }}
              >
                Noten
              </Text>
            </View>
          </View>
        </View>
      </MaterialCard>
    </Animated.View>
  );

  const renderQuickActions = () => (
    <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
      <Text
        variant="titleMedium"
        style={{
          color: ExpressiveColorPalette.onSurface,
          fontWeight: '600',
          marginBottom: 12,
        }}
      >
        Schnellaktionen
      </Text>
      
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <MaterialButton
          variant="tonal"
          style={{ flex: 1 }}
          onPress={() => navigation.navigate('AddGrade')}
        >
          Note hinzufügen
        </MaterialButton>
        <MaterialButton
          variant="outlined"
          style={{ flex: 1 }}
          onPress={() => navigation.navigate('AddSubject')}
        >
          Fach hinzufügen
        </MaterialButton>
      </View>
    </View>
  );

  const renderSubjectsList = () => (
    <View style={{ paddingHorizontal: 0, marginBottom: 100 }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <Text
          variant="titleMedium"
          style={{
            color: ExpressiveColorPalette.onSurface,
            fontWeight: '600',
          }}
        >
          Deine Fächer
        </Text>
      </View>
      
      {subjects.length > 0 ? (
        subjects.map((subject, index) => (
          <Animated.View
            key={subject.$id}
            style={{
              opacity: fadeAnim,
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 50 + (index * 10)],
                }),
              }],
            }}
          >            <MaterialSubjectCard
              subject={subject}
              grades={grades.filter(grade => grade.subjectId === subject.$id)}
              average={getSubjectAverage(subject.$id!)}
              onPress={() => navigation.navigate('MaterialDetails', { 
                subject: {
                  id: subject.$id,
                  name: subject.name,
                  color: subject.color,
                  grades: grades.filter(grade => grade.subjectId === subject.$id),
                  average: getSubjectAverage(subject.$id!),
                }
              })}
              onEditPress={() => navigation.navigate('EditSubject', { subjectId: subject.$id })}
            />
          </Animated.View>
        ))
      ) : (
        <MaterialCard
          elevation={1}
          variant="outlined"
          style={{ marginHorizontal: 16 }}
        >
          <View style={{
            padding: 32,
            alignItems: 'center',
          }}>
            <IconButton
              icon="school"
              size={48}
              iconColor={ExpressiveColorPalette.onSurfaceVariant}
            />
            <Text
              variant="titleMedium"
              style={{
                color: ExpressiveColorPalette.onSurface,
                marginBottom: 8,
                textAlign: 'center',
              }}
            >
              Keine Fächer vorhanden
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: ExpressiveColorPalette.onSurfaceVariant,
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              Füge dein erstes Fach hinzu, um zu beginnen!
            </Text>
            <MaterialButton
              variant="filled"
              onPress={() => navigation.navigate('AddSubject')}
            >
              Erstes Fach hinzufügen
            </MaterialButton>
          </View>
        </MaterialCard>
      )}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: ExpressiveColorPalette.background,
      }}>
        {renderHeader()}
        
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[ExpressiveColorPalette.primary]}
              progressBackgroundColor={ExpressiveColorPalette.surface}
            />
          }
        >
          {renderOverallStats()}
          {renderQuickActions()}
          {renderSubjectsList()}
        </ScrollView>

        <FAB
          icon="plus"
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: ExpressiveColorPalette.primary,
            ...MaterialElevation.level3,
          }}
          color={ExpressiveColorPalette.onPrimary}
          onPress={() => navigation.navigate('AddGrade')}
        />

        {/* User Profile Modal */}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={{
              backgroundColor: ExpressiveColorPalette.surface,
              margin: 20,
              borderRadius: 20,
              padding: 20,
              ...MaterialElevation.level4,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <IconButton
                icon="account-circle"
                size={64}
                iconColor={ExpressiveColorPalette.primary}
              />
              <Text
                variant="headlineSmall"
                style={{
                  color: ExpressiveColorPalette.onSurface,
                  marginBottom: 8,
                  fontWeight: '700',
                }}
              >
                {user?.name}
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: ExpressiveColorPalette.onSurfaceVariant,
                  marginBottom: 24,
                }}
              >
                {user?.email}
              </Text>
              
              <View style={{ width: '100%', gap: 12 }}>
                <MaterialButton
                  variant="tonal"
                  fullWidth
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('Settings');
                  }}
                >
                  Einstellungen
                </MaterialButton>
                <MaterialButton
                  variant="outlined"
                  fullWidth
                  onPress={() => {                    setModalVisible(false);
                    logout();
                  }}
                >
                  Abmelden
                </MaterialButton>
              </View>
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Re-export the new Material 3 Overview Screen
export { Material3OverviewScreen as MaterialOverviewScreen } from './Material3OverviewScreen';
export { default } from './Material3OverviewScreen';
