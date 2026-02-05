import { motion } from "framer-motion";
import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahKawtharPage = () => {
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

    // Data for Surah Al-Kawthar
    const kawtharData = {
        nameMeaning: "Al-Kawthar (الكوثر) waxaa loola jeedaa 'Nimco fara badan' ama wabiga Allah u ballan qaaday Nabiga (NNKH) ee Jannada ku yaal.",
        revelationType: "Waa Makki (مكية). Waa suuradda ugu gaaban Qur'aanka Kariimka ah.",
        revelationContext: "Waxay ku soo degtay jawaab loo bixiyey gaaladii dhihi jirtay Nabigu waa 'Abtar' (mid go'ay) markii ay carruurtiisii wiilasha ahaa dhinteen.",
        mainTheme: "Suuraddu waxay caddaynaysaa nimcada Allah siiyey Nabiga iyo in cadawgiisa ay yihiin kuwa halaagsami doona."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={108} />

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
                        surahId={108}
                    />
                </div>

                {/* Surah Details - High Performance Insight */}
                <CollapsibleSurahGrid data={kawtharData} />

            </div>
        </div>
    );
};

export default SurahKawtharPage;
