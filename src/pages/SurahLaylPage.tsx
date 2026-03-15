import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahLaylPage = () => {
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

    // Data for Suurat Al-Layl (92)
    const laylData = {
        nameMeaning: "Al-Layl (الليل) waxaa loola jeedaa 'Habaynka'.",
        revelationType: "Waa Makki (مكية). Waxay ka mid tahay suuradaha sawirka xooggan ka bixiya dabeecadda bini-aadamka iyo camalkiisa.",
        revelationContext: "Suuraddan waxay u timid inay muujiso kala duwanaanshaha camalka bini-aadamka iyo natiijada ka dhalata. Waxaa loo soo dejiyey Abuu Bakar (RC) oo iska bixiyey xoolahiisa si uu addoomada u xoreeyo iyo Umayya bin Khalaf oo bakhaylay.",
        mainTheme: "Caddaynta in dadaalka dadku uu kala duwan yahay, midna uu jannada u socdo midna naarta, iyo in Eebbe u fududeeyo qof kasta wixii uu u jeestay."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={92} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={92}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={laylData} />
            </div>
        </div>
    );
};

export default SurahLaylPage;
