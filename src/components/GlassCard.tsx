import React from 'react';
import { View, ViewStyle, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassCardProps {
  children: any;
  style?: ViewStyle;
  gradient?: [ColorValue, ColorValue, ...ColorValue[]];
  opacity?: number;
}

export const GlassCard = ({
  children,
  style,
  gradient = ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'] as [ColorValue, ColorValue],
  opacity = 0.1
}: GlassCardProps) => {
  return (
    <View style={[{
      borderRadius: 16,
      overflow: 'hidden'
    }, style]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ 
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 24,
          elevation: 8
        }}
      >
        <View style={{ padding: 16 }}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
};
