import { useEffect, useState } from "react";
import { X, BookOpen, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface FihrasOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    currentSurahId: number;
}

const FihrasOverlay = ({ isOpen, onClose, currentSurahId }: FihrasOverlayProps) => {
    const { session } = useAuth();
    const navigate = useNavigate();
    const [unlockedSurahs, setUnlockedSurahs] = useState<Set<number>>(new Set([1])); // Default Fatiha unlocked
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !session?.keyId) return;

        const fetchAccess = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('student_surah_access')
                .select('surah_id, is_unlocked')
                .eq('student_key_id', session.keyId);

            if (!error && data) {
                const unlocked = new Set(data.filter(d => d.is_unlocked).map(d => d.surah_id));
                setUnlockedSurahs(unlocked);
            }
            setLoading(false);
        };

        fetchAccess();
    }, [isOpen, session?.keyId]);

    if (!isOpen) return null;

    // Hardcoded list for now, ideally fetched or from config
    const surahList = [
        { id: 1, nameBase: "Surat Al-Fatiha", nameArabic: "سورة الفاتحة", lessonCount: 2 },
        { id: 113, nameBase: "Surat Al-Falaq", nameArabic: "سورة الفلق", lessonCount: 1 },
        { id: 114, nameBase: "Surat An-Naas", nameArabic: "سورة الناس", lessonCount: 1 } // Example ID for Naas
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-emerald-400" />
                        Suuradaha
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List of Surahs */}
                <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {loading && (
                        <div className="text-center py-4 text-gray-500 text-sm animate-pulse">Checking access...</div>
                    )}

                    {!loading && surahList.map((surah) => {
                        const isUnlocked = unlockedSurahs.has(surah.id);
                        const isActive = surah.id === currentSurahId;

                        return (
                            <div
                                key={surah.id}
                                onClick={() => {
                                    if (isUnlocked) {
                                        if (surah.id === 1) navigate('/');
                                        else navigate(`/surah/${surah.id}`);
                                        onClose();
                                    }
                                }}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                                    isUnlocked ? "cursor-pointer active:scale-[0.98]" : "cursor-not-allowed",
                                    isActive
                                        ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_-10px_rgba(16,185,129,0.3)]"
                                        : isUnlocked
                                            ? "bg-white/5 border-white/10 hover:bg-white/10"
                                            : "bg-black/20 border-white/5 opacity-50"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-colors",
                                        isActive
                                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                            : isUnlocked
                                                ? "bg-white/10 text-gray-300 border-white/20"
                                                : "bg-white/5 text-gray-600 border-white/5"
                                    )}>
                                        {surah.id}
                                    </div>
                                    <div>
                                        <h3 className={cn(
                                            "font-bold text-xl font-arabic transition-colors",
                                            isActive
                                                ? "text-emerald-100"
                                                : isUnlocked
                                                    ? "text-gray-200"
                                                    : "text-gray-500"
                                        )}>
                                            {surah.nameArabic}
                                        </h3>
                                        <p className={cn(
                                            "text-xs font-medium uppercase tracking-wider mt-0.5",
                                            isActive
                                                ? "text-emerald-400"
                                                : isUnlocked
                                                    ? "text-gray-400"
                                                    : "text-gray-600"
                                        )}>
                                            {isActive ? "Active Lesson" : isUnlocked ? "Available" : "Locked"}
                                        </p>
                                    </div>
                                </div>
                                {isUnlocked ? (
                                    <BookOpen className={cn(
                                        "w-5 h-5",
                                        isActive ? "text-emerald-400 drop-shadow-glow" : "text-gray-400"
                                    )} />
                                ) : (
                                    <Lock className="w-4 h-4 text-gray-700" />
                                )}
                            </div>
                        );
                    })}

                    <div className="h-4" />
                </div>
            </div>
        </div>
    );
};

export default FihrasOverlay;
