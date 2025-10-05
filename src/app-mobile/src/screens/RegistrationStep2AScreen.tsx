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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Progress from '../components/ui/Progress';
import { useTheme } from '../context/ThemeContext';

interface SecurityQuestion {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

interface RouteParams {
  selectedQuestions: SecurityQuestion[];
  answers: { [key: number]: string };
}

const RegistrationStep2AScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  
  const { selectedQuestions, answers = {} } = route.params as RouteParams;
  
  // Get first half of questions
  const firstHalfQuestions = selectedQuestions.slice(0, Math.ceil(selectedQuestions.length / 2));
  
  const [questionAnswers, setQuestionAnswers] = useState<{ [key: number]: string }>(answers);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    // Validate that all questions in this screen are answered
    const unansweredQuestions = firstHalfQuestions.filter(
      question => !questionAnswers[question.id]?.trim()
    );

    if (unansweredQuestions.length > 0) {
      Alert.alert(
        'Perguntas não respondidas',
        'Por favor, responda todas as perguntas antes de continuar.'
      );
      return;
    }

    // Navigate to next screen with all answers
    navigation.navigate('RegistrationStep2B' as never, {
      selectedQuestions,
      answers: questionAnswers
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const QuestionCard = ({ question }: { question: SecurityQuestion }) => {
    const answer = questionAnswers[question.id] || '';

    return (
      <Card style={styles.questionCard} padding="large">
        <View style={styles.questionHeader}>
          <View style={[styles.questionIcon, { backgroundColor: theme.colors.primary }]}>
            <Ionicons
              name={question.icon}
              size={20}
              color="white"
            />
          </View>
          <View style={styles.questionText}>
            <Text style={[styles.questionTitle, { color: theme.colors.text }]}>
              {question.title}
            </Text>
            <Text style={[styles.questionDescription, { color: theme.colors.textSecondary }]}>
              {question.description}
            </Text>
          </View>
        </View>

        <View style={styles.answerSection}>
          <Input
            label="Sua resposta"
            placeholder="Digite sua resposta aqui..."
            value={answer}
            onChangeText={(text) => handleAnswerChange(question.id, text)}
            multiline={true}
            numberOfLines={3}
            style={styles.answerInput}
          />
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              Perguntas de Segurança
            </Text>
            <View style={styles.placeholder} />
          </View>

          <Progress value={50} style={styles.progress} />
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            Parte 1 de 2
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Responda as Perguntas
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Responda as perguntas de segurança que você selecionou
            </Text>
            <View style={[styles.infoBox, { backgroundColor: `${theme.colors.primary}10` }]}>
              <Ionicons name="information-circle" size={16} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.primary }]}>
                Suas respostas serão usadas para verificar sua identidade em caso de necessidade
              </Text>
            </View>
          </View>

          <View style={styles.questionsContainer}>
            {firstHalfQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </View>

          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              Respondidas: {firstHalfQuestions.filter(q => questionAnswers[q.id]?.trim()).length}/{firstHalfQuestions.length}
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
          disabled={firstHalfQuestions.some(q => !questionAnswers[q.id]?.trim())}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(30, 64, 175, 0.2)',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  questionsContainer: {
    marginBottom: 24,
  },
  questionCard: {
    marginBottom: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  answerSection: {
    marginTop: 8,
  },
  answerInput: {
    minHeight: 80,
  },
  progressInfo: {
    alignItems: 'center',
    marginBottom: 16,
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

export default RegistrationStep2AScreen;
