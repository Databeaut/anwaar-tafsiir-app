import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, MapPin, Target } from "lucide-react";

interface SurahInfoCardProps {
  surahName: string;
  onError?: (error: string) => void;
}

const SurahInfoCard: React.FC<SurahInfoCardProps> = ({ surahName }) => {
  // Static Data for "Al-Faatixa" (or generic fallback) as requested
  const staticData = {
    nameMeaning: "Al-Faatixa waxay ka timid erayga Carabiga ah 'Al-Fath' oo macnaheedu yahay furitaan. Waxaa loogu magac daray 'Furitaanka Kitaabka' sababtoo ah waa suuradda lagu bilaabo akhriska Quraanka Kariimka ah iyo salaadda.",
    revelationType: "Waa Makki, waxaana la soo dejiyey xilli ay Muslimiintu joogeen Maka ka hor Hijradii Madiina.",
    revelationContext: "Suuraddan waxaa loo soo dejiyey inay noqoto gundhigga xiriirka ka dhexeeya addoonka iyo Rabbigiis, iyadoo baraysa qofka mu'minka ah qaabka saxda ah ee loo baryo loona weyneeyo Allah.",
    mainTheme: "Mawduuca ugu weyn ee suuradda waa qirashada kelinimada Allah (Tawxiidka), u hoggaansanaanta caabuditaankiisa, iyo weydiisashada hanuunka jidka toosan."
  };

  const infoSections = [
    {
      icon: Sparkles,
      label: "Macnaha Magaca",
      sublabel: "الاسم والمعنى",
      content: staticData.nameMeaning,
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
    },
    {
      icon: MapPin,
      label: "Nooca",
      sublabel: "مكان النزول",
      content: staticData.revelationType,
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      icon: BookOpen,
      label: "Sababta Soo Degtay",
      sublabel: "أسباب النزول",
      content: staticData.revelationContext,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: Target,
      label: "Ujeedada Guud",
      sublabel: "الموضوع الأساسي",
      content: staticData.mainTheme,
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
    },
  ];

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Faahfaahinta Suurada</h3>
            <p className="text-xs text-muted-foreground">Xogta Suuradda</p>
          </div>
        </div>
      </div>

      {/* Animated Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoSections.map((section, index) => (
          <motion.div
            key={index}
            className="p-4 rounded-xl bg-white/5 border border-white/5 cursor-default"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-8 h-8 rounded-lg ${section.iconBg} flex items-center justify-center`}
              >
                <section.icon className={`w-4 h-4 ${section.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{section.label}</p>
                <p className="text-xs font-medium text-zinc-500 font-arabic">{section.sublabel}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mt-2 border-t border-white/5 pt-2">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SurahInfoCard;
