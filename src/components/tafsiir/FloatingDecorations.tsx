const FloatingDecorations = () => {
  const arabicLetters = [
    { letter: "ق", top: "10%", left: "5%", size: "text-6xl", delay: "0s" },
    { letter: "ر", top: "20%", right: "8%", size: "text-5xl", delay: "1s" },
    { letter: "ء", top: "40%", left: "3%", size: "text-4xl", delay: "2s" },
    { letter: "ن", top: "60%", right: "5%", size: "text-7xl", delay: "0.5s" },
    { letter: "و", top: "75%", left: "8%", size: "text-5xl", delay: "1.5s" },
    { letter: "ك", top: "30%", right: "15%", size: "text-4xl", delay: "2.5s" },
    { letter: "ب", top: "85%", right: "12%", size: "text-6xl", delay: "3s" },
    { letter: "ت", top: "15%", left: "15%", size: "text-3xl", delay: "0.8s" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {arabicLetters.map((item, index) => (
        <span
          key={index}
          className={`floating-letter ${item.size} animate-float`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            animationDelay: item.delay,
          }}
        >
          {item.letter}
        </span>
      ))}
      
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
    </div>
  );
};

export default FloatingDecorations;
