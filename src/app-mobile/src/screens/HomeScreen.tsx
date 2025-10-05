import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const QuickActionCard = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    iconColor, 
    backgroundColor 
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    onPress: () => void;
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
          <Ionicons name={icon} size={24} color={iconColor} />
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

const FinanceCard = ({
  icon,
  title,
  subtitle,
  amount,
  percentage,
  onPress,
  iconColor,
  backgroundColor,
  showAmount = true, // 👈 novo parâmetro opcional
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  amount: number;
  percentage?: string;
  onPress: () => void;
  iconColor: string;
  backgroundColor: string;
  showAmount?: boolean;
}) => (
  <Card onPress={onPress} style={styles.financeCard} padding="large">
    <View style={styles.financeCardContent}>
      <View style={styles.financeCardLeft}>
        <View style={[styles.financeCardIcon, { backgroundColor }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.financeCardText}>
          <Text style={[styles.financeCardTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.financeCardSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
          {percentage && (
            <Text style={[styles.financeCardPercentage, { color: theme.colors.success }]}>
              {percentage}
            </Text>
          )}
        </View>
      </View>

      {/* 👇 Só mostra o valor se showAmount for true */}
      {showAmount && (
        <View style={styles.financeCardRight}>
          <Text style={[styles.financeCardAmount, { color: theme.colors.text }]}>
            {showBalance ? formatCurrency(amount) : '••••••'}
          </Text>
          <Text style={[styles.financeCardLabel, { color: theme.colors.textSecondary }]}>
            {title.includes('Investimento') ? 'Investido' : 'Disponível'}
          </Text>
        </View>
      )}
    </View>
  </Card>
);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => handleNavigate('Profile')}
              >
                <Ionicons name="person" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <Text style={styles.userGreeting}>Olá,</Text>
                <Text style={styles.userName}>João Silva</Text>
              </View>
            </View>

            {/* Balance Card */}
            <Card style={styles.balanceCard} padding="large">
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>Saldo total</Text>
                <TouchableOpacity
                  onPress={() => setShowBalance(!showBalance)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showBalance ? 'eye-off' : 'eye'}
                    size={16}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.balanceAmount}>
                {showBalance ? formatCurrency(45750.30) : '••••••'}
              </Text>
            </Card>
          </View>
        </LinearGradient>

        {/* Main Navigation Cards */}
        <View style={styles.mainContent}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Suas finanças
          </Text>

          <FinanceCard
            icon="trending-up"
            title="Dashboard de Investimentos"
            subtitle="Acompanhe seus rendimentos"
            amount={28450.00}
            percentage="+5.2% este mês"
            onPress={() => handleNavigate('InvestmentDashboard')}
            iconColor={theme.colors.success}
            backgroundColor={`${theme.colors.success}20`}
          />

          <FinanceCard
            icon="card"
            title="Dashboard de Crédito"
            subtitle="Gerencie seus empréstimos"
            amount={15000.00}
            onPress={() => handleNavigate('CreditDashboard')}
            iconColor={theme.colors.primary}
            backgroundColor={`${theme.colors.primary}20`}
          />

          <FinanceCard
            icon="receipt"
            title="Extrato"
            subtitle="Histórico de transações"
            amount={0}
            onPress={() => handleNavigate('Extract')}
            iconColor={theme.colors.textSecondary}
            backgroundColor={theme.colors.gray.light}
            showAmount={false} 
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
    paddingBottom: 24,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userGreeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  notificationButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceUpdate: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  quickActions: {
    paddingHorizontal: 24,
    marginTop: -16,
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
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
  },
  mainContent: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 16,
  },
  financeCard: {
    marginBottom: 16,
  },
  financeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  financeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  financeCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  financeCardText: {
    flex: 1,
  },
  financeCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  financeCardSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  financeCardPercentage: {
    fontSize: 12,
    fontWeight: '500',
  },
  financeCardRight: {
    alignItems: 'flex-end',
  },
  financeCardAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  financeCardLabel: {
    fontSize: 12,
  },
  bottomSpacing: {
    height: 80,
  },
});

export default HomeScreen;
