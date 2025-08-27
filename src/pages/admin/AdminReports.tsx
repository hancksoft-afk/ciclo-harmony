import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Check, X, Users, FileText } from 'lucide-react';
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

interface RegisterUser {
  id: string;
  name: string;
  phone: string;
  country: string;
  invitee: string;
  codigo_full: string | null;
  codigo_masked: string | null;
  has_money: boolean;
  binance_id: string | null;
  binance_id_step2: string | null;
  binance_id_step3: string | null;
  order_id_1: string | null;
  order_id_2: string | null;
  ticket_id: string | null;
  created_at: string;
  updated_at: string;
  payment_method: string;
}

export function AdminReports() {
  const [actions, setActions] = useState<UserAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<RegisterUser | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

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

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('register')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        toast.error('Error al cargar datos del usuario');
        return;
      }

      setSelectedUser(data);
      setShowInvoiceModal(true);
    } catch (error) {
      toast.error('Error al cargar datos del usuario');
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
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Factura</th>
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
                    <td className="py-4 px-6">
                      <button
                        onClick={() => fetchUserData(action.user_id)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                        title="Ver Factura"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-rose-300" />
                <div>
                  <h3 className="text-2xl font-bold text-rose-300 font-inter">
                    Tu Ticket
                  </h3>
                  <span className="text-xs text-slate-300/80 font-inter">finalizado</span>
                </div>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="p-2 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="rounded-2xl bg-gradient-to-b from-[#1e06afe6] to-[#00054d] border-white/10 overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 p-5 bg-gradient-to-b from-[#00054d] to-[#1e06afe6] relative">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <p className="text-xs tracking-wider text-white font-inter"># ADMIT ONE</p>
                      <p className="mt-3 text-xs text-white font-inter">ID</p>
                      <p className="text-sm font-medium text-slate-200 font-mono">{selectedUser.ticket_id || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wider text-white font-inter">ID de Orden</p>
                      <p className="text-sm font-medium text-amber-300 font-mono">{selectedUser.binance_id_step2 || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white font-inter">ID de Administrador</p>
                      <p className="text-sm font-medium text-amber-300 font-mono">{selectedUser.binance_id_step3 || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg sm:text-xl font-semibold tracking-tight text-[#f9ff01] font-inter">
                        Detalles del registro
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-white font-inter">Titular</p>
                      <p className="text-sm font-medium text-slate-200">{selectedUser.name}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/10 my-4" />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-white font-inter">Nombres:</p>
                      <p className="font-medium text-slate-200">{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white font-inter">WhatsApp:</p>
                      <p className="font-medium text-slate-200">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white font-inter">País:</p>
                      <p className="font-medium text-slate-200">{selectedUser.country}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white font-inter">Invita a:</p>
                      <p className="font-medium text-slate-200">{selectedUser.invitee}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white font-inter">Dinero:</p>
                      <p className="font-medium text-slate-200">{selectedUser.has_money ? 'Sí' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white font-inter">Binance de Pay:</p>
                      <p className="font-medium text-slate-200">{selectedUser.binance_id || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-amber-400/20 bg-neutral-900/40 p-3">
                    <div className="h-16 w-full rounded-md bg-[repeating-linear-gradient(90deg,rgba(251,191,36,1)_0_8px,transparent_8px_16px)]" />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-white">
                    <p className="font-inter">Conserva este ticket para futuras referencias.</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-inter">Código</span>
                      <span className="font-mono text-amber-300">
                        {selectedUser.codigo_masked || `${Math.random().toString(36).substr(2, 4).toUpperCase()}xxxxxxxxxxxx`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}