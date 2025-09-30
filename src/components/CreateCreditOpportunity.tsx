import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowLeft, DollarSign, Copy, CheckCircle2, QrCode } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

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

  const [showPixDialog, setShowPixDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  // Simulated PIX code
  const pixCode = '00020126580014BR.GOV.BCB.PIX0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540' + (parseFloat(formData.amount) || 0).toFixed(2) + '5802BR5925QI CREDITIZACAO LTDA6009SAO PAULO62070503***6304ABCD';

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

  const handleCreateOpportunity = () => {
    setShowPixDialog(true);
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: "Código copiado!",
      description: "Cole no app do seu banco para pagar",
    });
  };

  const handleConfirmPayment = () => {
    setIsCheckingPayment(true);
    
    // Simulate payment verification (3 seconds)
    setTimeout(() => {
      setIsCheckingPayment(false);
      setShowPixDialog(false);
      setShowConfirmationDialog(true);
    }, 3000);
  };

  const handleFinish = () => {
    setShowConfirmationDialog(false);
    onBack();
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
            onClick={handleCreateOpportunity}
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

      {/* PIX Payment Dialog */}
      <Dialog open={showPixDialog} onOpenChange={setShowPixDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-dark">
              Pagamento via PIX
            </DialogTitle>
            <DialogDescription className="text-gray-medium">
              Realize o pagamento para criar sua oportunidade de crédito
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Amount */}
            <div className="text-center">
              <p className="text-sm text-gray-medium mb-1">Valor a pagar</p>
              <p className="text-3xl font-bold text-qi-blue">
                {formatCurrency(parseFloat(formData.amount) || 0)}
              </p>
            </div>

            {/* QR Code Placeholder */}
            <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
              <div className="w-48 h-48 bg-white border-4 border-qi-blue rounded-lg flex items-center justify-center">
                <QrCode className="w-32 h-32 text-qi-blue" />
              </div>
            </div>

            {/* PIX Code */}
            <div>
              <Label className="text-sm font-medium text-gray-dark mb-2 block">
                Código PIX Copia e Cola
              </Label>
              <div className="flex gap-2">
                <Input
                  value={pixCode.substring(0, 40) + '...'}
                  readOnly
                  className="flex-1 text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPixCode}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-gray-dark mb-2">Como pagar:</h4>
              <ol className="text-sm text-gray-medium space-y-1 list-decimal list-inside">
                <li>Abra o app do seu banco</li>
                <li>Escolha pagar com PIX</li>
                <li>Escaneie o QR Code ou cole o código</li>
                <li>Confirme o pagamento</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                className="w-full bg-success-custom hover:bg-success-custom/90 text-white"
                onClick={handleConfirmPayment}
                disabled={isCheckingPayment}
              >
                {isCheckingPayment ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verificando pagamento...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Já realizei o pagamento
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPixDialog(false)}
                disabled={isCheckingPayment}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-success-custom/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-success-custom" />
            </div>
            <DialogTitle className="text-xl font-bold text-center text-gray-dark">
              Oportunidade Criada!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-medium">
              Seu pagamento foi confirmado e sua oportunidade de crédito foi criada com sucesso
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card className="p-4 bg-qi-blue/5 border-qi-blue/20">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-medium">Valor disponibilizado</span>
                  <span className="font-semibold text-gray-dark">
                    {formatCurrency(parseFloat(formData.amount) || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-medium">Taxa oferecida</span>
                  <span className="font-semibold text-qi-blue">{formData.interestRate}% a.m.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-medium">Prazo máximo</span>
                  <span className="font-semibold text-gray-dark">{formData.period} meses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-medium">Retorno mensal estimado</span>
                  <span className="font-semibold text-success-custom">
                    {formatCurrency(calculateMonthlyReturn())}
                  </span>
                </div>
              </div>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-dark">
                <strong>Próximos passos:</strong> Sua oportunidade está disponível para investidores. 
                Você será notificado quando houver propostas de empréstimo.
              </p>
            </div>

            <Button
              className="w-full bg-qi-blue hover:bg-qi-blue/90 text-white"
              onClick={handleFinish}
            >
              Concluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}