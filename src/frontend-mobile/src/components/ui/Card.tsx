import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  shadow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  padding = 'medium',
  margin = 'none',
  shadow = true,
}) => {
  const theme = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return theme.spacing.sm;
      case 'large':
        return theme.spacing.xl;
      default: // medium
        return theme.spacing.md;
    }
  };

  const getMargin = () => {
    switch (margin) {
      case 'none':
        return 0;
      case 'small':
        return theme.spacing.sm;
      case 'large':
        return theme.spacing.xl;
      default: // medium
        return theme.spacing.md;
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: getPadding(),
    margin: getMargin(),
    borderWidth: 1,
    borderColor: theme.colors.border,
  };

  if (shadow) {
    cardStyle.shadowColor = '#000';
    cardStyle.shadowOffset = {
      width: 0,
      height: 2,
    };
    cardStyle.shadowOpacity = 0.1;
    cardStyle.shadowRadius = 4;
    cardStyle.elevation = 3;
  }

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};

export interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <View style={[styles.cardHeader, { marginBottom: theme.spacing.sm }, style]}>
      {children}
    </View>
  );
};

export interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <Text style={[styles.cardTitle, { color: theme.colors.text }, style]}>
      {children}
    </Text>
  );
};

export interface CardDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }, style]}>
      {children}
    </Text>
  );
};

export interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  return (
    <View style={[styles.cardContent, style]}>
      {children}
    </View>
  );
};

export interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <View style={[styles.cardFooter, { marginTop: theme.spacing.sm }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Card;
