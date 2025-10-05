import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';

const ExtractScreen: React.FC = () => {
  const theme = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Dados de resumo
  const summaryData = {
    inflows: 3560.50,
    outflows: 25971.78,
  };

  // Dados das transações
  const transactions = [
    {
      id: 1,
      title: 'Rendimento Empréstimo',
      amount: 420.00,
      type: 'inflow',
      date: '2024-01-14T14:30:00',
    },
    {
      id: 2,
      title: 'Novo Empréstimo',
      amount: 8500.00,
      type: 'outflow',
      date: '2024-01-13T09:15:00',
    },
    {
      id: 3,
      title: 'Pagamento Crédito',
      amount: 456.78,
      type: 'outflow',
      date: '2024-01-12T16:00:00',
    },
    {
      id: 4,
      title: 'Rendimento Empréstimo',
      amount: 203.00,
      type: 'inflow',
      date: '2024-01-13T08:45:00',
    },
    {
      id: 5,
      title: 'Rendimento Empréstimo',
      amount: 272.00,
      type: 'inflow',
      date: '2024-01-11T12:00:00',
    },
    {
      id: 6,
      title: 'Depósito PIX',
      amount: 1000.00,
      type: 'outflow',
      date: '2024-01-10T10:30:00',
    },
    {
      id: 7,
      title: 'Quitação Antecipada',
      amount: 1850.00,
      type: 'inflow',
      date: '2024-01-09T00:01:00',
    },
  ];

  const handleBackPress = () => {
    console.log('Voltar para tela anterior');
  };

  const handleFilterPress = () => {
    console.log('Abrir filtros');
  };

  const renderTransaction = ({ item }: { item: typeof transactions[0] }) => (
    <Card style={styles.transactionCard} padding="large">
      <View style={styles.transactionContent}>
        <View style={styles.transactionLeft}>
          <View style={[
            styles.transactionIcon,
            { backgroundColor: item.type === 'inflow' ? '#e8f5e9' : '#fce4ec' }
          ]}>
            <Ionicons
              name={item.type === 'inflow' ? 'arrow-up' : 'arrow-down'}
              size={20}
              color={item.type === 'inflow' ? '#4caf50' : '#f44336'}
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.transactionSubtitle, { color: theme.colors.textSecondary }]}>
            </Text>
          </View>
        </View>
        
        <View style={styles.transactionRight}>
          <Text style={[
            styles.transactionAmount,
            { color: item.type === 'inflow' ? '#4caf50' : '#f44336' }
          ]}>
            {item.type === 'inflow' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <Text style={[styles.transactionDateTime, { color: theme.colors.textSecondary }]}>
            {formatDate(item.date)} • {formatTime(item.date)}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>


      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Cards de Resumo */}
          <View style={styles.summaryCards}>
            {/* Card Entradas */}
            <Card style={styles.summaryCard} padding="large">
              <View style={styles.summaryCardContent}>
                <View style={[styles.summaryIcon, { backgroundColor: '#e8f5e9' }]}>
                  <Ionicons name="arrow-up" size={24} color="#4caf50" />
                </View>
                <View style={styles.summaryText}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                    Entradas
                  </Text>
                  <Text style={[styles.summaryValue, { color: '#4caf50' }]}>
                    {formatCurrency(summaryData.inflows)}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Card Saídas */}
            <Card style={styles.summaryCard} padding="large">
              <View style={styles.summaryCardContent}>
                <View style={[styles.summaryIcon, { backgroundColor: '#fce4ec' }]}>
                  <Ionicons name="arrow-down" size={24} color="#f44336" />
                </View>
                <View style={styles.summaryText}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                    Saídas
                  </Text>
                  <Text style={[styles.summaryValue, { color: '#f44336' }]}>
                    {formatCurrency(summaryData.outflows)}
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Título Transações Recentes */}
          <Text style={[styles.transactionsTitle, { color: theme.colors.text }]}>
            Transações Recentes
          </Text>

          {/* Lista de Transações */}
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
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
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  // Cards de Resumo
  summaryCards: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 32,
  },
  summaryCard: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Título Transações
  transactionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  // Cards de Transação
  transactionCard: {
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionSubtitle: {
    fontSize: 14,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionDateTime: {
    fontSize: 12,
  },
});

export default ExtractScreen;