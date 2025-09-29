import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import Home from '@/components/Home';
import InvestmentDashboard from '@/components/InvestmentDashboard';
import CreditDashboard from '@/components/CreditDashboard';

type Screen = 'login' | 'home' | 'investment-dashboard' | 'credit-dashboard' | 'extract' | 'investments' | 'credit';

export default function MithrilApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const handleLogin = () => {
    setCurrentScreen('home');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginForm onLogin={handleLogin} />;
      
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      
      case 'investment-dashboard':
        return <InvestmentDashboard onBack={handleBack} onNavigate={handleNavigate} />;
      
      case 'credit-dashboard':
        return <CreditDashboard onBack={handleBack} onNavigate={handleNavigate} />;
      
      case 'extract':
        return (
          <div className="mobile-container flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center p-6">
              <h2 className="text-xl font-bold text-gray-dark mb-2">Extrato</h2>
              <p className="text-gray-medium mb-4">Funcionalidade em desenvolvimento</p>
              <button 
                onClick={handleBack}
                className="text-qi-blue font-medium hover:underline"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        );
      
      case 'investments':
        return (
          <div className="mobile-container flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center p-6">
              <h2 className="text-xl font-bold text-gray-dark mb-2">Investimentos</h2>
              <p className="text-gray-medium mb-4">Sugestões de investimento em desenvolvimento</p>
              <button 
                onClick={handleBack}
                className="text-qi-blue font-medium hover:underline"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        );
      
      case 'credit':
        return (
          <div className="mobile-container flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center p-6">
              <h2 className="text-xl font-bold text-gray-dark mb-2">Solicitar Crédito</h2>
              <p className="text-gray-medium mb-4">Simulação de crédito em desenvolvimento</p>
              <button 
                onClick={handleBack}
                className="text-qi-blue font-medium hover:underline"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        );
      
      default:
        return <LoginForm onLogin={handleLogin} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {renderScreen()}
    </div>
  );
}