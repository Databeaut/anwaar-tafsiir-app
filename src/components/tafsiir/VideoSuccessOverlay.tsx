import { CheckCircle2, MessageCircle } from "lucide-react";
import { getWhatsAppShareUrl } from "./surahData";

interface VideoSuccessOverlayProps {
  segmentLabel: string;
  segmentNumber: number;
  onRewatch?: () => void;
  onShareCompleted: () => void;
}

const VideoSuccessOverlay = ({ 
  segmentLabel, 
  segmentNumber,
  onRewatch, 
  onShareCompleted 
}: VideoSuccessOverlayProps) => {
  const whatsappUrl = getWhatsAppShareUrl(segmentNumber, segmentLabel);

  const handleShareClick = () => {
    // Mark share as completed - this unlocks the next lesson
    onShareCompleted();
  };

  return (
    <div className="absolute inset-0 z-50 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] flex items-center justify-center animate-fade-in">
      {/* Success Card */}
      <div className="text-center max-w-md mx-auto px-6">
        {/* Animated Checkmark */}
        <div className="relative mb-6">
          {/* Glow rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: "2s" }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20" />
          </div>
          
          {/* Checkmark Icon */}
          <div className="relative w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-10 h-10 text-black" />
          </div>
        </div>

        {/* Success Text */}
        <h3 className="text-2xl font-bold text-white mb-2">
          Casharka waa la dhamaystiray!
        </h3>
        <p className="text-emerald-400 font-medium mb-6">
          ✓ {segmentLabel}
        </p>

        {/* Share Button - Primary Action */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleShareClick}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-all duration-300 group animate-pulse no-underline mb-4"
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>La wadaag Macalinka 🔓</span>
        </a>

        {/* Helper text */}
        <p className="text-amber-400 text-sm mb-4">
          ⚠️ Wadaag si aad u furto casharka xiga
        </p>

        {/* Rewatch button */}
        {onRewatch && (
          <button
            onClick={onRewatch}
            className="text-sm text-muted-foreground hover:text-white transition-colors underline underline-offset-4"
          >
            Dib u daawad casharka
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoSuccessOverlay;
