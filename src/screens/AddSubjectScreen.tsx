import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  useTheme,
  ActivityIndicator 
} from 'react-native-paper';
import AppwriteService from '../appwrite/service';

interface AddSubjectScreenProps {
  navigation: any;
}

const subjectColors = [
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#F44336', // Red
  '#00BCD4', // Cyan
  '#FF5722', // Deep Orange
  '#607D8B', // Blue Grey
  '#E91E63', // Pink
  '#795548', // Brown
];

export const AddSubjectScreen: React.FC<AddSubjectScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(subjectColors[0]);
  const [loading, setLoading] = useState(false);

  const handleSaveSubject = async () => {
    if (!name.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Fach-Namen ein');
      return;
    }

    try {
      setLoading(true);
      await AppwriteService.createSubject({
        name: name.trim(),
        color: selectedColor,
      });
      navigation.goBack();
    } catch (error: any) {
      console.error('Error creating subject:', error);
      Alert.alert(
        'Fehler',
        error.message || 'Fach konnte nicht erstellt werden'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
          Neues Fach hinzufügen
        </Text>

        {/* Subject Name */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Fach-Name
            </Text>
            <TextInput
              label="Name des Fachs"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              disabled={loading}
              placeholder="z.B. Mathematik, Deutsch, Englisch"
            />
          </Card.Content>
        </Card>

        {/* Color Selection */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Farbe auswählen
            </Text>
            <View style={styles.colorGrid}>
              {subjectColors.map((color) => (
                <View
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onTouchEnd={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Text style={styles.selectedColorText}>✓</Text>
                  )}
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Preview */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Vorschau
            </Text>
            <View style={styles.preview}>
              <View style={[styles.previewColorIndicator, { backgroundColor: selectedColor }]} />
              <Text variant="bodyLarge" style={[styles.previewText, { color: theme.colors.onSurface }]}>
                {name || 'Fach-Name'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
            contentStyle={styles.buttonContent}
            disabled={loading}
          >
            Abbrechen
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSaveSubject}
            style={styles.button}
            contentStyle={styles.buttonContent}
            disabled={loading || !name.trim()}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.onPrimary} />
            ) : (
              'Speichern'
            )}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 1,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginVertical: 8,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedColor: {
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    transform: [{ scale: 1.1 }],
  },
  selectedColorText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginTop: 8,
  },
  previewColorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  previewText: {
    flex: 1,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
