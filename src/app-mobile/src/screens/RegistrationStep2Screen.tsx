import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Progress from '../components/ui/Progress';
import { useTheme } from '../context/ThemeContext';

interface SecurityQuestion {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const RegistrationStep2Screen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  const securityQuestions: SecurityQuestion[] = [
    {
      id: 1,
      icon: 'shield',
      title: 'Qual o nome da sua mãe?',
      description: 'Pergunta clássica de segurança',
    },
    {
      id: 2,
      icon: 'key',
      title: 'Qual o nome do seu primeiro animal de estimação?',
      description: 'Uma lembrança especial da infância',
    },
    {
      id: 3,
      icon: 'eye',
      title: 'Qual o nome da sua primeira escola?',
      description: 'Onde tudo começou',
    },
    {
      id: 4,
      icon: 'person-check',
      title: 'Qual a cidade onde você nasceu?',
      description: 'Sua cidade natal',
    },
  ];

  const handleQuestionSelect = (questionId: number) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else if (selectedQuestions.length < 2) {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleNext = () => {
    if (selectedQuestions.length !== 2) {
      Alert.alert('Erro', 'Por favor, selecione exatamente 2 perguntas de segurança');
      return;
    }
    
    // Get the selected question objects
    const selectedQuestionObjects = securityQuestions.filter(q => 
      selectedQuestions.includes(q.id)
    );
    
    // Navigate to the first answer screen
    navigation.navigate('RegistrationStep2A' as never, {
      selectedQuestions: selectedQuestionObjects,
      answers: {}
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const QuestionCard = ({ question }: { question: SecurityQuestion }) => {
    const isSelected = selectedQuestions.includes(question.id);

    return (
      <Card
        onPress={() => handleQuestionSelect(question.id)}
        style={[
          styles.questionCard,
          isSelected && {
            borderColor: theme.colors.primary,
            backgroundColor: `${theme.colors.primary}05`,
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          },
        ]}
        padding="medium"
      >
        <View style={styles.questionContent}>
          <View
            style={[
              styles.questionIcon,
              {
                backgroundColor: isSelected ? theme.colors.primary : theme.colors.gray.light,
              },
            ]}
          >
            <Ionicons
              name={question.icon}
              size={20}
              color={isSelected ? 'white' : theme.colors.textSecondary}
            />
          </View>
          <View style={styles.questionText}>
            <Text
              style={[
                styles.questionTitle,
                {
                  color: isSelected ? theme.colors.primary : theme.colors.text,
                },
              ]}
            >
              {question.title}
            </Text>
            <Text style={[styles.questionDescription, { color: theme.colors.textSecondary }]}>
              {question.description}
            </Text>
          </View>
          {isSelected && (
            <View style={[styles.selectedIndicator, { backgroundColor: theme.colors.primary }]}>
              <View style={styles.selectedDot} />
            </View>
          )}
        </View>
      </Card>
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

          <Progress value={66} style={styles.progress} />
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            Etapa 2 de 3
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Segurança
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Escolha 2 perguntas de segurança para proteger sua conta
            </Text>
            <View style={[styles.infoBox, { backgroundColor: `${theme.colors.primary}10` }]}>
              <Text style={[styles.infoText, { color: theme.colors.primary }]}>
                Essas perguntas ajudam a manter sua conta segura
              </Text>
            </View>
          </View>

          <View style={styles.questionsContainer}>
            {securityQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </View>

          <View style={styles.selectionInfo}>
            <Text style={[styles.selectionText, { color: theme.colors.textSecondary }]}>
              Selecionadas: {selectedQuestions.length}/2
            </Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomButton, { backgroundColor: theme.colors.surface }]}>
        <Button
          title="Continuar"
          onPress={handleNext}
          disabled={selectedQuestions.length !== 2}
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
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  infoBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(30, 64, 175, 0.2)',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  questionsContainer: {
    marginBottom: 24,
  },
  questionCard: {
    marginBottom: 16,
  },
  questionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  questionText: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  questionDescription: {
    fontSize: 14,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  selectionInfo: {
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 14,
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

export default RegistrationStep2Screen;
