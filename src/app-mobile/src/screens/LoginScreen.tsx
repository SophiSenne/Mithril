import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useTheme } from '../context/ThemeContext';

// Configuração da API
const API_BASE_URL = 'http://ec2-54-197-29-146.compute-1.amazonaws.com:8000'; // Ajuste para seu URL

// Armazenamento simples em memória para device_id
let cachedDeviceId: string | null = null;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    cpf: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState<string>('');

  // Gera ou recupera o device_id
  useEffect(() => {
    getOrCreateDeviceId();
  }, []);

  const getOrCreateDeviceId = () => {
    try {
      // Verifica se já existe um device_id em cache
      if (!cachedDeviceId) {
        // Gera um novo device_id único baseado em timestamp e plataforma
        const platform = Platform.OS;
        const timestamp = Date.now();
        const randomPart = Math.random().toString(36).substring(2, 15);
        
        cachedDeviceId = `${platform}-${timestamp}-${randomPart}`;
      }
      
      setDeviceId(cachedDeviceId);
    } catch (error) {
      console.error('Erro ao obter device_id:', error);
      // Fallback: gera um ID simples baseado em timestamp
      const fallbackId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setDeviceId(fallbackId);
    }
  };

  // Formata CPF removendo caracteres especiais
  const formatCPF = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');
    
    // Aplica máscara de CPF
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return text;
  };

  const handleCPFChange = (text: string) => {
    const formatted = formatCPF(text);
    setCredentials({ ...credentials, cpf: formatted });
  };

  const handleLogin = async () => {
    // Validações
    if (!credentials.cpf || !credentials.password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Remove formatação do CPF para enviar ao backend
    const cpfLimpo = credentials.cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
      Alert.alert('Erro', 'CPF inválido. Deve conter 11 dígitos.');
      return;
    }

    if (!deviceId) {
      Alert.alert('Erro', 'Não foi possível identificar o dispositivo');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cpf: cpfLimpo,
          senha: credentials.password,
          device_id: deviceId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login bem-sucedido
        // Você pode salvar as informações em um contexto/estado global
        // ou usar uma biblioteca de estado como Redux, Zustand, etc.
        
        Alert.alert('Sucesso', `Bem-vindo, ${data.nome}!`);
        navigation.navigate('MainTabs' as never);
      } else {
        // Erro de autenticação
        Alert.alert(
          'Erro de Login',
          data.detail || 'CPF ou senha inválidos'
        );
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('RegistrationStep1' as never);
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar Senha', 'Funcionalidade em desenvolvimento');
  };

  const handleBiometricLogin = () => {
    Alert.alert('Biometria', 'Funcionalidade em desenvolvimento');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
              <Image
                source={require('../../assets/logo.jpeg')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Mithril</Text>
            <Text style={styles.subtitle}>Crédito e investimento descomplicado</Text>
          </View>

          {/* Login Form */}
          <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.formContent}>
              <Text style={[styles.formTitle, { color: theme.colors.text }]}>
                Bem-vindo de volta
              </Text>
              <Text style={[styles.formSubtitle, { color: theme.colors.textSecondary }]}>
                Acesse sua conta para continuar
              </Text>

              <View style={styles.form}>
                <Input
                  label="CPF"
                  placeholder="000.000.000-00"
                  value={credentials.cpf}
                  onChangeText={handleCPFChange}
                  keyboardType="numeric"
                  maxLength={14}
                  leftIcon="card"
                />

                <Input
                  label="Senha"
                  placeholder="Digite sua senha"
                  value={credentials.password}
                  onChangeText={(text) => setCredentials({ ...credentials, password: text })}
                  secureTextEntry={!showPassword}
                  rightIcon={showPassword ? 'eye-off' : 'eye'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={handleForgotPassword}
                >
                  <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                    Esqueceu a senha?
                  </Text>
                </TouchableOpacity>

                <Button
                  title="Entrar"
                  onPress={handleLogin}
                  loading={loading}
                  style={styles.loginButton}
                />

                <View style={styles.divider}>
                  <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
                  <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
                    ou
                  </Text>
                  <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
                </View>

                <Button
                  title="Entrar com biometria"
                  onPress={handleBiometricLogin}
                  variant="outline"
                  leftIcon="finger-print"
                  style={styles.biometricButton}
                />
              </View>

              <View style={styles.registerContainer}>
                <Text style={[styles.registerText, { color: theme.colors.textSecondary }]}>
                  Novo por aqui?{' '}
                </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={[styles.registerLink, { color: theme.colors.primary }]}>
                    Criar conta
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  formContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  biometricButton: {
    marginBottom: 32,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;