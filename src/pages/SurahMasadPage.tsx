import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahMasadPage = () => {
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

    // Data for Surah Al-Masad
    const masadData = {
        nameMeaning: "Al-Masad (المسد) waxaa loola jeedaa 'Xadhig adag' ama 'Saan'. Waxay ka hadlaysaa ciqaabta Abuu Lahab.",
        revelationType: "Waa Makki (مكية), waxaana la soo dejiyey xilli ay jirtay cadaadis xooggan oo ka dhan ahaa Nabi Muxammad (NNKH).",
        revelationContext: "Waxay ku soo degtay jawaab loo bixiyey Abuu Lahab oo u gaabsaday Nabiga markii uu dadka ugu yeeray Safaa.",
        mainTheme: "Suuraddu waxay caddaynaysaa halaagga kuwa ka horyimaada diinta Allah iyo in xoolo iyo qaraabo toona aysan waxba ka tarayn."
    };



    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={111} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    {/* Coming Soon logic removed as video is now deployed. */}

                    {/* The Player Logic - Will still render the list below */}
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={111}
                    />
                </div>

                {/* Info Card - SURAH DETAILS */}
                {/* Info Ribbon - High Performance Insight */}
                {/* Info Ribbon - High Performance Insight */}
                <CollapsibleSurahGrid data={masadData} />

            </div>
        </div>
    );
};

export default SurahMasadPage;
