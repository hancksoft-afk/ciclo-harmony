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
                controls={isPlaying}
                autoPlay={isPlaying}
                onEnded={nextNotification}
              />
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border-2 border-white/50"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </button>
                </div>
              )}
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center text-white text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>0:00 / 0:04</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-purple-400 mb-2">¡Bienvenido a EduPlatform!</h2>
              <p className="text-slate-300 text-lg">{currentNotification.description}</p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                {notifications.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'bg-purple-400 scale-125' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-slate-400 text-sm">
                  {currentIndex + 1} de {notifications.length}
                </span>
                <button
                  onClick={nextNotification}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}