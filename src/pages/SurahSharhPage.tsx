import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahSharhPage = () => {
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

    // Data for Suurat Ash-Sharh (94)
    const sharhData = {
        nameMeaning: "Ash-Sharh (الشرح) waxaa loola jeedaa 'Fidinta' ama 'Wanaajinta' (oo loola jeedo furitaanka laabta).",
        revelationType: "Waa Makki (مكية). Waxay ka mid tahay suuradaha qalbi-qaboojinta iyo dhiirigelinta u ah mu'miniinta.",
        revelationContext: "Suuraddan waxay u timid inay Nabiga (CSW) iyo mu'miniinta u xaqiijiso in Eebbe garab taagan yahay, isagoo ka fududeeyey culayskii iyo dhibkii uu kala kulmay faafinta dacwada.",
        mainTheme: "Caddaynta in dhib kasta uu weheliyo fudeed (Inna macal cusri yusraa), dhiirigelinta in camalka suuban la joogteeyo, iyo in mar walba loo xidhado xagga Eebbe."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={94} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={94}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={sharhData} />
            </div>
        </div>
    );
};

export default SurahSharhPage;
