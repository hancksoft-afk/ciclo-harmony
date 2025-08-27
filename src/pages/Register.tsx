import { Link } from 'react-router-dom';
import { CircleX } from 'lucide-react';
import { RegistrationForm } from '@/components/registration-form';
import cicloLogo from '@/assets/ciclo-logo.png';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('setting_value')
          .eq('setting_key', 'registro_25')
          .single();
        
        if (error) {
          console.error('Error fetching registration status:', error);
          setIsRegistrationOpen(false);
        } else {
          setIsRegistrationOpen(data?.setting_value || false);
        }
      } catch (error) {
        console.error('Error:', error);
        setIsRegistrationOpen(false);
      } finally {
        setLoading(false);
      }
    };

    checkRegistrationStatus();
  }, []);

  if (loading) {
    return (
      <div className="relative bg-background text-foreground antialiased min-h-screen selection:bg-slate-200 selection:text-slate-900 font-inter flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (!isRegistrationOpen) {
    return (
      <div className="relative bg-background text-foreground antialiased min-h-screen selection:bg-slate-200 selection:text-slate-900 font-inter">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="fixed top-0 left-0 w-full h-full object-cover -z-10"
        >
          <source src="https://videos.pexels.com/video-files/18458403/18458403-hd_1920_1080_24fps.mp4" type="video/mp4" />
        </video>

        <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="mb-8">
            <img src={cicloLogo} alt="Logo" className="h-20 w-auto mx-auto mb-4" />
          </div>
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-8 max-w-md">
            <h1 className="text-2xl font-bold text-white mb-4">Registro Cerrado</h1>
            <p className="text-white/80 mb-6">El registro de 25 USD está cerrado temporalmente.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-md transition"
            >
              <CircleX className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-background text-foreground antialiased min-h-screen selection:bg-slate-200 selection:text-slate-900 font-inter">
      <style>{`
        .animated-border {
          position: relative;
          border-radius: 20px;
          background: transparent;
          isolation: isolate;
        }
        .animated-border:before,
        .animated-border:after {
          content: '';
          position: absolute;
          border-radius: 20px;
          left: -2px;
          top: -2px;
          background: linear-gradient(45deg, #9f00fb, #090081, #8c00ff, #4500b3, #000399, #4000a7, #ef00ff, #5900ff, #0011ff, #3700ff);
          background-size: 400% 400%;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          z-index: -1;
          animation: steam 20s linear infinite;
        }

        @keyframes steam {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animated-border:after {
          filter: blur(50px);
          opacity: 0.8;
        }
      `}</style>
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="https://videos.pexels.com/video-files/18458403/18458403-hd_1920_1080_24fps.mp4" type="video/mp4" />
      </video>

      <div className="relative min-h-screen">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-ciclo-cyan/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.06),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.06),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.05),transparent_40%)]" />
        </div>

        {/* Header */}
        <header className="relative mx-auto max-w-6xl px-4 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-[67px] w-[78px] grid place-items-center rounded-md ring-white/10 overflow-hidden">
              <img src={cicloLogo} alt="Logo" className="h-full w-full object-cover rounded-md" />
            </div>
            <div className="h-[52px] w-[1px] bg-white/10" />
            <p className="text-sm text-muted-foreground">Bienvenido</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 ring-1 ring-white/10 transition"
            >
              <CircleX className="w-4 h-4" />
              Salir
            </Link>
          </div>
        </header>

        {/* Main */}
        <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-8">
          <div className="grid grid-cols-1 gap-6">
            <section className="animated-border">
              <div className="relative z-10">
                <RegistrationForm />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Register;