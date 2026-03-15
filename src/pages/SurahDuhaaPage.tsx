import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahDuhaaPage = () => {
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

    // Data for Suurat Ad-Duhaa (93)
    const duhaaData = {
        nameMeaning: "Ad-Duhaa (الضحى) waxaa loola jeedaa 'Barqada' ama 'Iftiinka cadceedda ee barqada'.",
        revelationType: "Waa Makki (مكية). Waxay ka mid tahay suuradaha qalbiga dhisaya, naxariista Eebbena lagu xasuusinayo.",
        revelationContext: "Suuraddan waxay u timid inay Nabiga (CSW) u qaboojiso qalbiga ka dib markii uu waxyigu muddo ka daahay, gaaladiina ay yiraahdeen 'Eebbahaa wuu ku dardaarmay'. Eebbe wuxuu u caddeeyey inuusan marnaba ka tegin.",
        mainTheme: "Caddaynta naxariista Eebbe ee joogtada ah, ballan-qaadka aakhirada ee ka wanaagsan adduunka, iyo dhiirigelinta u samaynta agoonta iyo masaakiinta iyo ka sheekaynta nimcada Eebbe."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={93} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={93}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={duhaaData} />
            </div>
        </div>
    );
};

export default SurahDuhaaPage;
