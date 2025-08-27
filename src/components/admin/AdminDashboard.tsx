import { useState } from 'react';
import { 
  Users, TrendingUp, DollarSign, ShoppingCart, 
  Bell, Search, Plus, MoreHorizontal, ArrowUpRight,
  ArrowDownRight, Activity, Star, Calendar, EyeOff
} from 'lucide-react';

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cardsVisible, setCardsVisible] = useState(true);

  const metrics = [
    {
      title: 'Total Usuarios',
      value: '12,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Ingresos',
      value: '$84,392',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Ventas',
      value: '2,847',
      change: '-3.1%',
      trend: 'down',
      icon: ShoppingCart,
      color: 'purple'
    },
    {
      title: 'Conversión',
      value: '3.24%',
      change: '+2.4%',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const recentActivity = [
    { id: 1, user: 'Juan Pérez', action: 'se registró', time: 'Hace 5 min', avatar: '👤' },
    { id: 2, user: 'María García', action: 'realizó una compra', time: 'Hace 12 min', avatar: '👩' },
    { id: 3, user: 'Carlos López', action: 'actualizó su perfil', time: 'Hace 18 min', avatar: '👨' },
    { id: 4, user: 'Ana Martín', action: 'dejó una reseña', time: 'Hace 25 min', avatar: '👱‍♀️' },
    { id: 5, user: 'David Ruiz', action: 'canceló su suscripción', time: 'Hace 32 min', avatar: '🧑' },
  ];

  const topProducts = [
    { id: 1, name: 'Producto Premium', sales: 1247, revenue: '$24,580', trend: 'up' },
    { id: 2, name: 'Curso Avanzado', sales: 987, revenue: '$19,740', trend: 'up' },
    { id: 3, name: 'Membresía Gold', sales: 756, revenue: '$15,120', trend: 'down' },
    { id: 4, name: 'Consultoría', sales: 543, revenue: '$10,860', trend: 'up' },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      green: 'bg-green-500/10 text-green-400 border-green-500/20',
      purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Bienvenido de vuelta, aquí está el resumen de tu plataforma</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition w-64"
            />
          </div>
          <button className="relative p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          </button>
          <button 
            onClick={() => setCardsVisible(!cardsVisible)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-lg transition"
          >
            <EyeOff className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Cards</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
        </div>
      </div>



    </>
  );
}