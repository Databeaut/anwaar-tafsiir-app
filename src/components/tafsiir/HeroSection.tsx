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
    <section className="relative pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Bilaash oo Sahlan</span>
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
            className={`btn-hero ${isAnimating ? 'animate-cta-bounce' : 'glow-emerald'}`}
          >
            <ArrowDown className="w-5 h-5" />
            <span>Bilaaw Barashada</span>
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 md:gap-16 mt-16 animate-fade-in" style={{
          animationDelay: "0.4s"
        }}>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">
              <AnimatedCounter end={50} suffix="+" />
            </div>
            <div className="text-sm text-muted-foreground">Cashar</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">
              <AnimatedCounter end={1000} suffix="+" />
            </div>
            <div className="text-sm text-muted-foreground">Arday</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-3xl md:text-4xl font-bold text-white">
                <AnimatedCounter end={4.9} decimals={1} />
              </span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-sm text-muted-foreground">Qiimeyn</div>
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