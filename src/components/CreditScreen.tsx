import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, CreditCard, DollarSign, Clock } from 'lucide-react';
import { useState } from 'react';

interface CreditScreenProps {
  onBack: () => void;
}

export default function CreditScreen({ onBack }: CreditScreenProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  const creditOptions = [
    {
      id: 1,
      title: 'Crédito Pessoal QI Tech',
      subtitle: 'Para realizar seus projetos',
      minAmount: 1000,
      maxAmount: 50000,
      rate: 1.89,
      period: '12 a 48 meses',
      approval: '24h',
      icon: DollarSign,
      featured: true,
      benefits: ['Sem consulta ao SPC/Serasa', 'Aprovação rápida', 'Taxa competitiva']
    },
    {
      id: 2,
      title: 'Cartão de Crédito',
      subtitle: 'Limite pré-aprovado',
      minAmount: 500,
      maxAmount: 20000,
      rate: 0.0,
      period: 'Rotativo',
      approval: 'Instantâneo',
      icon: CreditCard,
      featured: false,
      benefits: ['Sem anuidade', 'Programa de pontos', 'Aceito mundialmente']
    },
    {
      id: 3,
      title: 'Antecipação do 13º',
      subtitle: 'Receba seu 13º salário antecipado',
      minAmount: 500,
      maxAmount: 10000,
      rate: 1.25,
      period: '3 a 11 meses',
      approval: '2h',
      icon: Clock,
      featured: false,
      benefits: ['Taxa reduzida', 'Desconto na folha', 'Processo simples']
    },
    {
      id: 4,
      title: 'Crédito com Garantia',
      subtitle: 'Melhores condições com garantia',
      minAmount: 5000,
      maxAmount: 200000,
      rate: 0.99,
      period: '12 a 120 meses',
      approval: '48h',
      icon: Calculator,
      featured: false,
      benefits: ['Menor taxa de juros', 'Prazos maiores', 'Valores elevados']
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const calculateInstallment = (amount: number, rate: number, months: number = 12) => {
    if (rate === 0) return amount / months;
    const monthlyRate = rate / 100;
    const installment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return installment;
  };

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-success-custom to-green-600 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Crédito</h1>
          <div className="w-9"></div>
        </div>

        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Crédito Disponível</h2>
          <p className="text-3xl font-bold mb-2">R$ 75.000</p>
          <p className="text-white/80">
            Baseado na análise do seu perfil
          </p>
        </div>
      </div>

      {/* Quick Simulator */}
      <div className="px-6 -mt-4 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4">Simulador Rápido</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-dark mb-2 block">
                Quanto você precisa?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5000, 15000, 30000].map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedAmount(amount)}
                    className={selectedAmount === amount ? "bg-success-custom hover:bg-success-custom/90" : ""}
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </div>
            </div>
            
            {selectedAmount > 0 && (
              <div className="bg-success-custom/10 border border-success-custom/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-medium">Parcela em 12x:</span>
                  <span className="font-bold text-success-custom">
                    {formatCurrency(calculateInstallment(selectedAmount, 1.89, 12))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-medium">Taxa mensal:</span>
                  <span className="font-bold text-success-custom">1,89%</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Credit Options */}
      <div className="px-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-dark">Opções de Crédito</h3>
        
        {creditOptions.map((option) => {
          const Icon = option.icon;
          
          return (
            <Card 
              key={option.id} 
              className={`p-6 hover:shadow-lg transition-all duration-200 ${
                option.featured ? 'border-success-custom bg-success-custom/5' : ''
              }`}
            >
              {option.featured && (
                <div className="bg-success-custom text-white text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
                  MELHOR OFERTA
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-success-custom/10 rounded-full">
                  <Icon className="w-6 h-6 text-success-custom" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-dark mb-1">{option.title}</h4>
                  <p className="text-sm text-gray-medium mb-2">{option.subtitle}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-medium">Limite: </span>
                      <span className="font-medium">
                        {formatCurrency(option.minAmount)} - {formatCurrency(option.maxAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-medium">Prazo: </span>
                      <span className="font-medium">{option.period}</span>
                    </div>
                    <div>
                      <span className="text-gray-medium">Taxa: </span>
                      <span className="font-medium text-success-custom">
                        {option.rate === 0 ? 'Sem juros' : `${option.rate}% a.m.`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-medium">Aprovação: </span>
                      <span className="font-medium">{option.approval}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-dark mb-2">Benefícios:</h5>
                <div className="flex flex-wrap gap-2">
                  {option.benefits.map((benefit, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-dark text-xs rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-success-custom hover:bg-success-custom/90 text-white"
                  size="sm"
                >
                  Solicitar Agora
                </Button>
                <Button 
                  variant="outline" 
                  className="border-success-custom text-success-custom hover:bg-success-custom/5"
                  size="sm"
                >
                  Simular
                </Button>
              </div>
            </Card>
          );
        })}

        <div className="text-center py-6">
          <p className="text-sm text-gray-medium mb-4">
            Dúvidas sobre crédito?
          </p>
          <Button variant="outline" className="border-success-custom text-success-custom">
            Falar com Consultor
          </Button>
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  );
}