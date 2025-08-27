import { useState, useEffect } from 'react';
import { Plus, Bell, Video, FileText, Send, Eye, EyeOff, Calendar, Upload, X, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  description: string;
  video_url: string | null;
  is_published: boolean;
  created_at: string;
}

export function AdminNotifications() {
  const [showNewNotification, setShowNewNotification] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
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
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const uploadVideo = async (): Promise<string | null> => {
    if (!videoFile) return null;

    const fileName = `${Date.now()}-${videoFile.name}`;
    const { data, error } = await supabase.storage
      .from('notification-videos')
      .upload(fileName, videoFile);

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
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la notificación",
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
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{notification.title}</h3>
                    <p className="text-sm text-slate-400">{notification.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-400">
                        {new Date(notification.created_at).toLocaleDateString('es-ES')}
                      </span>
                      {notification.video_url && (
                        <>
                          <Video className="w-4 h-4 text-slate-400 ml-2" />
                          <span className="text-xs text-slate-400">Con video</span>
                        </>
                      )}
                    </div>
                    {notification.video_url && (
                      <div className="mt-3">
                        <video
                          src={notification.video_url}
                          className="w-32 h-20 object-cover rounded border border-slate-600"
                          controls
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePublish(notification.id, notification.is_published)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                      notification.is_published
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                    }`}
                  >
                    {notification.is_published ? (
                      <>
                        <Eye className="w-4 h-4" />
                        Publicado
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Borrador
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    title="Eliminar notificación"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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