import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahTakaasurPage = () => {
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

    // Data for Surah At-Takaasur (102)
    const takaasurData = {
        nameMeaning: "At-Takaasur (التكاثر) waxaa loola jeedaa 'Tartanka badnaanta' ama 'Isku faanidda waxyaabaha adduunka'.",
        revelationType: "Waa Makki (مكية). Waxay ka mid tahay suuradaha digniinta xooggan u diraya dadka adduunka ku mashquulay.",
        revelationContext: "Suuraddan waxay u timid in lagu canaanto dadka u tartamaya urursiga maalka iyo tirada qoyska, iyagoo iska indho tiraya ujeeddadii loo abuuray ilaa ay qabriga ka galaan.",
        mainTheme: "In bini-aadamka laga baraarujiyo sabaalinta adduunka, lana xasuusiyo in maalin uun la weydiin doono nimco kasta oo la siiyey (Iimaan, caafimaad, iyo maal)."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={102} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={102}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={takaasurData} />
            </div>
        </div>
    );
};

export default SurahTakaasurPage;
