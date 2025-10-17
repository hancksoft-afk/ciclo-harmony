import { useState, useEffect } from "react";
import { RitualCard } from "@/components/ritual-card";
import { NotificationModal } from "@/components/NotificationModal";
import { Sunrise, Wind } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import cicloLogo from "@/assets/ciclovida-logo.png";

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
          backgroundImage: "url('/lovable-uploads/fondver.jpg')"
        }}
      />
      
      <main className="flex-1 w-full sm:px-6 pr-4 pb-12 pl-4">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="flex pt-8 items-center justify-center gap-4">
            <img 
              src="/lovable-uploads/28d885bc-fc01-4fa6-804c-fe9a1a8094f6.png" 
              alt="Ciclo" 
              className="w-20 h-20 object-contain"
            />
            <div className="text-center">
              <h1 className="sm:text-4xl text-7xl tracking-tight font-instrument">
                ¡Únete Hoy!
              </h1>
              <p className="text-sm text-slate-200/80 mt-1 font-inter font-light">
               Da el primer paso hacia tu independencia financiera...
              </p>
            </div>
          </header>

          {/* Cards Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 my-12">
            {isCardVisible('register_25_visible') && (
              <RitualCard
                title="Registardo 25 USD"
                subtitle="Bienvenido"
                description="Vamos a inscribirnos con un registro de 300k de energía."
                status="Nuevo Registardo"
                linkText="Continue ritual"
                linkHref="/register"
                variant="emerald"
                videoSrc="/lovable-uploads/A camera moves smoothly around the 50% OFF banner with glowing light and dynamic motion..mp4"
                videoPoster="/lovable-uploads/300k.png"
                icon={<Sunrise className="w-full h-full" strokeWidth={1.5} />}
                delay={0}
              />
            )}
            
            {isCardVisible('register_150_visible') && (
              <RitualCard
                title="Registardo 150 USD"
                subtitle="Bienvenido"
                description="Vamos a inscribirnos con un registro de 150 USD de energía."
                status="Nuevo Registardo"
                linkText="Start ritual"
                linkHref="/register150"
                variant="cyan"
                videoSrc="/lovable-uploads/moneda150usd.mp4"
                videoPoster="/lovable-uploads/fondo150usd.jpg"
                icon={<Wind className="w-full h-full" strokeWidth={1.5} />}
                delay={100}
              />
            )}
            
            {isCardVisible('eduplatform_visible') && (
              <RitualCard
                title="Noticias"
                subtitle=""
                description="Noticia: información sobre el ciclo de vida."
                status="Noticia"
                linkText="Explore rituals"
                variant="violet"
                videoSrc="https://cdn.pixabay.com/video/2021/02/20/65772-515379427_large.mp4"
                videoPoster="https://cdn.pixabay.com/video/2021/02/20/65772-515379427_tiny.jpg?w=800&q=80"
                delay={200}
              />
            )}
          </div>

          {/* Footer */}
          <footer className="border-t border-white/10 pt-6 mt-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-inter font-light">
              © 2025 Ciclo Vida.
            </p>
            <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground font-inter">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacidad
              </a>
              <span className="text-border">|</span>
              <a href="#" className="hover:text-foreground transition-colors">
                Términos
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
