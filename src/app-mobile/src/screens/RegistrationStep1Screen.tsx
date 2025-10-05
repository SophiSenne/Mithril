import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Checkbox from '../components/ui/Checkbox';
import Progress from '../components/ui/Progress';
import { useTheme } from '../context/ThemeContext';

const RegistrationStep1Screen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validate consents first
    const hasConsentErrors = !lgpdConsents.dataProcessing || !lgpdConsents.termsAndConditions;
    
    if (hasConsentErrors) {
      setConsentErrors({
        dataProcessing: !lgpdConsents.dataProcessing,
        termsAndConditions: !lgpdConsents.termsAndConditions,
      });
      Alert.alert(
        'Consentimento Necessário', 
        'Para continuar, você deve aceitar o processamento de dados pessoais e os termos de uso.'
      );
      return;
    }

    if (!isFormValid()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }
    navigation.navigate('RegistrationStep2' as never);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConsentChange = (consent: string, value: boolean) => {
    setLgpdConsents(prev => ({ ...prev, [consent]: value }));
    
    // Clear error when consent is given
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
      formData.name &&
      formData.email &&
      formData.cpf &&
      formData.phone &&
      formData.address &&
      formData.password &&
      formData.password === formData.confirmPassword &&
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
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
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
            />

            <Input
              label="Telefone"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
            />

            <Input
              label="Endereço"
              placeholder="Rua, número, bairro, cidade"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />

            <Input
              label="Senha"
              placeholder="Crie uma senha segura"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
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

          {/* LGPD Consent - Improved Version */}
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
          title="Continuar"
          onPress={handleNext}
          disabled={!isFormValid()}
          style={styles.continueButton}
        />
      </View>
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
  optionalSection: {
    marginBottom: 20,
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
});

export default RegistrationStep1Screen;
