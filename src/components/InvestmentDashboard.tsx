import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface InvestmentDashboardProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function InvestmentDashboard({ onBack, onNavigate }: InvestmentDashboardProps) {
  const [showValues, setShowValues] = useState(true);

  const performanceData = [
    { month: 'Jan', rendimento: 1200, meta: 1000 },
    { month: 'Fev', rendimento: 1450, meta: 1200 },
    { month: 'Mar', rendimento: 1320, meta: 1400 },
    { month: 'Abr', rendimento: 1680, meta: 1600 },
    { month: 'Mai', rendimento: 1895, meta: 1800 },
    { month: 'Jun', rendimento: 2100, meta: 2000 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const loans = [
    {
      name: 'E.*** E-commerce', // Anonymized
      amount: 15000,
      return: 2.8,
      period: '8 meses restantes',
      risk: 'Baixo',
      color: 'text-success-custom',
      monthlyIncome: 420,
      creditScore: 750
    },
    {
      name: 'D.*** - Equipamentos', // Anonymized
      amount: 8500,
      return: 3.2,
      period: '18 meses restantes',
      risk: 'Baixo',
      color: 'text-success-custom',
      monthlyIncome: 272,
      creditScore: 680
    },
    {
      name: 'MEI*** Prestador Serviços', // Anonymized
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
          <h1 className="text-white text-lg font-semibold">Investimentos</h1>
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
        
        {/* Nova Oportunidade Button */}
        <div className="mt-4">
          <Button 
            onClick={() => onNavigate('investments')}
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
            size="default"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Oportunidade
          </Button>
        </div>
      </div>

      {/* Loans Performance Chart Placeholder */}
      <div className="px-6 -mt-4 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4">Performance dos Empréstimos</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(1)}k`} />
                <Area 
                  type="monotone" 
                  dataKey="rendimento" 
                  stroke="hsl(var(--success-custom))" 
                  fill="hsl(var(--success-custom))" 
                  fillOpacity={0.3}
                />
                <Line 
                  type="monotone" 
                  dataKey="meta" 
                  stroke="hsl(var(--qi-blue))" 
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Loans List */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-dark">Meus Empréstimos</h3>
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