import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import Home from '@/components/Home';
import InvestmentDashboard from '@/components/InvestmentDashboard';
import CreditDashboard from '@/components/CreditDashboard';
import RegistrationStep1 from '@/components/RegistrationStep1';
import RegistrationStep2 from '@/components/RegistrationStep2';
import RegistrationStep3 from '@/components/RegistrationStep3';
import ExtractScreen from '@/components/ExtractScreen';
import InvestmentsScreen from '@/components/InvestmentsScreen';
import CreditScreen from '@/components/CreditScreen';
import CreateCreditOpportunity from '@/components/CreateCreditOpportunity';
import CreateInvestmentRequest from '@/components/CreateInvestmentRequest';
import ProfileScreen from '@/components/ProfileScreen';

type Screen = 'login' | 'register-1' | 'register-2' | 'register-3' | 'home' | 'investment-dashboard' | 'credit-dashboard' | 'extract' | 'investments' | 'credit' | 'create-credit-opportunity' | 'create-investment-request' | 'profile';

export default function MithrilApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [registrationData, setRegistrationData] = useState<any>({});

  const handleLogin = () => {
    setCurrentScreen('home');
  };

  const handleRegister = () => {
    setCurrentScreen('register-1');
  };

  const handleRegistrationNext = (step: number, data: any) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
    
    if (step === 1) {
      setCurrentScreen('register-2');
    } else if (step === 2) {
      setCurrentScreen('register-3');
    } else if (step === 3) {
      // Complete registration
      setCurrentScreen('home');
    }
  };

  const handleRegistrationBack = (step: number) => {
    if (step === 1) {
      setCurrentScreen('login');
    } else if (step === 2) {
      setCurrentScreen('register-1');
    } else if (step === 3) {
      setCurrentScreen('register-2');
    }
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const handleBackToInvestments = () => {
    setCurrentScreen('investments');
  };

  const handleBackToCredit = () => {
    setCurrentScreen('credit');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginForm onLogin={handleLogin} onRegister={handleRegister} />;
      
      case 'register-1':
        return (
          <RegistrationStep1 
            onNext={(data) => handleRegistrationNext(1, data)}
            onBack={() => handleRegistrationBack(1)}
          />
        );
      
      case 'register-2':
        return (
          <RegistrationStep2 
            onNext={(data) => handleRegistrationNext(2, data)}
            onBack={() => handleRegistrationBack(2)}
          />
        );
      
      case 'register-3':
        return (
          <RegistrationStep3 
            onComplete={(data) => handleRegistrationNext(3, data)}
            onBack={() => handleRegistrationBack(3)}
          />
        );
      
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      
      case 'investment-dashboard':
        return <InvestmentDashboard onBack={handleBack} onNavigate={handleNavigate} />;
      
      case 'credit-dashboard':
        return <CreditDashboard onBack={handleBack} onNavigate={handleNavigate} />;
      
      case 'extract':
        return <ExtractScreen onBack={handleBack} />;
      
      case 'investments':
        return <InvestmentsScreen onBack={handleBack} onNavigate={handleNavigate} />;
      
      case 'credit':
        return <CreditScreen onBack={handleBack} onNavigate={handleNavigate} />;
      
      case 'create-credit-opportunity':
        return <CreateCreditOpportunity onBack={handleBackToInvestments} />;
      
      case 'create-investment-request':
        return <CreateInvestmentRequest onBack={handleBackToCredit} />;
      
      case 'profile':
        return <ProfileScreen onBack={handleBack} />;
      
      default:
        return <LoginForm onLogin={handleLogin} onRegister={handleRegister} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {renderScreen()}
    </div>
  );
}