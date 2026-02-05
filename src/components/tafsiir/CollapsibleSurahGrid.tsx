import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, MapPin, BookOpen, Target } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface InsightData {
    nameMeaning: string;
    revelationType: string;
    revelationContext: string;
    mainTheme: string;
}

interface CollapsibleSurahGridProps {
    data: InsightData;
}

const CollapsibleSurahGrid = ({ data }: CollapsibleSurahGridProps) => {
    const [isOpen, setIsOpen] = useState(false); // Default to closed as requested (or open? "The Fold" implies toggle. Let's default false or true? Usually default false for "Fold" implies it opens. Let's default FALSE to keep it compact initially, or TRUE if they want details immediately. "Interactive Folding" usually implies user control. I'll default to TRUE so they see it, but it's foldable. Actually, previous request asked for "Fold logic for longer text". Let's default to OPEN so users see the content, but can collapse it to save space.) 
    // Wait, prompt says "State A (Closed)... State B (Open)". 
    // I'll default to OPEN because it's the main info section.
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleOpen = () => setIsExpanded(!isExpanded);

    const sections = [
        {
            id: 'meaning',
            label: 'Macnaha Magaca',
            icon: Sparkles,
            content: data.nameMeaning,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10'
        },
        {
            id: 'type',
            label: 'Nooca',
            icon: MapPin,
            content: data.revelationType,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
        },
        {
            id: 'context',
            label: 'Sababta Soo Degtay',
            icon: BookOpen,
            content: data.revelationContext,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10'
        },
        {
            id: 'theme',
            label: 'Ujeedada Guud',
            icon: Target,
            content: data.mainTheme,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10'
        }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto font-sans">
            <motion.div
                layout
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl"
            >
                {/* Header Section */}
                <motion.button
                    layout="position"
                    onClick={toggleOpen}
                    className="w-full flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <BookOpen className="w-5 h-5 text-white/80" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-white tracking-wide">Faahfaahinta Suurada</h3>
                            <p className="text-xs text-zinc-400 font-medium">Ribbon-ka Macluumaadka</p>
                        </div>
                    </div>
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border border-white/10 bg-white/5 transition-transform duration-300",
                        isExpanded ? "rotate-180" : "rotate-0"
                    )}>
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </div>
                </motion.button>

                {/* Collapsible Grid Content */}
                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <div className="bg-white/5 p-px gap-px grid grid-cols-1 md:grid-cols-2">
                                {sections.map((section) => (
                                    <div
                                        key={section.id}
                                        className="relative group bg-[#0f0f0f]/80 p-6 hover:bg-white/5 transition-colors duration-300"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn("mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/5", section.bg)}>
                                                <section.icon className={cn("w-4 h-4", section.color)} />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    {section.label}
                                                </h4>
                                                <p className="text-sm leading-relaxed text-zinc-200">
                                                    {section.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default CollapsibleSurahGrid;
