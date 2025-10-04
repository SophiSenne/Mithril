import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, Shield, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface NotificationsScreenProps {
  onBack: () => void;
}

interface Notification {
  id: number;
  type: 'transaction' | 'security' | 'alert' | 'system';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  amount?: number;
}

export default function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'alert',
      title: 'Atividade Suspeita Detectada',
      description: 'Tentativa de acesso não autorizado às 03:45 de IP não reconhecido',
      time: '2024-01-15T15:30:00',
      isRead: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'transaction',
      title: 'Empréstimo Aprovado',
      description: 'Novo empréstimo de R$ 15.000 foi aprovado para E.*** E-commerce',
      time: '2024-01-15T14:30:00',
      isRead: false,
      priority: 'medium',
      amount: 15000
    },
    {
      id: 3,
      type: 'security',
      title: 'Login de Novo Dispositivo',
      description: 'Acesso realizado via iPhone 14 - São Paulo, SP',
      time: '2024-01-15T12:15:00',
      isRead: true,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'transaction',
      title: 'Pagamento Recebido',
      description: 'MEI*** Prestador realizou pagamento de parcela',
      time: '2024-01-15T08:45:00',
      isRead: true,
      priority: 'low',
      amount: 203
    },
    {
      id: 5,
      type: 'alert',
      title: 'Padrão Irregular Identificado',
      description: 'Cliente C.S.*** apresentou comportamento atípico de pagamento',
      time: '2024-01-14T16:20:00',
      isRead: false,
      priority: 'high'
    },
    {
      id: 6,
      type: 'system',
      title: 'Backup Concluído',
      description: 'Backup automático dos dados foi realizado com sucesso',
      time: '2024-01-14T02:00:00',
      isRead: true,
      priority: 'low'
    },
    {
      id: 7,
      type: 'transaction',
      title: 'Quitação Antecipada',
      description: 'Eng.*** CLT quitou empréstimo com desconto nos juros',
      time: '2024-01-13T10:30:00',
      isRead: true,
      priority: 'medium',
      amount: 1850
    },
    {
      id: 8,
      type: 'alert',
      title: 'Múltiplas Tentativas de Login',
      description: 'Detectadas 5 tentativas de login incorretas para usuário D.***',
      time: '2024-01-13T07:45:00',
      isRead: false,
      priority: 'high'
    },
    {
      id: 9,
      type: 'security',
      title: 'Senha Alterada',
      description: 'Senha da conta foi alterada com sucesso',
      time: '2024-01-12T19:30:00',
      isRead: true,
      priority: 'medium'
    },
    {
      id: 10,
      type: 'transaction',
      title: 'Novo Cliente Aprovado',
      description: 'Com.*** Loja Física passou pela análise de crédito',
      time: '2024-01-12T11:20:00',
      isRead: true,
      priority: 'low'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatTime = (timeString: string) => {
    const now = new Date();
    const time = new Date(timeString);
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d atrás`;
    } else if (hours > 0) {
      return `${hours}h atrás`;
    } else {
      return 'Agora';
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case 'transaction':
        return <CheckCircle className="w-5 h-5 text-success-custom" />;
      case 'security':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'alert':
        return <AlertTriangle className={`w-5 h-5 ${priority === 'high' ? 'text-error-custom' : 'text-yellow-500'}`} />;
      case 'system':
        return <Bell className="w-5 h-5 text-gray-medium" />;
      default:
        return <Bell className="w-5 h-5 text-gray-medium" />;
    }
  };

  const getNotificationBg = (type: string, priority: string) => {
    switch (type) {
      case 'transaction':
        return 'bg-success-custom/10';
      case 'security':
        return 'bg-blue-50';
      case 'alert':
        return priority === 'high' ? 'bg-red-50' : 'bg-yellow-50';
      case 'system':
        return 'bg-gray-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Alta</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Média</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Baixa</Badge>;
      default:
        return null;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const alertCount = notifications.filter(n => n.type === 'alert' && !n.isRead).length;

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-dark" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-gray-dark text-lg font-semibold">Notificações</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Eye className="w-5 h-5 text-gray-dark" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center">
            <Bell className="w-5 h-5 text-blue-500 mx-auto mb-2" />
            <p className="text-xs text-gray-medium mb-1">Não Lidas</p>
            <p className="text-sm font-bold text-blue-500">{unreadCount}</p>
          </Card>
          <Card className="p-4 text-center">
            <AlertTriangle className="w-5 h-5 text-error-custom mx-auto mb-2" />
            <p className="text-xs text-gray-medium mb-1">Alertas</p>
            <p className="text-sm font-bold text-error-custom">{alertCount}</p>
          </Card>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 space-y-3">
        <h3 className="text-lg font-semibold text-gray-dark mb-4">Todas as Notificações</h3>
        
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`p-4 hover:shadow-md transition-all cursor-pointer ${
              !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${getNotificationBg(notification.type, notification.priority)}`}>
                {getNotificationIcon(notification.type, notification.priority)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold text-sm ${
                      !notification.isRead ? 'text-gray-dark' : 'text-gray-medium'
                    }`}>
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  {getPriorityBadge(notification.priority)}
                </div>
                
                <p className="text-xs text-gray-medium mb-2">
                  {notification.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(notification.time)}
                  </p>
                  {notification.amount && (
                    <span className="text-xs font-bold text-success-custom">
                      {formatCurrency(notification.amount)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        <div className="h-20"></div>
      </div>
    </div>
  );
}