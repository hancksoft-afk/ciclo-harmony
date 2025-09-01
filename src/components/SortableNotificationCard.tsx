import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bell, Video, Calendar, Eye, EyeOff, Trash2, GripVertical } from 'lucide-react';

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

export function SortableNotificationCard({ notification, onTogglePublish, onDelete }: SortableNotificationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: notification.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-600/40 border border-slate-500/30 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-purple-400/50 hover:scale-[1.02] backdrop-blur-sm"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-4 right-4 cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-5 h-5 text-slate-400" />
      </div>

      {/* Header con icono y estado */}
      <div className="flex items-start justify-between mb-4 pr-8">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-shadow duration-300">
            <Bell className="w-7 h-7 text-white" />
          </div>
          <div className="flex flex-col">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              notification.is_published 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {notification.is_published ? 'Publicado' : 'Borrador'}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-3">
        <h3 className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">{notification.title}</h3>
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{notification.description}</p>
        
        {/* Video preview si existe */}
        {notification.video_url && (
          <div className="relative mt-4">
            <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-600/50">
              <video
                src={notification.video_url}
                className="w-full h-full object-cover"
                muted
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Video className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metadatos */}
        <div className="flex items-center gap-4 pt-3 border-t border-slate-600/30">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">
              {new Date(notification.created_at).toLocaleDateString('es-ES')}
            </span>
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
          onClick={() => onTogglePublish(notification.id, notification.is_published)}
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
          onClick={() => onDelete(notification.id)}
          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          title="Eliminar notificación"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}