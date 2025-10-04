import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, DollarSign, Calendar, Plus, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CreditDashboardProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function CreditDashboard({ onBack, onNavigate }: CreditDashboardProps) {
  const [showValues, setShowValues] = useState(true);

  const interestData = [
    { month: 'Jan', juros: 180, principal: 276 },
    { month: 'Fev', juros: 175, principal: 281 },
    { month: 'Mar', juros: 170, principal: 286 },
    { month: 'Abr', juros: 165, principal: 291 },
    { month: 'Mai', juros: 160, principal: 296 },
    { month: 'Jun', juros: 155, principal: 301 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const credits = [
    {
      name: 'Crédito Pessoal',
      amount: 5000,
      installments: 12,
      monthlyPayment: 456.78,
      rate: 2.5,
      remainingInstallments: 8,
      status: 'active'
    },
    {
      name: 'Antecipação do 13º',
      amount: 2800,
      installments: 6,
      monthlyPayment: 483.33,
      rate: 1.8,
      remainingInstallments: 3,
      status: 'active'
    }
  ];

  const totalCredit = credits.reduce((sum, credit) => sum + credit.amount, 0);
  const availableLimit = 15000;
  const usedLimit = totalCredit;

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-qi-blue to-qi-blue-dark px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Crédito</h1>
          <button
            onClick={() => setShowValues(!showValues)}
            className="p-2 bg-white/10 backdrop-blur rounded-full"
          >
            {showValues ? <EyeOff className="w-5 h-5 text-white" /> : <Eye className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Credit Limit Card */}
        <Card className="bg-white/10 backdrop-blur border-white/20 p-6">
          <div className="text-center mb-4">
            <p className="text-white/80 text-sm font-medium mb-2">Limite Disponível</p>
            <p className="text-white text-3xl font-bold">
              {showValues ? formatCurrency(availableLimit - usedLimit) : '••••••'}
            </p>
          </div>
          
          {/* Credit Usage Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-white/80 text-xs">
              <span>Usado: {showValues ? formatCurrency(usedLimit) : '••••••'}</span>
              <span>Total: {showValues ? formatCurrency(availableLimit) : '••••••'}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${(usedLimit / availableLimit) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Interest Evolution Chart Placeholder */}
      <div className="px-6 -mt-4 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4">Evolução dos Juros</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interestData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Bar 
                  dataKey="juros" 
                  fill="hsl(var(--qi-blue))" 
                  name="Juros"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="principal" 
                  fill="hsl(var(--success-custom))" 
                  name="Principal"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Active Credits */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-dark">Créditos Ativos</h3>
          <Button 
            onClick={() => onNavigate('credit')}
            className="bg-qi-blue hover:bg-qi-blue-dark text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Solicitar
          </Button>
        </div>

        {credits.map((credit, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-qi-blue/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-qi-blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-dark">{credit.name}</h4>
                  <p className="text-sm text-gray-medium">Taxa: {credit.rate}% a.m.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-dark">
                  {showValues ? formatCurrency(credit.amount) : '••••••'}
                </p>
                <p className="text-xs text-gray-medium">Valor original</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-medium flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Parcela mensal
                </p>
                <p className="font-bold text-gray-dark">
                  {showValues ? formatCurrency(credit.monthlyPayment) : '••••••'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Restam
                </p>
                <p className="font-bold text-gray-dark">
                  {credit.remainingInstallments} de {credit.installments}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-medium">
                <span>Progresso do pagamento</span>
                <span>{Math.round(((credit.installments - credit.remainingInstallments) / credit.installments) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-qi-blue h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((credit.installments - credit.remainingInstallments) / credit.installments) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="px-3 py-1 bg-success-custom/10 text-success-custom rounded-full text-xs font-medium">
                Em dia
              </span>
              <button className="text-qi-blue text-sm font-medium hover:underline">
                Antecipar pagamento
              </button>
            </div>
          </Card>
        ))}

        {/* Credit Summary */}
        <Card className="p-6 border-2 border-qi-blue/20">
          <h4 className="font-semibold text-gray-dark mb-4">Resumo Mensal</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-medium">Total das parcelas</span>
              <span className="font-bold text-gray-dark">
                {showValues ? formatCurrency(credits.reduce((sum, c) => sum + c.monthlyPayment, 0)) : '••••••'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-medium">Próximo vencimento</span>
              <span className="font-medium text-gray-dark">05/01/2025</span>
            </div>
          </div>
        </Card>

        <div className="h-20"></div>
      </div>
    </div>
  );
}