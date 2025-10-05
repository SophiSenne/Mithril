import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useTheme } from '../context/ThemeContext';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('MainTabs' as never);
    }, 1500);
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
                  label="E-mail"
                  placeholder="seu@email.com"
                  value={credentials.email}
                  onChangeText={(text) => setCredentials({ ...credentials, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="mail"
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
