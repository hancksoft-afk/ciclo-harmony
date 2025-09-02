import { Link } from 'react-router-dom';
import { CircleX } from 'lucide-react';
import { RegistrationForm150 } from '@/components/registration-form-150';
import cicloLogo from '@/assets/ciclo-logo.png';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Register150 = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('setting_value')
          .eq('setting_key', 'registro_150')
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
            <p className="text-white/80 mb-6">El registro de 150 USD está cerrado temporalmente.</p>
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
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="https://limewire.com/decrypt?downloadUrl=https%3A%2F%2Flimewire-filesharing-production.b61cdfd8cf17f52ddc020162e738eb5d.r2.cloudflarestorage.com%2Fbuckets%2F8a00a651-1973-4efc-aa6d-92bbbf16f8cc%2F954c7fcc-2854-4ccb-a117-2a6b4e084309%3FX-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Date%3D20250902T020112Z%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Credential%3Da1868571dfad6d4fe293ee5b945a0ad5%252F20250902%252Fauto%252Fs3%252Faws4_request%26X-Amz-Expires%3D14400%26X-Amz-Signature%3D7cbb92498db0ac65e793ac6ed16bbbfdf3ef8a947421a4b41f01b4f9e9863eaa&mediaType=video%2Fmp4&decryptionKeys=eyJhZXNHY21Kd2siOnsiYWVzS2V5VHlwZSI6IlNZTU1FVFJJQ19BRVMtR0NNX0tFWSIsImp3ayI6eyJhbGciOiJBMjU2R0NNIiwiZXh0Ijp0cnVlLCJrIjoiRFlIaFh1aEdxd3J2RXBsbFBFYzc3VF9lY25OUFR0Y05wbnNoQWRjaG4xWSIsImtleV9vcHMiOlsiZW5jcnlwdCIsImRlY3J5cHQiXSwia3R5Ijoib2N0In19LCJhZXNDdHJKd2siOnsiYWVzS2V5VHlwZSI6IlNZTU1FVFJJQ19BRVMtQ1RSX0tFWSIsImp3ayI6eyJhbGciOiJBMjU2Q1RSIiwiZXh0Ijp0cnVlLCJrIjoiRFlIaFh1aEdxd3J2RXBsbFBFYzc3VF9lY25OUFR0Y05wbnNoQWRjaG4xWSIsImtleV9vcHMiOlsiZW5jcnlwdCIsImRlY3J5cHQiXSwia3R5Ijoib2N0In19fQ" type="video/mp4" />
      </video>

      <div className="relative min-h-screen">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.06),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(249,115,22,0.06),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(234,179,8,0.05),transparent_40%)]" />
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
            <section className="relative">
              <div className="animated-border-register150">
                <div className="bg-background/95 backdrop-blur-sm relative z-10">
                  <RegistrationForm150 />
                </div>
              </div>
            </section>
          </div>
        </main>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            .animated-border-register150 {
              position: relative;
              border-radius: 20px;
            }
            .animated-border-register150:before,
            .animated-border-register150:after {
              content: '';
              position: absolute;
              border-radius: 20px;
              left: -3px;
              top: -3px;
              background: linear-gradient(45deg, #fb0094, #ff9900, #ff0000, #ffff00, #ff7b00, #f7fb00, #ff000d, #ff7300, #ffff00, #ff0000);
              background-size: 400% 400%;
              width: calc(100% + 6px);
              height: calc(100% + 6px);
              z-index: -1;
              animation: steam150 20s linear infinite;
            }

            @keyframes steam150 {
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

            .animated-border-register150:after {
              filter: blur(57px);
            }
          `
        }} />
      </div>
    </div>
  );
};

export default Register150;