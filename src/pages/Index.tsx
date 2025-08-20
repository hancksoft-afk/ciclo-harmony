import { RitualCard } from "@/components/ritual-card";
import { Sunrise, Wind } from "lucide-react";
import cicloLogo from "@/assets/ciclo-logo.png";

const Index = () => {
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
            <RitualCard
              title="Registardo 25 USD"
              subtitle="Bienvenido"
              description="Whisk, breathe, and be present. Today's ritual celebrated calm, bright energy."
              status="Nuevo Registardo"
              linkText="Continue ritual"
              linkHref="/register"
              variant="emerald"
              videoSrc="https://cdn.pixabay.com/video/2021/02/17/65494-514501826_large.mp4"
              videoPoster="https://cdn.pixabay.com/video/2021/02/17/65494-514501826_tiny.jpg?w=800&q=80"
              icon={<Sunrise className="w-full h-full" strokeWidth={1.5} />}
              delay={0}
            />
            
            <RitualCard
              title="Registardo 150 USD"
              subtitle="Bienvenido"
              description="Cursos en línea y mejora tus habilidades desde cualquier lugar del mundo."
              status="Nuevo Registardo"
              linkText="Start ritual"
              variant="cyan"
              videoSrc="https://cdn.pixabay.com/video/2021/02/20/65771-515379416_large.mp4"
              videoPoster="https://cdn.pixabay.com/video/2021/02/20/65771-515379416_tiny.jpg?w=800&q=80"
              icon={<Wind className="w-full h-full" strokeWidth={1.5} />}
              delay={100}
            />
            
            <RitualCard
              title="EduPlatform"
              subtitle=""
              description="A curated tea-ritual library with guided ceremonies for every mood and moment."
              status="Virutal Binance"
              linkText="Explore rituals"
              variant="violet"
              videoSrc="https://cdn.pixabay.com/video/2021/02/20/65772-515379427_large.mp4"
              videoPoster="https://cdn.pixabay.com/video/2021/02/20/65772-515379427_tiny.jpg?w=800&q=80"
              delay={200}
            />
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
    </div>
  );
};

export default Index;