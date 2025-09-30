import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar, 
  Star, 
  Shield, 
  TrendingUp,
  CreditCard,
  Building2,
  FileText,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface BorrowerProfileProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function BorrowerProfile({ onBack, onNavigate }: BorrowerProfileProps) {
  const borrower = {
    id: 1,
    name: 'C.E.S.', // Anonymized initials
    profession: 'Empresário - E-commerce',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    creditScore: 750,
    age: 34,
    location: 'São Paulo, SP',
    memberSince: '2021',
    totalBorrowed: 85000,
    successfulLoans: 3,
    currentLoan: {
      amount: 25000,
      purpose: 'Expansão de estoque para temporada',
      rate: 2.8,
      period: '12 meses',
      monthlyPayment: 2250
    },
    guarantees: ['Nota fiscal', 'Histórico bancário', 'Faturamento comprovado'],
    documents: [
      { name: 'CPF', status: 'verified' },
      { name: 'Comprovante de Renda', status: 'verified' },
      { name: 'Comprovante de Residência', status: 'verified' },
      { name: 'CNPJ', status: 'verified' },
      { name: 'Balancete', status: 'verified' }
    ],
    paymentHistory: [
      { date: '2024-11', amount: 2250, status: 'paid' },
      { date: '2024-10', amount: 2250, status: 'paid' },
      { date: '2024-09', amount: 2250, status: 'paid' },
      { date: '2024-08', amount: 2250, status: 'paid' }
    ],
    businessInfo: {
      name: 'Silva E-commerce LTDA', // Only business name, not personal
      segment: 'Comércio Eletrônico',
      monthlyRevenue: 45000,
      employees: 8,
      yearsInBusiness: 5
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-qi-blue to-blue-600 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Perfil do Solicitante</h1>
          <div className="w-9"></div>
        </div>

        {/* Profile Header */}
        <Card className="bg-white/10 backdrop-blur border-white/20 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold">{borrower.name}</h2>
              <p className="text-white/80 text-sm">{borrower.profession}</p>
              <div className="flex items-center gap-4 mt-2 text-white/70 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {borrower.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Membro desde {borrower.memberSince}
                </span>
              </div>
            </div>
          </div>

          {/* Credit Score */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Score de Crédito</p>
              <div className="flex items-center gap-2">
                <span className="text-white text-2xl font-bold">{borrower.creditScore}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Histórico</p>
              <p className="text-white font-bold">{borrower.successfulLoans} empréstimos</p>
              <p className="text-white/70 text-xs">100% pagos em dia</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 space-y-4">
        {/* Current Loan Request */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4">Solicitação Atual</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-medium mb-1">Valor Solicitado</p>
              <p className="font-bold text-gray-dark">{formatCurrency(borrower.currentLoan.amount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1">Taxa Oferecida</p>
              <p className="font-bold text-success-custom">{borrower.currentLoan.rate}% a.m.</p>
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1">Prazo</p>
              <p className="font-bold text-gray-dark">{borrower.currentLoan.period}</p>
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1">Parcela Estimada</p>
              <p className="font-bold text-gray-dark">{formatCurrency(borrower.currentLoan.monthlyPayment)}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-medium mb-2">Finalidade:</p>
            <p className="text-sm text-gray-dark">{borrower.currentLoan.purpose}</p>
          </div>
          <Button className="w-full bg-qi-blue hover:bg-qi-blue/90 text-white">
            Emprestar Para Este Perfil
          </Button>
        </Card>

        {/* Business Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Informações da Empresa
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-medium">Segmento:</span>
              <span className="font-medium text-gray-dark">{borrower.businessInfo.segment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-medium">Faturamento Mensal:</span>
              <span className="font-medium text-success-custom">{formatCurrency(borrower.businessInfo.monthlyRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-medium">Funcionários:</span>
              <span className="font-medium text-gray-dark">{borrower.businessInfo.employees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-medium">Tempo de Atividade:</span>
              <span className="font-medium text-gray-dark">{borrower.businessInfo.yearsInBusiness} anos</span>
            </div>
          </div>
        </Card>

        {/* Guarantees */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Garantias Oferecidas
          </h3>
          <div className="space-y-2">
            {borrower.guarantees.map((guarantee, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-success-custom/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-success-custom" />
                <span className="text-sm text-gray-dark">{guarantee}</span>
              </div>
            ))}
          </div>
        </Card>


        {/* Contact Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4">Contato</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3">
              <Phone className="w-4 h-4" />
              Solicitar Contato Telefônico
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Mail className="w-4 h-4" />
              Enviar Mensagem
            </Button>
          </div>
        </Card>

        <div className="h-20"></div>
      </div>
    </div>
  );
}