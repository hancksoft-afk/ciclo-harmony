import { useEffect, useRef, useState } from 'react';
import { CheckCircle, Sunrise, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RitualCardProps {
  title: string;
  subtitle: string;
  description: string;
  status: string;
  linkText: string;
  linkHref?: string;
  variant: 'emerald' | 'cyan' | 'violet';
  videoSrc: string;
  videoPoster: string;
  icon?: React.ReactNode;
  delay?: number;
}

export function RitualCard({
  title,
  subtitle,
  description,
  status,
  linkText,
  linkHref = "#",
  variant,
  videoSrc,
  videoPoster,
  icon,
  delay = 0
}: RitualCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const variantClasses = {
    emerald: {
      ring: 'ring-ciclo-emerald/10',
      shadow: 'shadow-emerald-glow',
      badge: 'bg-ciclo-emerald/20 text-ciclo-emerald-foreground',
      border: 'border-ciclo-emerald/50',
      text: 'text-ciclo-emerald-foreground',
      icon: 'text-ciclo-emerald-foreground',
      bg: 'bg-ciclo-emerald/20'
    },
    cyan: {
      ring: 'ring-ciclo-cyan/10',
      shadow: 'shadow-cyan-glow',
      badge: 'bg-ciclo-cyan/20 text-ciclo-cyan-foreground',
      border: 'border-ciclo-cyan/50',
      text: 'text-ciclo-cyan-foreground',
      icon: 'text-ciclo-cyan-foreground',
      bg: 'bg-ciclo-cyan/20'
    },
    violet: {
      ring: 'ring-ciclo-violet/10',
      shadow: 'shadow-violet-glow',
      badge: 'bg-ciclo-violet/20 text-ciclo-violet-foreground',
      border: 'border-ciclo-violet/50',
      text: 'text-ciclo-violet-foreground',
      icon: 'text-ciclo-violet-foreground',
      bg: 'bg-ciclo-violet/20'
    }
  };

  const classes = variantClasses[variant];

  return (
      <div
        ref={cardRef}
        className={`flex flex-col w-full aspect-[3/5] hover:scale-[1.03] transition-all duration-300 group sm:p-10 ring-1 ${classes.ring} bg-center relative overflow-hidden text-foreground bg-cover rounded-3xl pt-8 pr-8 pb-8 pl-8 justify-between ${classes.shadow}`}
        style={{ backgroundImage: `url(${videoPoster})` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <video
            ref={videoRef}
            src={videoSrc}
            preload="metadata"
            muted
            playsInline
            loop
            className="w-full h-full object-cover opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            {icon && (
              <div className={`w-8 h-8 ${classes.icon} group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
            )}
            <span className={`text-xs px-3 py-1.5 ${classes.badge} rounded-full font-inter font-medium`}>
              Nuevo
            </span>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl tracking-tight font-instrument">
              {title}
            </p>
            <p className={`${classes.text} text-lg mt-2 font-inter`}>
              {subtitle}
            </p>
          </div>
        </div>

        <div className={`space-y-4 border-t ${classes.border} pt-6 relative z-10`}>
          <p className="leading-relaxed text-sm text-slate-50 font-inter font-light">
            {description}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-wider font-inter font-semibold">
                {status}
              </span>
              <CheckCircle className={`w-4 h-4 ${classes.text}`} />
            </div>
            {linkHref.startsWith('/') ? (
              <Link 
                to={linkHref}
                className={`inline-flex items-center gap-2 px-4 py-2 ${classes.bg} ${classes.text} text-sm font-medium rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/10`}
              >
                {linkText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <a 
                href={linkHref} 
                className={`inline-flex items-center gap-2 px-4 py-2 ${classes.bg} ${classes.text} text-sm font-medium rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/10`}
              >
                {linkText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
  );
}