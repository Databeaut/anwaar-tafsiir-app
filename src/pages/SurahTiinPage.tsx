import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahTiinPage = () => {
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

    // Data for Suurat At-Tiin (95)
    const tiinData = {
        nameMeaning: "At-Tiin (التين) waxaa loola jeedaa 'Tiinka' (waa midho la yaqaan).",
        revelationType: "Waa Makki (مكية). Waxay ka hadlaysaa karaamada bini-aadamka iyo sida uu Eebbe u abuuray.",
        revelationContext: "Suuraddan waxay u timid inay dadka xasuusiso in Eebbe bini-aadamka ku abuuray suuradda ugu quruxda badan (Ahsani Taquiim), loona baahan yahay inuu ku mahadiyo cibaadada.",
        mainTheme: "Caddaynta sharafta bini-aadamka, muhiimadda iimaanka iyo camalka suuban, iyo in Eebbe yahay kan ugu xaqqa badan ee xukuma (Ahkamul Xaakimiin)."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={95} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={95}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={tiinData} />
            </div>
        </div>
    );
};

export default SurahTiinPage;
