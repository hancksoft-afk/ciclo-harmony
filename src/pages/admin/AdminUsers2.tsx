import { useState, useEffect } from 'react';
import { UserCheck, Download, Search, Calendar, DollarSign, CreditCard, FileText, Smartphone, MapPin, User, Code, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  order_id_1: string | null;
  ticket_id: string | null;
  created_at: string;
  updated_at: string;
  payment_method: string;
}

export function AdminUsers2() {
  const [users, setUsers] = useState<Register150User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [selectedUser, setSelectedUser] = useState<Register150User | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('register150')
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

  const handleApproval = async (userId: string, approved: boolean) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('register150')
        .update({ has_money: approved })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, has_money: approved } : user
      ));

      toast({
        title: approved ? "Usuario aprobado" : "Usuario desaprobado",
        description: `El estado del usuario ha sido actualizado`,
      });
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{users.length}</p>
              <p className="text-slate-400 text-sm">Total Usuarios</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.has_money).length}</p>
              <p className="text-slate-400 text-sm">Aprobados</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-white">{users.filter(u => !u.has_money).length}</p>
              <p className="text-slate-400 text-sm">Pendientes</p>
            </div>
          </div>
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
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="text-left p-4 text-slate-300 font-medium">Nombres</th>
                  <th className="text-left p-4 text-slate-300 font-medium">WhatsApp</th>
                  <th className="text-left p-4 text-slate-300 font-medium">País</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Invita a</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Código</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Dinero</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Binance Pay</th>
                  <th className="text-left p-4 text-slate-300 font-medium">ID Orden</th>
                  <th className="text-left p-4 text-slate-300 font-medium">ID Admin</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Fecha</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
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
                        {user.codigo_masked || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-2 ${user.has_money ? 'text-green-400' : 'text-red-400'}`}>
                        <DollarSign className="w-4 h-4" />
                        {user.has_money ? 'Sí' : 'No'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <CreditCard className="w-4 h-4" />
                        {user.binance_id || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{user.order_id_1 || 'N/A'}</td>
                    <td className="p-4 text-slate-300">{user.ticket_id || 'N/A'}</td>
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
                          disabled={updating || user.has_money}
                          className={`p-2 rounded-lg transition ${
                            user.has_money 
                              ? 'bg-green-600/20 text-green-400 cursor-not-allowed' 
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                          title="Aprobar"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApproval(user.id, false)}
                          disabled={updating || !user.has_money}
                          className={`p-2 rounded-lg transition ${
                            !user.has_money 
                              ? 'bg-red-600/20 text-red-400 cursor-not-allowed' 
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
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Factura</h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Usuario:</span>
                <span className="text-white">{selectedUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">WhatsApp:</span>
                <span className="text-white">{selectedUser.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">País:</span>
                <span className="text-white">{selectedUser.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Método de Pago:</span>
                <span className="text-white">{selectedUser.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ID Admin:</span>
                <span className="text-white">{selectedUser.ticket_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fecha:</span>
                <span className="text-white">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estado:</span>
                <span className={selectedUser.has_money ? 'text-green-400' : 'text-red-400'}>
                  {selectedUser.has_money ? 'Aprobado' : 'Pendiente'}
                </span>
              </div>
              <div className="border-t border-slate-600 pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-300">Total:</span>
                  <span className="text-white">$150.00 USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}