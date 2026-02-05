import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Target, Award, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { useState } from "react";

interface InsightData {
    nameMeaning: string;
    revelationType: string;
    revelationContext: string;
    mainTheme: string;
}

interface SurahInsightRibbonProps {
    data: InsightData;
}

const SurahInsightRibbon = ({ data }: SurahInsightRibbonProps) => {
    const [isContextOpen, setIsContextOpen] = useState(false);

    // Extract Makki/Madani for badge styling logic
    // We scan the string to see if it implies Makki or Madani
    const typeLower = data.revelationType.toLowerCase();
    const isMakki = typeLower.includes("makki") || typeLower.includes("makkah");

    // Dynamic styles based on type
    const badgeColor = isMakki
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";

    const iconColor = isMakki ? "text-amber-400" : "text-emerald-400";

    return (
        <div className="w-full max-w-5xl mx-auto space-y-3 font-sans">
            {/* Top Ribbon - Compact Horizontal Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

                {/* 1. Name Meaning (Span 5) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-5 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden"
                >
                    <div className="flex items-start gap-4 h-full">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">Macnaha</h4>
                            <p className="text-sm font-medium text-zinc-100 leading-snug">
                                {data.nameMeaning}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Main Theme (Span 4) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-4 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 group relative overflow-hidden"
                >
                    <div className="flex items-start gap-4 h-full">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Target className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-purple-300 uppercase tracking-[0.2em]">Ujeedada</h4>
                            <p className="text-sm font-medium text-zinc-100 leading-snug line-clamp-3 md:line-clamp-2">
                                {data.mainTheme}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Type Badge & Toggle (Span 3) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-3 flex flex-col gap-2 h-full"
                >
                    {/* Badge */}
                    <div className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl border ${badgeColor} backdrop-blur-md`}>
                        <MapPin className={`w-4 h-4 ${iconColor}`} />
                        <div className="flex flex-col leading-none">
                            <span className="text-[9px] font-bold uppercase opacity-60 tracking-wider">Nooca</span>
                            <span className="text-sm font-bold truncate">{data.revelationType.split(',')[0]}</span>
                        </div>
                    </div>

                    {/* Context Toggle Button */}
                    <button
                        onClick={() => setIsContextOpen(!isContextOpen)}
                        className={`flex-1 flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border hover:bg-white/10 transition-all text-left ${isContextOpen ? "border-blue-500/50 text-white" : "border-white/5 text-zinc-400"}`}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {isContextOpen ? "Qari Sababta" : "Sababta"}
                        </span>
                        {isContextOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                </motion.div>

            </div>

            {/* Collapsible Context Section */}
            <AnimatePresence>
                {isContextOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/10 relative">
                            <div className="flex items-start gap-4">
                                <div className="mt-0.5">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/10">
                                        <Award className="w-4 h-4 text-blue-400" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.2em] mb-2">Sababta Soo Degtay (Context)</h4>
                                    <p className="text-sm md:text-base text-zinc-200 leading-relaxed max-w-4xl">
                                        {data.revelationContext}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SurahInsightRibbon;
