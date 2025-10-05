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
import Button from '../components/ui/Button';
import Progress from '../components/ui/Progress';
import { useEffect } from 'react';
import { SorobanService } from '../services/SorobanService';
import { blockchainConfig } from '../config/blockchain';

const CreditDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    const envUser = (process.env.EXPO_PUBLIC_DEBUG_USER_G as string) || '';
    const userPublicKey = envUser.trim();
    if (!userPublicKey) return; // no-op if not configured
    (async () => {
      try {
        const score = await SorobanService.getCreditScore(userPublicKey);
        console.log('Credit score (Soroban):', score);
      } catch (e) {
        console.warn('Falha ao obter score de crédito via Soroban:', e);
      }
    })();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const activeCredits = [
    {
      id: 1,
      title: 'Crédito Pessoal',
      originalAmount: 5000.00,
      monthlyRate: 2.5,
      monthlyPayment: 456.78,
      remainingPayments: 8,
      totalPayments: 12,
      progress: 33,
      status: 'Em dia',
      statusColor: '#10B981',
      icon: 'card-outline',
    },
    {
      id: 2,
      title: 'Antecipação do 13º',
      originalAmount: 2800.00,
      monthlyRate: 1.8,
      monthlyPayment: 483.33,
      remainingPayments: 3,
      totalPayments: 6,
      progress: 50,
      status: 'Em dia',
      statusColor: '#10B981',
      icon: 'calendar-outline',
    },
  ];

  const monthlySummary = {
    totalPayments: 940.11,
    nextDueDate: '05/01/2025',
  };

  const handleRequestCredit = () => {
    navigation.navigate('CreditRequest' as never);
  };

  const handleAnticipatePayment = (creditId: number) => {
    // Implementar lógica de antecipação de pagamento
    console.log('Antecipar pagamento para crédito:', creditId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Dashboard de Crédito
          </Text>
          
          <Card style={styles.summaryCard} padding="large">
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Limite Disponível
            </Text>
            <Text style={[styles.amount, { color: theme.colors.text }]}>
              {formatCurrency(15000.00)}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Para solicitações de empréstimo
            </Text>
          </Card>

          <Card style={styles.performanceCard} padding="large">
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Informações de Crédito
            </Text>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  R$ 0,00
                </Text>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Em uso
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
                  12.5%
                </Text>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Taxa a.a.
                </Text>
              </View>
            </View>
          </Card>

          {/* Seção Créditos Ativos */}
          <View style={styles.activeCreditsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Créditos Ativos
              </Text>
              <TouchableOpacity style={styles.requestButton} onPress={handleRequestCredit}>
                <Ionicons name="add" size={16} color="white" />
                <Text style={styles.requestButtonText}>Solicitar</Text>
              </TouchableOpacity>
            </View>

            {activeCredits.map((credit) => (
              <Card key={credit.id} style={styles.creditCard} padding="large">
                {/* Header do Card */}
                <View style={styles.creditHeader}>
                  <View style={styles.creditInfo}>
                    <View style={[styles.creditIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
                      <Ionicons name={credit.icon as any} size={20} color={theme.colors.primary} />
                    </View>
                    <View style={styles.creditDetails}>
                      <Text style={[styles.creditTitle, { color: theme.colors.text }]}>
                        {credit.title}
                      </Text>
                      <Text style={[styles.creditRate, { color: theme.colors.textSecondary }]}>
                        Taxa: {credit.monthlyRate}% a.m.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.creditAmount}>
                    <Text style={[styles.originalAmount, { color: theme.colors.text }]}>
                      {formatCurrency(credit.originalAmount)}
                    </Text>
                    <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>
                      Valor original
                    </Text>
                  </View>
                </View>

                {/* Detalhes do Crédito */}
                <View style={styles.creditDetailsRow}>
                  <View style={styles.detailColumn}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                      Parcela mensal
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                      {formatCurrency(credit.monthlyPayment)}
                    </Text>
                  </View>
                  <View style={styles.detailColumn}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                      Restam
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                      {credit.remainingPayments} de {credit.totalPayments}
                    </Text>
                  </View>
                </View>

                {/* Barra de Progresso */}
                <View style={styles.progressSection}>
                  <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                    Progresso do pagamento
                  </Text>
                  <View style={styles.progressContainer}>
                    <Progress value={credit.progress} style={styles.progressBar} />
                    <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                      {credit.progress}%
                    </Text>
                  </View>
                </View>

                {/* Footer do Card */}
                <View style={styles.creditFooter}>
                  <View style={[styles.statusBadge, { backgroundColor: `${credit.statusColor}20` }]}>
                    <Text style={[styles.statusText, { color: credit.statusColor }]}>
                      {credit.status}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleAnticipatePayment(credit.id)}>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>

          {/* Resumo Mensal */}
          <Card style={styles.monthlySummaryCard} padding="large">
            <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
              Resumo Mensal
            </Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
                Total das parcelas
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {formatCurrency(monthlySummary.totalPayments)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
                Próximo vencimento
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {monthlySummary.nextDueDate}
              </Text>
            </View>
          </Card>

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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
  },
  // Novos estilos para Créditos Ativos
  activeCreditsSection: {
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
    backgroundColor: '#1E40AF',
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
  creditCard: {
    marginBottom: 16,
  },
  creditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  creditInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  creditIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  creditDetails: {
    flex: 1,
  },
  creditTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  creditRate: {
    fontSize: 14,
  },
  creditAmount: {
    alignItems: 'flex-end',
  },
  originalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  amountLabel: {
    fontSize: 12,
  },
  creditDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    marginRight: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  creditFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  anticipateButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Estilos para Resumo Mensal
  monthlySummaryCard: {
    marginTop: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default CreditDashboardScreen;
