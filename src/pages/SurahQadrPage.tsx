import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahQadrPage = () => {
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

    // Data for Suurat Al-Qadr (97)
    const qadrData = {
        nameMeaning: "Al-Qadr (القدر) waxaa loola jeedaa 'Sharafta' ama 'Qaddarinta' (Habeenka Laylatul Qadr).",
        revelationType: "Waa Makki (مكية). Waxay ka hadlaysaa habeenka barakaysan ee Quraanka la soo dejiyey.",
        revelationContext: "Suuraddan waxay u timid inay dadka u sheegto fadliga weyn ee Habeenka Qadriga, kaas oo ka khayr badan kun bilood.",
        mainTheme: "Caddaynta sharafta Habeenka Qadriga, soo degista malaa'igta, iyo nabadgelyada habeenkaas ilaa waaberiga."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={97} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={97}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={qadrData} />
            </div>
        </div>
    );
};

export default SurahQadrPage;
