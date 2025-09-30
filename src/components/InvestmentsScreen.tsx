import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Star, Shield, Zap } from 'lucide-react';

interface InvestmentsScreenProps {
  onBack: () => void;
}

export default function InvestmentsScreen({ onBack }: InvestmentsScreenProps) {
  const investmentSuggestions = [
    {
      id: 1,
      title: 'CDB Banco QI Tech',
      subtitle: 'Certificado de Depósito Bancário',
      return: '105% CDI',
      returnPercentage: 11.2,
      minAmount: 1000,
      period: '12 meses',
      risk: 'Baixo',
      liquidity: 'No vencimento',
      icon: Shield,
      featured: true,
      description: 'Investimento seguro com rentabilidade garantida'
    },
    {
      id: 2,
      title: 'Tesouro Direto IPCA+',
      subtitle: 'Título público indexado à inflação',
      return: 'IPCA + 5,8%',
      returnPercentage: 10.5,
      minAmount: 30,
      period: '5 anos',
      risk: 'Baixo',
      liquidity: 'Diária',
      icon: Shield,
      featured: false,
      description: 'Protegido contra a inflação'
    },
    {
      id: 3,
      title: 'LCI Banco QI Tech',
      subtitle: 'Letra de Crédito Imobiliário',
      return: '98% CDI',
      returnPercentage: 10.1,
      minAmount: 5000,
      period: '18 meses',
      risk: 'Baixo',
      liquidity: 'No vencimento',
      icon: Shield,
      featured: false,
      description: 'Isento de Imposto de Renda'
    },
    {
      id: 4,
      title: 'Fundo Multimercado',
      subtitle: 'Gestão ativa diversificada',
      return: '15,5% a.a.',
      returnPercentage: 15.5,
      minAmount: 100,
      period: 'Sem prazo',
      risk: 'Médio',
      liquidity: 'D+1',
      icon: TrendingUp,
      featured: false,
      description: 'Estratégia dinâmica de investimentos'
    },
    {
      id: 5,
      title: 'Fundo de Ações',
      subtitle: 'Investimento em bolsa de valores',
      return: '18,2% a.a.',
      returnPercentage: 18.2,
      minAmount: 100,
      period: 'Sem prazo',
      risk: 'Alto',
      liquidity: 'D+0',
      icon: Zap,
      featured: false,
      description: 'Alto potencial de retorno'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Baixo':
        return 'text-success-custom bg-success-custom/10';
      case 'Médio':
        return 'text-qi-blue bg-qi-blue/10';
      case 'Alto':
        return 'text-error-custom bg-error-custom/10';
      default:
        return 'text-gray-medium bg-gray-100';
    }
  };

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-qi-blue to-blue-600 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Investimentos</h1>
          <div className="w-9"></div>
        </div>

        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Sugestões para Você</h2>
          <p className="text-white/80">
            Investimentos personalizados baseados no seu perfil
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 space-y-4">
        {investmentSuggestions.map((investment) => {
          const Icon = investment.icon;
          
          return (
            <Card 
              key={investment.id} 
              className={`p-6 hover:shadow-lg transition-all duration-200 ${
                investment.featured ? 'border-qi-blue bg-qi-blue/5' : ''
              }`}
            >
              {investment.featured && (
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium text-qi-blue">RECOMENDADO</span>
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-qi-blue/10 rounded-full">
                  <Icon className="w-6 h-6 text-qi-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-dark mb-1">{investment.title}</h3>
                  <p className="text-sm text-gray-medium mb-2">{investment.subtitle}</p>
                  <p className="text-xs text-gray-medium">{investment.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-success-custom">
                    {investment.return}
                  </p>
                  <p className="text-xs text-gray-medium">ao ano</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-medium mb-1">Valor Mínimo</p>
                  <p className="font-semibold text-gray-dark">
                    {formatCurrency(investment.minAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-medium mb-1">Prazo</p>
                  <p className="font-semibold text-gray-dark">{investment.period}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-medium mb-1">Liquidez</p>
                  <p className="font-semibold text-gray-dark">{investment.liquidity}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-medium mb-1">Risco</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investment.risk)}`}>
                    {investment.risk}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-qi-blue hover:bg-qi-blue/90 text-white"
                  size="sm"
                >
                  Investir Agora
                </Button>
                <Button 
                  variant="outline" 
                  className="border-qi-blue text-qi-blue hover:bg-qi-blue/5"
                  size="sm"
                >
                  Saiba Mais
                </Button>
              </div>
            </Card>
          );
        })}

        <div className="text-center py-6">
          <p className="text-sm text-gray-medium mb-4">
            Não encontrou o investimento ideal?
          </p>
          <Button variant="outline" className="border-qi-blue text-qi-blue">
            Falar com Especialista
          </Button>
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  );
}