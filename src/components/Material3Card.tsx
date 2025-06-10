import React from 'react';
import { ViewStyle } from 'react-native';
import { Card } from 'react-native-paper';

interface Material3CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Material3Card: React.FC<Material3CardProps> = ({
  children,
  style,
  onPress,
}) => {
  return (
    <Card
      style={[
        {
          borderRadius: 16,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        style,
      ]}
      onPress={onPress}
    >
      <Card.Content>{children}</Card.Content>
    </Card>
  );
};