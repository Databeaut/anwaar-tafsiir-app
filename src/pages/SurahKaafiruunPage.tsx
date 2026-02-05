import { motion } from "framer-motion";
import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahKaafiruunPage = () => {
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

    // Data for Surah Al-Kaafiruun
    const kaafiruunData = {
        nameMeaning: "Al-Kaafiruun (الكافرون) waxaa loola jeedaa 'Gaalada'. Waxay ka hadlaysaa kala saarista tawxiidka iyo gaalnimada.",
        revelationType: "Waa Makki (مكية). Waxay ku soo degtay xilli madaxda Quraysh ay Nabiga (NNKH) u soo bandhigeen in diimaha la isku dhex daro.",
        revelationContext: "Waxay jawaab u ahayd soo jeedintii gaalada ee ahayd 'hal sano annaga ayaa Ilaahayaga caabudayna, hal sano adiguna caabud', taasoo Allah uu diiday.",
        mainTheme: "Caddaynta inuusan jirin wax tanaasul ah oo laga samaynayo caqiidada iyo in qof walba leeyahay waddadiisa diineed."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={109} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">

                    {/* The Player Logic - Will still render the list below */}
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={109}
                    />
                </div>

                {/* Surah Details - High Performance Insight */}
                <CollapsibleSurahGrid data={kaafiruunData} />

            </div>
        </div>
    );
};

export default SurahKaafiruunPage;
