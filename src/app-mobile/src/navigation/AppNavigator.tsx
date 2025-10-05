import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import RegistrationStep1Screen from '../screens/RegistrationStep1Screen';
import RegistrationStep2Screen from '../screens/RegistrationStep2Screen';
import RegistrationStep2AScreen from '../screens/RegistrationStep2AScreen';
import RegistrationStep2BScreen from '../screens/RegistrationStep2BScreen';
import RegistrationStep3Screen from '../screens/RegistrationStep3Screen';
import HomeScreen from '../screens/HomeScreen';
import InvestmentDashboardScreen from '../screens/InvestmentDashboardScreen';
import CreditDashboardScreen from '../screens/CreditDashboardScreen';
import ExtractScreen from '../screens/ExtractScreen';
import InvestmentsScreen from '../screens/InvestmentsScreen';
import CreditScreen from '../screens/CreditScreen';
import CreateCreditOpportunityScreen from '../screens/CreateCreditOpportunityScreen';
import CreateInvestmentRequestScreen from '../screens/CreateInvestmentRequestScreen';
import CreditRequestScreen from '../screens/CreditRequestScreen';
import LoanOpportunitiesScreen from '../screens/LoanOpportunitiesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BorrowerProfileScreen from '../screens/BorrowerProfileScreen';
import InvestorProfileScreen from '../screens/InvestorProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Investments') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Credit') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Investments" component={LoanOpportunitiesScreen} />
      <Tab.Screen name="Credit" component={CreditRequestScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="RegistrationStep1" 
        component={RegistrationStep1Screen}
        options={{ title: 'Cadastro - Passo 1' }}
      />
      <Stack.Screen 
        name="RegistrationStep2" 
        component={RegistrationStep2Screen}
        options={{ title: 'Cadastro - Passo 2' }}
      />
      <Stack.Screen 
        name="RegistrationStep2A" 
        component={RegistrationStep2AScreen}
        options={{ title: 'Perguntas de Segurança - Parte 1' }}
      />
      <Stack.Screen 
        name="RegistrationStep2B" 
        component={RegistrationStep2BScreen}
        options={{ title: 'Perguntas de Segurança - Parte 2' }}
      />
      <Stack.Screen 
        name="RegistrationStep3" 
        component={RegistrationStep3Screen}
        options={{ title: 'Cadastro - Passo 3' }}
      />
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="InvestmentDashboard" 
        component={InvestmentDashboardScreen}
        options={{ title: 'Dashboard de Investimentos' }}
      />
      <Stack.Screen 
        name="CreditDashboard" 
        component={CreditDashboardScreen}
        options={{ title: 'Dashboard de Crédito' }}
      />
      <Stack.Screen 
        name="Extract" 
        component={ExtractScreen}
        options={{ title: 'Extrato' }}
      />
      <Stack.Screen 
        name="CreateCreditOpportunity" 
        component={CreateCreditOpportunityScreen}
        options={{ title: 'Criar Oportunidade de Crédito' }}
      />
      <Stack.Screen 
        name="CreateInvestmentRequest" 
        component={CreateInvestmentRequestScreen}
        options={{ title: 'Criar Solicitação de Investimento' }}
      />
      <Stack.Screen 
        name="CreditRequest" 
        component={CreditRequestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="LoanOpportunities" 
        component={LoanOpportunitiesScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
