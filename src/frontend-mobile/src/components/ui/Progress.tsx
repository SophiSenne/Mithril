import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export interface ProgressProps {
  value: number; // 0-100
  style?: ViewStyle;
  showPercentage?: boolean;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  style,
  showPercentage = false,
  height = 8,
  color,
  backgroundColor,
}) => {
  const theme = useTheme();

  const progressColor = color || theme.colors.primary;
  const trackColor = backgroundColor || theme.colors.border;

  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: trackColor,
          },
        ]}
      >
        <View
          style={[
            styles.progress,
            {
              width: `${clampedValue}%`,
              backgroundColor: progressColor,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={[styles.percentage, { color: theme.colors.textSecondary }]}>
          {Math.round(clampedValue)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Progress;
