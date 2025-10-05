import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const CreateCreditOpportunityScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    amount: '0,00',
    interestRate: '2.5',
    maxTerm: '12',
    purpose: '',
    riskProfile: 'Baixo risco',
    requirements: 'Ex: Score mínimo 650, comprovação de',
  });

  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [showRiskDropdown, setShowRiskDropdown] = useState(false);

  const purposes = [
    'Capital de giro',
    'Expansão de negócio',
    'Aquisição de equipamentos',
    'Investimento em tecnologia',
    'Outros',
  ];

  const riskProfiles = [
    'Baixo risco',
    'Médio risco',
    'Alto risco',
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^\d,]/g, '');
    setFormData(prev => ({ ...prev, amount: cleanValue }));
  };

  const handleAmountIncrement = () => {
    const currentAmount = parseFloat(formData.amount.replace(',', '.')) || 0;
    const newAmount = (currentAmount + 1000).toFixed(2).replace('.', ',');
    setFormData(prev => ({ ...prev, amount: newAmount }));
  };

  const handleAmountDecrement = () => {
    const currentAmount = parseFloat(formData.amount.replace(',', '.')) || 0;
    const newAmount = Math.max(0, currentAmount - 1000).toFixed(2).replace('.', ',');
    setFormData(prev => ({ ...prev, amount: newAmount }));
  };

  const handleRateIncrement = () => {
    const currentRate = parseFloat(formData.interestRate) || 0;
    const newRate = Math.min(20, currentRate + 0.1).toFixed(1);
    setFormData(prev => ({ ...prev, interestRate: newRate }));
  };

  const handleRateDecrement = () => {
    const currentRate = parseFloat(formData.interestRate) || 0;
    const newRate = Math.max(0.1, currentRate - 0.1).toFixed(1);
    setFormData(prev => ({ ...prev, interestRate: newRate }));
  };

  const handleTermIncrement = () => {
    const currentTerm = parseInt(formData.maxTerm) || 0;
    const newTerm = Math.min(60, currentTerm + 1).toString();
    setFormData(prev => ({ ...prev, maxTerm: newTerm }));
  };

  const handleTermDecrement = () => {
    const currentTerm = parseInt(formData.maxTerm) || 0;
    const newTerm = Math.max(1, currentTerm - 1).toString();
    setFormData(prev => ({ ...prev, maxTerm: newTerm }));
  };

  const handleCreateOpportunity = () => {
    if (!formData.purpose) {
      Alert.alert('Erro', 'Por favor, selecione uma finalidade preferencial');
      return;
    }

    Alert.alert(
      'Oportunidade Criada',
      'Sua oportunidade de crédito foi criada com sucesso!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar',
      'Tem certeza que deseja cancelar a criação da oportunidade?',
      [
        {
          text: 'Continuar',
          style: 'cancel',
        },
        {
          text: 'Cancelar',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Conteúdo Scrollável */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header com título e subtítulo - agora scrollável */}
        <View style={styles.headerContent}>
          <Text style={styles.mainTitle}>Criar Oportunidade de Crédito</Text>
          <Text style={styles.subtitle}>
            Disponibilize seu dinheiro para empréstimo
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          <Card style={styles.formCard} padding="large">
            {/* Valor a disponibilizar */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Valor a disponibilizar
              </Text>
              <View style={styles.inputWithButtons}>
                <Input
                  value={formData.amount}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                  style={styles.inputField}
                />
                <View style={styles.buttonGroup}>
                  <TouchableOpacity style={styles.incrementButton} onPress={handleAmountIncrement}>
                    <Ionicons name="chevron-up" size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.decrementButton} onPress={handleAmountDecrement}>
                    <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Taxa de juros mensal */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Taxa de juros mensal (%)
              </Text>
              <View style={styles.inputWithButtons}>
                <Input
                  value={formData.interestRate}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, interestRate: value }))}
                  keyboardType="numeric"
                  style={styles.inputField}
                />
                <View style={styles.buttonGroup}>
                  <TouchableOpacity style={styles.incrementButton} onPress={handleRateIncrement}>
                    <Ionicons name="chevron-up" size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.decrementButton} onPress={handleRateDecrement}>
                    <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Prazo máximo */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Prazo máximo (meses)
              </Text>
              <View style={styles.inputWithButtons}>
                <Input
                  value={formData.maxTerm}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, maxTerm: value }))}
                  keyboardType="numeric"
                  style={styles.inputField}
                />
                <View style={styles.buttonGroup}>
                  <TouchableOpacity style={styles.incrementButton} onPress={handleTermIncrement}>
                    <Ionicons name="chevron-up" size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.decrementButton} onPress={handleTermDecrement}>
                    <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Finalidade preferencial */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Finalidade preferencial
              </Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowPurposeDropdown(!showPurposeDropdown)}
              >
                <Text style={[styles.dropdownText, { color: formData.purpose ? theme.colors.text : theme.colors.textSecondary }]}>
                  {formData.purpose || 'Selecione a finalidade'}
                </Text>
                <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              
              {showPurposeDropdown && (
                <View style={styles.dropdownList}>
                  {purposes.map((purpose, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, purpose }));
                        setShowPurposeDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, { color: theme.colors.text }]}>
                        {purpose}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Perfil de risco aceito */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Perfil de risco aceito
              </Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowRiskDropdown(!showRiskDropdown)}
              >
                <Text style={[styles.dropdownText, { color: theme.colors.text }]}>
                  {formData.riskProfile}
                </Text>
                <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              
              {showRiskDropdown && (
                <View style={styles.dropdownList}>
                  {riskProfiles.map((risk, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, riskProfile: risk }));
                        setShowRiskDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, { color: theme.colors.text }]}>
                        {risk}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </Card>
        </View>

        {/* Botões de Ação - agora dentro do ScrollView */}
        <View style={styles.actionButtons}>
          <Button
            title="Criar Oportunidade"
            onPress={handleCreateOpportunity}
            style={styles.createButton}
            textStyle={styles.createButtonText}
          />
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: theme.colors.primary }]}
            onPress={handleCancel}
          >
            <Text style={[styles.cancelButtonText, { color: theme.colors.primary }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF',
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 16,
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerContent: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
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
    opacity: 0.9,
  },
  formContainer: {
    padding: 24,
    marginTop: 20,
  },
  formCard: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWithButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    marginRight: 8,
  },
  buttonGroup: {
    flexDirection: 'column',
  },
  incrementButton: {
    width: 32,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D1D5DB',
  },
  decrementButton: {
    width: 32,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  textAreaField: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bottomSpacing: {
    height: 24,
  },
  actionButtons: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 12,
  },
  createButton: {
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E40AF',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateCreditOpportunityScreen;