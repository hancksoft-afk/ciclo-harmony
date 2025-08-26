import { useState, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  title: string;
  description: string;
  video_url: string | null;
  is_published: boolean;
  created_at: string;
}

export function NotificationModal() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setNotifications(data);
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const closeModal = () => {
    setIsVisible(false);
    setIsPlaying(false);
  };

  const nextNotification = () => {
    if (currentIndex < notifications.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(false);
    } else {
      closeModal();
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (!isVisible || notifications.length === 0) return null;

  const currentNotification = notifications[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{currentNotification.title}</h3>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentNotification.video_url && (
          <div className="mb-4 relative">
            <video
              src={currentNotification.video_url}
              className="w-full h-64 object-cover rounded-lg"
              controls={isPlaying}
              autoPlay={isPlaying}
              onEnded={nextNotification}
            />
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg hover:bg-black/50 transition"
              >
                <Play className="w-12 h-12 text-white" />
              </button>
            )}
          </div>
        )}

        <p className="text-slate-300 mb-6">{currentNotification.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {notifications.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">
              {currentIndex + 1} de {notifications.length}
            </span>
            <button
              onClick={nextNotification}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}