import { useState } from 'react';
import { 
  Users, TrendingUp, DollarSign, ShoppingCart, 
  Bell, Search, Plus, MoreHorizontal, ArrowUpRight,
  ArrowDownRight, Activity, Star, Calendar
} from 'lucide-react';

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="space-y-6">
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
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg border ${getColorClasses(metric.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <button className="text-slate-400 hover:text-white transition">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-slate-400 text-sm font-medium">{metric.title}</h3>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-slate-400 text-sm">vs último mes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Análisis de Ingresos</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg">7d</button>
              <button className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition">30d</button>
              <button className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition">90d</button>
            </div>
          </div>
          
          <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700">
            <div className="text-center">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Gráfico de ingresos aquí</p>
              <p className="text-xs text-slate-500 mt-1">Integra tu librería de gráficos favorita</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Actividad Reciente</h3>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-center text-blue-400 hover:text-blue-300 text-sm font-medium transition">
            Ver toda la actividad
          </button>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Productos Top</h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition">
            Ver todos
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 text-slate-400 font-medium">Producto</th>
                <th className="text-left py-3 text-slate-400 font-medium">Ventas</th>
                <th className="text-left py-3 text-slate-400 font-medium">Ingresos</th>
                <th className="text-left py-3 text-slate-400 font-medium">Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id} className="border-b border-slate-700/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-300">{product.sales.toLocaleString()}</td>
                  <td className="py-4 text-slate-300">{product.revenue}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      {product.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-sm ${
                        product.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {product.trend === 'up' ? '+' : '-'}
                        {Math.floor(Math.random() * 10)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}