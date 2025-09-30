import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, PiggyBank } from 'lucide-react';
import { useState } from 'react';

interface CreateInvestmentRequestProps {
  onBack: () => void;
}

export default function CreateInvestmentRequest({ onBack }: CreateInvestmentRequestProps) {
  const [formData, setFormData] = useState({
    amount: '',
    maxInterestRate: '',
    period: '',
    purpose: '',
    creditScore: '',
    guarantees: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const calculateMonthlyPayment = () => {
    const amount = parseFloat(formData.amount) || 0;
    const rate = parseFloat(formData.maxInterestRate) || 0;
    const months = parseFloat(formData.period) || 1;
    
    if (rate === 0) return amount / months;
    
    const monthlyRate = rate / 100;
    const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };

  const getRiskLevel = () => {
    const score = parseFloat(formData.creditScore) || 0;
    if (score >= 700) return { level: 'Baixo', color: 'text-success-custom bg-success-custom/10' };
    if (score >= 600) return { level: 'Médio', color: 'text-qi-blue bg-qi-blue/10' };
    return { level: 'Alto', color: 'text-error-custom bg-error-custom/10' };
  };

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-success-custom to-green-600 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Nova Solicitação</h1>
          <div className="w-9"></div>
        </div>

        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Solicitar Investimento</h2>
          <p className="text-white/80">
            Crie sua solicitação para atrair investidores
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 -mt-4 space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-gray-dark">
                Valor necessário
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="maxInterestRate" className="text-sm font-medium text-gray-dark">
                Taxa máxima aceita (% ao mês)
              </Label>
              <Input
                id="maxInterestRate"
                type="number"
                step="0.1"
                placeholder="3.5"
                value={formData.maxInterestRate}
                onChange={(e) => handleInputChange('maxInterestRate', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="period" className="text-sm font-medium text-gray-dark">
                Prazo para pagamento (meses)
              </Label>
              <Input
                id="period"
                type="number"
                placeholder="24"
                value={formData.period}
                onChange={(e) => handleInputChange('period', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="purpose" className="text-sm font-medium text-gray-dark">
                Finalidade do investimento
              </Label>
              <select 
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                className="mt-1 w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Selecione a finalidade</option>
                <option value="capital-giro">Capital de giro</option>
                <option value="expansao">Expansão de negócio</option>
                <option value="equipamentos">Aquisição de equipamentos</option>
                <option value="estoque">Renovação de estoque</option>
                <option value="reforma">Reforma/Construção</option>
                <option value="quitacao">Quitação de dívidas</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div>
              <Label htmlFor="creditScore" className="text-sm font-medium text-gray-dark">
                Seu score de crédito
              </Label>
              <Input
                id="creditScore"
                type="number"
                placeholder="750"
                value={formData.creditScore}
                onChange={(e) => handleInputChange('creditScore', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="guarantees" className="text-sm font-medium text-gray-dark">
                Garantias oferecidas
              </Label>
              <Input
                id="guarantees"
                placeholder="Ex: Comprovação de renda, imóvel próprio"
                value={formData.guarantees}
                onChange={(e) => handleInputChange('guarantees', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-dark">
                Descrição adicional
              </Label>
              <textarea
                id="description"
                placeholder="Conte um pouco sobre você e o motivo da solicitação"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-1 w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Preview */}
        {formData.amount && formData.maxInterestRate && formData.period && formData.creditScore && (
          <Card className="p-6 bg-success-custom/5 border-success-custom/20">
            <h3 className="text-lg font-semibold text-gray-dark mb-4">Prévia da Solicitação</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-medium">Valor solicitado</p>
                  <p className="font-bold text-success-custom">
                    {formatCurrency(parseFloat(formData.amount) || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-medium">Parcela estimada</p>
                  <p className="font-bold text-gray-dark">
                    {formatCurrency(calculateMonthlyPayment())}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-medium">Taxa máxima</p>
                  <p className="font-bold text-gray-dark">{formData.maxInterestRate}% a.m.</p>
                </div>
                <div>
                  <p className="text-sm text-gray-medium">Prazo</p>
                  <p className="font-bold text-gray-dark">{formData.period} meses</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm text-gray-medium">Score de crédito</p>
                  <p className="font-bold text-gray-dark">{formData.creditScore}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevel().color}`}>
                    Risco {getRiskLevel().level}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-success-custom hover:bg-success-custom/90 text-white"
            disabled={!formData.amount || !formData.maxInterestRate || !formData.period || !formData.creditScore}
          >
            <PiggyBank className="w-4 h-4 mr-2" />
            Criar Solicitação
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-success-custom text-success-custom hover:bg-success-custom/5"
            onClick={onBack}
          >
            Cancelar
          </Button>
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  );
}