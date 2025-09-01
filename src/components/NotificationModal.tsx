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
        .order('order_index', { ascending: true });

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

  const prevNotification = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (!isVisible || notifications.length === 0) return null;

  const currentNotification = notifications[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-4xl">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute -top-4 -right-4 z-10 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Container - matching the uploaded image style */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900">
          {currentNotification.video_url && (
            <div className="relative aspect-video">
              <video
                src={currentNotification.video_url}
                className="w-full h-full object-cover"
                controls
                controlsList="nodownload"
                muted
                preload="metadata"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-purple-400 mb-2">{currentNotification.title}</h2>
              <p className="text-slate-300 text-lg">{currentNotification.description}</p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {currentIndex > 0 && (
                <button
                  onClick={prevNotification}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Anterior
                </button>
              )}
              
              {currentIndex < notifications.length - 1 && (
                <button
                  onClick={nextNotification}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ml-auto"
                >
                  Siguiente
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}