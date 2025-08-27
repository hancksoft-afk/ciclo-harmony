import { Link } from 'react-router-dom';
import { CircleX } from 'lucide-react';
import { RegistrationForm150 } from '@/components/registration-form-150';
import cicloLogo from '@/assets/ciclo-logo.png';

const Register150 = () => {
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
        <source src="https://videos.pexels.com/video-files/2389545/2389545-hd_1920_1080_30fps.mp4" type="video/mp4" />
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
              left: -2px;
              top: -2px;
              background: linear-gradient(45deg, #fb0094, #ff9900, #ff0000, #ffff00, #ff7b00, #f7fb00,
                        #ff000d, #ff7300, #ffff00, #ff0000);
              background-size: 400%;
              width: calc(100% + 6px);
              height: calc(100% + 6px);
              z-index: -1;
              animation: steam150 20s linear infinite;
            }

            @keyframes steam150 {
              0% {
                background-position: 0 0;
              }

              50% {
                background-position: 400% 0;
              }

              100% {
                background-position: 0 0;
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