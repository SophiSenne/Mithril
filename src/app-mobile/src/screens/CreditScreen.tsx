import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const CreditScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const CreditCard = ({
    title,
    subtitle,
    amount,
    status,
    onPress,
    icon,
    iconColor,
    backgroundColor,
  }: {
    title: string;
    subtitle: string;
    amount: number;
    status: string;
    onPress: () => void;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    backgroundColor: string;
  }) => (
    <Card onPress={onPress} style={styles.creditCard} padding="large">
      <View style={styles.creditContent}>
        <View style={styles.creditLeft}>
          <View style={[styles.creditIcon, { backgroundColor }]}>
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
          <View style={styles.creditText}>
            <Text style={[styles.creditTitle, { color: theme.colors.text }]}>
              {title}
            </Text>
            <Text style={[styles.creditSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
            <Text style={[styles.creditStatus, { color: theme.colors.primary }]}>
              {status}
            </Text>
          </View>
        </View>
        <View style={styles.creditRight}>
          <Text style={[styles.creditAmount, { color: theme.colors.text }]}>
            {formatCurrency(amount)}
          </Text>
        </View>
      </View>
    </Card>
  );

  const QuickActionCard = ({
    title,
    subtitle,
    onPress,
    icon,
    iconColor,
    backgroundColor,
  }: {
    title: string;
    subtitle: string;
    onPress: () => void;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    backgroundColor: string;
  }) => (
    <Card
      onPress={onPress}
      style={[styles.quickActionCard, { width: (width - 48 - 16) / 2 }]}
      padding="medium"
    >
      <View style={styles.quickActionContent}>
        <View style={[styles.quickActionIcon, { backgroundColor }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text style={[styles.quickActionTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.quickActionSubtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Crédito</Text>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => handleNavigate('CreditDashboard')}
            >
              <Ionicons name="analytics" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Credit Summary */}
        <View style={styles.summarySection}>
          <Card style={styles.summaryCard} padding="large">
            <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
              Limite Disponível
            </Text>
            <Text style={[styles.summaryAmount, { color: theme.colors.text }]}>
              {formatCurrency(15000.00)}
            </Text>
            <Text style={[styles.summarySubtitle, { color: theme.colors.textSecondary }]}>
              Para solicitações de empréstimo
            </Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.success }]}>
                  R$ 0,00
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Em uso
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                  12.5%
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Taxa a.a.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Ações Rápidas
          </Text>
          <View style={styles.quickActionsRow}>
            <QuickActionCard
              title="Solicitar Investimento"
              subtitle="Solicitar agora"
              onPress={() => handleNavigate('CreateInvestmentRequest')}
              icon="add-circle"
              iconColor={theme.colors.primary}
              backgroundColor={`${theme.colors.primary}20`}
            />
            <QuickActionCard
              title="Dashboard"
              subtitle="Ver detalhes"
              onPress={() => handleNavigate('CreditDashboard')}
              icon="analytics"
              iconColor={theme.colors.success}
              backgroundColor={`${theme.colors.success}20`}
            />
          </View>
        </View>

        {/* Credit Options */}
        <View style={styles.creditOptionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Opções de Crédito
          </Text>

          <CreditCard
            title="Empréstimo Pessoal"
            subtitle="Dinheiro na conta em até 24h"
            amount={15000.00}
            status="Disponível"
            onPress={() => {}}
            icon="cash"
            iconColor={theme.colors.success}
            backgroundColor={`${theme.colors.success}20`}
          />

          <CreditCard
            title="Cartão de Crédito"
            subtitle="Limite pré-aprovado"
            amount={5000.00}
            status="Disponível"
            onPress={() => {}}
            icon="card"
            iconColor={theme.colors.primary}
            backgroundColor={`${theme.colors.primary}20`}
          />

          <CreditCard
            title="Antecipação de FGTS"
            subtitle="Saque do seu FGTS"
            amount={8000.00}
            status="Em análise"
            onPress={() => {}}
            icon="time"
            iconColor={theme.colors.warning}
            backgroundColor={`${theme.colors.warning}20`}
          />
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  summarySection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  summaryCard: {
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  quickActions: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    marginBottom: 0,
  },
  quickActionContent: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  creditOptionsSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  creditCard: {
    marginBottom: 16,
  },
  creditContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creditLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  creditIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  creditText: {
    flex: 1,
  },
  creditTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  creditSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  creditStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  creditRight: {
    alignItems: 'flex-end',
  },
  creditAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 80,
  },
});

export default CreditScreen;
