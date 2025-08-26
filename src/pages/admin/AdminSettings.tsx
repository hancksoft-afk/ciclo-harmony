import { useState, useEffect } from 'react';
import { Settings, QrCode, Clock, Image, Upload, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QrSetting {
  id: string;
  type: 'register' | 'register150';
  code_id: string;
  remaining_time: number;
  qr_image_url: string | null;
  is_active: boolean;
}

export function AdminSettings() {
  const [qrSettings, setQrSettings] = useState<Record<string, QrSetting>>({});
  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQrSettings();
  }, []);

  const fetchQrSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('qr_settings')
        .select('*')
        .in('type', ['register', 'register150']);

      if (error) throw error;

      const settingsMap: Record<string, QrSetting> = {};
      data?.forEach((setting: any) => {
        if (setting.type === 'register' || setting.type === 'register150') {
          settingsMap[setting.type] = setting as QrSetting;
        }
      });

      setQrSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching QR settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (type: string, file: File) => {
    setImageFiles(prev => ({ ...prev, [type]: file }));
    const url = URL.createObjectURL(file);
    setImagePreviews(prev => ({ ...prev, [type]: url }));
  };

  const uploadImage = async (type: string): Promise<string | null> => {
    const file = imageFiles[type];
    if (!file) return null;

    const fileName = `qr-${type}-${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage
      .from('qr-codes')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('qr-codes')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSave = async (type: 'register' | 'register150') => {
    setUploading(true);
    try {
      const formData = new FormData(document.getElementById(`form-${type}`) as HTMLFormElement);
      const codeId = formData.get('code_id') as string;
      const remainingTime = parseInt(formData.get('remaining_time') as string);

      let qrImageUrl = qrSettings[type]?.qr_image_url || null;
      if (imageFiles[type]) {
        qrImageUrl = await uploadImage(type);
      }

      const settingData = {
        type,
        code_id: codeId,
        remaining_time: remainingTime,
        qr_image_url: qrImageUrl,
        is_active: true
      };

      if (qrSettings[type]) {
        // Update existing
        const { error } = await supabase
          .from('qr_settings')
          .update(settingData)
          .eq('id', qrSettings[type].id);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('qr_settings')
          .insert([settingData]);
        if (error) throw error;
      }

      toast({
        title: "Configuración guardada",
        description: `QR ${type === 'register' ? '25 USD' : '150 USD'} actualizado exitosamente`,
      });

      fetchQrSettings();
      setImageFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[type];
        return newFiles;
      });
      setImagePreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[type];
        return newPreviews;
      });
    } catch (error) {
      console.error('Error saving QR settings:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const QrForm = ({ type, title }: { type: 'register' | 'register150'; title: string }) => {
    const setting = qrSettings[type];
    const imagePreview = imagePreviews[type] || setting?.qr_image_url;

    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <QrCode className={`w-5 h-5 ${type === 'register' ? 'text-blue-400' : 'text-green-400'}`} />
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>

        <form id={`form-${type}`} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Código ID
            </label>
            <input
              name="code_id"
              type="text"
              defaultValue={setting?.code_id || ''}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tiempo restante (minutos)
            </label>
            <input
              name="remaining_time"
              type="number"
              defaultValue={setting?.remaining_time || 1440}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Código QR imagen
            </label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center">
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview}
                    alt="QR Code Preview"
                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFiles(prev => {
                        const newFiles = { ...prev };
                        delete newFiles[type];
                        return newFiles;
                      });
                      setImagePreviews(prev => {
                        const newPreviews = { ...prev };
                        delete newPreviews[type];
                        return newPreviews;
                      });
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remover imagen
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm mb-2">Arrastra una imagen aquí o haz clic para seleccionar</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageChange(type, file);
                    }}
                    className="hidden"
                    id={`image-upload-${type}`}
                  />
                  <label
                    htmlFor={`image-upload-${type}`}
                    className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Seleccionar archivo
                  </label>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSave(type)}
            disabled={uploading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r ${
              type === 'register' 
                ? 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
            } text-white rounded-lg transition disabled:opacity-50`}
          >
            <Save className="w-4 h-4" />
            {uploading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-slate-400">Gestiona los códigos QR de pago</p>
      </div>

      {/* QR Settings */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Cargando configuraciones...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QrForm type="register" title="Pago por QR Ciclo vida" />
            <QrForm type="register150" title="Pago de QR (Admin)" />
          </div>
        )}
      </div>
    </div>
  );
}