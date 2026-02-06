import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahFilPage = () => {
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

    // Data for Surah Al-Fil (105)
    const filData = {
        nameMeaning: "Al-Fiil (الفيل) waxaa loola jeedaa 'Maroodiga'. Waxay ka hadlaysaa qisadii weynayd ee ciidankii maroodiga watey.",
        revelationType: "Waa Makki (مكية). Waxay ka mid tahay suuradaha looga sheekeeyo awoodda Allah.",
        revelationContext: "Waxay ku soo degtay in lagu xasuusiyo dadka sidii Allah u baabi'iyey ciidankii Abraha ee u yimid inay dumiyaan Kacbada sanadkii uu dhashay Nabiga (NNKH).",
        mainTheme: "Caddaynta in Allah uu difaacayo gurigiisa (Kacbada) iyo tusaale ku saabsan halaagga kuwa is-weyneeya ee doonaya inay diinta dumiyaan."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={105} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={105}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={filData} />
            </div>
        </div>
    );
};

export default SurahFilPage;
