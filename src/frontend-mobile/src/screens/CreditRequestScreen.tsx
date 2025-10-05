import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface CreditOpportunity {
  id: number;
  investor: string;
  investorType: string;
  amount: number;
  term: number;
  rate: number;
  investorScore: number;
  purpose: string;
  risk: 'Baixo' | 'Médio' | 'Alto';
  riskColor: string;
  requirements: string[];
  estimatedInstallment: number;
  isBestOffer?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
}

const CreditRequestScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  
  const [selectedAmount, setSelectedAmount] = useState<number>(5000);

  const quickAmounts = [5000, 15000, 30000];

  const creditOpportunities: CreditOpportunity[] = [
    {
      id: 1,
      investor: 'C.S.***',
      investorType: 'Investidor experiente há 5 anos',
      amount: 25000,
      term: 24,
      rate: 1.2,
      investorScore: 850,
      purpose: 'Capital de giro',
      risk: 'Baixo',
      riskColor: '#10B981',
      requirements: ['Score mínimo 650', 'Comprovação de renda', 'Sem restrições'],
      estimatedInstallment: 1205.05,
      isBestOffer: true,
      icon: 'cash-outline',
    },
    {
      id: 2,
      investor: 'A.S.***',
      investorType: 'Investidor profissional há 3 anos',
      amount: 18000,
      term: 18,
      rate: 1.5,
      investorScore: 780,
      purpose: 'Expansão de negócio',
      risk: 'Médio',
      riskColor: '#F59E0B',
      requirements: ['Score mínimo 600', 'Comprovação de renda', 'Garantias'],
      estimatedInstallment: 1089.32,
      icon: 'business-outline',
    },
    {
      id: 3,
      investor: 'J.O.***',
      investorType: 'Investidor institucional há 8 anos',
      amount: 35000,
      term: 36,
      rate: 1.8,
      investorScore: 920,
      purpose: 'Investimento em equipamentos',
      risk: 'Baixo',
      riskColor: '#10B981',
      requirements: ['Score mínimo 700', 'Comprovação de renda', 'Histórico bancário'],
      estimatedInstallment: 1256.78,
      icon: 'construct-outline',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRequestInvestment = () => {
    navigation.navigate('CreateInvestmentRequest' as never);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
  };

  const handleRequestApproval = (opportunity: CreditOpportunity) => {
    Alert.alert(
      'Solicitar Aprovação',
      `Deseja solicitar aprovação para o crédito de ${formatCurrency(opportunity.amount)} do investidor ${opportunity.investor}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Solicitar', 
          onPress: () => {
            Alert.alert('Sucesso', 'Solicitação enviada com sucesso!');
          }
        },
      ]
    );
  };

  const handleViewProfile = (opportunity: CreditOpportunity) => {
    navigation.navigate('InvestorProfile' as never, { investor: opportunity });
  };

  const renderCreditOpportunity = ({ item }: { item: CreditOpportunity }) => (
    <Card style={styles.opportunityCard} padding="large">


      {/* Header do Investidor */}
      <View style={styles.investorHeader}>
        <View style={styles.investorInfo}>
          <View style={[styles.investorIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
            <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.investorDetails}>
            <Text style={[styles.investorName, { color: theme.colors.text }]}>
              {item.investor}
            </Text>
            <Text style={[styles.investorType, { color: theme.colors.textSecondary }]}>
              {item.investorType}
            </Text>
          </View>
        </View>
      </View>

      {/* Detalhes da Oferta */}
      <View style={styles.offerDetails}>
        <View style={styles.detailsRow}>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Valor:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {formatCurrency(item.amount)}
            </Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Prazo:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {item.term} meses
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Taxa:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {item.rate}% a.m.
            </Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Score Investidor:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {item.investorScore}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Finalidade:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {item.purpose}
            </Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Risco:
            </Text>
            <View style={[styles.riskBadge, { backgroundColor: `${item.riskColor}20` }]}>
              <Text style={[styles.riskText, { color: item.riskColor }]}>
                {item.risk}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Parcela Estimada */}
      <View style={styles.installmentSection}>
        <Text style={[styles.installmentLabel, { color: theme.colors.textSecondary }]}>
          Parcela estimada:
        </Text>
        <Text style={[styles.installmentValue, { color: theme.colors.text }]}>
          {formatCurrency(item.estimatedInstallment)}
        </Text>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionButtons}>
        <Button
          title="Solicitar Aprovação"
          onPress={() => handleRequestApproval(item)}
          style={[styles.requestButton, { backgroundColor: theme.colors.primary }]}
          textStyle={styles.requestButtonText}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Seção 1 - Cabeçalho Principal */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Crédito</Text>
          </View>
          
          <View style={styles.headerContent}>
            <Text style={styles.mainTitle}>Crédito de Investidores</Text>
            <Text style={styles.amountValue}>R$ 100.000</Text>
            <Text style={styles.subtitle}>
              Disponível de investidores verificados
            </Text>
            
            <TouchableOpacity
              style={styles.requestInvestmentButton}
              onPress={handleRequestInvestment}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.requestInvestmentText}>Solicitar Investimento</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção 3 - Oportunidades de Crédito */}
        <View style={styles.opportunitiesSection}>
          <Text style={[styles.opportunitiesTitle, { color: theme.colors.text }]}>
            Oportunidades de Crédito
          </Text>
          
          <FlatList
            data={creditOpportunities}
            renderItem={renderCreditOpportunity}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

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
  // Seção 1 - Header
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
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 24,
  },
  requestInvestmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2F80ED',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  requestInvestmentText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Seção 2 - Simulador
  simulatorSection: {
    padding: 24,
    marginTop: -20,
  },
  simulatorCard: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  simulatorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  simulatorSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  amountButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  amountButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  amountButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Seção 3 - Oportunidades
  opportunitiesSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  opportunitiesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 30,
  },
  opportunityCard: {
    marginBottom: 16,
    position: 'relative',
  },
  bestOfferBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: '#1E40AF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  bestOfferText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  investorHeader: {
    marginBottom: 16,
  },
  investorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  investorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  investorDetails: {
    flex: 1,
  },
  investorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  investorType: {
    fontSize: 14,
  },
  offerDetails: {
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  riskText: {
    fontSize: 12,
    fontWeight: '500',
  },
  requirementsSection: {
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  requirementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  requirementTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  requirementText: {
    fontSize: 12,
    fontWeight: '500',
  },
  installmentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  installmentLabel: {
    fontSize: 14,
  },
  installmentValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  requestButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  requestButtonText: {
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

export default CreditRequestScreen;
