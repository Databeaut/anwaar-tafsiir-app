import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahIkhlaasPage = () => {
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

    // Data for Surah Al-Ikhlaas
    const ikhlaasData = {
        nameMeaning: "Al-Ikhlaas (الإخلاص) macnaheedu waa 'Daacadnimada' ama 'Kalı u noqoshada'.",
        revelationType: "Waa Makki (مكية)",
        revelationContext: "Waxay soo degtay markii ay mushrikiintu Nebiga (SCW) waydiiyeen abtirsiinyaha Rabbi.",
        mainTheme: "Mawduuca ugu weyn waa Tawxiidka iyo sifaynta Allah ee midnimada."
    };



    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={112} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    {/* Coming Soon logic removed as video is now deploy. */}

                    {/* The Player Logic - Will still render the list below */}
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={112}
                    />
                </div>

                {/* Info Card - SURAH DETAILS */}
                {/* Info Ribbon */}
                {/* Info Ribbon */}
                <CollapsibleSurahGrid data={ikhlaasData} />

            </div>
        </div>
    );
};

export default SurahIkhlaasPage;
