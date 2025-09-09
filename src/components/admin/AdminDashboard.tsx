import { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp, Settings, Eye, EyeOff, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNotificationContext } from '@/components/admin/AdminLayout';
import { useNavigate } from 'react-router-dom';

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: boolean;
}

export function AdminDashboard() {
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { showNotifications, setShowNotifications } = useNotificationContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('Fetching system settings...');
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      console.log('Settings data:', data);
      console.log('Settings error:', error);

      if (error) throw error;

      const settingsMap: Record<string, boolean> = {};
      data?.forEach((setting: SystemSetting) => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });
      
      console.log('Settings map:', settingsMap);
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las configuraciones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = async (key: string) => {
    try {
      const newValue = !settings[key];
      
      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: newValue })
        .eq('setting_key', key);

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: newValue }));
      
      toast({
        title: "Configuración actualizada",
        description: `${getSettingLabel(key)} ${newValue ? 'activado' : 'desactivado'}`,
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración",
        variant: "destructive"
      });
    }
  };

  const getSettingLabel = (key: string) => {
    switch (key) {
      case 'register_25_visible': return 'Card 25 USD';
      case 'register_150_visible': return 'Registro 150 USD';
      case 'register_closed_message': return 'Mensaje Cerrado';
      case 'eduplatform_visible': return 'EduPlatform';
      default: return key;
    }
  };

  const getSettingDescription = (key: string) => {
    switch (key) {
      case 'register_25_visible': return 'Controla la visibilidad de cards de 25 USD';
      case 'register_150_visible': return 'Permite el registro con plan de 150 USD';
      case 'register_closed_message': return 'Muestra mensaje cerrado en /register';
      case 'eduplatform_visible': return 'Activa la plataforma educativa';
      default: return 'Configuración del sistema';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Cargando dashboard...</div>
      </div>
    );
  }

  console.log('Rendering dashboard with settings:', settings);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Panel de control y configuraciones del sistema</p>
        </div>
      </div>

      {/* Notification Toggle Card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              showNotifications ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'
            }`}>
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">Mostrar Notificaciones</p>
              <p className="text-slate-400 text-sm">Controla la visibilidad del modal de notificaciones</p>
            </div>
          </div>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
              showNotifications ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className={`w-2 h-2 rounded-full ${showNotifications ? 'bg-blue-400' : 'bg-gray-400'}`}></div>
          <span className={`text-sm font-medium ${showNotifications ? 'text-blue-400' : 'text-gray-400'}`}>
            {showNotifications ? 'Modal Visible' : 'Modal Oculto'}
          </span>
        </div>
      </div>

      {/* Ciclo de Vida Toggle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Registro 25 USD */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              settings['register_25_visible'] ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              {settings['register_25_visible'] ? (
                <Eye className="w-8 h-8 text-white" />
              ) : (
                <EyeOff className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Card 25 USD</h3>
              <p className="text-slate-400 text-sm mt-1">Controla visibilidad de cards</p>
            </div>
            <button
              onClick={() => toggleSetting('register_25_visible')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                settings['register_25_visible'] ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${
                  settings['register_25_visible'] ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${settings['register_25_visible'] ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className={`text-sm font-medium ${settings['register_25_visible'] ? 'text-green-400' : 'text-red-400'}`}>
                {settings['register_25_visible'] ? 'Abierto' : 'Cerrado'}
              </span>
            </div>
          </div>
        </div>

        {/* Registro 150 USD */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              settings['register_150_visible'] ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              {settings['register_150_visible'] ? (
                <Eye className="w-8 h-8 text-white" />
              ) : (
                <EyeOff className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Registro 150 USD</h3>
              <p className="text-slate-400 text-sm mt-1">Control de visibilidad</p>
            </div>
            <button
              onClick={() => toggleSetting('register_150_visible')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                settings['register_150_visible'] ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${
                  settings['register_150_visible'] ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${settings['register_150_visible'] ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className={`text-sm font-medium ${settings['register_150_visible'] ? 'text-green-400' : 'text-red-400'}`}>
                {settings['register_150_visible'] ? 'Abierto' : 'Cerrado'}
              </span>
            </div>
          </div>
        </div>

        {/* Mensaje Registro Cerrado */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              settings['register_closed_message'] ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'
            }`}>
              {settings['register_closed_message'] ? (
                <EyeOff className="w-8 h-8 text-white" />
              ) : (
                <Eye className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Mensaje Cerrado</h3>
              <p className="text-slate-400 text-sm mt-1">Controla /register cerrado</p>
            </div>
            <button
              onClick={() => toggleSetting('register_closed_message')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                settings['register_closed_message'] ? 'bg-red-600' : 'bg-green-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${
                  settings['register_closed_message'] ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${settings['register_closed_message'] ? 'bg-red-400' : 'bg-green-400'}`}></div>
              <span className={`text-sm font-medium ${settings['register_closed_message'] ? 'text-red-400' : 'text-green-400'}`}>
                {settings['register_closed_message'] ? 'Cerrado' : 'Abierto'}
              </span>
            </div>
          </div>
        </div>

        {/* EduPlatform */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              settings['eduplatform_visible'] ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              {settings['eduplatform_visible'] ? (
                <Eye className="w-8 h-8 text-white" />
              ) : (
                <EyeOff className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">EduPlatform</h3>
              <p className="text-slate-400 text-sm mt-1">Control de visibilidad</p>
            </div>
            <button
              onClick={() => toggleSetting('eduplatform_visible')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                settings['eduplatform_visible'] ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${
                  settings['eduplatform_visible'] ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${settings['eduplatform_visible'] ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className={`text-sm font-medium ${settings['eduplatform_visible'] ? 'text-green-400' : 'text-red-400'}`}>
                {settings['eduplatform_visible'] ? 'Abierto' : 'Cerrado'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-slate-300 text-sm">Nuevo usuario registrado - Juan Pérez</span>
            <span className="text-slate-500 text-xs ml-auto">Hace 5 min</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-slate-300 text-sm">Configuración actualizada - Registro 25 USD</span>
            <span className="text-slate-500 text-xs ml-auto">Hace 15 min</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-slate-300 text-sm">Notificación publicada - Bienvenida</span>
            <span className="text-slate-500 text-xs ml-auto">Hace 1 hora</span>
          </div>
        </div>
      </div>
    </div>
  );
}