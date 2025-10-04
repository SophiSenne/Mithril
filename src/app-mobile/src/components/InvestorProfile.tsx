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
  Target,
  Award,
  BarChart3
} from 'lucide-react';

interface InvestorProfileProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function InvestorProfile({ onBack, onNavigate }: InvestorProfileProps) {
  const investor = {
    id: 1,
    name: 'C.S.***',
    experience: 'Investidor experiente há 5 anos',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    score: 850,
    age: 42,
    location: 'São Paulo, SP',
    memberSince: '2019',
    totalInvested: 450000,
    activeLoans: 12,
    completedLoans: 28,
    averageReturn: 3.2,
    currentOffer: {
      amount: 25000,
      rate: 1.2,
      period: 24,
      purpose: 'Capital de giro',
      riskProfile: 'Baixo'
    },
    investmentCriteria: [
      'Score mínimo 650',
      'Comprovação de renda',
      'Sem restrições no CPF/CNPJ',
      'Garantias sólidas'
    ],
    portfolio: [
      { category: 'E-commerce', percentage: 35, amount: 157500 },
      { category: 'Serviços', percentage: 25, amount: 112500 },
      { category: 'Indústria', percentage: 20, amount: 90000 },
      { category: 'Agronegócio', percentage: 15, amount: 67500 },
      { category: 'Tecnologia', percentage: 5, amount: 22500 }
    ],
    recentInvestments: [
      { date: '2024-01-10', borrower: 'E.*** E-commerce', amount: 15000, status: 'active', rate: 2.8 },
      { date: '2024-01-05', borrower: 'MEI*** Serviços', amount: 8000, status: 'active', rate: 3.1 },
      { date: '2023-12-28', borrower: 'Ind.*** Manufatura', amount: 12000, status: 'completed', rate: 2.9 },
      { date: '2023-12-15', borrower: 'Agro*** Cultivo', amount: 20000, status: 'active', rate: 2.5 }
    ],
    reviews: [
      { borrower: 'E.*** Comércio', rating: 5, comment: 'Investidor muito profissional, processo rápido e transparente.' },
      { borrower: 'P.L.*** Dentista', rating: 5, comment: 'Excelente comunicação, entendeu perfeitamente nossas necessidades.' },
      { borrower: 'MEI*** Prestador', rating: 4, comment: 'Investimento aprovado rapidamente, recomendo.' }
    ],
    preferences: {
      minAmount: 5000,
      maxAmount: 50000,
      preferredSectors: ['E-commerce', 'Serviços', 'Agronegócio'],
      maxRisk: 'Médio',
      preferredTerm: '12-24 meses'
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
          <h1 className="text-white text-lg font-semibold">Perfil do Investidor</h1>
          <div className="w-9"></div>
        </div>

        {/* Profile Header */}
        <Card className="bg-white/10 backdrop-blur border-white/20 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold">{investor.name}</h2>
              <p className="text-white/80 text-sm">{investor.experience}</p>
              <div className="flex items-center gap-4 mt-2 text-white/70 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {investor.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Membro desde {investor.memberSince}
                </span>
              </div>
            </div>
          </div>

          {/* Investor Score */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Score do Investidor</p>
              <div className="flex items-center gap-2">
                <span className="text-white text-2xl font-bold">{investor.score}</span>
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
              <p className="text-white/80 text-sm">Portfolio</p>
              <p className="text-white font-bold">{formatCurrency(investor.totalInvested)}</p>
              <p className="text-white/70 text-xs">{investor.activeLoans} empréstimos ativos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 space-y-4">
        {/* Current Offer */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4">Oferta Atual</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-medium mb-1">Valor Disponível</p>
              <p className="font-bold text-gray-dark">{formatCurrency(investor.currentOffer.amount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1">Taxa Oferecida</p>
              <p className="font-bold text-qi-blue">{investor.currentOffer.rate}% a.m.</p>
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1">Prazo Máximo</p>
              <p className="font-bold text-gray-dark">{investor.currentOffer.period} meses</p>
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1">Finalidade</p>
              <p className="font-bold text-gray-dark">{investor.currentOffer.purpose}</p>
            </div>
          </div>
          <Button className="w-full bg-qi-blue hover:bg-qi-blue/90 text-white">
            Solicitar Crédito Deste Investidor
          </Button>
        </Card>

        {/* Investment Statistics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Estatísticas de Investimento
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-qi-blue/10 rounded-lg">
              <p className="text-2xl font-bold text-qi-blue">{investor.completedLoans}</p>
              <p className="text-xs text-gray-medium">Empréstimos Concluídos</p>
            </div>
            <div className="text-center p-4 bg-success-custom/10 rounded-lg">
              <p className="text-2xl font-bold text-success-custom">{investor.averageReturn}%</p>
              <p className="text-xs text-gray-medium">Retorno Médio Mensal</p>
            </div>
          </div>
        </Card>

        {/* Investment Criteria */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Critérios de Investimento
          </h3>
          <div className="space-y-2">
            {investor.investmentCriteria.map((criteria, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-qi-blue/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-qi-blue" />
                <span className="text-sm text-gray-dark">{criteria}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Portfolio Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Distribuição do Portfolio
          </h3>
          <div className="space-y-3">
            {investor.portfolio.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-dark">{item.category}</span>
                  <div className="text-right">
                    <span className="font-bold text-gray-dark">{item.percentage}%</span>
                    <p className="text-xs text-gray-medium">{formatCurrency(item.amount)}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-qi-blue h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Reviews */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Avaliações de Mutuários
          </h3>
          <div className="space-y-4">
            {investor.reviews.map((review, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-dark">{review.borrower}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-medium">{review.comment}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Investment Preferences */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4">Preferências de Investimento</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-medium">Valor mínimo:</span>
              <span className="font-medium text-gray-dark">{formatCurrency(investor.preferences.minAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-medium">Valor máximo:</span>
              <span className="font-medium text-gray-dark">{formatCurrency(investor.preferences.maxAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-medium">Risco máximo:</span>
              <span className="font-medium text-gray-dark">{investor.preferences.maxRisk}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-medium">Prazo preferido:</span>
              <span className="font-medium text-gray-dark">{investor.preferences.preferredTerm}</span>
            </div>
            <div>
              <p className="text-gray-medium mb-2">Setores preferidos:</p>
              <div className="flex flex-wrap gap-2">
                {investor.preferences.preferredSectors.map((sector, index) => (
                  <span key={index} className="px-3 py-1 bg-qi-blue/10 text-qi-blue text-xs rounded-full">
                    {sector}
                  </span>
                ))}
              </div>
            </div>
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