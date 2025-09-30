import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fingerprint, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import mithrilIcon from '@/assets/logo.jpeg';

interface LoginFormProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function LoginForm({ onLogin, onRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="mobile-container">
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-qi-blue to-qi-blue-dark">
        {/* Header */}
        <div className="pt-16 pb-8 px-6 text-center text-white">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center overflow-hidden">
            <img src={mithrilIcon} alt="Mithril" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Mithril</h1>
          <p className="text-qi-blue-light text-sm">Crédito e investimento descomplicado</p>
        </div>

        {/* Login Form */}
        <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8">
          <div className="max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-gray-dark mb-2">Bem-vindo de volta</h2>
            <p className="text-gray-medium mb-8">Acesse sua conta para continuar</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-dark font-medium">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-medium" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 py-3 border-2 focus:border-qi-blue"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-dark font-medium">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-medium" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    className="pl-10 pr-12 py-3 border-2 focus:border-qi-blue"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-medium hover:text-gray-dark"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-qi-blue text-sm font-medium hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 bg-qi-blue hover:bg-qi-blue-dark text-white font-semibold rounded-lg shadow-lg"
              >
                Entrar
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-medium">ou</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-2 border-qi-blue text-qi-blue hover:bg-qi-blue/5 font-semibold rounded-lg"
              >
                <Fingerprint className="w-5 h-5 mr-2" />
                Entrar com biometria
              </Button>
            </form>

            <div className="text-center mt-8 pb-8">
              <p className="text-gray-medium text-sm">
                Novo por aqui?{' '}
                <button 
                  onClick={onRegister}
                  className="text-qi-blue font-semibold hover:underline"
                >
                  Criar conta
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}