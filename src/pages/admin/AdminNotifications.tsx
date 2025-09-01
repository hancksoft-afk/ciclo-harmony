import { useState, useEffect } from 'react';
import { Plus, Bell, Video, FileText, Send, Eye, EyeOff, Calendar, Upload, X, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableNotificationCard } from '@/components/SortableNotificationCard';

interface Notification {
  id: string;
  title: string;
  description: string;
  video_url: string | null;
  is_published: boolean;
  created_at: string;
  order_index?: number;
}

interface SortableNotificationCardProps {
  notification: Notification;
  onTogglePublish: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export function AdminNotifications() {
  const [showNewNotification, setShowNewNotification] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño del archivo (máximo 2GB)
      const maxSize = 2048 * 1024 * 1024; // 2GB en bytes
      
      if (file.size > maxSize) {
        toast({
          title: "Archivo muy grande",
          description: `El video es demasiado grande. El tamaño máximo permitido es 2GB. Tu archivo es ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
          variant: "destructive"
        });
        return;
      }

      // Validar duración aproximada basada en tamaño (estimación)
      const estimatedDurationMins = file.size / (1024 * 1024 * 2); // Estimación: ~2MB por minuto para video comprimido
      if (estimatedDurationMins > 120) {
        toast({
          title: "Video muy largo",
          description: `Para asegurar una carga rápida, se recomienda videos de máximo 1-2 horas. Tu video parece ser de aproximadamente ${Math.ceil(estimatedDurationMins)} minutos.`,
          variant: "destructive"
        });
      }

      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const uploadVideo = async (): Promise<string | null> => {
    if (!videoFile) return null;

    // Sanitizar el nombre del archivo para evitar errores de "InvalidKey"
    const sanitizedFileName = videoFile.name
      .replace(/[^\w\-_\.\s]/g, '') // Remover caracteres especiales excepto guiones, guiones bajos, puntos y espacios
      .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
      .toLowerCase(); // Convertir a minúsculas

    const fileName = `${Date.now()}-${sanitizedFileName}`;
    const { data, error } = await supabase.storage
      .from('notification-videos')
      .upload(fileName, videoFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('notification-videos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;

      let videoUrl = null;
      if (videoFile) {
        videoUrl = await uploadVideo();
      }

      const { error } = await supabase
        .from('notifications')
        .insert([{
          title,
          description,
          video_url: videoUrl,
          is_published: false
        }]);

      if (error) throw error;

      toast({
        title: "Notificación creada",
        description: "La notificación se ha creado exitosamente",
      });

      setShowNewNotification(false);
      setVideoFile(null);
      setVideoPreview('');
      fetchNotifications();
    } catch (error: any) {
      console.error('Error creating notification:', error);
      
      let errorMessage = "No se pudo crear la notificación";
      
      // Manejo específico de errores de storage
      if (error?.message?.includes('exceeded the maximum allowed size')) {
        errorMessage = "El video es demasiado grande. El tamaño máximo permitido es 2GB. Intenta comprimir el video o usar uno más corto.";
      } else if (error?.message?.includes('storage')) {
        errorMessage = "Error al subir el video. Verifica el formato y tamaño del archivo.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta notificación?')) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Notificación eliminada",
        description: "La notificación se ha eliminado exitosamente",
      });

      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la notificación",
        variant: "destructive"
      });
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `Notificación ${!currentStatus ? 'publicada' : 'despublicada'}`,
      });

      fetchNotifications();
    } catch (error) {
      console.error('Error updating notification:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setNotifications((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Actualizar el orden en la base de datos
        updateNotificationOrder(newOrder);
        
        return newOrder;
      });
    }
  };

  const updateNotificationOrder = async (orderedNotifications: Notification[]) => {
    try {
      // Actualizar cada notificación con su nuevo índice
      const updates = orderedNotifications.map((notification, index) => 
        supabase
          .from('notifications')
          .update({ order_index: index } as any)
          .eq('id', notification.id)
      );

      await Promise.all(updates);
      
      toast({
        title: "Orden actualizado",
        description: "El orden de las notificaciones se ha guardado exitosamente",
      });
    } catch (error) {
      console.error('Error updating notification order:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el orden de las notificaciones",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Notificaciones</h1>
          <p className="text-slate-400">Gestiona las notificaciones de bienvenida</p>
        </div>
        
        <button 
          onClick={() => setShowNewNotification(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
        >
          <Plus className="w-4 h-4" />
          Nueva Bienvenida
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Notificaciones Existentes</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-400">Cargando notificaciones...</div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={notifications.map(n => n.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {notifications.map((notification) => (
                  <SortableNotificationCard
                    key={notification.id}
                    notification={notification}
                    onTogglePublish={togglePublish}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* New Notification Form */}
      {showNewNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Nueva Notificación</h3>
              <button
                onClick={() => {
                  setShowNewNotification(false);
                  setVideoFile(null);
                  setVideoPreview('');
                }}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Título
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="Ingresa el título de la notificación"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  placeholder="Describe la notificación"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Video (opcional)
                </label>
                <div className="mb-2 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Video className="w-4 h-4 text-blue-400" />
                    <span>Límites: Máximo 2GB | Recomendado: 1-2 horas (≤ 120 min) | Formatos: MP4, WebM, MOV</span>
                  </div>
                </div>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                  {videoPreview ? (
                    <div className="space-y-4">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full max-h-48 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setVideoFile(null);
                          setVideoPreview('');
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remover video
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-400 mb-2">Arrastra y suelta un video aquí</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        Seleccionar archivo
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewNotification(false);
                    setVideoFile(null);
                    setVideoPreview('');
                  }}
                  className="px-4 py-2 text-slate-300 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {uploading ? 'Creando...' : 'Crear Notificación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}