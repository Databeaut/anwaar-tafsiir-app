import { motion } from "framer-motion";
import { Clock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/tafsiir/Navbar";
import { Link, useNavigate } from "react-router-dom";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahNaasPage = () => {
    const navigate = useNavigate();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

    const handleLessonsReady = useCallback((newLessons: Lesson[]) => {
        setLessons(newLessons);
    }, []);

    const handleLessonChange = useCallback((index: number) => {
        setCurrentLessonIndex(index);
    }, []);

    const handleLessonCompleted = useCallback((index: number) => {
        // Only one lesson for now, but standard handler
        console.log("Lesson completed:", index);
    }, []);

    const naasData = {
        nameMeaning: "An-Naas (الناس) waxaa loola jeedaa 'Dadka'. Waa suuradda ugu dambaysa Quraanka.",
        revelationType: "Waa Makki (مكية), waxaana la soo dejiyey xilli ay Muslimiintu joogeen Maka.",
        revelationContext: "Waxay ku soo degtay in lagu daweeyo sixirka iyo waswaaska (الوسواس الخناس).",
        mainTheme: "Mawduuca ugu weyn waa magan-galka Allah (الاستعاذة) si looga badbaado xumaanta qarsoon."
    };



    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            <Navbar currentSurahId={114} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* Video Player */}
                <div className="w-full -mt-8">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={114}
                    />
                </div>

                {/* Info Card - SURAH DETAILS */}
                {/* Info Ribbon */}
                {/* Info Ribbon */}
                <CollapsibleSurahGrid data={naasData} />

            </div>
        </div>
    );
};

export default SurahNaasPage;
