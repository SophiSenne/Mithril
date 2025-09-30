import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface ExtractScreenProps {
  onBack: () => void;
}

export default function ExtractScreen({ onBack }: ExtractScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = [
    {
      id: 1,
      type: 'entrada',
      title: 'Rendimento Empréstimo',
      description: 'E.*** E-commerce - Parcela 8/12',
      amount: 420.00,
      date: '2024-01-15',
      time: '14:30'
    },
    {
      id: 2,
      type: 'saida',
      title: 'Novo Empréstimo',
      description: 'Para D.*** - Equipamentos',
      amount: -8500.00,
      date: '2024-01-14',
      time: '09:15'
    },
    {
      id: 3,
      type: 'entrada',
      title: 'Rendimento Empréstimo',
      description: 'MEI*** Prestador - Parcela 3/18',
      amount: 203.00,
      date: '2024-01-14',
      time: '08:45'
    },
    {
      id: 4,
      type: 'saida',
      title: 'Pagamento Crédito',
      description: 'Para C.S.*** - Parcela 4/12',
      amount: -456.78,
      date: '2024-01-13',
      time: '16:00'
    },
    {
      id: 5,
      type: 'entrada',
      title: 'Rendimento Empréstimo',
      description: 'E.*** E-commerce - Juros mensais',
      amount: 272.00,
      date: '2024-01-12',
      time: '12:00'
    },
    {
      id: 6,
      type: 'saida',
      title: 'Depósito PIX',
      description: 'Recarga de conta',
      amount: -1000.00,
      date: '2024-01-11',
      time: '10:30'
    },
    {
      id: 7,
      type: 'entrada',
      title: 'Quitação Antecipada',
      description: 'Eng.*** CLT - Desconto de juros',
      amount: 1850.00,
      date: '2024-01-10',
      time: '00:01'
    },
    {
      id: 8,
      type: 'saida',
      title: 'Taxa de Administração',
      description: 'Manutenção da plataforma',
      amount: -15.00,
      date: '2024-01-09',
      time: '18:00'
    },
    {
      id: 9,
      type: 'entrada',
      title: 'Rendimento Empréstimo',
      description: 'Com.*** Loja Física - Parcela 6/24',
      amount: 315.50,
      date: '2024-01-08',
      time: '11:20'
    },
    {
      id: 10,
      type: 'saida',
      title: 'Solicitação de Crédito',
      description: 'Aprovada por A.S.*** - 18 parcelas',
      amount: -15000.00,
      date: '2024-01-07',
      time: '14:45'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-dark" />
          </button>
          <h1 className="text-gray-dark text-lg font-semibold">Extrato</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Filter className="w-5 h-5 text-gray-dark" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
          <Input
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center">
            <ArrowUpRight className="w-5 h-5 text-success-custom mx-auto mb-2" />
            <p className="text-xs text-gray-medium mb-1">Entradas</p>
            <p className="text-sm font-bold text-success-custom">R$ 3.560,50</p>
          </Card>
          <Card className="p-4 text-center">
            <ArrowDownLeft className="w-5 h-5 text-error-custom mx-auto mb-2" />
            <p className="text-xs text-gray-medium mb-1">Saídas</p>
            <p className="text-sm font-bold text-error-custom">R$ 25.971,78</p>
          </Card>
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-6 space-y-3">
        <h3 className="text-lg font-semibold text-gray-dark mb-4">Transações Recentes</h3>
        
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${
                transaction.type === 'entrada' 
                  ? 'bg-success-custom/10' 
                  : 'bg-gray-100'
              }`}>
                {transaction.type === 'entrada' ? (
                  <ArrowUpRight className="w-5 h-5 text-success-custom" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5 text-gray-medium" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-dark text-sm">
                    {transaction.title}
                  </h4>
                  <span className={`font-bold text-sm ${
                    transaction.type === 'entrada' 
                      ? 'text-success-custom' 
                      : 'text-gray-medium'
                  }`}>
                    {transaction.type === 'entrada' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-medium">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-medium">
                    {formatDate(transaction.date)} • {transaction.time}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-medium">Nenhuma transação encontrada</p>
          </div>
        )}

        <div className="h-20"></div>
      </div>
    </div>
  );
}