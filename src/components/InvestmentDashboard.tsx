import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface InvestmentDashboardProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function InvestmentDashboard({ onBack, onNavigate }: InvestmentDashboardProps) {
  const [showValues, setShowValues] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const loans = [
    {
      name: 'Empresário E-commerce',
      amount: 15000,
      return: 2.8,
      period: '8 meses restantes',
      risk: 'Baixo',
      color: 'text-success-custom',
      monthlyIncome: 420,
      creditScore: 750
    },
    {
      name: 'Dentista - Equipamentos',
      amount: 8500,
      return: 3.2,
      period: '18 meses restantes',
      risk: 'Baixo',
      color: 'text-success-custom',
      monthlyIncome: 272,
      creditScore: 680
    },
    {
      name: 'MEI Prestador Serviços',
      amount: 4950,
      return: 4.1,
      period: '12 meses restantes',
      risk: 'Médio',
      color: 'text-success-custom',
      monthlyIncome: 203,
      creditScore: 620
    }
  ];

  const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const monthlyIncome = loans.reduce((sum, loan) => sum + loan.monthlyIncome, 0);

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-success-custom to-green-600 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Empréstimos P2P</h1>
          <button
            onClick={() => setShowValues(!showValues)}
            className="p-2 bg-white/10 backdrop-blur rounded-full"
          >
            {showValues ? <EyeOff className="w-5 h-5 text-white" /> : <Eye className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Total Loaned Card */}
        <Card className="bg-white/10 backdrop-blur border-white/20 p-6">
          <div className="text-center">
            <p className="text-white/80 text-sm font-medium mb-2">Total Emprestado</p>
            <p className="text-white text-3xl font-bold mb-1">
              {showValues ? formatCurrency(totalLoaned) : '••••••'}
            </p>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                {showValues ? `+${formatCurrency(monthlyIncome)}/mês` : '••••••/mês'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Loans Performance Chart Placeholder */}
      <div className="px-6 -mt-4 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4">Performance dos Empréstimos</h3>
          <div className="h-32 bg-gradient-to-r from-success-custom/20 to-success-custom/5 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-success-custom mx-auto mb-2" />
              <p className="text-sm text-gray-medium">Gráfico de rendimentos</p>
              <p className="text-xs text-success-custom font-medium">Taxa média de 3.4% ao mês</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Loans List */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-dark">Meus Empréstimos</h3>
          <div className="flex gap-2">
            <Button 
              onClick={() => onNavigate('create-credit-opportunity')}
              variant="outline"
              className="border-success-custom text-success-custom hover:bg-success-custom/5"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nova Oportunidade
            </Button>
            <Button 
              onClick={() => onNavigate('investments')}
              className="bg-success-custom hover:bg-success-custom/90 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Emprestar
            </Button>
          </div>
        </div>

        {loans.map((loan, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-dark">{loan.name}</h4>
              <div className={`flex items-center gap-1 ${loan.color}`}>
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium text-sm">
                  {loan.return}% a.m.
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-medium">Valor Emprestado</p>
                <p className="font-bold text-gray-dark">
                  {showValues ? formatCurrency(loan.amount) : '••••••'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-medium">Rendimento Mensal</p>
                <p className="font-medium text-success-custom">
                  {showValues ? formatCurrency(loan.monthlyIncome) : '••••••'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-medium">Score do Devedor</p>
                <p className="font-medium text-gray-dark">{loan.creditScore}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-medium">Status</p>
                <p className="font-medium text-gray-dark">{loan.period}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                loan.risk === 'Baixo' 
                  ? 'bg-success-custom/10 text-success-custom' 
                  : loan.risk === 'Médio'
                  ? 'bg-qi-blue/10 text-qi-blue'
                  : 'bg-error-custom/10 text-error-custom'
              }`}>
                Risco {loan.risk}
              </span>
              <button className="text-qi-blue text-sm font-medium hover:underline">
                Ver detalhes
              </button>
            </div>
          </Card>
        ))}

        <div className="h-20"></div>
      </div>
    </div>
  );
}