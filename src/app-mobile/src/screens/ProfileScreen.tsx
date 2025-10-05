import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const InfoField = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoField}>
      <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
        {label}
      </Text>
      <View style={[styles.infoValueContainer, { backgroundColor: '#f8fafc' }]}>
        <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
          {value}
        </Text>
      </View>
    </View>
  );

  const SettingsItem = ({
    title,
    icon,
    onPress,
    textColor = theme.colors.text,
  }: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    textColor?: string;
  }) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingsItemContent}>
        <Ionicons name={icon} size={20} color={textColor} />
        <Text style={[styles.settingsItemText, { color: textColor }]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Azul */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary || '#1e40af' }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Meu Perfil</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {}}
            >
            </TouchableOpacity>
          </View>

          {/* Avatar e Nome */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={48} color="white" />
              </View>
            </View>
            <Text style={styles.profileName}>João Silva</Text>
            <Text style={styles.memberSince}>Membro desde Janeiro 2024</Text>
          </View>
        </View>

        {/* Informações Pessoais */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color={theme.colors.text} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Informações Pessoais
            </Text>
          </View>

          <Card style={styles.infoCard} padding="none">
            <View style={styles.infoContent}>
              <InfoField label="Nome Completo" value="João Silva" />
              <InfoField label="E-mail" value="joao.silva@email.com" />
              <InfoField label="Telefone" value="(11) 99999-9999" />
              <InfoField label="Endereço" value="Rua das Flores, 123, São Paulo - SP" />
            </View>
          </Card>
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
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingBottom: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    margin: 15
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    overflow: 'hidden',
  },
  infoContent: {
    padding: 16,
  },
  infoField: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoValueContainer: {
    padding: 12,
    borderRadius: 8,
  },
  infoValue: {
    fontSize: 14,
  },
  settingsCard: {
    overflow: 'hidden',
  },
  settingsItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ProfileScreen;