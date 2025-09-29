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

  const investments = [
    {
      name: 'CDB Banco QI Tech',
      amount: 15000,
      return: 5.2,
      period: '12 meses',
      risk: 'Baixo',
      color: 'text-success-custom'
    },
    {
      name: 'Tesouro Direto IPCA+',
      amount: 8500,
      return: 4.8,
      period: '5 anos',
      risk: 'Baixo',
      color: 'text-success-custom'
    },
    {
      name: 'Fundo Multimercado',
      amount: 4950,
      return: -1.2,
      period: '3 meses',
      risk: 'Alto',
      color: 'text-error-custom'
    }
  ];

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-success-custom to-green-600 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Investimentos</h1>
          <button
            onClick={() => setShowValues(!showValues)}
            className="p-2 bg-white/10 backdrop-blur rounded-full"
          >
            {showValues ? <EyeOff className="w-5 h-5 text-white" /> : <Eye className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Total Invested Card */}
        <Card className="bg-white/10 backdrop-blur border-white/20 p-6">
          <div className="text-center">
            <p className="text-white/80 text-sm font-medium mb-2">Total Investido</p>
            <p className="text-white text-3xl font-bold mb-1">
              {showValues ? formatCurrency(totalInvested) : '••••••'}
            </p>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+5.2% este mês</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Portfolio Evolution Chart Placeholder */}
      <div className="px-6 -mt-4 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4">Evolução do Portfólio</h3>
          <div className="h-32 bg-gradient-to-r from-success-custom/20 to-success-custom/5 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-success-custom mx-auto mb-2" />
              <p className="text-sm text-gray-medium">Gráfico de evolução</p>
              <p className="text-xs text-success-custom font-medium">Crescimento de 12.5% em 6 meses</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Investments List */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-dark">Meus Investimentos</h3>
          <Button 
            onClick={() => onNavigate('investments')}
            className="bg-success-custom hover:bg-success-custom/90 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Investir
          </Button>
        </div>

        {investments.map((investment, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-dark">{investment.name}</h4>
              <div className={`flex items-center gap-1 ${investment.color}`}>
                {investment.return > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium text-sm">
                  {investment.return > 0 ? '+' : ''}{investment.return}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-medium">Valor Aplicado</p>
                <p className="font-bold text-gray-dark">
                  {showValues ? formatCurrency(investment.amount) : '••••••'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-medium">Período</p>
                <p className="font-medium text-gray-dark">{investment.period}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                investment.risk === 'Baixo' 
                  ? 'bg-success-custom/10 text-success-custom' 
                  : 'bg-error-custom/10 text-error-custom'
              }`}>
                Risco {investment.risk}
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