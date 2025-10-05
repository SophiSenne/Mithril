import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';

const InvestorProfileScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Perfil do Investidor
          </Text>
          <Card style={styles.card} padding="large">
            <Text style={[styles.cardText, { color: theme.colors.text }]}>
              Informações do perfil de investidor em desenvolvimento
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollView: { flex: 1 },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  card: { marginBottom: 16 },
  cardText: { fontSize: 16, textAlign: 'center' },
});

export default InvestorProfileScreen;
