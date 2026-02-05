import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahQurayshPage = () => {
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

    // Data for Surah Quraysh (106)
    const qurayshData = {
        nameMeaning: "Quraysh waxaa loola jeedaa qabiilka Nabi Muxamed (SCW), oo ahaa kuwa gacanta ku hayay Kacbada.",
        revelationType: "Waa Makki (مكية). Waxay xusuusinaysaa Quraysh nimcooyinka Eebe ku mannaystay.",
        revelationContext: "Eebe wuxuu Quraysh ku nimceeyay ammaan iyo risiqa labada safar (jiilaal iyo xagaa), isagoo ugu baaqaya inay caabudaan.",
        mainTheme: "Mahadnaqa Eebe iyo cibaadada Rabiga Kacbada oo siiyay amni iyo barwaaqo."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={106} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">

                    {/* The Player Logic */}
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={106}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={qurayshData} />

            </div>
        </div>
    );
};

export default SurahQurayshPage;
