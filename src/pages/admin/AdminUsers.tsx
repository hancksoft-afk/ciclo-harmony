import { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', role: 'Usuario', status: 'Activo', lastLogin: '2024-01-15', avatar: '👤' },
    { id: 2, name: 'María García', email: 'maria@email.com', role: 'Moderador', status: 'Activo', lastLogin: '2024-01-14', avatar: '👩' },
    { id: 3, name: 'Carlos López', email: 'carlos@email.com', role: 'Usuario', status: 'Inactivo', lastLogin: '2024-01-10', avatar: '👨' },
    { id: 4, name: 'Ana Martín', email: 'ana@email.com', role: 'Usuario', status: 'Activo', lastLogin: '2024-01-15', avatar: '👱‍♀️' },
    { id: 5, name: 'David Ruiz', email: 'david@email.com', role: 'Admin', status: 'Activo', lastLogin: '2024-01-15', avatar: '🧑' },
  ];

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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Usuario</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Rol</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Estado</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Último Login</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : user.role === 'Moderador'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {user.status === 'Activo' ? (
                        <UserCheck className="w-4 h-4 text-green-400" />
                      ) : (
                        <UserX className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        user.status === 'Activo' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-300">{user.lastLogin}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition">
                        <Trash2 className="w-4 h-4" />
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
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700">
          <p className="text-slate-400 text-sm">Mostrando 1-5 de 125 usuarios</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition">
              Anterior
            </button>
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition">2</button>
            <button className="px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition">3</button>
            <button className="px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}