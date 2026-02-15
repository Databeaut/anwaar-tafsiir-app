import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahCaadiyaatPage = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

    const handleLessonsReady = useCallback((fetchedLessons: Lesson[]) => {
        setLessons(fetchedLessons);
    }, []);

    const handleLessonChange = useCallback((index: number) => {
        setCurrentLessonIndex(index);
    }, []);

    const handleLessonCompleted = useCallback((lessonId: number) => {
        console.log("Lesson completed:", lessonId);
    }, []);

    // Data for Surah Al-Caadiyaat (100)
    const caadiyaatData = {
        nameMeaning: "Al-Caadiyaat (العاديات) waxaa loola jeedaa 'Fardaha Ordaya'.",
        revelationType: "Waa Makki (مكية). Waxay ka mid tahay suuradaha sawirka xooggan ka bixiya dabeecadda bini-aadamka.",
        revelationContext: "Suuraddan waxay u timid inay dadka xasuusiso nimcada Eebbe iyo sida bini-aadamku uu ugu xidhan yahay jaceylka adduunka, isagoo iska indho-tiraya aakhiradiisa.",
        mainTheme: "Caddaynta in bini-aadamku uu yahay mid abaal-laawe ah marka laga reebo inta iimaanku hagayo, iyo digniin ku saabsan maalinta waxa laabta ku qarsoon la soo saari doono."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={100} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO SECTION: SmartVideoPlayer */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={100}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={caadiyaatData} />
            </div>
        </div>
    );
};

export default SurahCaadiyaatPage;
