import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Checkbox from '../components/ui/Checkbox';
import Progress from '../components/ui/Progress';
import { useTheme } from '../context/ThemeContext';

// Configure a URL do seu backend aqui
const BACKEND_URL = 'http://ec2-54-197-29-146.compute-1.amazonaws.com:8000'; 

const RegistrationStep1Screen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    cpf: '',
    telefone: '',
    data_nascimento: '',
    senha: '',
    confirmPassword: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [lgpdConsents, setLgpdConsents] = useState({
    dataProcessing: false,
    termsAndConditions: false,
    dataSharing: false,
  });

  const [showConsentDetails, setShowConsentDetails] = useState({
    dataProcessing: false,
    termsAndConditions: false,
    dataSharing: false,
  });

  const [consentErrors, setConsentErrors] = useState({
    dataProcessing: false,
    termsAndConditions: false,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpa erros de validação quando o usuário começa a digitar
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      // Formato ISO para o backend (YYYY-MM-DD)
      const formattedDate = date.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, data_nascimento: formattedDate }));
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00'); // Adiciona hora para evitar problemas de timezone
    return date.toLocaleDateString('pt-BR');
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validação de nome
    if (!formData.nome_completo.trim()) {
      errors.push('Nome completo é obrigatório');
    } else if (formData.nome_completo.trim().split(' ').length < 2) {
      errors.push('Digite nome e sobrenome');
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.push('E-mail é obrigatório');
    } else if (!emailRegex.test(formData.email)) {
      errors.push('E-mail inválido');
    }

    // Validação de CPF (básica - apenas formato)
    const cpfClean = formData.cpf.replace(/\D/g, '');
    if (!cpfClean) {
      errors.push('CPF é obrigatório');
    } else if (cpfClean.length !== 11) {
      errors.push('CPF deve ter 11 dígitos');
    }

    // Validação de telefone
    const phoneClean = formData.telefone.replace(/\D/g, '');
    if (!phoneClean) {
      errors.push('Telefone é obrigatório');
    } else if (phoneClean.length < 10 || phoneClean.length > 11) {
      errors.push('Telefone inválido');
    }

    // Validação de data de nascimento
    if (!formData.data_nascimento) {
      errors.push('Data de nascimento é obrigatória');
    } else {
      const birthDate = new Date(formData.data_nascimento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        errors.push('Você deve ter pelo menos 18 anos');
      }
    }

    // Validação de senha
    if (!formData.senha) {
      errors.push('Senha é obrigatória');
    } else if (formData.senha.length < 6) {
      errors.push('Senha deve ter no mínimo 6 caracteres');
    }

    // Validação de confirmação de senha
    if (formData.senha !== formData.confirmPassword) {
      errors.push('As senhas não coincidem');
    }

    // Validação de consentimentos
    if (!lgpdConsents.dataProcessing) {
      errors.push('Aceite o processamento de dados');
    }
    if (!lgpdConsents.termsAndConditions) {
      errors.push('Aceite os termos de uso');
    }

    return { isValid: errors.length === 0, errors };
  };

  const sendToBackend = async (userData: any) => {
    try {
      console.log('Enviando dados para:', `${BACKEND_URL}/usuarios/`);
      console.log('Dados:', JSON.stringify(userData, null, 2));

      const response = await fetch(`${BACKEND_URL}/usuarios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Status da resposta:', response.status);

      const responseText = await response.text();
      console.log('Resposta do servidor:', responseText);

      // Tenta fazer parse do JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Erro ao fazer parse da resposta:', e);
        throw new Error('Resposta inválida do servidor');
      }

      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { 
          success: false, 
          error: result.message || result.error || 'Erro ao criar conta' 
        };
      }
    } catch (error: any) {
      console.error('Erro na requisição:', error);
      return { 
        success: false, 
        error: error.message || 'Erro de conexão. Verifique sua internet e tente novamente.' 
      };
    }
  };

  const handleNext = async () => {
    // Limpa erros anteriores
    setValidationErrors([]);
    setConsentErrors({
      dataProcessing: false,
      termsAndConditions: false,
    });

    // Valida o formulário
    const validation = validateForm();
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      
      // Marca erros de consentimento se houver
      setConsentErrors({
        dataProcessing: !lgpdConsents.dataProcessing,
        termsAndConditions: !lgpdConsents.termsAndConditions,
      });

      Alert.alert(
        'Erro de Validação',
        validation.errors.join('\n'),
        [{ text: 'OK' }]
      );
      return;
    }

    // Prepara dados para o backend (remove confirmPassword e limpa formatação)
    const backendData = {
      cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação
      email: formData.email.trim().toLowerCase(),
      nome_completo: formData.nome_completo.trim(),
      telefone: formData.telefone.replace(/\D/g, ''), // Remove formatação
      data_nascimento: formData.data_nascimento,
      senha: formData.senha,
    };

    // Inicia loading
    setIsLoading(true);

    try {
      // Envia para o backend
      const result = await sendToBackend(backendData);

      if (result.success) {
        Alert.alert(
          'Sucesso!',
          'Conta criada com sucesso!',
          [
            {
              text: 'Continuar',
              onPress: () => {
                // Navega para próxima tela passando os dados necessários
                navigation.navigate('RegistrationStep2' as never, {
                  userId: result.data?.id || result.data?.user_id,
                  email: formData.email,
                } as never);
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          'Erro ao Criar Conta',
          result.error,
          [{ text: 'Tentar Novamente' }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro inesperado. Tente novamente.',
        [{ text: 'OK' }]
      );
      console.error('Erro no handleNext:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConsentChange = (consent: string, value: boolean) => {
    setLgpdConsents(prev => ({ ...prev, [consent]: value }));
    
    // Limpa erro quando consentimento é dado
    if (value && consentErrors[consent as keyof typeof consentErrors]) {
      setConsentErrors(prev => ({ ...prev, [consent]: false }));
    }
  };

  const toggleConsentDetails = (consent: string) => {
    setShowConsentDetails(prev => ({ 
      ...prev, 
      [consent]: !prev[consent as keyof typeof prev] 
    }));
  };

  const openDocument = async (type: 'privacy' | 'terms') => {
    const urls = {
      privacy: 'https://sophisenne.github.io/Mithril/docs/LGPD/',
      terms: 'https://sophisenne.github.io/Mithril/docs/LGPD/',
    };

    const url = urls[type];

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o documento.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um problema ao abrir o documento.');
    }
  };

  const isFormValid = () => {
    return (
      formData.nome_completo.trim() &&
      formData.email.trim() &&
      formData.cpf.replace(/\D/g, '').length === 11 &&
      formData.telefone.replace(/\D/g, '').length >= 10 &&
      formData.data_nascimento &&
      formData.senha.length >= 6 &&
      formData.senha === formData.confirmPassword &&
      lgpdConsents.dataProcessing &&
      lgpdConsents.termsAndConditions
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              Cadastro
            </Text>
            <View style={styles.placeholder} />
          </View>

          <Progress value={33} style={styles.progress} />
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            Etapa 1 de 3
          </Text>
        </View>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <View style={styles.errorContainer}>
            <View style={styles.errorHeader}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.errorTitle}>Corrija os seguintes erros:</Text>
            </View>
            {validationErrors.map((error, index) => (
              <Text key={index} style={styles.errorItem}>• {error}</Text>
            ))}
          </View>
        )}

        {/* Form */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Dados Pessoais
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Preencha suas informações básicas
            </Text>
          </View>

          <Card style={styles.formCard} padding="large">
            <Input
              label="Nome Completo"
              placeholder="Digite seu nome completo"
              value={formData.nome_completo}
              onChangeText={(text) => handleInputChange('nome_completo', text)}
            />

            <Input
              label="E-mail"
              placeholder="seu@email.com"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="CPF"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChangeText={(text) => handleInputChange('cpf', text)}
              keyboardType="numeric"
              maxLength={14}
            />

            <Input
              label="Telefone"
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChangeText={(text) => handleInputChange('telefone', text)}
              keyboardType="phone-pad"
              maxLength={15}
            />

            {/* Data de Nascimento */}
            <View style={styles.dateInputContainer}>
              <Text style={[styles.dateLabel, { color: theme.colors.text }]}>
                Data de Nascimento
              </Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[
                  styles.dateText,
                  { color: formData.data_nascimento ? theme.colors.text : theme.colors.textSecondary }
                ]}>
                  {formData.data_nascimento ? formatDateForDisplay(formData.data_nascimento) : 'Selecione sua data de nascimento'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Input
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              value={formData.senha}
              onChangeText={(text) => handleInputChange('senha', text)}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <Input
              label="Confirmar Senha"
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              secureTextEntry={true}
            />
          </Card>

          {/* LGPD Consent */}
          <Card style={styles.consentCard} padding="large">
            <View style={styles.consentHeader}>
              <Text style={[styles.consentTitle, { color: theme.colors.text }]}>
                Consentimento de Dados - LGPD
              </Text>
              <Text style={[styles.consentSubtitle, { color: theme.colors.textSecondary }]}>
                Para continuar, você deve aceitar os itens obrigatórios
              </Text>
            </View>

            {/* Mandatory Consents */}
            <View style={styles.mandatorySection}>
              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
                Obrigatórios *
              </Text>
              
              {/* Data Processing Consent */}
              <View style={[
                styles.consentItemContainer,
                consentErrors.dataProcessing && styles.consentItemError
              ]}>
                <Checkbox
                  checked={lgpdConsents.dataProcessing}
                  onPress={() => handleConsentChange('dataProcessing', !lgpdConsents.dataProcessing)}
                  label="Processamento de Dados Pessoais"
                  style={styles.consentItem}
                />
                <Text style={[styles.consentDescription, { color: theme.colors.textSecondary }]}>
                  Autorizo o uso dos meus dados para funcionamento da plataforma.
                </Text>
                
                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => toggleConsentDetails('dataProcessing')}
                  accessibilityLabel="Ver detalhes sobre processamento de dados"
                >
                  <Text style={[styles.detailsButtonText, { color: theme.colors.primary }]}>
                    {showConsentDetails.dataProcessing ? 'Ocultar detalhes' : 'Ver detalhes'}
                  </Text>
                  <Ionicons 
                    name={showConsentDetails.dataProcessing ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color={theme.colors.primary} 
                  />
                </TouchableOpacity>
                
                {showConsentDetails.dataProcessing && (
                  <View style={styles.detailsContent}>
                    <Text style={[styles.detailsText, { color: theme.colors.textSecondary }]}>
                      Inclui dados de identificação, contato e financeiros necessários para:
                    </Text>
                    <Text style={[styles.detailsList, { color: theme.colors.textSecondary }]}>
                      • Criação e gerenciamento da conta{'\n'}
                      • Processamento de transações{'\n'}
                      • Cumprimento de obrigações legais{'\n'}
                      • Suporte ao cliente
                    </Text>
                  </View>
                )}
                
                {consentErrors.dataProcessing && (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    Este consentimento é obrigatório
                  </Text>
                )}
              </View>

              {/* Terms and Conditions Consent */}
              <View style={[
                styles.consentItemContainer,
                consentErrors.termsAndConditions && styles.consentItemError
              ]}>
                <Checkbox
                  checked={lgpdConsents.termsAndConditions}
                  onPress={() => handleConsentChange('termsAndConditions', !lgpdConsents.termsAndConditions)}
                  label="Termos de Uso e Política de Privacidade"
                  style={styles.consentItem}
                />
                <Text style={[styles.consentDescription, { color: theme.colors.textSecondary }]}>
                  Declaro que li e aceito os termos da plataforma.
                </Text>
                
                <View style={styles.documentLinks}>
                  <TouchableOpacity 
                    style={styles.documentLink}
                    onPress={() => openDocument('privacy')}
                    accessibilityLabel="Abrir política de privacidade"
                  >
                    <Ionicons name="shield-checkmark" size={16} color={theme.colors.primary} />
                    <Text style={[styles.documentLinkText, { color: theme.colors.primary }]}>
                      Política de Privacidade
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {consentErrors.termsAndConditions && (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    Este consentimento é obrigatório
                  </Text>
                )}
              </View>
            </View>

            {/* Rights Information */}
            <View style={[styles.rightsInfo, { backgroundColor: `${theme.colors.primary}08` }]}>
              <View style={styles.rightsHeader}>
                <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
                <Text style={[styles.rightsTitle, { color: theme.colors.primary }]}>
                  Seus Direitos LGPD
                </Text>
              </View>
              <Text style={[styles.rightsText, { color: theme.colors.textSecondary }]}>
                Você pode revogar estes consentimentos a qualquer momento através do seu perfil ou entrando em contato conosco.
              </Text>
            </View>
          </Card>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomButton, { backgroundColor: theme.colors.surface }]}>
        <Button
          title={isLoading ? 'Processando...' : 'Continuar'}
          onPress={handleNext}
          disabled={!isFormValid() || isLoading}
          style={styles.continueButton}
        />
        {isLoading && (
          <ActivityIndicator 
            size="small" 
            color={theme.colors.primary} 
            style={styles.loadingIndicator}
          />
        )}
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
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
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 36,
  },
  progress: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
  errorItem: {
    fontSize: 13,
    color: '#991b1b',
    marginLeft: 28,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formCard: {
    marginBottom: 24,
  },
  consentCard: {
    marginBottom: 24,
  },
  consentHeader: {
    marginBottom: 20,
  },
  consentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  consentSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  mandatorySection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  consentItemContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  consentItemError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  consentItem: {
    marginBottom: 8,
  },
  consentDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 32,
    marginBottom: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 32,
    marginBottom: 8,
    paddingVertical: 4,
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 4,
  },
  detailsContent: {
    marginLeft: 32,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
  },
  detailsText: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  detailsList: {
    fontSize: 12,
    lineHeight: 18,
  },
  documentLinks: {
    flexDirection: 'row',
    marginLeft: 32,
    marginTop: 8,
    gap: 16,
  },
  documentLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  documentLinkText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 32,
    marginTop: 4,
  },
  rightsInfo: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  rightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  rightsText: {
    fontSize: 12,
    lineHeight: 16,
  },
  bottomSpacing: {
    height: 100,
  },
  bottomButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  continueButton: {
    width: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    right: 40,
    top: 28,
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  dateInput: {
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
  dateText: {
    fontSize: 16,
    flex: 1,
  },
});

export default RegistrationStep1Screen;