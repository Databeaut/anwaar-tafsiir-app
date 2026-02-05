import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahNasrPage = () => {
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

    // Data for Surah An-Nasr
    const nasrData = {
        nameMeaning: "An-Nasr (النصر) waxaa loola jeedaa 'Guusha'. Waa suuraddii ugu dambaysay ee soo dagta.",
        revelationType: "Waa Madani (مدنية), waxaana la soo dejiyey Xajka Sagootinta (Xajjatul Wadaac).",
        revelationContext: "Waxay bishaaraysay in geerida Nebiga (NNKH) ay soo dhawaatay iyo in diinta Islaamku ay guulaysatay.",
        mainTheme: "Suuraddu waxay amraysaa in Allah loo tasbiixsado marka guushu timaado, laguna shukriyo."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={110} />

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
                        surahId={110}
                    />
                </div>

                {/* Info Ribbon - High Performance Insight */}
                {/* Surah Details - High Performance Insight */}
                <CollapsibleSurahGrid data={nasrData} />

            </div>
        </div>
    );
};

export default SurahNasrPage;
