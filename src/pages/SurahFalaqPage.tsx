import { motion } from "framer-motion";
import { BookOpen, Sparkles, MapPin, Target } from "lucide-react";
import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";

const SurahFalaqPage = () => {
    // Data for Surah Al-Falaq
    const falaqData = {
        nameMeaning: "Al-Falaq (الفلق) waxaa loola jeedaa 'Waaberiga' ama 'Kala dilaaca'. Waa suuradda 113-aad ee Quraanka.",
        revelationType: "Waa Makki (مكية), waxaana la soo dejiyey iyadoo la raacinayo suuradda An-Naas.",
        revelationContext: "Waxay ku soo degtay in lagu daweeyo sixirka iyo in Allah laga magan-galo xumaanta makhluuqaadka.",
        mainTheme: "Mawduuca ugu weyn waa magan-galka Allah (الاستعاذة) si looga badbaado makhluuqaadka xumaantooda iyo xaasidnimada."
    };

    const infoSections = [
        {
            icon: Sparkles,
            label: "Macnaha Magaca",
            sublabel: "الاسم والمعنى",
            content: falaqData.nameMeaning,
            iconBg: "bg-amber-500/20",
            iconColor: "text-amber-400",
        },
        {
            icon: MapPin,
            label: "Nooca",
            sublabel: "مكان النزول",
            content: falaqData.revelationType,
            iconBg: "bg-emerald-500/20",
            iconColor: "text-emerald-400",
        },
        {
            icon: BookOpen,
            label: "Sababta Soo Degtay",
            sublabel: "أسباب النزول",
            content: falaqData.revelationContext,
            iconBg: "bg-blue-500/20",
            iconColor: "text-blue-400",
        },
        {
            icon: Target,
            label: "Ujeedada Guud",
            sublabel: "الموضوع الأساسي",
            content: falaqData.mainTheme,
            iconBg: "bg-purple-500/20",
            iconColor: "text-purple-400",
        },
    ];

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            <Navbar currentSurahId={113} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLACEHOLDER: Glassmorphism "Coming Soon" */}
                <div className="w-full -mt-8 aspect-video rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 group">
                    {/* Background with Blur */}
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523060-8da1d56e37ad?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700 blur-sm scale-110" />

                    {/* Glass Overlay Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 backdrop-blur-sm bg-black/40">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                            <h2 className="relative text-4xl md:text-5xl font-bold font-arabic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 tracking-wide drop-shadow-lg">
                                Dhawaan Filo
                            </h2>
                        </div>
                        <p className="mt-4 text-slate-400 text-lg font-medium border-t border-white/10 pt-4 px-8">
                            Dersiga Suuradda Al-Falaq wuu soo socdaa Insha'Allah
                        </p>
                    </div>

                    {/* Subtle Border Glow */}
                    <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-emerald-500/30 transition-colors duration-500" />
                </div>

                {/* Info Card - SURAH DETAILS */}
                <div className="glass-card p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Faahfaahinta Suurada</h3>
                                <p className="text-xs text-muted-foreground">Xogta Suuradda Al-Falaq</p>
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

            </div>
        </div>
    );
};

export default SurahFalaqPage;
