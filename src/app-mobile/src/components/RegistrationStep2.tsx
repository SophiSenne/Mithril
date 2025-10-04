import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Shield, Key, Eye, UserCheck } from 'lucide-react';

interface RegistrationStep2Props {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function RegistrationStep2({ onNext, onBack }: RegistrationStep2Props) {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  const securityQuestions = [
    {
      id: 1,
      icon: Shield,
      title: 'Qual o nome da sua mãe?',
      description: 'Pergunta clássica de segurança'
    },
    {
      id: 2,
      icon: Key,
      title: 'Qual o nome do seu primeiro animal de estimação?',
      description: 'Uma lembrança especial da infância'
    },
    {
      id: 3,
      icon: Eye,
      title: 'Qual o nome da sua primeira escola?',
      description: 'Onde tudo começou'
    },
    {
      id: 4,
      icon: UserCheck,
      title: 'Qual a cidade onde você nasceu?',
      description: 'Sua cidade natal'
    }
  ];

  const handleQuestionSelect = (questionId: number) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else if (selectedQuestions.length < 2) {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleNext = () => {
    onNext({ securityQuestions: selectedQuestions });
  };

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-dark" />
          </button>
          <h1 className="text-gray-dark text-lg font-semibold">Cadastro</h1>
          <div className="w-9"></div>
        </div>

        <Progress value={66} className="mb-4" />
        <p className="text-sm text-gray-medium text-center">Etapa 2 de 3</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-dark mb-2">Segurança</h2>
          <p className="text-gray-medium mb-4">
            Escolha 2 perguntas de segurança para proteger sua conta
          </p>
          <div className="bg-qi-blue/10 border border-qi-blue/20 rounded-lg p-4">
            <p className="text-sm text-qi-blue font-medium">
              Essas perguntas ajudam a manter sua conta segura
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {securityQuestions.map((question) => {
            const Icon = question.icon;
            const isSelected = selectedQuestions.includes(question.id);
            
            return (
              <Card 
                key={question.id}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-qi-blue bg-qi-blue/5 shadow-md' 
                    : 'hover:shadow-md border-gray-200'
                }`}
                onClick={() => handleQuestionSelect(question.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    isSelected 
                      ? 'bg-qi-blue text-white' 
                      : 'bg-gray-100 text-gray-medium'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      isSelected ? 'text-qi-blue' : 'text-gray-dark'
                    }`}>
                      {question.title}
                    </h3>
                    <p className="text-sm text-gray-medium">
                      {question.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-qi-blue rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-medium">
            Selecionadas: {selectedQuestions.length}/2
          </p>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg">
        <Button 
          onClick={handleNext}
          disabled={selectedQuestions.length !== 2}
          className="w-full bg-qi-blue hover:bg-qi-blue/90 text-white"
        >
          Continuar
        </Button>
      </div>

      <div className="h-20"></div>
    </div>
  );
}