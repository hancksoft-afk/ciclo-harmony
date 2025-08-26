import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Check, X, Receipt, Calendar, TicketCheck, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';

interface RegisterUser {
  id: string;
  name: string;
  phone: string;
  country: string;
  invitee: string;
  has_money: boolean;
  binance_id: string | null;
  binance_id_step2: string | null;
  binance_id_step3: string | null;
  ticket_id: string | null;
  created_at: string;
  payment_method: string;
  codigo_full: string | null;
  codigo_masked: string | null;
}

export function AdminUsers() {
  console.log('AdminUsers component loaded - new version');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<RegisterUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RegisterUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('register')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
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

  const handleApprove = async (userId: string) => {
    toast({
      title: "Aprobado",
      description: "Usuario aprobado exitosamente",
    });
  };

  const handleDisapprove = async (userId: string) => {
    toast({
      title: "Desaprobado", 
      description: "Usuario desaprobado",
      variant: "destructive"
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
          <p className="text-slate-400">Administra los usuarios de tu plataforma</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition">
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            />
          </div>
          
          <select className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition">
            <option>Todos los roles</option>
            <option>Admin</option>
            <option>Moderador</option>
            <option>Usuario</option>
          </select>
          
          <select className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition">
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:text-white transition">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
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
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Nombres</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">WhatsApp</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">País</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Invita a</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Código</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">ID Orden</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">ID Admin</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Fecha</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-slate-400 text-sm">{user.codigo_masked || 'Sin código'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-300">{user.phone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">
                        {user.country}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-300">{user.invitee}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-300 text-sm font-mono">{user.codigo_full || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-300 text-sm">{user.binance_id_step2 || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-300 text-sm">{user.binance_id_step3 || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.created_at).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleApprove(user.id)}
                          className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded transition"
                          title="Aprobar"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDisapprove(user.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition"
                          title="Desaprobar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setShowInvoiceModal(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition" 
                          title="Ver factura"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700">
          <p className="text-slate-400 text-sm">Mostrando {filteredUsers.length} usuarios</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition">
              Anterior
            </button>
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedUser && (
        <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
          <DialogOverlay className="fixed inset-0 bg-black/80 z-50" />
          <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] border-0 bg-transparent p-0 shadow-none">
            <div className="relative max-h-[90vh] overflow-y-auto">
              <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-2xl">
                <div className="flex items-center justify-end p-4">
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 md:p-8">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-2 font-inter">
                        <TicketCheck className="w-5 h-5 text-rose-300" />
                        Factura del Usuario
                      </h3>
                      <span className="text-xs text-slate-300/80">registrado</span>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-b from-[#1e06afe6] to-[#00054d] border-white/10 overflow-hidden shadow-2xl">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 p-5 bg-gradient-to-b from-[#00054d] to-[#1e06afe6] relative">
                          <div className="flex flex-col h-full justify-between space-y-4">
                            <div>
                              <p className="text-xs tracking-wider text-white font-inter"># ADMIT ONE</p>
                              <p className="mt-3 text-xs text-white font-inter">ID</p>
                              <p className="text-sm font-medium text-slate-200">{selectedUser.id.substr(0, 8).toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-white font-inter">ID de Orden</p>
                              <p className="text-sm font-medium text-amber-300">{selectedUser.binance_id_step2 || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-white font-inter">ID de Administrador</p>
                              <p className="text-sm font-medium text-amber-300">{selectedUser.binance_id_step3 || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg sm:text-xl font-semibold tracking-tight text-amber-300 font-inter">
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
                              <p className="text-xs text-white font-inter">Código Completo:</p>
                              <p className="font-medium text-slate-200 font-mono">{selectedUser.codigo_full || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white font-inter">Ticket ID:</p>
                              <p className="font-medium text-slate-200 font-mono">{selectedUser.ticket_id || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="mt-6 rounded-xl border border-amber-400/20 bg-neutral-900/40 p-3">
                            <div className="h-16 w-full rounded-md bg-[repeating-linear-gradient(90deg,rgba(251,191,36,1)_0_8px,transparent_8px_16px)]" />
                          </div>

                          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                            <p className="font-inter">Factura del usuario registrado.</p>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-inter">Código</span>
                              <span className="font-medium text-amber-300 font-mono">{selectedUser.codigo_masked || 'xxxxxxxxxxxx'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowInvoiceModal(false)}
                          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 hover:from-cyan-500/30 hover:to-violet-500/30 border border-white/10 text-slate-100 transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}