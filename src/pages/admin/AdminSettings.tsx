import { useState, useEffect } from 'react';
import { QrCode, Clock, Plus, Edit, X, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface QRPayment {
  id: string;
  code_id: string;
  time_remaining: number;
  qr_image: string;
  route: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export function AdminSettings() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [qrPayments, setQrPayments] = useState<QRPayment[]>([]);
  const [editingQR, setEditingQR] = useState<QRPayment | null>(null);
  const [formData, setFormData] = useState({
    code_id: '',
    time_remaining: 24,
    qr_image: '',
    route: 'register',
    is_admin: false
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // QR payment creation logic would go here
      toast({
        title: "Éxito",
        description: "Código QR creado exitosamente",
      });
      
      setShowCreateModal(false);
      setFormData({ code_id: '', time_remaining: 24, qr_image: '', route: 'register', is_admin: false });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el código QR",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-slate-400">Gestiona los códigos QR de pago</p>
      </div>
      
      {/* QR Register Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Pago por QR - /register
            </h2>
            <p className="text-slate-400">Gestiona los códigos QR para el formulario de registro principal</p>
          </div>
          <button 
            onClick={() => {
              setFormData({...formData, route: 'register'});
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
          >
            <Plus className="w-4 h-4" />
            Nuevo QR
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3">Pago por QR Ciclo vida</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">Código ID: <span className="text-blue-400">No configurado</span></p>
              <p className="text-slate-300">Tiempo restante: <span className="text-amber-400">-- horas</span></p>
              <div className="mt-3 p-3 bg-slate-600/50 rounded border-2 border-dashed border-slate-500 text-center">
                <QrCode className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="text-slate-400 text-xs">Código QR no disponible</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3">Pago de QR (Admin)</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">Código ID: <span className="text-blue-400">No configurado</span></p>
              <p className="text-slate-300">Tiempo restante: <span className="text-amber-400">-- horas</span></p>
              <div className="mt-3 p-3 bg-slate-600/50 rounded border-2 border-dashed border-slate-500 text-center">
                <QrCode className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="text-slate-400 text-xs">Código QR no disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Register150 Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Pago por QR - /register150
            </h2>
            <p className="text-slate-400">Gestiona los códigos QR para el formulario de registro 150</p>
          </div>
          <button 
            onClick={() => {
              setFormData({...formData, route: 'register150'});
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Nuevo QR
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3">Pago por QR Ciclo vida</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">Código ID: <span className="text-blue-400">No configurado</span></p>
              <p className="text-slate-300">Tiempo restante: <span className="text-amber-400">-- horas</span></p>
              <div className="mt-3 p-3 bg-slate-600/50 rounded border-2 border-dashed border-slate-500 text-center">
                <QrCode className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="text-slate-400 text-xs">Código QR no disponible</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3">Pago de QR (Admin)</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">Código ID: <span className="text-blue-400">No configurado</span></p>
              <p className="text-slate-300">Tiempo restante: <span className="text-amber-400">-- horas</span></p>
              <div className="mt-3 p-3 bg-slate-600/50 rounded border-2 border-dashed border-slate-500 text-center">
                <QrCode className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="text-slate-400 text-xs">Código QR no disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create QR Modal */}
      {showCreateModal && (
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogOverlay className="fixed inset-0 bg-black/80 z-50" />
          <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] border-0 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Nuevo Código QR</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Código ID
                </label>
                <input
                  type="text"
                  value={formData.code_id}
                  onChange={(e) => setFormData({...formData, code_id: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="Código único del QR"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tiempo restante (horas)
                </label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={formData.time_remaining}
                  onChange={(e) => setFormData({...formData, time_remaining: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  URL de la imagen QR
                </label>
                <input
                  type="url"
                  value={formData.qr_image}
                  onChange={(e) => setFormData({...formData, qr_image: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="https://ejemplo.com/qr-image.png"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.is_admin}
                    onChange={(e) => setFormData({...formData, is_admin: e.target.checked})}
                    className="rounded border-slate-600 bg-slate-700"
                  />
                  Es QR de administrador
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Crear QR
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}