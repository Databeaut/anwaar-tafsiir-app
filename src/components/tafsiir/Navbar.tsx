import { User } from "lucide-react";
import anwaarLogo from "@/assets/anwaar-logo.png";

const Navbar = () => {
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
        <button className="btn-outline scale-90 origin-right py-1.5 px-3 text-sm">
          <User className="w-3.5 h-3.5" />
          <span>Soo Gal</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
