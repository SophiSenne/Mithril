import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingDown, TrendingUp, BarChart3 } from 'lucide-react';

interface RegistrationStep3Props {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function RegistrationStep3({ onComplete, onBack }: RegistrationStep3Props) {
  const [selectedProfile, setSelectedProfile] = useState<string>('');

  const investmentProfiles = [
    {
      id: 'conservative',
      title: 'Conservador',
      subtitle: 'Segurança em primeiro lugar',
      description: 'Prefere investimentos mais seguros com menor risco de perda',
      icon: TrendingDown,
      color: 'success-custom',
      bgColor: 'success-custom/10',
      borderColor: 'success-custom/20',
      features: ['Baixo risco', 'Retorno estável', 'Liquidez alta']
    },
    {
      id: 'moderate',
      title: 'Moderado',
      subtitle: 'Equilibrio entre risco e retorno',
      description: 'Busca um equilíbrio entre segurança e rentabilidade',
      icon: BarChart3,
      color: 'qi-blue',
      bgColor: 'qi-blue/10',
      borderColor: 'qi-blue/20',
      features: ['Risco médio', 'Retorno balanceado', 'Diversificação']
    },
    {
      id: 'aggressive',
      title: 'Arrojado',
      subtitle: 'Busca maiores retornos',
      description: 'Aceita maiores riscos em busca de retornos superiores',
      icon: TrendingUp,
      color: 'error-custom',
      bgColor: 'error-custom/10',
      borderColor: 'error-custom/20',
      features: ['Alto risco', 'Retorno potencial alto', 'Estratégias avançadas']
    }
  ];

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfile(profileId);
  };

  const handleComplete = () => {
    onComplete({ investmentProfile: selectedProfile });
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

        <Progress value={100} className="mb-4" />
        <p className="text-sm text-gray-medium text-center">Etapa 3 de 3</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-dark mb-2">Perfil de Investimento</h2>
          <p className="text-gray-medium mb-4">
            Escolha o perfil que melhor se adapta aos seus objetivos
          </p>
          <div className="bg-qi-blue/10 border border-qi-blue/20 rounded-lg p-4">
            <p className="text-sm text-qi-blue font-medium">
              Você poderá alterar seu perfil a qualquer momento
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {investmentProfiles.map((profile) => {
            const Icon = profile.icon;
            const isSelected = selectedProfile === profile.id;
            
            return (
              <Card 
                key={profile.id}
                className={`p-6 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? `border-${profile.color} bg-${profile.bgColor} shadow-lg` 
                    : 'hover:shadow-md border-gray-200'
                }`}
                onClick={() => handleProfileSelect(profile.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-full ${
                    isSelected 
                      ? `bg-${profile.color} text-white` 
                      : `bg-${profile.bgColor} text-${profile.color}`
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-lg font-bold ${
                        isSelected ? `text-${profile.color}` : 'text-gray-dark'
                      }`}>
                        {profile.title}
                      </h3>
                      {isSelected && (
                        <div className={`w-6 h-6 bg-${profile.color} rounded-full flex items-center justify-center`}>
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-medium mb-2">
                      {profile.subtitle}
                    </p>
                    <p className="text-sm text-gray-medium mb-3">
                      {profile.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.features.map((feature, index) => (
                        <span 
                          key={index}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isSelected 
                              ? `bg-${profile.color}/20 text-${profile.color}` 
                              : 'bg-gray-100 text-gray-medium'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg">
        <Button 
          onClick={handleComplete}
          disabled={!selectedProfile}
          className="w-full bg-qi-blue hover:bg-qi-blue/90 text-white"
        >
          Concluir Cadastro
        </Button>
      </div>

      <div className="h-20"></div>
    </div>
  );
}