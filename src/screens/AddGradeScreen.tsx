import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  SegmentedButtons,
  useTheme,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import AppwriteService from '../appwrite/service';
import { Subject } from '../types';

interface AddGradeScreenProps {
  route?: any;
  navigation: any;
}

export const AddGradeScreen: React.FC<AddGradeScreenProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const subjectId = route?.params?.subjectId;
  
  const [grade, setGrade] = useState('');
  const [type, setType] = useState('Klausur');
  const [weight, setWeight] = useState('1.0');
  const [semester, setSemester] = useState('2024/1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectId || '');
  const [loading, setLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setSubjectsLoading(true);
      const subjectsData = await AppwriteService.getSubjects();
      setSubjects(subjectsData);
      
      // If no subjectId was passed, select the first subject
      if (!subjectId && subjectsData.length > 0) {
        setSelectedSubjectId(subjectsData[0].$id);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      Alert.alert('Fehler', 'Fächer konnten nicht geladen werden');
    } finally {
      setSubjectsLoading(false);
    }
  };

  const gradeTypes = [
    { value: 'Klausur', label: 'Klausur' },
    { value: 'Test', label: 'Test' },
    { value: 'Hausaufgabe', label: 'Hausaufgabe' },
    { value: 'Referat', label: 'Referat' },
  ];

  const handleSaveGrade = async () => {
    const gradeValue = parseFloat(grade);
    
    // Validation
    if (!grade) {
      Alert.alert('Fehler', 'Bitte geben Sie eine Note ein');
      return;
    }
    
    if (gradeValue < 1.0 || gradeValue > 6.0) {
      Alert.alert('Fehler', 'Note muss zwischen 1.0 und 6.0 liegen');
      return;
    }
    
    if (!selectedSubjectId) {
      Alert.alert('Fehler', 'Bitte wählen Sie ein Fach aus');
      return;
    }

    const weightValue = parseFloat(weight);
    if (weightValue <= 0) {
      Alert.alert('Fehler', 'Gewichtung muss größer als 0 sein');
      return;
    }

    try {
      setLoading(true);
      
      await AppwriteService.createGrade({
        subjectId: selectedSubjectId,
        type,
        value: gradeValue,
        weight: weightValue,
        semester,
        date,
      });

      Alert.alert(
        'Erfolgreich',
        'Note wurde hinzugefügt',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating grade:', error);
      Alert.alert(
        'Fehler',
        error.message || 'Note konnte nicht gespeichert werden'
      );
    } finally {
      setLoading(false);
    }
  };

  const getGradeDisplayText = (value: number) => {
    if (value <= 1.5) return 'Sehr gut';
    if (value <= 2.5) return 'Gut';
    if (value <= 3.5) return 'Befriedigend';
    if (value <= 4.5) return 'Ausreichend';
    if (value <= 5.5) return 'Mangelhaft';
    return 'Ungenügend';
  };

  if (subjectsLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyLarge" style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            Lade Fächer...
          </Text>
        </View>
      </View>
    );
  }

  if (subjects.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyContainer}>
          <Card style={[styles.glassmorphCard, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
            <Card.Content style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text variant="headlineSmall" style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                📚 Keine Fächer vorhanden
              </Text>
              <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Sie müssen zuerst ein Fach erstellen, bevor Sie Noten hinzufügen können.
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('AddSubject')}
                style={[styles.addSubjectButton, { marginTop: 24 }]}
                contentStyle={{ paddingVertical: 12, paddingHorizontal: 24 }}
                icon="book-plus"
                buttonColor={theme.colors.primary}
              >
                Erstes Fach hinzufügen
              </Button>
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  }

  const selectedSubject = subjects.find(s => s.$id === selectedSubjectId);
  const gradeValue = parseFloat(grade);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Simple Title */}
        <Text variant="headlineMedium" style={[styles.pageTitle, { color: theme.colors.onSurface }]}>
          Neue Note hinzufügen
        </Text>

        {/* Subject Selection */}
        {!subjectId && (
          <Card style={[styles.glassmorphCard, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                🎯 Fach auswählen
              </Text>
              <Text variant="bodySmall" style={[styles.cardDescription, { color: theme.colors.onSurfaceVariant }]}>
                Wählen Sie das Fach für diese Note
              </Text>
              <View style={styles.subjectChips}>
                {subjects.map((subject) => (
                  <Chip
                    key={subject.$id}
                    selected={selectedSubjectId === subject.$id}
                    onPress={() => setSelectedSubjectId(subject.$id)}
                    style={[
                      styles.subjectChip,
                      selectedSubjectId === subject.$id && { 
                        backgroundColor: subject.color + '40' 
                      }
                    ]}
                    textStyle={{
                      color: selectedSubjectId === subject.$id ? theme.colors.onSurface : theme.colors.onSurfaceVariant
                    }}
                    showSelectedCheck={false}
                  >
                    {subject.name}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}        {/* Selected Subject Display */}
        {selectedSubject && (
          <Card style={[styles.glassmorphCard, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                📚 Gewähltes Fach
              </Text>
              <View style={styles.selectedSubject}>
                <View style={[styles.subjectColorIndicator, { backgroundColor: selectedSubject.color }]} />
                <Text variant="titleMedium" style={[styles.selectedSubjectName, { color: theme.colors.onSurface }]}>
                  {selectedSubject.name}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Grade Input */}
        <Card style={[styles.glassmorphCard, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              📊 Note eingeben
            </Text>
            <Text variant="bodySmall" style={[styles.cardDescription, { color: theme.colors.onSurfaceVariant }]}>
              Deutsche Notenskala (1.0 = Sehr gut, 6.0 = Ungenügend)
            </Text>
            
            <TextInput
              label="Note (1.0 - 6.0)"
              value={grade}
              onChangeText={setGrade}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              disabled={loading}
              outlineStyle={{ borderRadius: 12 }}
            />
            
            <View style={styles.gradeHints}>
              <Text variant="bodySmall" style={[styles.hint, { color: theme.colors.onSurfaceVariant }]}>
                1.0 = Sehr gut • 2.0 = Gut • 3.0 = Befriedigend • 4.0 = Ausreichend • 5.0 = Mangelhaft • 6.0 = Ungenügend
              </Text>
              {gradeValue >= 1.0 && gradeValue <= 6.0 && (
                <View style={[
                  styles.gradePreview, 
                  { 
                    backgroundColor: gradeValue <= 2.5 ? theme.colors.tertiary + '20' : 
                                   gradeValue <= 4.0 ? theme.colors.primary + '20' : 
                                   theme.colors.error + '20',
                    borderColor: gradeValue <= 2.5 ? theme.colors.tertiary + '40' : 
                               gradeValue <= 4.0 ? theme.colors.primary + '40' : 
                               theme.colors.error + '40'
                  }
                ]}>
                  <Text variant="headlineSmall" style={[
                    { 
                      color: gradeValue <= 2.5 ? theme.colors.tertiary : 
                             gradeValue <= 4.0 ? theme.colors.primary : 
                             theme.colors.error,
                      fontWeight: '700'
                    }
                  ]}>
                    {gradeValue.toFixed(1)}
                  </Text>
                  <Text variant="bodyMedium" style={[
                    { 
                      color: gradeValue <= 2.5 ? theme.colors.tertiary : 
                             gradeValue <= 4.0 ? theme.colors.primary : 
                             theme.colors.error,
                      marginTop: 4
                    }
                  ]}>
                    {getGradeDisplayText(gradeValue)}
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Type Selection */}
        <Card style={[styles.glassmorphCard, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              📝 Art der Bewertung
            </Text>
            <Text variant="bodySmall" style={[styles.cardDescription, { color: theme.colors.onSurfaceVariant }]}>
              Wählen Sie die Art der Leistungsüberprüfung
            </Text>
            <SegmentedButtons
              value={type}
              onValueChange={setType}
              buttons={gradeTypes}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Weight and Details */}
        <Card style={[styles.glassmorphCard, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              ⚖️ Zusätzliche Details
            </Text>
            <Text variant="bodySmall" style={[styles.cardDescription, { color: theme.colors.onSurfaceVariant }]}>
              Gewichtung, Semester und Datum der Bewertung
            </Text>
            
            <TextInput
              label="Gewichtung"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
              disabled={loading}
              outlineStyle={{ borderRadius: 12 }}
            />
            <Text variant="bodySmall" style={[styles.hint, { color: theme.colors.onSurfaceVariant }]}>
              1.0 = normale Gewichtung • 2.0 = doppelte Gewichtung • 0.5 = halbe Gewichtung
            </Text>

            <TextInput
              label="Semester"
              value={semester}
              onChangeText={setSemester}
              mode="outlined"
              style={styles.input}
              disabled={loading}
              placeholder="z.B. 2024/1"
              outlineStyle={{ borderRadius: 12 }}
            />

            <TextInput
              label="Datum (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              mode="outlined"
              style={styles.input}
              disabled={loading}
              outlineStyle={{ borderRadius: 12 }}
            />
          </Card.Content>
        </Card>        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={[styles.button, { backgroundColor: 'rgba(255,255,255,0.05)' }]}
            contentStyle={styles.buttonContent}
            disabled={loading}
            buttonColor="transparent"
            textColor={theme.colors.onSurfaceVariant}
          >
            Abbrechen
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSaveGrade}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            contentStyle={styles.buttonContent}
            disabled={loading || !grade || !selectedSubjectId || parseFloat(grade) < 1.0 || parseFloat(grade) > 6.0}
            buttonColor={theme.colors.primary}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.onPrimary} />
            ) : (
              '💾 Speichern'
            )}
          </Button>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 24,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  addSubjectButton: {
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  glassmorphCard: {
    borderRadius: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  cardTitle: {
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 18,
  },
  cardDescription: {
    marginBottom: 16,
    opacity: 0.8,
    lineHeight: 18,
  },
  subjectChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  subjectChip: {
    borderRadius: 20,
    marginBottom: 8,
  },
  selectedSubject: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginTop: 8,
  },
  subjectColorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedSubjectName: {
    fontWeight: '700',
    fontSize: 16,
  },
  input: {
    marginBottom: 12,
    borderRadius: 12,
  },
  gradeHints: {
    marginTop: 12,
    gap: 12,
  },
  hint: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
    textAlign: 'center',
  },
  gradePreview: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
  },
  segmentedButtons: {
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
    paddingTop: 20,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  buttonContent: {
    paddingVertical: 12,
  },
});
