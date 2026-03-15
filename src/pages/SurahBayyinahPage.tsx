import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahBayyinahPage = () => {
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

    // Data for Suurat Al-Bayyinah (98)
    const bayyinahData = {
        nameMeaning: "Al-Bayyinah (البيّنة) waxaa loola jeedaa 'Caddaynta' ama 'Bayaanka'.",
        revelationType: "Waa Madani (مدنية). Waxay ka hadlaysaa farriinta Islaamka iyo kala saarista xaqa iyo baadilka.",
        revelationContext: "Suuraddan waxay u timid inay caddeyso in bini-aadamku u baahnaa rasool iyo caddayn xagga Eebbe ka timid si ay uga baxaan gudkurka gaalnimada.",
        mainTheme: "Caddaynta booska ay taagan yihiin Ehlu-Kitaabka iyo Mushrikiinta, iyo abaal-marinta weyn ee u dambaysa kuwa rumeeyey ee camalka suuban sameeyey (Khayrul Bariyyah)."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={98} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={98}
                    />
                </div>

                {/* Surah Details - Foldable Glass Grid */}
                <CollapsibleSurahGrid data={bayyinahData} />
            </div>
        </div>
    );
};

export default SurahBayyinahPage;
