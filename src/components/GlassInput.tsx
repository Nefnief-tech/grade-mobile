import React from 'react';
import { TextInput, Text, View, ViewStyle, TextStyle } from 'react-native';
import { GlassCard } from './GlassCard';

interface GlassInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export const GlassInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  inputStyle,
  error,
  multiline = false,
  numberOfLines = 1
}: GlassInputProps) => {
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
      <GlassCard
        gradient={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']}
        style={{ marginBottom: error ? 4 : 0 }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[{
            color: 'white',
            fontSize: 16,
            minHeight: multiline ? numberOfLines * 20 : 20
          }, inputStyle]}
        />
      </GlassCard>
      {error && (
        <Text style={{
          color: '#ef4444',
          fontSize: 14,
          marginTop: 4
        }}>
          {error}
        </Text>
      )}
    </View>
  );
};
