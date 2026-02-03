import { useState } from "react";
import { BookOpen } from "lucide-react";
import anwaarLogo from "@/assets/anwaar-logo.png";
import FihrasOverlay from "./FihrasOverlay";

interface NavbarProps {
  currentSurahId?: number;
}

const Navbar = ({ currentSurahId = 1 }: NavbarProps) => {
  const [showFihras, setShowFihras] = useState(false);

  return (
    <nav className="relative z-50 px-4 py-2 bg-[#0f0f0f] border-b border-white/5">
      <div className="relative max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={anwaarLogo}
            alt="Anwaar Logo"
            className="h-8 w-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setShowFihras(true)}
          className="btn-outline scale-90 origin-right py-1.5 px-3 text-sm flex items-center gap-2 group hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300"
        >
          <BookOpen className="w-3.5 h-3.5 group-hover:text-emerald-400 transition-colors" />
          <span className="group-hover:text-emerald-50 transition-colors">Suuradaha</span>
        </button>

        {/* Overlay */}
        <FihrasOverlay
          isOpen={showFihras}
          onClose={() => setShowFihras(false)}
          currentSurahId={currentSurahId}
        />
      </div>
    </nav>
  );
};

export default Navbar;
