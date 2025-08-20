import { Link } from 'react-router-dom';
import { CircleX } from 'lucide-react';
import { RegistrationForm } from '@/components/registration-form';
import cicloLogo from '@/assets/ciclo-logo.png';

const Register = () => {
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
            <section className="relative">
              <div className="absolute inset-0 rounded-2xl">
                <div className="absolute -left-2 -top-2 w-[calc(100%+16px)] h-[calc(100%+16px)] rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 via-cyan-500 to-violet-500 bg-[length:400%_400%] animate-[gradient_20s_linear_infinite] opacity-75" />
                <div className="absolute -left-2 -top-2 w-[calc(100%+16px)] h-[calc(100%+16px)] rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 via-cyan-500 to-violet-500 bg-[length:400%_400%] animate-[gradient_20s_linear_infinite] blur-[57px] opacity-50" />
              </div>
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