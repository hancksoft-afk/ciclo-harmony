import { useState, useEffect } from 'react';
import { UserCheck, Download, Search, Calendar, DollarSign, CreditCard, FileText, Smartphone, MapPin, User, Code, CheckCircle, XCircle, X, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  nequi_phone: string | null;
}

export function AdminUsers2() {
  const [users, setUsers] = useState<Register150User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [selectedUser, setSelectedUser] = useState<Register150User | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [processedUserIds, setProcessedUserIds] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('register150')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch processed user IDs from history
      const { data: historyData, error: historyError } = await supabase
        .from('user_actions_history2')
        .select('user_id');

      if (historyError) throw historyError;

      const processedIds = historyData?.map(h => h.user_id) || [];
      setProcessedUserIds(processedIds);
      
      // Filter out users that have already been processed
      const pendingUsers = usersData?.filter(user => !processedIds.includes(user.id)) || [];
      setUsers(pendingUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('register150')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleApproval = async (userId: string, approved: boolean) => {
    setUpdating(true);
    try {
      // Update user status
      const { error } = await supabase
        .from('register150')
        .update({ has_money: approved })
        .eq('id', userId);

      if (error) throw error;

      // Get user data for history
      const user = users.find(u => u.id === userId);
      if (!user) {
        toast({
          title: "Error",
          description: "Usuario no encontrado",
          variant: "destructive"
        });
        return;
      }

      // Save to history
      const { error: historyError } = await supabase
        .from('user_actions_history2')
        .insert({
          user_id: userId,
          user_name: user.name,
          user_phone: user.phone,
          user_country: user.country,
          action_type: approved ? 'approved' : 'disapproved',
          admin_action_by: 'admin'
        });

      if (historyError) {
        console.error('Error saving to history:', historyError);
        toast({
          title: "Advertencia",
          description: "Usuario actualizado pero no se pudo guardar en el historial",
          variant: "destructive"
        });
        return;
      }

      // Remove user from local state
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      
      toast({
        title: approved ? "Aprobado" : "Desaprobado",
        description: approved ? "Usuario aprobado exitosamente" : "Usuario desaprobado",
      });

      // Navigate to Reports2 page
      navigate('/admin/reportes2');
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del usuario",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm) ||
                         user.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'approved') return matchesSearch && user.has_money;
    if (statusFilter === 'pending') return matchesSearch && !user.has_money;
    return matchesSearch;
  });

  const exportData = () => {
    const csvContent = [
      ['Nombre', 'WhatsApp', 'País', 'Invita a', 'Código', 'Dinero', 'Binance Pay', 'ID Orden', 'ID Admin', 'Fecha'],
      ...filteredUsers.map(user => [
        user.name,
        user.phone,
        user.country,
        user.invitee,
        user.codigo_masked || 'N/A',
        user.has_money ? 'Sí' : 'No',
        user.binance_id || 'N/A',
        user.order_id_1 || 'N/A',
        user.ticket_id || 'N/A',
        new Date(user.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios150_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Usuarios2 (150 USD)</h1>
          <p className="text-slate-400">Gestiona los usuarios registrados con plan de 150 USD</p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono o país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'approved' | 'pending')}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          >
            <option value="all">Todos los estados</option>
            <option value="approved">Aprobados</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>
      </div>


      {/* Users Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Cargando usuarios...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-blue-500/20">
                <tr>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Nombres</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">WhatsApp</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">País</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Invita a</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Código</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Dinero</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Información de Pago</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">ID Orden</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">ID Admin</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Fecha</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Acción</th>
                  <th className="text-left p-4 text-blue-300 font-semibold text-sm uppercase tracking-wider">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700/30 hover:bg-gradient-to-r hover:from-slate-700/10 hover:to-slate-600/10 transition-all duration-200 group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-xs text-slate-400">{user.codigo_masked || user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Smartphone className="w-4 h-4" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4" />
                        {user.country}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{user.invitee}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Code className="w-4 h-4" />
                        {user.codigo_full || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-2 ${user.has_money ? 'text-green-400' : 'text-red-400'}`}>
                        <DollarSign className="w-4 h-4" />
                        {user.has_money ? 'Sí' : 'No'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {user.payment_method === 'Binance + Nequi' && (
                          <>
                            {user.binance_id && (
                              <div className="flex items-center gap-2 text-slate-300">
                                <CreditCard className="w-4 h-4" />
                                <span className="text-xs text-blue-300">Binance Pay:</span>
                                <span>{user.binance_id}</span>
                              </div>
                            )}
                            {user.nequi_phone && (
                              <div className="flex items-center gap-2 text-slate-300">
                                <Smartphone className="w-4 h-4" />
                                <span className="text-xs text-green-300">ID Nequi:</span>
                                <span>{user.nequi_phone}</span>
                              </div>
                            )}
                          </>
                        )}
                        {user.payment_method === 'ID de Nequi' && (
                          <div className="flex items-center gap-2 text-slate-300">
                            <Smartphone className="w-4 h-4" />
                            <span className="text-xs text-green-300">ID Nequi:</span>
                            <span>{user.nequi_phone || 'N/A'}</span>
                          </div>
                        )}
                        {user.payment_method === 'Binance de Pay' && (
                          <div className="flex items-center gap-2 text-slate-300">
                            <CreditCard className="w-4 h-4" />
                            <span className="text-xs text-blue-300">Binance Pay:</span>
                            <span>{user.binance_id || 'N/A'}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{user.binance_id_step2 || 'N/A'}</td>
                    <td className="p-4 text-slate-300">{user.binance_id_step3 || 'N/A'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproval(user.id, true)}
                          disabled={updating}
                          className={`p-2 rounded-lg transition ${
                            user.has_money 
                              ? 'bg-green-600/20 text-green-400' 
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                          title="Aprobar"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApproval(user.id, false)}
                          disabled={updating}
                          className={`p-2 rounded-lg transition ${
                            !user.has_money 
                              ? 'bg-red-600/20 text-red-400' 
                              : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                          title="Desaprobar"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowInvoiceModal(true);
                          }}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                          title="Ver Factura"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                        title="Eliminar Usuario"
                      >
                        <X className="w-4 h-4" />
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
            
            <div className="rounded-2xl bg-gradient-to-b from-[#c14500] to-[#5b0101] border-white/10 overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 p-5 bg-gradient-to-b from-[#5b0101] to-[#c14500] relative">
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
                    {/* Mostrar información de plataforma de pago */}
                    <div>
                      <p className="text-xs text-white font-inter">Plataforma:</p>
                      <p className="font-medium text-slate-200">{selectedUser.payment_method}</p>
                    </div>
                    
                    {selectedUser.payment_method === 'Binance + Nequi' && (
                      <div className="col-span-2 sm:col-span-3 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-blue-300 font-inter">Binance:</p>
                          <p className="font-medium text-slate-200">{selectedUser.binance_id || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-green-300 font-inter">Nequi:</p>
                          <p className="font-medium text-slate-200">{selectedUser.nequi_phone || 'N/A'}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedUser.payment_method === 'ID de Nequi' && (
                      <div>
                        <p className="text-xs text-green-300 font-inter">Nequi:</p>
                        <p className="font-medium text-slate-200">{selectedUser.nequi_phone || 'N/A'}</p>
                      </div>
                    )}
                    
                    {selectedUser.payment_method === 'Binance de Pay' && (
                      <div>
                        <p className="text-xs text-blue-300 font-inter">Binance:</p>
                        <p className="font-medium text-slate-200">{selectedUser.binance_id || 'N/A'}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 rounded-xl border border-amber-400/20 bg-neutral-900/40 p-3">
                    <div className="h-16 w-full rounded-md bg-gradient-to-r from-amber-400 via-transparent to-amber-400" 
                         style={{backgroundImage: 'repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 8px, transparent 8px, transparent 16px)'}} />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-white">
                    <p className="text-white">Conserva este ticket para futuras referencias.</p>
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
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg"
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