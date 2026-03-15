import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahAlaqPage = () => {
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

    // Data for Suurat Al-Alaq (96)
    const alaqData = {
        nameMeaning: "Al-Alaq (العلق) waxaa loola jeedaa 'Xinjirta'.",
        revelationType: "Waa Makki (مكية). Waa suuraddii ugu horreysay ee lagu bilaabay soo degista Quraanka.",
        revelationContext: "Waxay u timid inay caddayso bilowga waxyiga iyo muhiimadda akhriska iyo barashada, iyadoo u jawaabaysa diidmadii iyo kibirkii Abuu Jahal.",
        mainTheme: "Caddaynta in Eebbe yahay kan abuuray bini-aadamka, muhiimadda cilmiga iyo qalinku u leeyihiin dadka, iyo digniinta dadka kibra ee ka hor yimaada xaqa iyo cibaadada."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={96} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={96}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={alaqData} />
            </div>
        </div>
    );
};

export default SurahAlaqPage;
