import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowLeft, TrendingUp, Star, Shield, Zap, Plus, CheckCircle, AlertTriangle, PartyPopper } from 'lucide-react';
import { useState } from 'react';

interface InvestmentsScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function InvestmentsScreen({ onBack, onNavigate }: InvestmentsScreenProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const lendingOpportunities = [
    {
      id: 1,
      borrowerProfile: 'E.*** - E-commerce', // Anonymized
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
      borrowerProfile: 'P.L.*** - Dentista', // Anonymized
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
      borrowerProfile: 'MEI*** - Prestador de Serviços', // Anonymized
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
      borrowerProfile: 'Eng.*** - CLT Multinacional', // Anonymized
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
      borrowerProfile: 'Com.*** - Loja Física', // Anonymized
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
        return 'text-orange-600 bg-orange-100';
      case 'Alto':
        return 'text-error-custom bg-error-custom/10';
      default:
        return 'text-gray-medium bg-gray-100';
    }
  };

  const handleLendNow = (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    setShowConfirmationDialog(true);
  };

  const handleConfirmLending = () => {
    // Aqui você implementaria a lógica de empréstimo
    setShowConfirmationDialog(false);
    setShowSuccessDialog(true);
    console.log('Empréstimo confirmado para:', selectedOpportunity);
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    setSelectedOpportunity(null);
  };

  const calculateTotalReturn = (amount: number, rate: number, months: number) => {
    const monthlyRate = rate / 100;
    const totalWithInterest = amount * (1 + (monthlyRate * months));
    return totalWithInterest;
  };

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-success-custom to-green-600 px-6 pt-12 pb-6">
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
                opportunity.featured ? 'border-success-custom bg-success-custom/5' : ''
              }`}
            >
              {opportunity.featured && (
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium text-success-custom">MELHOR TAXA</span>
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-success-custom/10 rounded-full">
                  <Icon className="w-6 h-6 text-success-custom" />
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
                  className="flex-1 bg-success-custom hover:bg-success-custom/90 text-white"
                  size="sm"
                  onClick={() => handleLendNow(opportunity)}
                >
                  Emprestar Agora
                </Button>
                <Button 
                  variant="outline" 
                  className="border-success-custom text-success-custom hover:bg-success-custom/5"
                  size="sm"
                  onClick={() => onNavigate('borrower-profile')}
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
          <Button variant="outline" className="border-success-custom text-success-custom">
            Falar com o chatbot
          </Button>
        </div>

        <div className="h-20"></div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Confirmar Empréstimo
            </DialogTitle>
            <DialogDescription>
              Você está prestes a emprestar dinheiro. Revise os detalhes antes de confirmar.
            </DialogDescription>
          </DialogHeader>

          {selectedOpportunity && (
            <div className="space-y-4">
              {/* Resumo da Oportunidade */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  {selectedOpportunity.borrowerProfile}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedOpportunity.subtitle}
                </p>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Valor:</span>
                    <p className="font-semibold">{formatCurrency(selectedOpportunity.amount)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Taxa:</span>
                    <p className="font-semibold text-primary">{selectedOpportunity.interestRate}% a.m.</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Prazo:</span>
                    <p className="font-semibold">{selectedOpportunity.period}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Risco:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(selectedOpportunity.risk)}`}>
                      {selectedOpportunity.risk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Projeção de Retorno */}
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Projeção de Retorno
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor emprestado:</span>
                    <span className="font-semibold">{formatCurrency(selectedOpportunity.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total a receber:</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(calculateTotalReturn(
                        selectedOpportunity.amount, 
                        selectedOpportunity.interestRate, 
                        parseInt(selectedOpportunity.period)
                      ))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lucro estimado:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(calculateTotalReturn(
                        selectedOpportunity.amount, 
                        selectedOpportunity.interestRate, 
                        parseInt(selectedOpportunity.period)
                      ) - selectedOpportunity.amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowConfirmationDialog(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-success-custom hover:bg-success-custom/90 text-white"
                  onClick={handleConfirmLending}
                >
                  Confirmar Empréstimo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-center justify-center">
              <PartyPopper className="w-6 h-6 text-green-600" />
              Empréstimo Realizado!
            </DialogTitle>
            <DialogDescription className="text-center">
              Seu empréstimo foi processado com sucesso.
            </DialogDescription>
          </DialogHeader>

          {selectedOpportunity && (
            <div className="space-y-4">
              {/* Ícone de Sucesso */}
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Parabéns!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Você emprestou {formatCurrency(selectedOpportunity.amount)} com sucesso
                </p>
              </div>

              {/* Detalhes do Empréstimo */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-3 text-center">
                  Resumo do Empréstimo
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Para:</span>
                    <span className="font-semibold">{selectedOpportunity.borrowerProfile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="font-semibold">{formatCurrency(selectedOpportunity.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa:</span>
                    <span className="font-semibold text-primary">{selectedOpportunity.interestRate}% a.m.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Retorno esperado:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(calculateTotalReturn(
                        selectedOpportunity.amount, 
                        selectedOpportunity.interestRate, 
                        parseInt(selectedOpportunity.period)
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Próximos Passos */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h5 className="font-semibold text-foreground mb-2">
                  O que acontece agora?
                </h5>
                <div className="space-y-2 text-xs text-blue-800">
                  <p>• Você receberá um e-mail de confirmação</p>
                  <p>• O tomador será notificado sobre o empréstimo</p>
                  <p>• Acompanhe os pagamentos na sua carteira</p>
                  <p>• Primeiro pagamento em 30 dias</p>
                </div>
              </div>

              {/* Botão de Ação */}
              <div className="pt-4">
                <Button 
                  className="w-full bg-success-custom hover:bg-success-custom/90 text-white"
                  onClick={handleCloseSuccess}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>
  );
}