import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Modal,
  Portal,
  IconButton,
  FAB,
  Divider,
} from 'react-native-paper';
import {
  MaterialCard,
  MaterialButton,
  MaterialTextInput,
  MaterialGradeChip,
} from '../components';
import { ExpressiveColorPalette, MaterialMotion } from '../theme/materialTheme';

const { width: screenWidth } = Dimensions.get('window');

interface Grade {
  id: string;
  type: string;
  value: number;
  weight: number;
  date: string;
  semester: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
  grades: Grade[];
  average: number;
}

interface MaterialDetailsScreenProps {
  route?: {
    params?: {
      subject?: Subject;
    };
  };
  navigation?: any;
}

const MaterialDetailsScreen: React.FC<MaterialDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const subject = route?.params?.subject || {
    id: '1',
    name: 'Mathematik',
    color: ExpressiveColorPalette.primary,
    grades: [
      { id: '1', type: 'Klassenarbeit', value: 2.3, weight: 0.6, date: '2024-01-15', semester: 'WS24' },
      { id: '2', type: 'Mündlich', value: 1.7, weight: 0.2, date: '2024-01-20', semester: 'WS24' },
      { id: '3', type: 'Hausaufgabe', value: 2.0, weight: 0.2, date: '2024-01-25', semester: 'WS24' },
    ],
    average: 2.1,
  };

  const [addGradeModalVisible, setAddGradeModalVisible] = useState(false);
  const [newGrade, setNewGrade] = useState({
    type: '',
    value: '',
    weight: '1.0',
  });

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: MaterialMotion.duration.medium2,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: MaterialMotion.duration.medium2,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAddGrade = () => {
    // Implementation for adding grade
    setAddGradeModalVisible(false);
    setNewGrade({ type: '', value: '', weight: '1.0' });
  };

  const renderGradeCard = (grade: Grade, index: number) => (
    <Animated.View
      key={grade.id}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <MaterialCard
        variant="filled"
        style={{
          marginBottom: 12,
          backgroundColor: ExpressiveColorPalette.surfaceVariant,
        }}
      >
        <View style={{ padding: 20 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: 12,
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: ExpressiveColorPalette.onSurface,
                marginBottom: 4,
              }}>
                {grade.type}
              </Text>
              <Text style={{
                fontSize: 13,
                color: ExpressiveColorPalette.onSurfaceVariant,
                marginBottom: 8,
              }}>
                {new Date(grade.date).toLocaleDateString('de-DE')} • Gewichtung: {(grade.weight * 100).toFixed(0)}%
              </Text>
            </View>
            <MaterialGradeChip grade={grade.value} />
          </View>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View style={{
              backgroundColor: ExpressiveColorPalette.primaryContainer,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '500',
                color: ExpressiveColorPalette.onPrimaryContainer,
              }}>
                {grade.semester}
              </Text>
            </View>
            
            <IconButton
              icon="dots-vertical"
              size={20}
              iconColor={ExpressiveColorPalette.onSurfaceVariant}
              onPress={() => {}}
            />
          </View>
        </View>
      </MaterialCard>
    </Animated.View>
  );

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: ExpressiveColorPalette.background,
    }}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={ExpressiveColorPalette.background} 
      />
      
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: ExpressiveColorPalette.outlineVariant,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor={ExpressiveColorPalette.onSurface}
              onPress={() => navigation?.goBack()}
            />
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: ExpressiveColorPalette.onSurface,
              marginLeft: 8,
            }}>
              {subject.name}
            </Text>
          </View>
          
          <IconButton
            icon="pencil"
            size={20}
            iconColor={ExpressiveColorPalette.primary}
            onPress={() => {}}
          />
        </View>

        {/* Subject Summary */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}
        >
          <MaterialCard
            variant="elevated"
            style={{
              backgroundColor: ExpressiveColorPalette.elevation.level2,
              elevation: 8,
            }}
          >
            <View style={{ padding: 24 }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: ExpressiveColorPalette.onSurface,
                }}>
                  Gesamtdurchschnitt
                </Text>
                <MaterialGradeChip grade={subject.average} size="large" />
              </View>
              
              <Divider style={{ 
                backgroundColor: ExpressiveColorPalette.outlineVariant,
                marginBottom: 16,
              }} />
              
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: ExpressiveColorPalette.primary,
                  }}>
                    {subject.grades.length}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: ExpressiveColorPalette.onSurfaceVariant,
                    marginTop: 4,
                  }}>
                    Noten
                  </Text>
                </View>
                
                <View style={{ alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: ExpressiveColorPalette.secondary,
                  }}>
                    {Math.min(...subject.grades.map(g => g.value)).toFixed(1)}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: ExpressiveColorPalette.onSurfaceVariant,
                    marginTop: 4,
                  }}>
                    Beste Note
                  </Text>
                </View>
                
                <View style={{ alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: ExpressiveColorPalette.tertiary,
                  }}>
                    WS24
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: ExpressiveColorPalette.onSurfaceVariant,
                    marginTop: 4,
                  }}>
                    Semester
                  </Text>
                </View>
              </View>
            </View>
          </MaterialCard>
        </Animated.View>

        {/* Grades List */}
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: ExpressiveColorPalette.onSurface,
            marginBottom: 16,
            marginTop: 8,
          }}>
            Alle Noten ({subject.grades.length})
          </Text>
          
          {subject.grades.map((grade, index) => renderGradeCard(grade, index))}
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Add Grade FAB */}
      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 24,
          right: 0,
          bottom: 0,
          backgroundColor: ExpressiveColorPalette.primary,
        }}
        color={ExpressiveColorPalette.onPrimary}
        onPress={() => setAddGradeModalVisible(true)}
      />

      {/* Add Grade Modal */}
      <Portal>
        <Modal
          visible={addGradeModalVisible}
          onDismiss={() => setAddGradeModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: ExpressiveColorPalette.elevation.level3,
            margin: 20,
            borderRadius: 28,
            padding: 24,
          }}
        >
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: ExpressiveColorPalette.onSurface,
            marginBottom: 24,
            textAlign: 'center',
          }}>
            Note hinzufügen
          </Text>
          
          <MaterialTextInput
            label="Notentyp"
            value={newGrade.type}
            onChangeText={(text) => setNewGrade(prev => ({ ...prev, type: text }))}
            placeholder="z.B. Klassenarbeit, Mündlich"
            style={{ marginBottom: 16 }}
            variant="outlined"
          />
          
          <MaterialTextInput
            label="Note (1.0 - 6.0)"
            value={newGrade.value}
            onChangeText={(text) => setNewGrade(prev => ({ ...prev, value: text }))}
            placeholder="z.B. 2.3"
            keyboardType="decimal-pad"
            style={{ marginBottom: 16 }}
            variant="outlined"
          />
          
          <MaterialTextInput
            label="Gewichtung"
            value={newGrade.weight}
            onChangeText={(text) => setNewGrade(prev => ({ ...prev, weight: text }))}
            placeholder="z.B. 1.0"
            keyboardType="decimal-pad"
            style={{ marginBottom: 24 }}
            variant="outlined"
          />
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <MaterialButton
              variant="outlined"
              onPress={() => setAddGradeModalVisible(false)}
              style={{ flex: 1 }}
            >
              Abbrechen
            </MaterialButton>
            
            <MaterialButton
              variant="filled"
              onPress={handleAddGrade}
              style={{ flex: 1 }}
            >
              Hinzufügen
            </MaterialButton>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default MaterialDetailsScreen;
