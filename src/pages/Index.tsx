import { useState, useEffect } from "react";
import { NotificationModal } from "@/components/NotificationModal";
import { Sunrise, Wind } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import cicloLogo from "@/assets/ciclo-logo.png";

const Index = () => {
  const [systemSettings, setSystemSettings] = useState<any>({});

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;

      const settingsMap: any = {};
      data?.forEach((setting) => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });
      setSystemSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching system settings:', error);
    }
  };

  const isCardVisible = (cardType: string) => {
    return systemSettings[cardType] === true;
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-ciclo-emerald/20 selection:text-ciclo-emerald-foreground">
      {/* Background Image */}
      <div 
        className="fixed top-0 w-full h-screen bg-cover bg-center -z-10"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/10296797/pexels-photo-10296797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
        }}
      />
      
      <main className="flex-1 w-full sm:px-6 pr-4 pb-12 pl-4">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="flex pt-8 items-center justify-center gap-4">
            <img 
              src={cicloLogo} 
              alt="Ciclo" 
              className="w-20 h-20 object-contain"
            />
            <div className="text-center">
              <h1 className="sm:text-4xl text-7xl tracking-tight font-instrument">
                Ciclo vida
              </h1>
              <p className="text-sm text-slate-200/80 mt-1 font-inter font-light">
                Mindful tea guidance for your daily practice
              </p>
            </div>
          </header>

          {/* Cards Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 my-12">
            {isCardVisible('register_25_visible') && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Registro 25 USD</h3>
                <p className="text-slate-400 text-sm mb-4">Bienvenido - Nuevo Registardo</p>
                <a href="/register" className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
                  Continue ritual
                </a>
              </div>
            )}
            
            {isCardVisible('register_150_visible') && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Registro 150 USD</h3>
                <p className="text-slate-400 text-sm mb-4">Bienvenido - Cursos en línea y mejora tus habilidades desde cualquier lugar del mundo.</p>
                <a href="/register150" className="inline-block bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition">
                  Start ritual
                </a>
              </div>
            )}
            
            {isCardVisible('eduplatform_visible') && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">EduPlatform</h3>
                <p className="text-slate-400 text-sm mb-4">A curated tea-ritual library with guided ceremonies for every mood and moment.</p>
                <button className="inline-block bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition">
                  Explore rituals
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="border-t border-white/10 pt-6 mt-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-inter font-light">
              © 2025 Ciclo Vida.
            </p>
            <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground font-inter">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <span className="text-border">|</span>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
            </div>
          </footer>
        </div>
      </main>
      
      <NotificationModal />
    </div>
  );
};

export default Index;