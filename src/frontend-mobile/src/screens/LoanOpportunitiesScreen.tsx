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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface LoanOpportunity {
  id: number;
  borrower: string;
  profession: string;
  purpose: string;
  description: string;
  interestRate: number;
  requestedAmount: number;
  creditScore: number;
  term: number;
  risk: 'Baixo' | 'Médio' | 'Alto';
  riskColor: string;
  guarantees: string[];
  isBestRate?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
}

const LoanOpportunitiesScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const opportunities: LoanOpportunity[] = [
    {
      id: 1,
      borrower: 'E.***',
      profession: 'E-commerce',
      purpose: 'Expansão de estoque para temporada',
      description: 'Histórico excelente de pagamentos, garantias sólidas',
      interestRate: 2.8,
      requestedAmount: 25000,
      creditScore: 750,
      term: 12,
      risk: 'Baixo',
      riskColor: '#10B981',
      guarantees: ['Nota fiscal', 'Histórico bancário', 'Faturamento comprovado'],
      isBestRate: true,
      icon: 'shield-outline',
    },
    {
      id: 2,
      borrower: 'P.L.***',
      profession: 'Dentista',
      purpose: 'Aquisição de equipamentos odontológicos',
      description: 'CRO ativo, consultório estabelecido há 8 anos',
      interestRate: 3.2,
      requestedAmount: 50000,
      creditScore: 680,
      term: 24,
      risk: 'Baixo',
      riskColor: '#10B981',
      guarantees: ['CRO ativo', 'Comprovante de renda', 'Imóvel próprio'],
      icon: 'shield-outline',
    },
    {
      id: 3,
      borrower: 'MEI***',
      profession: 'Prestador de Serviços',
      purpose: 'Capital de giro para crescimento',
      description: 'CNPJ ativo há 3 anos, faturamento crescente',
      interestRate: 4.1,
      requestedAmount: 15000,
      creditScore: 620,
      term: 18,
      risk: 'Médio',
      riskColor: '#F59E0B',
      guarantees: ['CNPJ ativo', 'Faturamento comprovado', 'Conta bancária'],
      icon: 'trending-up-outline',
    },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCreateOpportunity = () => {
    navigation.navigate('CreateCreditOpportunity' as never);
  };

  const handleLendNow = (opportunity: LoanOpportunity) => {
    Alert.alert(
      'Confirmar Empréstimo',
      `Deseja emprestar ${formatCurrency(opportunity.requestedAmount)} para ${opportunity.borrower} - ${opportunity.profession}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            Alert.alert('Sucesso', 'Empréstimo realizado com sucesso!');
          },
        },
      ]
    );
  };

  const handleViewProfile = (opportunity: LoanOpportunity) => {
    navigation.navigate('BorrowerProfile' as never, { opportunity });
  };

  const OpportunityCard = ({ opportunity }: { opportunity: LoanOpportunity }) => (
    <Card style={styles.opportunityCard} padding="large">

      {/* Borrower Info */}
      <View style={styles.borrowerHeader}>
        <View style={styles.borrowerInfo}>
          <View style={[styles.borrowerIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
            <Ionicons name={opportunity.icon} size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.borrowerDetails}>
            <Text style={[styles.borrowerName, { color: theme.colors.text }]}>
              {opportunity.borrower} - {opportunity.profession}
            </Text>
            <Text style={[styles.purpose, { color: theme.colors.textSecondary }]}>
              {opportunity.purpose}
            </Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {opportunity.description}
            </Text>
          </View>
        </View>
        <View style={styles.rateContainer}>
          <Text style={[styles.rateValue, { color: theme.colors.success }]}>
            {opportunity.interestRate}%
          </Text>
          <Text style={[styles.rateLabel, { color: theme.colors.textSecondary }]}>
            ao mês
          </Text>
        </View>
      </View>

      {/* Financial Details */}
      <View style={styles.financialDetails}>
        <View style={styles.detailsRow}>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Valor Solicitado
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {formatCurrency(opportunity.requestedAmount)}
            </Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Prazo
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {opportunity.term} meses
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Score de Crédito
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {opportunity.creditScore}
            </Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Risco
            </Text>
            <View style={[styles.riskBadge, { backgroundColor: `${opportunity.riskColor}20` }]}>
              <Text style={[styles.riskText, { color: opportunity.riskColor }]}>
                {opportunity.risk}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          title="Emprestar Agora"
          onPress={() => handleLendNow(opportunity)}
          style={[styles.lendButton, { backgroundColor: theme.colors.success }]}
          textStyle={styles.lendButtonText}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
  <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
    {/* Header */}
    <View style={[styles.header, { backgroundColor: theme.colors.success }]}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Investimentos</Text>
      </View>
      
      <View style={styles.headerContent}>
        <Text style={styles.mainTitle}>Oportunidades de Empréstimo</Text>
        <Text style={styles.subtitle}>
          Emprestando seu dinheiro diretamente para quem precisa
        </Text>
        
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateOpportunity}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.createButtonText}>Criar Nova Oportunidade</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Content */}
    <View style={styles.content}>
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerContent: {
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6DD47E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  opportunityCard: {
    marginBottom: 20,
    position: 'relative',
  },
  bestRateBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
    zIndex: 1,
  },
  bestRateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  borrowerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  borrowerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  borrowerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  borrowerDetails: {
    flex: 1,
  },
  borrowerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  purpose: {
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  rateContainer: {
    alignItems: 'flex-end',
  },
  rateValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rateLabel: {
    fontSize: 12,
  },
  financialDetails: {
    marginBottom: 20,
  },
  detailsRow: {
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
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  riskText: {
    fontSize: 12,
    fontWeight: '500',
  },
  guaranteesSection: {
    marginBottom: 20,
  },
  guaranteesTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  guaranteesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  guaranteeTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  guaranteeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  lendButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  lendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default LoanOpportunitiesScreen;
