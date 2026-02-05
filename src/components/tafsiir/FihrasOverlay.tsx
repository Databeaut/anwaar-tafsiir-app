import { useEffect, useState } from "react";
import { X, BookOpen, Lock, CheckCircle2, ChevronRight, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSurahAccess } from "@/hooks/useSurahAccess";

interface FihrasOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    currentSurahId: number;
}

const FihrasOverlay = ({ isOpen, onClose, currentSurahId }: FihrasOverlayProps) => {
    const { session } = useAuth();
    const navigate = useNavigate();

    // State
    const { unlockedSurahs } = useSurahAccess(session?.keyId);
    const [completedSurahs, setCompletedSurahs] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);

    // Sidebar Animation Variants
    const sidebarVariants = {
        closed: { x: "-100%", opacity: 0 },
        open: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 30
            }
        }
    };

    // Fetch Data
    useEffect(() => {
        if (!isOpen || !session?.keyId) return;

        const fetchData = async () => {
            setLoading(true);

            try {
                // 1. Fetch Access (Locks) - Handled by useSurahAccess Hook now


                // 2. Fetch Progress (Completion Checks)
                // We check if the student has marked the surah as completed in `student_progress`
                // Note: The logic for "Surah Completed" might need to verify if *all* lessons in surah are done.
                // For simplified logic on single-lesson surahs, checking if the lesson_id (which usually matches surahId for these short ones) is complete.
                // For Fatiha (ID 1), it has Lesson 0 and 1. We'll verify against surah-level logic if possible, 
                // but for now, let's assume if they have a completion record for the main lesson, it's done.

                const { data: progressData } = await supabase
                    .from('student_progress')
                    .select('lesson_id, is_completed')
                    .eq('student_access_key_id', session.keyId)
                    .eq('is_completed', true);

                if (progressData) {
                    // Map lesson IDs to Surah IDs. 
                    // For short surahs (114, 113, 112, 111, 110), lesson_id == surah_id typically in our current setup (or close mapping).
                    // For Fatiha (1), lesson Ids are 0 and 1. 
                    const finishedSurahs = new Set<number>();

                    progressData.forEach(p => {
                        // Direct mapping for short surahs
                        if (p.lesson_id >= 110 && p.lesson_id <= 114) {
                            finishedSurahs.add(p.lesson_id);
                        }
                        // Fatiha Logic: If Lesson 1 (ID 1) is done, we mark Surah 1 as done (simplification)
                        if (p.lesson_id === 1) finishedSurahs.add(1);
                    });

                    setCompletedSurahs(finishedSurahs);
                }

            } catch (error) {
                console.error("Fihras Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, session?.keyId]);

    // Data Definition
    const surahList = [
        { id: 1, displayOrder: 1, nameBase: "Surat Al-Fatiha", nameArabic: "سورة الفاتحة" },
        { id: 114, displayOrder: 2, nameBase: "Surat An-Naas", nameArabic: "سورة الناس" },
        { id: 113, displayOrder: 3, nameBase: "Surat Al-Falaq", nameArabic: "سورة الفلق" },
        { id: 112, displayOrder: 4, nameBase: "Surat Al-Ikhlaas", nameArabic: "سورة الإخلاص" },
        { id: 111, displayOrder: 5, nameBase: "Surat Al-Masad", nameArabic: "سورة المسد" },
        { id: 110, displayOrder: 6, nameBase: "Surat An-Nasr", nameArabic: "سورة النصر" }
    ].sort((a, b) => a.displayOrder - b.displayOrder);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Glass Sidebar */}
                    <motion.div
                        variants={sidebarVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm z-[101] bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                                    <Menu className="w-4 h-4 text-emerald-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white tracking-wide">Fihras</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {surahList.map((surah) => {
                                const isUnlocked = unlockedSurahs.has(surah.id);
                                const isCompleted = completedSurahs.has(surah.id);
                                const isActive = currentSurahId === surah.id;

                                return (
                                    <motion.button
                                        layout
                                        key={surah.id}
                                        disabled={!isUnlocked}
                                        onClick={() => {
                                            if (isUnlocked) {
                                                navigate(surah.id === 1 ? '/' : `/surah/${surah.id}`);
                                                onClose();
                                            }
                                        }}
                                        whileHover={isUnlocked ? { scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" } : {}}
                                        whileTap={isUnlocked ? { scale: 0.98 } : {}}
                                        className={cn(
                                            "w-full relative group flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300",
                                            isActive
                                                ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"
                                                : isUnlocked
                                                    ? "bg-white/5 border-white/10 hover:border-white/20"
                                                    : "bg-black/20 border-white/5 opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {/* Status Indicator Line (Active) */}
                                        {isActive && (
                                            <div className="absolute left-0 top-3 bottom-3 w-1 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        )}

                                        {/* Number Badge */}
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border backdrop-blur-md transition-colors",
                                            isActive
                                                ? "bg-emerald-500 text-black border-emerald-400"
                                                : isCompleted
                                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                                                    : "bg-white/5 text-zinc-500 border-white/10 group-hover:bg-white/10"
                                        )}>
                                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : surah.displayOrder}
                                        </div>

                                        {/* Text Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className={cn(
                                                    "text-sm font-bold truncate",
                                                    isActive ? "text-white" : isUnlocked ? "text-zinc-200" : "text-zinc-500"
                                                )}>
                                                    {surah.nameBase}
                                                </span>
                                                {!isUnlocked && <Lock className="w-3 h-3 text-zinc-600" />}
                                            </div>
                                            <div className={cn(
                                                "text-xs font-arabic truncate",
                                                isActive ? "text-emerald-400/80" : "text-zinc-500"
                                            )}>
                                                {surah.nameArabic}
                                            </div>
                                        </div>

                                        {/* Arrow / Active Glow */}
                                        {isUnlocked && (
                                            <ChevronRight className={cn(
                                                "w-4 h-4 transition-transform group-hover:translate-x-1",
                                                isActive ? "text-emerald-500" : "text-zinc-600 group-hover:text-zinc-400"
                                            )} />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Footer Info */}
                        <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                            <div className="flex items-center justify-between text-xs text-zinc-500 font-medium uppercase tracking-wider">
                                <span>Progress</span>
                                <span>{completedSurahs.size} / {surahList.length} Completed</span>
                            </div>
                            <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${(completedSurahs.size / surahList.length) * 100}%` }}
                                />
                            </div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FihrasOverlay;
