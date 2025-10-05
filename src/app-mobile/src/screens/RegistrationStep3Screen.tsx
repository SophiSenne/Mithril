import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Progress from '../components/ui/Progress';
import { useTheme } from '../context/ThemeContext';

interface InvestmentProfile {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  features: string[];
}

interface RouteParams {
  securityAnswers?: { [key: number]: string };
}

const RegistrationStep3Screen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  
  const { securityAnswers } = route.params as RouteParams;

  const investmentProfiles: InvestmentProfile[] = [
    {
      id: 'conservative',
      title: 'Conservador',
      subtitle: 'Segurança em primeiro lugar',
      description: 'Prefere investimentos mais seguros com menor risco de perda',
      icon: 'trending-down',
      color: theme.colors.success,
      features: ['Baixo risco', 'Retorno estável', 'Liquidez alta'],
    },
    {
      id: 'moderate',
      title: 'Moderado',
      subtitle: 'Equilibrio entre risco e retorno',
      description: 'Busca um equilíbrio entre segurança e rentabilidade',
      icon: 'bar-chart',
      color: theme.colors.primary,
      features: ['Risco médio', 'Retorno balanceado', 'Diversificação'],
    },
    {
      id: 'aggressive',
      title: 'Arrojado',
      subtitle: 'Busca maiores retornos',
      description: 'Aceita maiores riscos em busca de retornos superiores',
      icon: 'trending-up',
      color: theme.colors.error,
      features: ['Alto risco', 'Retorno potencial alto', 'Estratégias avançadas'],
    },
  ];

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfile(profileId);
  };

  const handleComplete = () => {
    if (!selectedProfile) {
      Alert.alert('Erro', 'Por favor, selecione um perfil de investimento');
      return;
    }
    
    // Log security answers for debugging (in production, this would be sent to backend)
    if (securityAnswers) {
      console.log('Security answers received:', securityAnswers);
    }
    
    // Complete registration and navigate to main app
    navigation.navigate('Login' as never);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const ProfileCard = ({ profile }: { profile: InvestmentProfile }) => {
    const isSelected = selectedProfile === profile.id;

    return (
      <Card
        onPress={() => handleProfileSelect(profile.id)}
        style={[
          styles.profileCard,
          isSelected && {
            borderColor: profile.color,
            backgroundColor: `${profile.color}05`,
            shadowColor: profile.color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          },
        ]}
        padding="large"
      >
        <View style={styles.profileContent}>
          <View
            style={[
              styles.profileIcon,
              {
                backgroundColor: isSelected ? profile.color : `${profile.color}20`,
              },
            ]}
          >
            <Ionicons
              name={profile.icon}
              size={24}
              color={isSelected ? 'white' : profile.color}
            />
          </View>
          <View style={styles.profileText}>
            <View style={styles.profileHeader}>
              <Text
                style={[
                  styles.profileTitle,
                  {
                    color: isSelected ? profile.color : theme.colors.text,
                  },
                ]}
              >
                {profile.title}
              </Text>
              {isSelected && (
                <View style={[styles.selectedIndicator, { backgroundColor: profile.color }]}>
                  <View style={styles.selectedDot} />
                </View>
              )}
            </View>
            <Text style={[styles.profileSubtitle, { color: theme.colors.textSecondary }]}>
              {profile.subtitle}
            </Text>
            <Text style={[styles.profileDescription, { color: theme.colors.textSecondary }]}>
              {profile.description}
            </Text>
            <View style={styles.featuresContainer}>
              {profile.features.map((feature, index) => (
                <View
                  key={index}
                  style={[
                    styles.featureTag,
                    {
                      backgroundColor: isSelected ? `${profile.color}20` : theme.colors.gray.light,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.featureText,
                      {
                        color: isSelected ? profile.color : theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              Cadastro
            </Text>
            <View style={styles.placeholder} />
          </View>

          <Progress value={100} style={styles.progress} />
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            Etapa 3 de 3
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Perfil de Investimento
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Escolha o perfil que melhor se adapta aos seus objetivos
            </Text>
            <View style={[styles.infoBox, { backgroundColor: `${theme.colors.primary}10` }]}>
              <Text style={[styles.infoText, { color: theme.colors.primary }]}>
                Você poderá alterar seu perfil a qualquer momento
              </Text>
            </View>
          </View>

          <View style={styles.profilesContainer}>
            {investmentProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomButton, { backgroundColor: theme.colors.surface }]}>
        <Button
          title="Concluir Cadastro"
          onPress={handleComplete}
          disabled={!selectedProfile}
          style={styles.completeButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 36,
  },
  progress: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  infoBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(30, 64, 175, 0.2)',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  profilesContainer: {
    marginBottom: 24,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  profileSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  profileDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 100,
  },
  bottomButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  completeButton: {
    width: '100%',
  },
});

export default RegistrationStep3Screen;
