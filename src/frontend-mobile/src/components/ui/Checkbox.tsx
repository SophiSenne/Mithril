import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  disabled = false,
  style,
  labelStyle,
}) => {
  const theme = useTheme();

  const checkboxStyle: ViewStyle = {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: checked ? theme.colors.primary : theme.colors.border,
    backgroundColor: checked ? theme.colors.primary : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  if (label) {
    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={checkboxStyle}>
          {checked && (
            <Ionicons name="checkmark" size={12} color="white" />
          )}
        </View>
        <Text style={[styles.label, { color: theme.colors.text }, labelStyle]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[checkboxStyle, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {checked && (
        <Ionicons name="checkmark" size={12} color="white" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Checkbox;
