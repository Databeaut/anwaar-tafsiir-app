import { MessageCircle, Share2, CheckCircle2, Lock } from "lucide-react";

interface ShareProgressCardProps {
  currentSegmentIndex: number;
  isQuizCompleted: boolean;
  isShareCompleted: boolean;
  segmentLabel?: string;
  onShareCompleted: () => void;
}

const ShareProgressCard = ({
  currentSegmentIndex,
  isQuizCompleted,
  isShareCompleted,
  segmentLabel,
  onShareCompleted,
}: ShareProgressCardProps) => {
  const segmentNumber = currentSegmentIndex + 1;
  const displayLabel = segmentLabel || `Qaybta ${segmentNumber}`;

  const message = `Asc Macalin! Waxaan dhameeyay ${displayLabel}. Natiijada Imtixaanka: Sax ✅`;
  const whatsappUrl = `https://wa.me/252632141316?text=${encodeURIComponent(message)}`;

  const handleShareClick = () => {
    // Mark share as completed - this unlocks the next lesson
    onShareCompleted();
  };

  // Already shared state
  if (isShareCompleted) {
    return (
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#141414] rounded-2xl border border-emerald-500/30 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Waa la diray! ✨</h3>
            <p className="text-sm text-emerald-400">Casharka xiga ayaa furan</p>
          </div>
        </div>

        {/* Success State */}
        <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <p className="text-emerald-400 font-medium mb-2">
            Waxaad u dirtay Macalinka
          </p>
          <p className="text-sm text-muted-foreground">
            Casharka xiga waa diyaar!
          </p>
        </div>

        {/* Share Again Button (optional) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-all duration-300 mt-6 no-underline"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Mar kale dir</span>
        </a>
      </div>
    );
  }

  // Quiz completed - can share
  if (isQuizCompleted) {
    return (
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#141414] rounded-2xl border border-white/5 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">La wadaag Macalinka</h3>
            <p className="text-sm text-muted-foreground">U dir natiijadaada</p>
          </div>
        </div>

        {/* Success Preview */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-emerald-400 font-medium mb-1">
                Fariin diyaar ah
              </p>
              <p className="text-xs text-muted-foreground">
                "Asc Macalin! Waxaan dhameeyay {displayLabel}. Natiijada Imtixaanka: Sax ✅"
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
          <p className="text-xs text-amber-400 text-center">
            ⚠️ Tallaabo muhiim ah: Wadaag si aad u furto casharka xiga
          </p>
        </div>

        {/* WhatsApp Share Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleShareClick}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-all duration-300 group animate-pulse no-underline"
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>La wadaag Macalinka 🔓</span>
        </a>

        {/* Alternative Text */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Waxaa la furayaa WhatsApp
        </p>
      </div>
    );
  }

  // Locked state - quiz not completed
  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#141414] rounded-2xl border border-white/5 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-white">La wadaag Macalinka</h3>
          <p className="text-sm text-muted-foreground">Tallaabada 3aad</p>
        </div>
      </div>

      {/* Locked State */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-muted-foreground opacity-50" />
        </div>
        <p className="text-muted-foreground text-sm mb-2">
          Dhamaystir imtixaanka
        </p>
        <p className="text-xs text-muted-foreground/60">
          Ka dib markii aad ka guulaysato imtixaanka, waxaad u diri kartaa natiijadaada macalinka
        </p>
      </div>

      {/* Disabled Button */}
      <button
        disabled
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white/10 text-muted-foreground font-medium cursor-not-allowed mt-6"
      >
        <Lock className="w-4 h-4" />
        <span>La wadaag Macalinka</span>
      </button>
    </div>
  );
};

export default ShareProgressCard;
