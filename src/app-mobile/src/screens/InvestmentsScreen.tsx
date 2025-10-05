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

const InvestmentsScreen: React.FC = () => {
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

  const InvestmentCard = ({
    title,
    subtitle,
    amount,
    percentage,
    onPress,
    icon,
    iconColor,
    backgroundColor,
  }: {
    title: string;
    subtitle: string;
    amount: number;
    percentage: string;
    onPress: () => void;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    backgroundColor: string;
  }) => (
    <Card onPress={onPress} style={styles.investmentCard} padding="large">
      <View style={styles.investmentContent}>
        <View style={styles.investmentLeft}>
          <View style={[styles.investmentIcon, { backgroundColor }]}>
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
          <View style={styles.investmentText}>
            <Text style={[styles.investmentTitle, { color: theme.colors.text }]}>
              {title}
            </Text>
            <Text style={[styles.investmentSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
            <Text style={[styles.investmentPercentage, { color: theme.colors.success }]}>
              {percentage}
            </Text>
          </View>
        </View>
        <View style={styles.investmentRight}>
          <Text style={[styles.investmentAmount, { color: theme.colors.text }]}>
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
            <Text style={styles.headerTitle}>Investimentos</Text>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => handleNavigate('InvestmentDashboard')}
            >
              <Ionicons name="analytics" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Portfolio Summary */}
        <View style={styles.summarySection}>
          <Card style={styles.summaryCard} padding="large">
            <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
              Seu Portfólio
            </Text>
            <Text style={[styles.summaryAmount, { color: theme.colors.text }]}>
              {formatCurrency(28450.00)}
            </Text>
            <Text style={[styles.summarySubtitle, { color: theme.colors.textSecondary }]}>
              Valor total investido
            </Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.success }]}>
                  +5.2%
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Este mês
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  +12.8%
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Este ano
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
              title="Nova Oportunidade"
              subtitle="Criar oportunidade"
              onPress={() => handleNavigate('CreateCreditOpportunity')}
              icon="add-circle"
              iconColor={theme.colors.primary}
              backgroundColor={`${theme.colors.primary}20`}
            />
            <QuickActionCard
              title="Dashboard"
              subtitle="Ver detalhes"
              onPress={() => handleNavigate('InvestmentDashboard')}
              icon="analytics"
              iconColor={theme.colors.success}
              backgroundColor={`${theme.colors.success}20`}
            />
          </View>
        </View>

        {/* Investment List */}
        <View style={styles.investmentsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Meus Investimentos
          </Text>

          <InvestmentCard
            title="Tesouro Selic 2029"
            subtitle="Renda Fixa - Governo"
            amount={15000.00}
            percentage="+4.2%"
            onPress={() => {}}
            icon="treasury"
            iconColor={theme.colors.success}
            backgroundColor={`${theme.colors.success}20`}
          />

          <InvestmentCard
            title="CDB Banco Inter"
            subtitle="Renda Fixa - Privado"
            amount={8500.00}
            percentage="+6.1%"
            onPress={() => {}}
            icon="bank"
            iconColor={theme.colors.primary}
            backgroundColor={`${theme.colors.primary}20`}
          />

          <InvestmentCard
            title="Fundo Multimercado"
            subtitle="Renda Variável"
            amount={4950.00}
            percentage="+8.3%"
            onPress={() => {}}
            icon="trending-up"
            iconColor={theme.colors.error}
            backgroundColor={`${theme.colors.error}20`}
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
  investmentsSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  investmentCard: {
    marginBottom: 16,
  },
  investmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  investmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  investmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  investmentText: {
    flex: 1,
  },
  investmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  investmentSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  investmentPercentage: {
    fontSize: 12,
    fontWeight: '500',
  },
  investmentRight: {
    alignItems: 'flex-end',
  },
  investmentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 80,
  },
});

export default InvestmentsScreen;
