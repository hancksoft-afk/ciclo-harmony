import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Mail, Lock, Eye, EyeOff, Shield, Check, ArrowRight } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (success) {
      navigate('/adminhub/dashboard');
    } else {
      setError('Credenciales inválidas');
    }
    
    setLoading(false);
  };

  const features = [
    'Dashboard completo con métricas en tiempo real',
    'Gestión avanzada de usuarios y permisos',
    'Reportes y analytics detallados',
    'Sistema de notificaciones inteligente',
    'Seguridad de nivel empresarial',
    'Soporte técnico 24/7'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Bienvenido a AdminHub</h1>
            <p className="text-slate-400">Accede a tu panel de administración</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@adminhub.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-slate-800"
                />
                <span className="ml-2 text-sm text-slate-300">Recordarme</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 transition"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              ¿No tienes cuenta?{' '}
              <button className="text-blue-400 hover:text-blue-300 transition">
                Regístrate aquí
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h3 className="text-sm font-medium text-blue-300 mb-2">Credenciales de Demo:</h3>
            <p className="text-xs text-blue-200">Email: admin@adminhub.com</p>
            <p className="text-xs text-blue-200">Contraseña: admin123</p>
          </div>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-4">Panel de Administración</h2>
          <p className="text-xl text-blue-100 mb-8">Potente y Elegante</p>
          
          <p className="text-blue-50 mb-8 leading-relaxed">
            Gestiona tu plataforma con herramientas avanzadas y una interfaz intuitiva diseñada para maximizar tu productividad.
          </p>

          <ul className="space-y-4 mb-12">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-blue-50">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-green-300" />
              <h3 className="text-lg font-semibold">Seguridad Garantizada</h3>
            </div>
            <p className="text-blue-100 text-sm">
              Autenticación de dos factores y encriptación end-to-end
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}