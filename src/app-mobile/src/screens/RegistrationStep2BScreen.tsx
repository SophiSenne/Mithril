import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
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

interface RouteParams {
  selectedQuestions: SecurityQuestion[];
  answers: { [key: number]: string };
}

const RegistrationStep2BScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const { selectedQuestions, answers = {} } = route.params as RouteParams;

  // Get second half of questions
  const secondHalfQuestions = selectedQuestions.slice(Math.ceil(selectedQuestions.length / 2));

  const [questionAnswers, setQuestionAnswers] = useState<{ [key: number]: string }>(answers);

  // Memoizado para não recriar função a cada render
  const handleAnswerChange = useCallback(
    (questionId: number, answer: string) => {
      setQuestionAnswers((prev) => ({
        ...prev,
        [questionId]: answer,
      }));
    },
    []
  );

  const handleSubmit = () => {
    const unanswered = secondHalfQuestions.filter(
      (q) => !questionAnswers[q.id]?.trim()
    );
    if (unanswered.length > 0) {
      Alert.alert(
        'Perguntas não respondidas',
        'Por favor, responda todas as perguntas antes de continuar.'
      );
      return;
    }

    // Show confirmation dialogx'
    Alert.alert(
      'Confirmação',
      'Tem certeza de que suas respostas estão corretas? Elas serão usadas para verificar sua identidade.',
      [
        {
          text: 'Revisar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            // Navigate to next step with all answers
            navigation.navigate('RegistrationStep3' as never, {
              securityAnswers: questionAnswers
            });
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Memoizado para não recriar a cada render
  const QuestionCard = React.memo(({ question }: { question: SecurityQuestion }) => {
    const answer = questionAnswers[question.id] || '';

    return (
      <Card style={styles.questionCard} padding="large">
        <View style={styles.questionHeader}>
          <View style={[styles.questionIcon, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name={question.icon} size={20} color="white" />
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
          <TextInput
            placeholder="Digite sua resposta aqui..."
            placeholderTextColor={theme.colors.textSecondary}
            value={answer}
            onChangeText={(text) => handleAnswerChange(question.id, text)}
            multiline
            numberOfLines={3}
            style={[styles.answerInput, { color: theme.colors.text }]}
            blurOnSubmit={false}
            returnKeyType="default"
            onSubmitEditing={() => {}}
          />
        </View>
      </Card>
    );
  });

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

          <Progress value={75} style={styles.progress} />
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            Parte 2 de 2
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Finalize suas Respostas
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Complete as perguntas de segurança restantes
            </Text>
            <View style={[styles.infoBox, { backgroundColor: `${theme.colors.success}10` }]}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={[styles.infoText, { color: theme.colors.success }]}>
                Você está quase terminando! Revise suas respostas antes de continuar.
              </Text>
            </View>
          </View>

          <View style={styles.questionsContainer}>
            {secondHalfQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </View>

          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              Respondidas: {secondHalfQuestions.filter((q) => questionAnswers[q.id]?.trim()).length}/
              {secondHalfQuestions.length}
            </Text>
          </View>

          {/* Summary Card */}
          <Card style={styles.summaryCard} padding="large">
            <View style={styles.summaryHeader}>
              <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
              <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
                Resumo das Perguntas
              </Text>
            </View>
            <Text style={[styles.summaryText, { color: theme.colors.textSecondary }]}>
              Você selecionou {selectedQuestions.length} perguntas de segurança e respondeu todas elas. 
              Essas informações serão usadas para proteger sua conta e verificar sua identidade quando necessário.
            </Text>
            <View style={styles.summaryList}>
              {selectedQuestions.map((question, index) => (
                <View key={question.id} style={styles.summaryItem}>
                  <View style={[styles.summaryDot, { backgroundColor: theme.colors.primary }]} />
                  <Text style={[styles.summaryItemText, { color: theme.colors.textSecondary }]}>
                    {index + 1}. {question.title}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomButton, { backgroundColor: theme.colors.surface }]}>
        <Button
          title="Finalizar e Continuar"
          onPress={handleSubmit}
          disabled={secondHalfQuestions.some((q) => !questionAnswers[q.id]?.trim())}
          style={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollView: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backButton: { padding: 8, borderRadius: 20 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  placeholder: { width: 36 },
  progress: { marginBottom: 8 },
  progressText: { fontSize: 14, textAlign: 'center' },
  content: { paddingHorizontal: 24, paddingVertical: 24 },
  titleSection: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 16 },
  infoBox: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(30, 64, 175, 0.2)' },
  infoText: { fontSize: 14, fontWeight: '500', marginLeft: 8, flex: 1 },
  questionsContainer: { marginBottom: 24 },
  questionCard: { marginBottom: 20 },
  questionHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  questionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  questionText: { flex: 1 },
  questionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  questionDescription: { fontSize: 14 },
  answerSection: { marginTop: 8 },
  answerInput: { minHeight: 80, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8 },
  progressInfo: { alignItems: 'center', marginBottom: 16 },
  summaryCard: { marginBottom: 16 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  summaryTitle: { fontSize: 16, fontWeight: '600', marginLeft: 8 },
  summaryText: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  summaryList: { marginTop: 8 },
  summaryItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  summaryDot: { width: 6, height: 6, borderRadius: 3, marginRight: 12 },
  summaryItemText: { fontSize: 13, flex: 1 },
  bottomSpacing: { height: 100 },
  bottomButton: { paddingHorizontal: 24, paddingVertical: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  continueButton: { width: '100%' },
});

export default RegistrationStep2BScreen;
