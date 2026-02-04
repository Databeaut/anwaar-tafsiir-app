import { motion } from "framer-motion";
import { BookOpen, Sparkles, MapPin, Target } from "lucide-react";
import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahFalaqPage = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

    const handleLessonsReady = useCallback((newLessons: Lesson[]) => {
        setLessons(newLessons);
    }, []);

    const handleLessonChange = useCallback((index: number) => {
        setCurrentLessonIndex(index);
    }, []);

    const handleLessonCompleted = useCallback((index: number) => {
        console.log("Lesson completed:", index);
    }, []);

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
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={113}
                    />
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
