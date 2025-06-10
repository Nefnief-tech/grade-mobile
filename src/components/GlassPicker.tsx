import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Modal, FlatList, ViewStyle } from 'react-native';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';

interface PickerItem {
  label: string;
  value: string | number;
  color?: string;
}

interface GlassPickerProps {
  label?: string;
  items: PickerItem[];
  selectedValue: string | number | null;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  style?: ViewStyle;
  error?: string;
}

export const GlassPicker = ({
  label,
  items,
  selectedValue,
  onValueChange,
  placeholder = 'Auswählen...',
  style,
  error
}: GlassPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find(item => item.value === selectedValue);

  return (
    <View style={style}>
      {label && (
        <Text style={{
          color: 'white',
          fontSize: 16,
          fontWeight: '500',
          marginBottom: 8
        }}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <GlassCard
          gradient={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']}
          style={{ marginBottom: error ? 4 : 0 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{
              color: selectedItem ? 'white' : 'rgba(255, 255, 255, 0.5)',
              fontSize: 16,
              flex: 1
            }}>
              {selectedItem?.label || placeholder}
            </Text>
            {selectedItem?.color && (
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: selectedItem.color,
                marginLeft: 8
              }} />
            )}
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 16, marginLeft: 8 }}>
              ▼
            </Text>
          </View>
        </GlassCard>
      </TouchableOpacity>

      {error && (
        <Text style={{
          color: '#ef4444',
          fontSize: 14,
          marginTop: 4
        }}>
          {error}
        </Text>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          padding: 20
        }}>
          <GlassCard style={{ maxHeight: '70%' }}>
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 16,
              textAlign: 'center'
            }}>
              {label || 'Auswählen'}
            </Text>
            
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 8,
                    backgroundColor: item.value === selectedValue 
                      ? 'rgba(59, 130, 246, 0.3)' 
                      : 'rgba(255, 255, 255, 0.05)'
                  }}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {item.color && (
                      <View style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: item.color,
                        marginRight: 12
                      }} />
                    )}
                    <Text style={{
                      color: 'white',
                      fontSize: 16,
                      flex: 1
                    }}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            
            <GlassButton
              title="Abbrechen"
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 16 }}
              size="small"
            />
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
};
