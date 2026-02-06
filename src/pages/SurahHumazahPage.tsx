import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahHumazahPage = () => {
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

    // Data for Surah Al-Humazah (104)
    const humazahData = {
        nameMeaning: "Al-Humazah (الهمزة) waxaa loola jeedaa 'Cebaynta ama xumaan-ka-sheegga'.",
        revelationType: "Waa Makki (مكية). Waxay ka hadlaysaa khatarta ay leedahay in dadka lagu dhababaco ama la yaso.",
        revelationContext: "Suuraddu waxay ku soo degtay dadka u haysta in xoolahoodu ay u waarayaan, kuwaas oo caadaystay inay dadka kale afka iyo gacantaba ku dhibaan.",
        mainTheme: "Caddaynta ciqaabta adag ee u taal kuwa hantida isku weyneeya ee dadka caaya, iyo in xooluhu aysan qofna ka badbaadin karin cadaabka Allah."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={104} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={104}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={humazahData} />
            </div>
        </div>
    );
};

export default SurahHumazahPage;
