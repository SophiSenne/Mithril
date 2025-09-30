import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, User, Shield, Mail, Phone, MapPin, Edit } from 'lucide-react';

interface ProfileScreenProps {
  onBack: () => void;
}

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    address: 'Rua das Flores, 123, São Paulo - SP'
  });

  const [lgpdConsents, setLgpdConsents] = useState({
    dataProcessing: true,
    marketing: false,
    analytics: true,
    profiling: false,
    thirdPartySharing: false
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would save the profile data
  };

  const handleConsentChange = (consent: string, value: boolean) => {
    setLgpdConsents(prev => ({ ...prev, [consent]: value }));
  };

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-qi-blue to-qi-blue-dark px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Meu Perfil</h1>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 bg-white/10 backdrop-blur rounded-full"
          >
            <Edit className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-white text-xl font-semibold">{profileData.name}</h2>
          <p className="text-white/80 text-sm">Membro desde Janeiro 2024</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-qi-blue" />
            <h3 className="text-lg font-semibold text-gray-dark">Informações Pessoais</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-light' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-light' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-light' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-light' : ''}
              />
            </div>

            {isEditing && (
              <Button onClick={handleSaveProfile} className="w-full bg-qi-blue hover:bg-qi-blue/90">
                Salvar Alterações
              </Button>
            )}
          </div>
        </Card>

        {/* LGPD Privacy Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-qi-blue" />
            <h3 className="text-lg font-semibold text-gray-dark">Privacidade e Dados</h3>
          </div>

          <p className="text-sm text-gray-medium mb-6">
            Gerencie como seus dados são utilizados de acordo com a LGPD (Lei Geral de Proteção de Dados).
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="dataProcessing"
                checked={lgpdConsents.dataProcessing}
                onCheckedChange={(checked) => handleConsentChange('dataProcessing', checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="dataProcessing" className="text-sm font-medium">
                  Processamento de Dados Necessários
                </Label>
                <p className="text-xs text-gray-medium">
                  Autorizo o processamento dos meus dados para funcionamento da plataforma.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="marketing"
                checked={lgpdConsents.marketing}
                onCheckedChange={(checked) => handleConsentChange('marketing', checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="marketing" className="text-sm font-medium">
                  Marketing e Comunicações
                </Label>
                <p className="text-xs text-gray-medium">
                  Autorizo o envio de ofertas e comunicações promocionais.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="analytics"
                checked={lgpdConsents.analytics}
                onCheckedChange={(checked) => handleConsentChange('analytics', checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="analytics" className="text-sm font-medium">
                  Analytics e Melhorias
                </Label>
                <p className="text-xs text-gray-medium">
                  Autorizo o uso dos dados para análises e melhorias da plataforma.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="profiling"
                checked={lgpdConsents.profiling}
                onCheckedChange={(checked) => handleConsentChange('profiling', checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="profiling" className="text-sm font-medium">
                  Perfilização e Personalização
                </Label>
                <p className="text-xs text-gray-medium">
                  Autorizo a criação de perfis para personalizar ofertas e conteúdo.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="thirdPartySharing"
                checked={lgpdConsents.thirdPartySharing}
                onCheckedChange={(checked) => handleConsentChange('thirdPartySharing', checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="thirdPartySharing" className="text-sm font-medium">
                  Compartilhamento com Terceiros
                </Label>
                <p className="text-xs text-gray-medium">
                  Autorizo o compartilhamento de dados com parceiros para ofertas especiais.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Seus direitos:</strong> Você pode solicitar acesso, correção, exclusão ou portabilidade dos seus dados a qualquer momento. Entre em contato conosco para exercer seus direitos.
            </p>
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-dark mb-4">Configurações da Conta</h3>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Mail className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Autenticação em Duas Etapas
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50">
              <User className="w-4 h-4 mr-2" />
              Excluir Conta
            </Button>
          </div>
        </Card>
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}