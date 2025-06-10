import React from 'react';
import { View } from 'react-native';
import { TextInput as PaperTextInput, TextInputProps, Text } from 'react-native-paper';
import { ExpressiveColorPalette } from '../theme/materialTheme';

interface MaterialTextInputProps extends Omit<TextInputProps, 'theme' | 'error'> {
  label?: string;
  helper?: string;
  error?: string;
  variant?: 'filled' | 'outlined';
}

export const MaterialTextInput: React.FC<MaterialTextInputProps> = ({
  label,
  helper,
  error,
  variant = 'outlined',
  style,
  ...props
}) => {
  return (
    <View style={{ marginVertical: 8 }}>
      <PaperTextInput
        mode={variant === 'filled' ? 'flat' : 'outlined'}
        label={label}
        error={!!error}
        style={[
          {
            backgroundColor: variant === 'filled' ? ExpressiveColorPalette.surfaceVariant : 'transparent',
          },
          style,
        ]}
        theme={{
          colors: {
            primary: ExpressiveColorPalette.primary,
            onSurface: ExpressiveColorPalette.onSurface,
            onSurfaceVariant: ExpressiveColorPalette.onSurfaceVariant,
            outline: ExpressiveColorPalette.outline,
            surface: ExpressiveColorPalette.surface,
            surfaceVariant: ExpressiveColorPalette.surfaceVariant,
            error: ExpressiveColorPalette.error,
          },
        }}
        {...props}
      />
      {(helper || error) && (
        <Text
          variant="bodySmall"
          style={{
            color: error ? ExpressiveColorPalette.error : ExpressiveColorPalette.onSurfaceVariant,
            marginTop: 4,
            marginLeft: 16,
          }}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
};
