import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';

const InvestmentDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const loans = [
    {
      id: 1,
      name: 'E.*** E-commerce',
      rate: 2.8,
      loanAmount: 15000.00,
      monthlyReturn: 420.00,
      score: 750,
      monthsRemaining: 8,
      risk: 'Baixo',
      riskColor: '#10B981',
    },
    {
      id: 2,
      name: 'D.*** - Equipamentos',
      rate: 3.2,
      loanAmount: 8500.00,
      monthlyReturn: 272.00,
      score: 680,
      monthsRemaining: 18,
      risk: 'Baixo',
      riskColor: '#10B981',
    },
    {
      id: 3,
      name: 'MEI*** Prestador Serviços',
      rate: 4.1,
      loanAmount: 4950.00,
      monthlyReturn: 203.00,
      score: 620,
      monthsRemaining: 12,
      risk: 'Médio',
      riskColor: '#3B82F6',
    },
  ];

  const handleNewOpportunity = () => {
    navigation.navigate('LoanOpportunities' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Dashboard de Investimentos
          </Text>

          <Card style={styles.summaryCard} padding="large">
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Resumo do Portfólio
            </Text>
            <Text style={[styles.amount, { color: theme.colors.text }]}>
              {formatCurrency(28450.00)}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Valor total investido
            </Text>
          </Card>

          <Card style={styles.performanceCard} padding="large">
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Performance
            </Text>
            <View style={styles.performanceRow}>
              <View style={styles.performanceItem}>
                <Text style={[styles.performanceValue, { color: theme.colors.success }]}>
                  +5.2%
                </Text>
                <Text style={[styles.performanceLabel, { color: theme.colors.textSecondary }]}>
                  Este mês
                </Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={[styles.performanceValue, { color: theme.colors.success }]}>
                  +12.8%
                </Text>
                <Text style={[styles.performanceLabel, { color: theme.colors.textSecondary }]}>
                  Este ano
                </Text>
              </View>
            </View>
          </Card>

          {/* Seção Meus Empréstimos */}
          <View style={styles.loansSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Meus Empréstimos
              </Text>
              <TouchableOpacity style={styles.requestButton} onPress={handleNewOpportunity}>
                <Ionicons name="add" size={16} color="white" />
                <Text style={styles.requestButtonText}> Oportunidade</Text>
              </TouchableOpacity>
            </View>

            {loans.map((loan) => (
              <Card key={loan.id} style={styles.loanCard} padding="large">
                <View style={styles.loanHeader}>
                  <Text style={[styles.loanName, { color: theme.colors.text }]}>
                    {loan.name}
                  </Text>
                  <View style={styles.rateContainer}>
                    <Ionicons name="trending-up" size={16} color={theme.colors.success} />
                    <Text style={[styles.rateText, { color: theme.colors.success }]}>
                      {loan.rate}% a.m.
                    </Text>
                  </View>
                </View>

                <View style={styles.loanDetails}>
                  <View style={styles.loanRow}>
                    <View style={styles.loanColumn}>
                      <Text style={[styles.loanLabel, { color: theme.colors.textSecondary }]}>
                        Valor Emprestado
                      </Text>
                      <Text style={[styles.loanValue, { color: theme.colors.text }]}>
                        {formatCurrency(loan.loanAmount)}
                      </Text>
                    </View>
                    <View style={styles.loanColumn}>
                      <Text style={[styles.loanLabel, { color: theme.colors.textSecondary }]}>
                        Rendimento Mensal
                      </Text>
                      <Text style={[styles.loanValue, { color: theme.colors.text }]}>
                        {formatCurrency(loan.monthlyReturn)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.loanRow}>
                    <View style={styles.loanColumn}>
                      <Text style={[styles.loanLabel, { color: theme.colors.textSecondary }]}>
                        Score do Devedor
                      </Text>
                      <Text style={[styles.loanValue, { color: theme.colors.text }]}>
                        {loan.score}
                      </Text>
                    </View>
                    <View style={styles.loanColumn}>
                      <Text style={[styles.loanLabel, { color: theme.colors.textSecondary }]}>
                        Status
                      </Text>
                      <Text style={[styles.loanValue, { color: theme.colors.text }]}>
                        {loan.monthsRemaining} meses restantes
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.loanFooter}>
                  <View style={[styles.riskBadge, { backgroundColor: `${loan.riskColor}20` }]}>
                    <Text style={[styles.riskText, { color: loan.riskColor }]}>
                      Risco {loan.risk}
                    </Text>
                  </View>
                  <TouchableOpacity>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>

          <View style={styles.bottomSpacing} />
        </View>
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
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  summaryCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  performanceCard: {
    marginBottom: 16,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 14,
  },
  loansSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  requestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loanCard: {
    marginBottom: 16,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loanDetails: {
    marginBottom: 16,
  },
  loanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  loanColumn: {
    flex: 1,
  },
  loanLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  loanValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  loanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default InvestmentDashboardScreen;