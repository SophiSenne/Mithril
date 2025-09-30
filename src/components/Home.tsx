import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, 
  CreditCard, 
  Receipt, 
  Target, 
  Eye, 
  EyeOff, 
  Bell,
  User
} from 'lucide-react';

interface HomeProps {
  onNavigate: (screen: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <div className="mobile-container bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-qi-blue to-qi-blue-dark px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('profile')}
              className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <User className="w-6 h-6 text-white" />
            </button>
            <div>
              <p className="text-white/80 text-sm">Olá,</p>
              <h2 className="text-white text-lg font-semibold">João Silva</h2>
            </div>
          </div>
          <button className="p-2 bg-white/10 backdrop-blur rounded-full">
            <Bell className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Balance Card */}
        <Card className="bg-white/10 backdrop-blur border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/80 text-sm font-medium">Saldo total</p>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              {showBalance ? (
                <EyeOff className="w-4 h-4 text-white" />
              ) : (
                <Eye className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white text-3xl font-bold">
              {showBalance ? formatCurrency(45750.30) : '••••••'}
            </span>
          </div>
          <p className="text-white/60 text-xs mt-1">Atualizado agora</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-4">
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onNavigate('investments')}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 bg-success-custom/10 rounded-xl flex items-center justify-center group-hover:bg-success-custom/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-success-custom" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-dark text-sm">Investimentos</h3>
                <p className="text-xs text-gray-medium">Ver portfólio</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onNavigate('credit')}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 bg-qi-blue/10 rounded-xl flex items-center justify-center group-hover:bg-qi-blue/20 transition-colors">
                <CreditCard className="w-6 h-6 text-qi-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-dark text-sm">Crédito</h3>
                <p className="text-xs text-gray-medium">Solicitar</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Navigation Cards */}
      <div className="px-6 mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-dark">Suas finanças</h3>

        <Card 
          className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => onNavigate('investment-dashboard')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success-custom/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-success-custom" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-dark">Dashboard de Investimentos</h4>
                <p className="text-sm text-gray-medium">Acompanhe seus rendimentos</p>
                <p className="text-xs text-success-custom font-medium mt-1">
                  +5.2% este mês
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-dark">
                {showBalance ? formatCurrency(28450.00) : '••••••'}
              </p>
              <p className="text-xs text-gray-medium">Investido</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => onNavigate('credit-dashboard')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-qi-blue/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-qi-blue" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-dark">Dashboard de Crédito</h4>
                <p className="text-sm text-gray-medium">Gerencie seus empréstimos</p>
                <p className="text-xs text-qi-blue font-medium mt-1">
                  Limite disponível
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-dark">
                {showBalance ? formatCurrency(15000.00) : '••••••'}
              </p>
              <p className="text-xs text-gray-medium">Disponível</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => onNavigate('extract')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-light rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-gray-medium" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-dark">Extrato</h4>
                <p className="text-sm text-gray-medium">Histórico de transações</p>
                <p className="text-xs text-gray-medium mt-1">
                  Última movimentação hoje
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20"></div>
    </div>
  );
}