import { ArrowDown, Sparkles, Star } from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Animated Counter Component
const AnimatedCounter = ({
  end,
  suffix = "",
  decimals = 0,
  duration = 2000
}: {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = easeOut * end;

            setCount(currentValue);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={counterRef}>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
};

const HeroSection = () => {
  const [isAnimating, setIsAnimating] = useState(true);

  const handleClick = () => {
    setIsAnimating(false);
    document.getElementById('login-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Floating Arabic Chars */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <span className="absolute top-24 left-[10%] text-7xl opacity-[0.03] font-arabic animate-bounce-slow">س</span>
        <span className="absolute top-1/3 right-[15%] text-9xl opacity-[0.02] font-arabic animate-pulse">ق</span>
        <span className="absolute bottom-32 left-[20%] text-8xl opacity-[0.03] font-arabic animate-bounce-slow" style={{ animationDelay: '1s' }}>م</span>
      </div>
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Fudud oo gaaban</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in" style={{
          animationDelay: "0.1s"
        }}>
          <span className="text-white">Baro </span>
          <span className="text-gradient-primary text-secondary">Tafsiirka</span>
          <br />
          <span className="text-gradient-primary">Quraanka</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{
          animationDelay: "0.2s"
        }}>
          Casharro Tafsiir ah oo kooban iyo sahlan
        </p>

        {/* CTA Button - Scrolls to login section */}
        <div className="animate-fade-in" style={{
          animationDelay: "0.3s"
        }}>
          <button
            onClick={handleClick}
            className={`btn-hero group relative overflow-hidden ${isAnimating ? 'animate-cta-bounce' : 'glow-emerald'} transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-105 active:scale-95`}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            <ArrowDown className="w-5 h-5 group-hover:animate-bounce" />
            <span className="font-bold tracking-wide">Bilaaw Barashada</span>
          </button>
        </div>

        {/* Stats - Glassmorphism */}
        <div className="inline-flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-16 animate-fade-in px-8 py-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl shadow-black/20 hover:bg-white/10 transition-colors duration-500" style={{
          animationDelay: "0.4s"
        }}>
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-emerald-400 transition-colors">
              <AnimatedCounter end={50} suffix="+" />
            </div>
            <div className="text-xs uppercase tracking-widest text-emerald-100/60 font-medium mt-1">Cashar</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-emerald-400 transition-colors">
              <AnimatedCounter end={1000} suffix="+" />
            </div>
            <div className="text-xs uppercase tracking-widest text-emerald-100/60 font-medium mt-1">Arday</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="text-center flex flex-col items-center group">
            <div className="flex items-center gap-1.5 text-3xl md:text-4xl font-bold text-white group-hover:text-emerald-400 transition-colors">
              <AnimatedCounter end={4.9} decimals={1} />
              <Star className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-lg" />
            </div>
            <div className="text-xs uppercase tracking-widest text-emerald-100/60 font-medium mt-1">Qiimeyn</div>
          </div>
        </div>

        {/* Decorative stars */}
        <div className="absolute top-40 left-1/4 text-amber-400/30 animate-pulse-glow">
          <Star className="w-4 h-4" fill="currentColor" />
        </div>
        <div className="absolute top-60 right-1/3 text-amber-400/20 animate-pulse-glow" style={{
          animationDelay: "1s"
        }}>
          <Star className="w-3 h-3" fill="currentColor" />
        </div>
        <div className="absolute bottom-40 right-1/4 text-amber-400/25 animate-pulse-glow" style={{
          animationDelay: "2s"
        }}>
          <Star className="w-5 h-5" fill="currentColor" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;