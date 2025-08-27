import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  LayoutDashboard, Users, BarChart3, Settings, Bell, 
  FileText, Shield, LogOut, Menu, X, ChevronDown,
  TrendingUp, UserCheck, CreditCard, MessageSquare
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function AdminSidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { logout, user } = useAdminAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/adminhub/dashboard', icon: LayoutDashboard },
    { name: 'Usuarios', href: '/adminhub/users', icon: Users },
    { name: 'Usuarios2', href: '/adminhub/users2', icon: UserCheck },
    { name: 'Analytics', href: '/adminhub/analytics', icon: BarChart3 },
    { name: 'Reportes', href: '/adminhub/reportes', icon: FileText },
    { name: 'Reportes2', href: '/adminhub/reportes2', icon: FileText },
    { name: 'Notificaciones', href: '/adminhub/notifications', icon: Bell },
    { name: 'Configuración', href: '/adminhub/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg"
      >
        {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out
        ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-64'}
        bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-white font-bold text-lg">AdminHub</h1>
                <p className="text-slate-400 text-xs">Panel de Control</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <div
                key={item.name}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.name}</span>}
                {!collapsed && isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="border-t border-slate-700 p-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {showUserMenu && !collapsed && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-red-400 hover:bg-slate-700/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>

          {collapsed && (
            <button
              onClick={handleLogout}
              className="w-full mt-2 p-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-slate-700/50 transition-colors flex items-center justify-center"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}