import { useState, useEffect } from 'react';
import { FileText, Download, Users, CheckCircle, XCircle, Eye, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface Register150User {
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

export function AdminReports2() {
  const [actions, setActions] = useState<UserAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Register150User | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_actions_history2')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActions(data || []);
    } catch (error) {
      console.error('Error fetching actions:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los reportes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const viewUserInvoice = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('register150')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      setSelectedUser(data);
      setShowInvoiceModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del usuario",
        variant: "destructive"
      });
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Nombre', 'Teléfono', 'País', 'Acción', 'Administrador', 'Fecha'],
      ...actions.map(action => [
        action.user_name,
        action.user_phone,
        action.user_country,
        action.action_type === 'approved' ? 'Aprobado' : 'Desaprobado',
        action.admin_action_by,
        new Date(action.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reportes150_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const approvedActions = actions.filter(a => a.action_type === 'approved');
  const disapprovedActions = actions.filter(a => a.action_type === 'disapproved');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reportes2 (150 USD)</h1>
          <p className="text-slate-400">Historial de acciones administrativas para usuarios de 150 USD</p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{actions.length}</p>
              <p className="text-slate-400 text-sm">Total Acciones</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{approvedActions.length}</p>
              <p className="text-slate-400 text-sm">Aprobados</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-white">{disapprovedActions.length}</p>
              <p className="text-slate-400 text-sm">Desaprobados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Cargando reportes...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-blue-500/20">
                <tr>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Nombre</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Teléfono</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">País</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Acción</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Admin</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Fecha</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Ver Factura</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action) => (
                  <tr key={action.id} className="border-b border-slate-700/30 hover:bg-gradient-to-r hover:from-slate-700/10 hover:to-slate-600/10 transition-all duration-200">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {action.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-white font-medium">{action.user_name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{action.user_phone}</td>
                    <td className="p-4 text-slate-300">{action.user_country}</td>
                    <td className="p-4">
                      <div className={`flex items-center gap-2 ${
                        action.action_type === 'approved' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {action.action_type === 'approved' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {action.action_type === 'approved' ? 'Aprobado' : 'Desaprobado'}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{action.admin_action_by}</td>
                    <td className="p-4 text-slate-300">
                      {new Date(action.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => viewUserInvoice(action.user_id)}
                        className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs rounded-lg transition"
                        title="Ver Factura"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Factura
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
            
            <div className="rounded-2xl bg-gradient-to-b from-[#f97316] to-[#991b1b] border-white/10 overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 p-5 bg-gradient-to-b from-[#991b1b] to-[#f97316] relative">
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
                      <p className="text-xs text-white font-inter">Binance Pay:</p>
                      <p className="font-medium text-slate-200">{selectedUser.binance_id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white font-inter">Método de Pago:</p>
                      <p className="font-medium text-slate-200">{selectedUser.payment_method}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/10 my-4" />

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-white font-inter">Fecha de registro:</p>
                      <p className="text-sm font-medium text-slate-200">
                        {new Date(selectedUser.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white font-inter">Estado:</p>
                      <p className={`text-sm font-medium ${selectedUser.has_money ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedUser.has_money ? 'Aprobado' : 'Pendiente'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}