import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface CreateCreditOpportunityProps {
  onBack: () => void;
}

export default function CreateCreditOpportunity({ onBack }: CreateCreditOpportunityProps) {
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: '',
    period: '',
    purpose: '',
    riskProfile: 'Baixo',
    requirements: ''
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

  const calculateMonthlyReturn = () => {
    const amount = parseFloat(formData.amount) || 0;
    const rate = parseFloat(formData.interestRate) || 0;
    return (amount * rate) / 100;
  };

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-qi-blue to-blue-600 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Nova Oportunidade</h1>
          <div className="w-9"></div>
        </div>

        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Criar Oportunidade de Crédito</h2>
          <p className="text-white/80">
            Disponibilize seu dinheiro para empréstimo
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 -mt-4 space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-gray-dark">
                Valor a disponibilizar
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
              <Label htmlFor="interestRate" className="text-sm font-medium text-gray-dark">
                Taxa de juros mensal (%)
              </Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                placeholder="2.5"
                value={formData.interestRate}
                onChange={(e) => handleInputChange('interestRate', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="period" className="text-sm font-medium text-gray-dark">
                Prazo máximo (meses)
              </Label>
              <Input
                id="period"
                type="number"
                placeholder="12"
                value={formData.period}
                onChange={(e) => handleInputChange('period', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="purpose" className="text-sm font-medium text-gray-dark">
                Finalidade preferencial
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
                <option value="pessoal">Uso pessoal</option>
                <option value="reforma">Reforma/Construção</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div>
              <Label htmlFor="riskProfile" className="text-sm font-medium text-gray-dark">
                Perfil de risco aceito
              </Label>
              <select 
                id="riskProfile"
                value={formData.riskProfile}
                onChange={(e) => handleInputChange('riskProfile', e.target.value)}
                className="mt-1 w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Baixo">Baixo risco</option>
                <option value="Médio">Médio risco</option>
                <option value="Alto">Alto risco</option>
              </select>
            </div>

            <div>
              <Label htmlFor="requirements" className="text-sm font-medium text-gray-dark">
                Requisitos mínimos
              </Label>
              <Input
                id="requirements"
                placeholder="Ex: Score mínimo 650, comprovação de renda"
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Preview */}
        {formData.amount && formData.interestRate && (
          <Card className="p-6 bg-qi-blue/5 border-qi-blue/20">
            <h3 className="text-lg font-semibold text-gray-dark mb-4">Simulação</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-medium">Valor disponibilizado</p>
                <p className="font-bold text-qi-blue">
                  {formatCurrency(parseFloat(formData.amount) || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-medium">Retorno mensal estimado</p>
                <p className="font-bold text-success-custom">
                  {formatCurrency(calculateMonthlyReturn())}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-medium">Taxa oferecida</p>
                <p className="font-bold text-gray-dark">{formData.interestRate}% a.m.</p>
              </div>
              <div>
                <p className="text-sm text-gray-medium">Prazo máximo</p>
                <p className="font-bold text-gray-dark">{formData.period} meses</p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-qi-blue hover:bg-qi-blue/90 text-white"
            disabled={!formData.amount || !formData.interestRate || !formData.period}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Criar Oportunidade
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-qi-blue text-qi-blue hover:bg-qi-blue/5"
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