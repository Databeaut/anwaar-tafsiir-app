import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahShamsPage = () => {
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

    // Data for Suurat Ash-Shams (91)
    const shamsData = {
        nameMeaning: "Ash-Shams (الشمس) waxaa loola jeedaa 'Qorraxda'.",
        revelationType: "Waa Makki (مكية). Waxay ka mid tahay suuradaha ugu quruxda badan ee Eebbe ku dhaartay uunka weyn.",
        revelationContext: "Suuraddan waxay u timid inay dadka xasuusiso guusha qofka naftiisga daahiriya (tazkiyah) iyo khasaaraha qofka naftiisa dunuubta ku dhex huriya, iyadoo tusaale loosoo qaatay qoladii Thamuud ee Nabigoodii Saalix (CS) beeniyey.",
        mainTheme: "Caddaynta in guusha dhabta ahi ay ku xidhan tahay daahirinta nafta, iyo digniin ku saabsan ciqaabta Eebbe ee ku dhacda kuwa kibra ee xadgudba."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={91} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={91}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={shamsData} />
            </div>
        </div>
    );
};

export default SurahShamsPage;
