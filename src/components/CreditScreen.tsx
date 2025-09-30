import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, CreditCard, DollarSign, Clock, Plus } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface CreditScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function CreditScreen({ onBack, onNavigate }: CreditScreenProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const { toast } = useToast();

  const creditOpportunities = [
    {
      id: 1,
      investorName: 'C.S.***', // Anonymized initials
      investorScore: 850,
      amount: 25000,
      rate: 1.2,
      period: 24,
      purpose: 'Capital de giro',
      riskProfile: 'Baixo',
      approval: 'Aguardando análise',
      icon: DollarSign,
      featured: true,
      requirements: ['Score mínimo 650', 'Comprovação de renda', 'Sem restrições'],
      investorProfile: 'Investidor experiente há 5 anos'
    },
    {
      id: 2,
      investorName: 'A.S.***', // Anonymized initials
      investorScore: 780,
      amount: 15000,
      rate: 1.5,
      period: 18,
      purpose: 'Expansão de negócio',
      riskProfile: 'Médio',
      approval: 'Aprovação rápida',
      icon: Calculator,
      featured: false,
      requirements: ['Score mínimo 600', 'Garantidor', 'Histórico comercial'],
      investorProfile: 'Investidora focada em PMEs'
    },
    {
      id: 3,
      investorName: 'J.O.***', // Anonymized initials
      investorScore: 720,
      amount: 10000,
      rate: 1.8,
      period: 12,
      purpose: 'Pagamento de fornecedores',
      riskProfile: 'Médio',
      approval: 'Análise em 24h',
      icon: Clock,
      featured: false,
      requirements: ['Score mínimo 550', 'Nota fiscal', 'Faturamento comprovado'],
      investorProfile: 'Investidor conservador'
    },
    {
      id: 4,
      investorName: 'M.C.***', // Anonymized initials
      investorScore: 820,
      amount: 50000,
      rate: 0.9,
      period: 36,
      purpose: 'Investimento em equipamentos',
      riskProfile: 'Baixo',
      approval: 'Análise detalhada',
      icon: CreditCard,
      featured: false,
      requirements: ['Score mínimo 700', 'Garantia real', 'Plano de negócios'],
      investorProfile: 'Grande investidora institucional'
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

  const handleConfirmApplication = (opportunity: any) => {
    toast({
      title: "Solicitação Criada com Sucesso!",
      description: `Sua solicitação de crédito de ${formatCurrency(opportunity.amount)} foi enviada para ${opportunity.investorName}. Você receberá uma resposta em até 24 horas.`,
      duration: 5000,
    });
  };

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-qi-blue to-blue-600 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Crédito</h1>
          <div className="w-9"></div>
        </div>

        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Crédito de Investidores</h2>
          <p className="text-3xl font-bold mb-2">R$ 100.000</p>
          <p className="text-white/80 mb-4">
            Disponível de investidores verificados
          </p>
          <Button 
            onClick={() => onNavigate('create-investment-request')}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Solicitar Investimento
          </Button>
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
                    className={selectedAmount === amount ? "bg-qi-blue hover:bg-qi-blue/90" : ""}
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </div>
            </div>
            
            {selectedAmount > 0 && (
              <div className="bg-qi-blue/10 border border-qi-blue/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-medium">Parcela em 12x:</span>
                  <span className="font-bold text-qi-blue">
                    {formatCurrency(calculateInstallment(selectedAmount, 1.89, 12))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-medium">Taxa mensal:</span>
                  <span className="font-bold text-qi-blue">1,89%</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Credit Opportunities */}
      <div className="px-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-dark">Oportunidades de Crédito</h3>
        
        {creditOpportunities.map((opportunity) => {
          const Icon = opportunity.icon;
          
          return (
            <Card 
              key={opportunity.id} 
              className={`p-6 hover:shadow-lg transition-all duration-200 ${
                opportunity.featured ? 'border-qi-blue bg-qi-blue/5' : ''
              }`}
            >
              {opportunity.featured && (
                <div className="bg-qi-blue text-white text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
                  MELHOR OFERTA
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-qi-blue/10 rounded-full">
                  <Icon className="w-6 h-6 text-qi-blue" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-dark mb-1">{opportunity.investorName}</h4>
                  <p className="text-sm text-gray-medium mb-2">{opportunity.investorProfile}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-medium">Valor: </span>
                      <span className="font-medium text-qi-blue">
                        {formatCurrency(opportunity.amount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-medium">Prazo: </span>
                      <span className="font-medium">{opportunity.period} meses</span>
                    </div>
                    <div>
                      <span className="text-gray-medium">Taxa: </span>
                      <span className="font-medium text-qi-blue">
                        {opportunity.rate}% a.m.
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-medium">Score Investidor: </span>
                      <span className="font-medium">{opportunity.investorScore}</span>
                    </div>
                    <div>
                      <span className="text-gray-medium">Finalidade: </span>
                      <span className="font-medium">{opportunity.purpose}</span>
                    </div>
                    <div>
                      <span className="text-gray-medium">Risco: </span>
                      <span className={`font-medium ${
                        opportunity.riskProfile === 'Baixo' ? 'text-green-600' : 
                        opportunity.riskProfile === 'Médio' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {opportunity.riskProfile}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-dark mb-2">Requisitos:</h5>
                <div className="flex flex-wrap gap-2">
                  {opportunity.requirements.map((requirement, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-dark text-xs rounded-full"
                    >
                      {requirement}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-medium">Parcela estimada:</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(calculateInstallment(opportunity.amount, opportunity.rate, opportunity.period))}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      className="flex-1 bg-qi-blue hover:bg-qi-blue/90 text-white"
                      size="sm"
                    >
                      Solicitar Aprovação
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Solicitação de Crédito</AlertDialogTitle>
                      <AlertDialogDescription>
                        Você está prestes a solicitar aprovação para um empréstimo de{' '}
                        <strong>{formatCurrency(opportunity.amount)}</strong> com{' '}
                        <strong>{opportunity.investorName}</strong>.
                        <br /><br />
                        <strong>Detalhes:</strong>
                        <br />• Taxa: {opportunity.rate}% ao mês
                        <br />• Prazo: {opportunity.period} meses  
                        <br />• Parcela estimada: {formatCurrency(calculateInstallment(opportunity.amount, opportunity.rate, opportunity.period))}
                        <br /><br />
                        Deseja continuar com a solicitação?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-qi-blue hover:bg-qi-blue/90"
                        onClick={() => handleConfirmApplication(opportunity)}
                      >
                        Confirmar Solicitação
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button 
                  variant="outline" 
                  className="border-qi-blue text-qi-blue hover:bg-qi-blue/5"
                  size="sm"
                  onClick={() => onNavigate('investor-profile')}
                >
                  Ver Perfil
                </Button>
              </div>
            </Card>
          );
        })}

        <div className="text-center py-6">
          <p className="text-sm text-gray-medium mb-4">
            Dúvidas sobre como funciona?
          </p>
          <Button variant="outline" className="border-qi-blue text-qi-blue">
            Falar com o chatbot
          </Button>
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  );
}