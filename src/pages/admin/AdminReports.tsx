import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Check, X, Users } from 'lucide-react';
import { toast } from 'sonner';

interface UserAction {
  id: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  user_country: string;
  action_type: string;
  admin_action_by: string;
  created_at: string;
}

export function AdminReports() {
  const [actions, setActions] = useState<UserAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserActions();
  }, []);

  const fetchUserActions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_actions_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Error al cargar historial');
        return;
      }

      setActions(data || []);
    } catch (error) {
      toast.error('Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  const approvedCount = actions.filter(a => a.action_type === 'approved').length;
  const disapprovedCount = actions.filter(a => a.action_type === 'disapproved').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reportes</h1>
        <p className="text-slate-400">Historial de acciones de administrador</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Usuarios Aprobados</p>
              <p className="text-2xl font-bold text-white">{approvedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <X className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Usuarios Rechazados</p>
              <p className="text-2xl font-bold text-white">{disapprovedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Acciones</p>
              <p className="text-2xl font-bold text-white">{actions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions History Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Historial de Acciones</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-slate-400">Cargando historial...</p>
          </div>
        ) : actions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400">No hay acciones registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Usuario</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Teléfono</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">País</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Acción</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Admin</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {actions.map((action) => (
                  <tr key={action.id} className="hover:bg-slate-700/30 transition">
                    <td className="py-4 px-6">
                      <div className="text-white font-medium">{action.user_name}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {action.user_phone}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {action.user_country}
                    </td>
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        action.action_type === 'approved' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {action.action_type === 'approved' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {action.action_type === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {action.admin_action_by}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(action.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}