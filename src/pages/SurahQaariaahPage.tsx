import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahQaariaahPage = () => {
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

    // Data for Surah Al-Qaari'ah (101)
    const qaariaahData = {
        nameMeaning: "Al-Qaari'ah (القارعة) waxaa loola jeedaa 'Tan wax garaacda' ama 'Dhawaaq naxdin leh' (waa mid ka mid ah magacyada Maalinta Qiyaamaha).",
        revelationType: "Waa Makki (مكية). Waxay si xooggan u sawiraysaa naxdinta Maalinta Qiyaamaha iyo kala bixidda dadka.",
        revelationContext: "Suuraddan waxay u timid inay bini-aadamka uga digto maalinta dadku ay noqon doonaan sida balanbaalis firdhay, buurahana ay noqon doonaan sida dhogorta la tuman.",
        mainTheme: "Caddaynta weynida miisaanka camalka iyo siday dadku ugu kala bixi doonaan laba kooxood: kuwa miisaankoodu cuslaado (liibaana) iyo kuwa miisaankoodu fududaado (halaagsama)."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={101} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={101}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={qaariaahData} />
            </div>
        </div>
    );
};

export default SurahQaariaahPage;
