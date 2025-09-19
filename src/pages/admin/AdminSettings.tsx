import { useState, useEffect } from 'react';
import { Settings, QrCode, Clock, Image, Upload, Save, X, Trash2, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface QrSetting {
  id: string;
  type: string;
  code_id: string;
  remaining_time: number;
  price_usd?: number;
  price_cop?: number;
  qr_image_url: string | null;
  qr_image_url2: string | null;
  is_active: boolean;
}

interface QrFormProps {
  title: string;
  description: string;
  type: string;
  setting: QrSetting | undefined;
  onSave: (type: string) => void;
  loading: boolean;
  isUploading: boolean;
  imageFiles: Record<string, File>;
  imagePreviews: Record<string, string>;
  onImageChange: (type: string, file: File) => void;
}

interface QrFormGroupProps {
  title: string;
  qrSettings: Array<{
    title: string;
    description: string;
    type: string;
  }>;
  onSave: (type: string) => void;
  loading: boolean;
  isUploading: boolean;
  imageFiles: Record<string, File>;
  imagePreviews: Record<string, string>;
  onImageChange: (type: string, file: File) => void;
  settings: QrSetting[];
}

export function AdminSettings() {
  const [qrSettings, setQrSettings] = useState<QrSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [inputValues, setInputValues] = useState<{ [key: string]: { code_id: string; remaining_time: string; price_usd: string; price_cop: string } }>({});

  // Función para formatear precios COP con separadores de miles
  const formatCOPPrice = (value: string | number): string => {
    if (!value) return '';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;
    if (isNaN(numValue)) return '';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue);
  };

  // Función para parsear precios COP (acepta tanto 100000 como 100.000)
  const parseCOPPrice = (value: string): number => {
    if (!value) return 0;
    // Remover puntos y convertir a número
    const cleanValue = value.replace(/\./g, '');
    return parseFloat(cleanValue) || 0;
  };
  const [systemSettings, setSystemSettings] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchQrSettings();
    fetchSystemSettings();
  }, []);

  // Actualizar inputValues cuando qrSettings cambie
  useEffect(() => {
    const newInputValues: { [key: string]: { code_id: string; remaining_time: string; price_usd: string; price_cop: string } } = {};
    qrSettings.forEach(setting => {
      newInputValues[setting.type] = {
        code_id: setting.code_id || '',
        remaining_time: setting.remaining_time.toString() || '1440',
        price_usd: setting.price_usd?.toString() || '25.00',
        price_cop: setting.price_cop ? formatCOPPrice(setting.price_cop) : '100.000'
      };
    });
    // Solo actualizar si realmente hay cambios para evitar bucles infinitos
    setInputValues(prev => {
      const hasChanges = Object.keys(newInputValues).some(key => 
        !prev[key] || 
        prev[key].code_id !== newInputValues[key].code_id ||
        prev[key].remaining_time !== newInputValues[key].remaining_time ||
        prev[key].price_usd !== newInputValues[key].price_usd ||
        prev[key].price_cop !== newInputValues[key].price_cop
      );
      return hasChanges ? newInputValues : prev;
    });
  }, [qrSettings]);

  const fetchQrSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('qr_settings')
        .select('*')
        .in('type', ['register', 'register150', 'register_admin', 'register150_admin', 'register_nequi', 'register_admin_nequi', 'register150_nequi', 'register150_admin_nequi']);

      if (error) throw error;
      setQrSettings(data || []);
    } catch (error) {
      console.error('Error fetching QR settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .in('setting_key', ['binance_25_enabled', 'binance_150_enabled', 'nequi_25_enabled', 'nequi_150_enabled']);

      if (error) throw error;
      
      const settingsMap: { [key: string]: boolean } = {};
      data?.forEach(setting => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });
      setSystemSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching system settings:', error);
    }
  };

  const handleToggleSystem = async (settingKey: string, newValue: boolean) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: newValue })
        .eq('setting_key', settingKey);

      if (error) throw error;
      
      setSystemSettings(prev => ({ ...prev, [settingKey]: newValue }));
      toast({
        title: "Configuración actualizada",
        description: `${settingKey} ${newValue ? 'activado' : 'desactivado'}`,
      });
    } catch (error) {
      console.error('Error updating system setting:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración",
        variant: "destructive"
      });
    }
  };

  const handleImageChange = (type: string, file: File) => {
    setImageFiles(prev => ({ ...prev, [type]: file }));
    const url = URL.createObjectURL(file);
    setImagePreviews(prev => ({ ...prev, [type]: url }));
  };

  const handleImageRemove = (type: string) => {
    // Revoke the existing URL to free up memory
    if (imagePreviews[type]) {
      URL.revokeObjectURL(imagePreviews[type]);
    }
    
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
  };

  const uploadImage = async (type: string): Promise<string | null> => {
    const file = imageFiles[type];
    if (!file) return null;

    const fileName = `qr-${type}-${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage
      .from('qr-codes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('qr-codes')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSave = async (type: string) => {
    setIsUploading(true);
    try {
      const formData = new FormData(document.getElementById(`form-${type}`) as HTMLFormElement);
      const codeId = formData.get('code_id') as string;
      const remainingTime = parseInt(formData.get('remaining_time') as string);
      const priceUsd = parseFloat(formData.get('price_usd') as string);
      const priceCop = parseCOPPrice(formData.get('price_cop') as string);

      const existingSetting = qrSettings.find(setting => setting.type === type);
      let qrImageUrl = existingSetting?.qr_image_url || null;
      
      if (imageFiles[type]) {
        qrImageUrl = await uploadImage(type);
      }

      const settingData = {
        type,
        code_id: codeId,
        remaining_time: remainingTime,
        price_usd: priceUsd,
        price_cop: priceCop,
        qr_image_url: qrImageUrl,
        is_active: true
      };

      if (existingSetting) {
        // Update existing
        const { error } = await supabase
          .from('qr_settings')
          .update(settingData)
          .eq('id', existingSetting.id);
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
        description: `QR ${type} actualizado exitosamente`,
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
      setIsUploading(false);
    }
  };

  const handleSaveGroup = async (types: string[]) => {
    setIsUploading(true);
    console.log('handleSaveGroup called with types:', types);
    
    try {
      for (const type of types) {
        console.log(`Processing type: ${type}`);
        
        // Usar valores del estado en lugar del DOM
        const codeId = inputValues[type]?.code_id?.trim() || '';
        const remainingTime = parseInt(inputValues[type]?.remaining_time || '1440') || 1440;
        const priceUsd = parseFloat(inputValues[type]?.price_usd || '25.00') || 25.00;
        const priceCop = parseCOPPrice(inputValues[type]?.price_cop || '100000') || 100000;

        console.log(`Type: ${type}, Code ID: "${codeId}", Remaining Time: ${remainingTime}`);

        // Validación para admin
        if (type.includes('admin') && !codeId?.trim()) {
          console.log(`Admin type ${type} missing code_id`);
          toast({
            title: "Error",
            description: "El código admin es requerido",
            variant: "destructive"
          });
          continue;
        }

        const existingSetting = qrSettings.find(setting => setting.type === type);
        let qrImageUrl = existingSetting?.qr_image_url || null;
        
        console.log(`Existing setting for ${type}:`, existingSetting);
        console.log(`Image file for ${type}:`, imageFiles[type]);
        
        if (imageFiles[type]) {
          qrImageUrl = await uploadImage(type);
          console.log(`Uploaded image URL for ${type}:`, qrImageUrl);
        }

        const settingData = {
          type,
          code_id: codeId || '',
          remaining_time: remainingTime,
          price_usd: priceUsd,
          price_cop: priceCop,
          qr_image_url: qrImageUrl,
          is_active: true
        };

        console.log(`Saving data for ${type}:`, settingData);

        if (existingSetting) {
          // Update existing
          console.log(`Updating existing setting for ${type}`);
          const { error } = await supabase
            .from('qr_settings')
            .update(settingData)
            .eq('id', existingSetting.id);
          if (error) {
            console.error(`Update error for ${type}:`, error);
            throw error;
          }
        } else {
          // Insert new
          console.log(`Inserting new setting for ${type}`);
          const { error } = await supabase
            .from('qr_settings')
            .insert([settingData]);
          if (error) {
            console.error(`Insert error for ${type}:`, error);
            throw error;
          }
        }
        
        console.log(`Successfully processed type: ${type}`);
      }

      toast({
        title: "Configuración guardada",
        description: "Todas las configuraciones QR han sido actualizadas exitosamente",
      });

      fetchQrSettings();
      
      // Clear all files and previews for this group
      setImageFiles(prev => {
        const newFiles = { ...prev };
        types.forEach(type => delete newFiles[type]);
        return newFiles;
      });
      setImagePreviews(prev => {
        const newPreviews = { ...prev };
        types.forEach(type => delete newPreviews[type]);
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
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    try {
      const { error } = await supabase
        .from('qr_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Configuración eliminada",
        description: `QR ${type} eliminado exitosamente`,
      });

      fetchQrSettings();
    } catch (error) {
      console.error('Error deleting QR setting:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la configuración",
        variant: "destructive"
      });
    }
  };

  const QrForm = ({ title, description, type, setting, onSave, loading, isUploading, imageFiles, imagePreviews, onImageChange }: QrFormProps) => {
    const imagePreview = imagePreviews[type] || setting?.qr_image_url;

    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <QrCode className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
          {setting && (
            <button
              type="button"
              onClick={() => handleDelete(setting.id, setting.type)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Eliminar configuración"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <form id={`form-${type}`} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Código ID
              </label>
              <input
                name="code_id"
                type="text"
                value={inputValues[type]?.code_id || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setInputValues(prev => ({
                    ...prev,
                    [type]: {
                      ...prev[type],
                      code_id: newValue
                    }
                  }));
                }}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                placeholder="Ingrese código ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Tiempo restante (minutos)
              </label>
              <input
                name="remaining_time"
                type="number"
                defaultValue={setting?.remaining_time || 1440}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                placeholder="1440"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Código QR imagen
            </label>
            <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-6 text-center bg-slate-800/30">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="QR Code Preview"
                      className="w-32 h-32 object-cover rounded-xl shadow-lg border border-slate-600"
                    />
                  </div>
                    <button
                      type="button"
                      onClick={() => handleImageRemove(type)}
                      className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 mx-auto transition"
                    >
                      <X className="w-4 h-4" />
                      Remover imagen
                    </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm mb-4">Arrastra una imagen aquí o haz clic para seleccionar</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onImageChange(type, file);
                    }}
                    className="hidden"
                    id={`image-upload-${type}`}
                  />
                  <label
                    htmlFor={`image-upload-${type}`}
                    className="cursor-pointer inline-flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-white px-6 py-3 rounded-lg transition border border-slate-600/50"
                  >
                    <Upload className="w-4 h-4" />
                    Seleccionar archivo
                  </label>
                </div>
              )}
            </div>
          </div>

        </form>
      </div>
    );
  };

  const QrFormGroup = ({ title, qrSettings: qrSettingsConfig, onSave, loading, isUploading, imageFiles, imagePreviews, onImageChange, settings }: QrFormGroupProps) => {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {qrSettingsConfig.map((config) => {
            const setting = settings.find(s => s.type === config.type);
            const imagePreview = imagePreviews[config.type] || setting?.qr_image_url;

            return (
              <div key={config.type} className="space-y-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <QrCode className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{config.title}</h3>
                    <p className="text-sm text-slate-400">{config.description}</p>
                  </div>
                  {setting && (
                    <button
                      type="button"
                      onClick={() => handleDelete(setting.id, setting.type)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Eliminar configuración"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <form id={`form-${config.type}`} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Código ID
                      </label>
                       <input
                         name="code_id"
                         type="text"
                         value={inputValues[config.type]?.code_id ?? ''}
                         onChange={(e) => setInputValues(prev => ({
                           ...prev,
                           [config.type]: {
                             ...prev[config.type],
                             code_id: e.target.value
                           }
                         }))}
                         className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                         placeholder={config.type.includes('admin') ? "Ingrese código admin" : "Ingrese código ID"}
                         required={config.type.includes('admin')}
                       />
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                         <DollarSign className="w-4 h-4" />
                         Precio
                       </label>
                       {/* Solo USD para tipos Binance */}
                       {config.type.includes('nequi') ? (
                         <div>
                           <label className="block text-xs text-slate-400 mb-1">COP (Nequi)</label>
                            <input
                              name="price_cop"
                              type="text"
                              value={inputValues[config.type]?.price_cop || (setting?.price_cop ? formatCOPPrice(setting.price_cop) : '100.000')}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Permitir solo números y puntos
                                const cleanValue = value.replace(/[^\d.]/g, '');
                                // Formatear automáticamente mientras escribe
                                let formattedValue = cleanValue;
                                if (cleanValue && !cleanValue.includes('.')) {
                                  // Si no hay puntos, formatear como número entero
                                  const numValue = parseInt(cleanValue);
                                  if (!isNaN(numValue)) {
                                    formattedValue = formatCOPPrice(numValue);
                                  }
                                }
                                setInputValues(prev => ({
                                  ...prev,
                                  [config.type]: {
                                    ...prev[config.type],
                                    price_cop: formattedValue
                                  }
                                }));
                              }}
                              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                              placeholder="100.000"
                           />
                         </div>
                       ) : (
                         <div>
                           <label className="block text-xs text-slate-400 mb-1">USD (Binance)</label>
                           <input
                             name="price_usd"
                             type="number"
                             step="0.01"
                             value={inputValues[config.type]?.price_usd || setting?.price_usd || '25.00'}
                              onChange={(e) => setInputValues(prev => ({
                                ...prev,
                                [config.type]: {
                                  ...prev[config.type],
                                  price_usd: e.target.value
                                }
                              }))}
                             className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                             placeholder="25.00"
                           />
                         </div>
                       )}
                     </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Tiempo restante (minutos)
                        </label>
                        <input
                          id={`time-input-${config.type}`}
                          name="remaining_time"
                          type="number"
                          value={inputValues[config.type]?.remaining_time || setting?.remaining_time || '1440'}
                          onChange={(e) => setInputValues(prev => ({
                            ...prev,
                            [config.type]: {
                              ...prev[config.type],
                              remaining_time: e.target.value
                            }
                          }))}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                          placeholder="1440"
                        />
                       <div className="mt-3">
                         <p className="text-xs text-slate-400 mb-2">Presets rápidos:</p>
                         <div className="flex gap-2">
                           {[
                             { label: '10m', value: 10 },
                             { label: '15m', value: 15 },
                             { label: '30m', value: 30 },
                             { label: '45m', value: 45 },
                             { label: '1h', value: 60 }
                           ].map((preset) => (
                             <button
                               key={preset.value}
                               type="button"
                                onClick={() => {
                                  setInputValues(prev => ({
                                    ...prev,
                                    [config.type]: {
                                      ...prev[config.type],
                                      remaining_time: preset.value.toString()
                                    }
                                  }));
                                }}
                               className="px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-violet-600 text-slate-300 hover:text-white border border-slate-600/50 hover:border-violet-500 rounded-lg transition-all duration-200"
                             >
                               {preset.label}
                             </button>
                           ))}
                         </div>
                       </div>
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Código QR imagen
                    </label>
                    <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-6 text-center bg-slate-800/30">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="QR Code Preview"
                              className="w-32 h-32 object-cover rounded-xl shadow-lg border border-slate-600"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleImageRemove(config.type)}
                            className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 mx-auto transition"
                          >
                            <X className="w-4 h-4" />
                            Remover imagen
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                          <p className="text-slate-400 text-sm mb-4">Arrastra una imagen aquí o haz clic para seleccionar</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onImageChange(config.type, file);
                            }}
                            className="hidden"
                            id={`image-upload-${config.type}`}
                          />
                          <label
                            htmlFor={`image-upload-${config.type}`}
                            className="cursor-pointer inline-flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-white px-6 py-3 rounded-lg transition border border-slate-600/50"
                          >
                            <Upload className="w-4 h-4" />
                            Seleccionar archivo
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-700/50 space-y-3">
          <button
            type="button"
            onClick={() => handleSaveGroup(qrSettingsConfig.map(config => config.type))}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg font-medium"
          >
            <Save className="w-5 h-5" />
            {isUploading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Administra la configuración de códigos QR para los procesos de registro.
      </p>

      {/* Group 1: Register $25 */}
      <div className="mb-16 border-2 border-blue-500/20 rounded-2xl p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            Registro $25 USD
          </h2>
          <p className="text-blue-100">Configuración para el proceso de registro de $25 USD</p>
        </div>
        
        {/* Toggle Settings Section for $25 */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Opciones de Pago</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Binance Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div>
                <h4 className="text-white font-medium">Binance</h4>
                <p className="text-sm text-slate-400">Habilitar/deshabilitar pagos con Binance</p>
              </div>
              <Switch
                checked={systemSettings.binance_25_enabled ?? false}
                onCheckedChange={(checked) => handleToggleSystem('binance_25_enabled', checked)}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </div>
            
            {/* Nequi $25 Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div>
                <h4 className="text-white font-medium">Nequi</h4>
                <p className="text-sm text-slate-400">Habilitar/deshabilitar pagos con Nequi para $25</p>
              </div>
              <Switch
                checked={systemSettings.nequi_25_enabled ?? true}
                onCheckedChange={(checked) => handleToggleSystem('nequi_25_enabled', checked)}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </div>
          </div>
        </div>
        
        <QrFormGroup
          title="Configuración de QR Codes $25 USD - Binance"
          qrSettings={[
            {
              title: "Pago por QR - 25 USD (Ciclo de vida) - Binance",
              description: "Configuración del código QR principal para registros de $25 con Binance",
              type: "register"
            },
            {
              title: "Pago por QR (Admin) - Binance",
              description: "Configuración del código QR administrativo para registros de $25 con Binance",
              type: "register_admin"
            }
          ]}
          onSave={handleSave}
          loading={loading}
          isUploading={isUploading}
          imageFiles={imageFiles}
          imagePreviews={imagePreviews}
          onImageChange={handleImageChange}
          settings={qrSettings}
        />

        <QrFormGroup
          title="Configuración de QR Codes $25 USD - Nequi"
          qrSettings={[
            {
              title: "Pago por QR - 25 USD (Ciclo de vida) - Nequi",
              description: "Configuración del código QR principal para registros de $25 con Nequi",
              type: "register_nequi"
            },
            {
              title: "Pago por QR (Admin) - Nequi",
              description: "Configuración del código QR administrativo para registros de $25 con Nequi",
              type: "register_admin_nequi"
            }
          ]}
          onSave={handleSave}
          loading={loading}
          isUploading={isUploading}
          imageFiles={imageFiles}
          imagePreviews={imagePreviews}
          onImageChange={handleImageChange}
          settings={qrSettings}
        />
      </div>

      {/* Group 2: Register $150 */}
      <div className="mb-8 border-2 border-green-500/20 rounded-2xl p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            Registro $150 USD
          </h2>
          <p className="text-green-100">Configuración para el proceso de registro de $150 USD</p>
        </div>
        
        {/* Toggle Settings Section for $150 */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Opciones de Pago</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Binance Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div>
                <h4 className="text-white font-medium">Binance</h4>
                <p className="text-sm text-slate-400">Habilitar/deshabilitar pagos con Binance</p>
              </div>
              <Switch
                checked={systemSettings.binance_150_enabled ?? true}
                onCheckedChange={(checked) => handleToggleSystem('binance_150_enabled', checked)}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </div>
            
            {/* Nequi $150 Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div>
                <h4 className="text-white font-medium">Nequi</h4>
                <p className="text-sm text-slate-400">Habilitar/deshabilitar pagos con Nequi para $150</p>
              </div>
              <Switch
                checked={systemSettings.nequi_150_enabled ?? true}
                onCheckedChange={(checked) => handleToggleSystem('nequi_150_enabled', checked)}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </div>
          </div>
        </div>
        
        <QrFormGroup
          title="Configuración de QR Codes $150 USD - Binance"
          qrSettings={[
            {
              title: "Pago por QR - 150 USD (Ciclo de vida) - Binance",
              description: "Configuración del código QR principal para registros de $150 con Binance",
              type: "register150"
            },
            {
              title: "Pago por QR (Admin) - Binance",
              description: "Configuración del código QR administrativo para registros de $150 con Binance",
              type: "register150_admin"
            }
          ]}
          onSave={handleSave}
          loading={loading}
          isUploading={isUploading}
          imageFiles={imageFiles}
          imagePreviews={imagePreviews}
          onImageChange={handleImageChange}
          settings={qrSettings}
        />

        <QrFormGroup
          title="Configuración de QR Codes $150 USD - Nequi"
          qrSettings={[
            {
              title: "Pago por QR - 150 USD (Ciclo de vida) - Nequi",
              description: "Configuración del código QR principal para registros de $150 con Nequi",
              type: "register150_nequi"
            },
            {
              title: "Pago por QR (Admin) - Nequi",
              description: "Configuración del código QR administrativo para registros de $150 con Nequi",
              type: "register150_admin_nequi"
            }
          ]}
          onSave={handleSave}
          loading={loading}
          isUploading={isUploading}
          imageFiles={imageFiles}
          imagePreviews={imagePreviews}
          onImageChange={handleImageChange}
          settings={qrSettings}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : null}
    </div>
  );
}