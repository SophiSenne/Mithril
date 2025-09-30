import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Star, Shield, Zap, Plus } from 'lucide-react';

interface InvestmentsScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function InvestmentsScreen({ onBack, onNavigate }: InvestmentsScreenProps) {
  const lendingOpportunities = [
    {
      id: 1,
      borrowerProfile: 'Empresário - E-commerce',
      subtitle: 'Expansão de estoque para temporada',
      creditScore: 750,
      amount: 25000,
      interestRate: 2.8,
      period: '12 meses',
      risk: 'Baixo',
      monthlyPayment: 2250,
      icon: Shield,
      featured: true,
      description: 'Histórico excelente de pagamentos, garantias sólidas',
      guarantees: ['Nota fiscal', 'Histórico bancário', 'Faturamento comprovado']
    },
    {
      id: 2,
      borrowerProfile: 'Profissional Liberal - Dentista',
      subtitle: 'Aquisição de equipamentos odontológicos',
      creditScore: 680,
      amount: 50000,
      interestRate: 3.2,
      period: '24 meses',
      risk: 'Baixo',
      monthlyPayment: 2350,
      icon: Shield,
      featured: false,
      description: 'CRO ativo, consultório estabelecido há 8 anos',
      guarantees: ['CRO ativo', 'Comprovante de renda', 'Imóvel próprio']
    },
    {
      id: 3,
      borrowerProfile: 'MEI - Prestador de Serviços',
      subtitle: 'Capital de giro para crescimento',
      creditScore: 620,
      amount: 15000,
      interestRate: 4.1,
      period: '18 meses',
      risk: 'Médio',
      monthlyPayment: 950,
      icon: TrendingUp,
      featured: false,
      description: 'CNPJ ativo há 3 anos, faturamento crescente',
      guarantees: ['CNPJ ativo', 'Faturamento comprovado', 'Conta bancária']
    },
    {
      id: 4,
      borrowerProfile: 'Engenheiro - CLT Multinacional',
      subtitle: 'Reforma residencial completa',
      creditScore: 590,
      amount: 30000,
      interestRate: 4.8,
      period: '36 meses',
      risk: 'Médio',
      monthlyPayment: 1050,
      icon: TrendingUp,
      featured: false,
      description: 'Funcionário há 5 anos, salário estável',
      guarantees: ['Carteira assinada', 'Comprovante residência', 'Holerite']
    },
    {
      id: 5,
      borrowerProfile: 'Comerciante - Loja Física',
      subtitle: 'Renovação completa do estoque',
      creditScore: 540,
      amount: 80000,
      interestRate: 5.5,
      period: '48 meses',
      risk: 'Alto',
      monthlyPayment: 2100,
      icon: Zap,
      featured: false,
      description: 'Loja estabelecida, necessita capital para expansão',
      guarantees: ['Alvará comercial', 'Fiador avalista', 'Patrimônio']
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
          <h2 className="text-2xl font-bold mb-2">Oportunidades de Empréstimo</h2>
          <p className="text-white/80 mb-4">
            Emprestando seu dinheiro diretamente para quem precisa
          </p>
          <Button 
            onClick={() => onNavigate('create-credit-opportunity')}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Nova Oportunidade
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-4">
        {lendingOpportunities.map((opportunity) => {
          const Icon = opportunity.icon;
          
          return (
            <Card 
              key={opportunity.id} 
              className={`p-6 hover:shadow-lg transition-all duration-200 ${
                opportunity.featured ? 'border-qi-blue bg-qi-blue/5' : ''
              }`}
            >
              {opportunity.featured && (
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium text-qi-blue">MELHOR TAXA</span>
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-qi-blue/10 rounded-full">
                  <Icon className="w-6 h-6 text-qi-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-dark mb-1">{opportunity.borrowerProfile}</h3>
                  <p className="text-sm text-gray-medium mb-2">{opportunity.subtitle}</p>
                  <p className="text-xs text-gray-medium">{opportunity.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-success-custom">
                    {opportunity.interestRate}%
                  </p>
                  <p className="text-xs text-gray-medium">ao mês</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-medium mb-1">Valor Solicitado</p>
                  <p className="font-semibold text-gray-dark">
                    {formatCurrency(opportunity.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-medium mb-1">Prazo</p>
                  <p className="font-semibold text-gray-dark">{opportunity.period}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-medium mb-1">Score de Crédito</p>
                  <p className="font-semibold text-gray-dark">{opportunity.creditScore}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-medium mb-1">Risco</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(opportunity.risk)}`}>
                    {opportunity.risk}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-medium mb-2">Garantias oferecidas:</p>
                <div className="flex flex-wrap gap-2">
                  {opportunity.guarantees.map((guarantee, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-dark text-xs rounded-full"
                    >
                      {guarantee}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-qi-blue hover:bg-qi-blue/90 text-white"
                  size="sm"
                >
                  Emprestar Agora
                </Button>
                <Button 
                  variant="outline" 
                  className="border-qi-blue text-qi-blue hover:bg-qi-blue/5"
                  size="sm"
                >
                  Ver Perfil
                </Button>
              </div>
            </Card>
          );
        })}

        <div className="text-center py-6">
          <p className="text-sm text-gray-medium mb-4">
            Dúvidas sobre empréstimos pessoa a pessoa?
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