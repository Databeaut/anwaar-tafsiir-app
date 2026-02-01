import { Mic, MessageCircle } from "lucide-react";

const VoiceRecorderCard = () => {
  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Mic className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Codkaaga Duub</h3>
          <p className="text-sm text-muted-foreground">Macalinka u dir</p>
        </div>
      </div>

      {/* Prompt */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-400">
            Macalinka u sheeg waxaad faa'iiday casharkaani maanta?
          </p>
        </div>
      </div>

      {/* Record Button */}
      <div className="flex justify-center">
        <button className="relative group">
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute -inset-3 rounded-full bg-emerald-500/10" />
          
          {/* Button */}
          <div className="relative w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center hover:bg-emerald-400 transition-all duration-300 hover:scale-105 active:scale-95 glow-emerald">
            <Mic className="w-8 h-8 text-black" />
          </div>
        </button>
      </div>

      {/* Instructions */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        Taabo si aad u duubto codkaaga
      </p>
    </div>
  );
};

export default VoiceRecorderCard;
