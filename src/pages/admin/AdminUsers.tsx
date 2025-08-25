import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Check, X, Receipt, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RegisterUser {
  id: string;
  name: string;
  phone: string;
  country: string;
  invitee: string;
  has_money: boolean;
  binance_id: string | null;
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
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Dinero</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Binance Pay</th>
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
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.has_money ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className={`text-sm font-medium ${user.has_money ? 'text-green-400' : 'text-red-400'}`}>
                          {user.has_money ? 'Sí' : 'No'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-300 text-sm">{user.binance_id || 'N/A'}</p>
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
                        <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition" title="Ver factura">
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
    </div>
  );
}