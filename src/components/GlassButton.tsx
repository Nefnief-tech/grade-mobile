import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: [ColorValue, ColorValue, ...ColorValue[]];
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const GlassButton = ({
  title,
  onPress,
  style,
  textStyle,
  gradient = ['rgba(59, 130, 246, 0.6)', 'rgba(147, 51, 234, 0.6)'],
  disabled = false,
  size = 'medium'
}: GlassButtonProps) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32, fontSize: 18 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 };
    }
  };

  const sizeStyle = getSize();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[{
        borderRadius: 12,
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1
      }, style]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4
        }}
      >
        <Text
          style={[{
            color: 'white',
            fontWeight: '600',
            textAlign: 'center',
            fontSize: sizeStyle.fontSize
          }, textStyle]}
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
