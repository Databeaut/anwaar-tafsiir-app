import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahAsrPage = () => {
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

    // Data for Surah Al-Asr (103)
    const asrData = {
        nameMeaning: "Al-Casri (العصر) waxaa loola jeedaa 'Xilliga' ama 'Galabta'.",
        revelationType: "Waa Makki (مكية). Waa suurad kooban laakiin xambaarsan nuxurka guusha bini-aadamka.",
        revelationContext: "Suuraddan waxay caddeynaysaa in waqtigu uu yahay raasamaalka qofka, qof kastaana uu khasaare ku jiro marka laga reebo kuwa rumeeyay Allah, camal faliidkana la yimid.",
        mainTheme: "Caddaynta afar sifo oo haddii qofku helo uu ka badbaadayo khasaaraha ifka iyo aakhiraba: Iimaan, Camal saalix ah, is-faryidda xaqa, iyo is-faryidda samirka."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={103} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={103}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={asrData} />
            </div>
        </div>
    );
};

export default SurahAsrPage;
