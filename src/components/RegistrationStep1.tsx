import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface RegistrationStep1Props {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function RegistrationStep1({ onNext, onBack }: RegistrationStep1Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [lgpdConsents, setLgpdConsents] = useState({
    dataProcessing: false,
    termsAndConditions: false,
    dataSharing: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    onNext({ ...formData, lgpdConsents });
  };

  const handleConsentChange = (consent: string, value: boolean) => {
    setLgpdConsents(prev => ({ ...prev, [consent]: value }));
  };

  const isFormValid = formData.name && formData.email && formData.cpf && 
                     formData.phone && formData.address && formData.password && 
                     formData.password === formData.confirmPassword &&
                     lgpdConsents.dataProcessing && lgpdConsents.termsAndConditions;

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-dark" />
          </button>
          <h1 className="text-gray-dark text-lg font-semibold">Cadastro</h1>
          <div className="w-9"></div>
        </div>

        <Progress value={33} className="mb-4" />
        <p className="text-sm text-gray-medium text-center">Etapa 1 de 3</p>
      </div>

      {/* Form */}
      <div className="px-6 py-6 space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-dark mb-2">Dados Pessoais</h2>
          <p className="text-gray-medium">Preencha suas informações básicas</p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Digite seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={formData.cpf}
              onChange={(e) => handleInputChange('cpf', e.target.value)}
              placeholder="000.000.000-00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Rua, número, bairro, cidade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Crie uma senha segura"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Digite a senha novamente"
            />
          </div>
        </Card>

        {/* LGPD Consent */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4">Autorização de Dados - LGPD</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="dataProcessing"
                checked={lgpdConsents.dataProcessing}
                onCheckedChange={(checked) => handleConsentChange('dataProcessing', checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="dataProcessing" className="text-sm font-medium">
                  Processamento de Dados Pessoais *
                </Label>
                <p className="text-xs text-gray-medium">
                  Autorizo o processamento dos meus dados pessoais para utilização da plataforma Mithril, incluindo dados de identificação, contato e financeiros, conforme descrito na Política de Privacidade.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="termsAndConditions"
                checked={lgpdConsents.termsAndConditions}
                onCheckedChange={(checked) => handleConsentChange('termsAndConditions', checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="termsAndConditions" className="text-sm font-medium">
                  Termos de Uso e Política de Privacidade *
                </Label>
                <p className="text-xs text-gray-medium">
                  Declaro que li e aceito os Termos de Uso e a Política de Privacidade da plataforma.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="dataSharing"
                checked={lgpdConsents.dataSharing}
                onCheckedChange={(checked) => handleConsentChange('dataSharing', checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="dataSharing" className="text-sm font-medium">
                  Marketing e Ofertas (Opcional)
                </Label>
                <p className="text-xs text-gray-medium">
                  Autorizo o envio de comunicações sobre produtos, serviços e ofertas por e-mail, SMS e outros meios.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Seus direitos:</strong> Você pode revogar estes consentimentos a qualquer momento através do seu perfil ou entrando em contato conosco.
            </p>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg">
        <Button 
          onClick={handleNext}
          disabled={!isFormValid}
          className="w-full bg-qi-blue hover:bg-qi-blue/90 text-white"
        >
          Continuar
        </Button>
      </div>

      <div className="h-20"></div>
    </div>
  );
}