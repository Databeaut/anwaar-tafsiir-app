import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import CollapsibleSurahGrid from "@/components/tafsiir/CollapsibleSurahGrid";
import { useState, useCallback } from "react";
import { type Lesson } from "@/components/tafsiir/surahData";

const SurahMaunPage = () => {
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

    // Data for Surah Al-Ma'un
    const maunData = {
        nameMeaning: "Al-Maacun (الماعون) waxaa loola jeedaa 'Waxyaabaha yaryar ee la isku caawiyo' ama agabka guriga ee dadku isu amaahiyaan.",
        revelationType: "Waa Makki (مكية). Waxay ka hadlaysaa dabeecadaha dadka diinta beeniya iyo munaafiqiinta.",
        revelationContext: "Suuraddu waxay ku soo degtay dad diidi jiray inay masaakiinta quudiyaan ama agoomaha u naxariistaan, iyagoo is-tusnimo u tukanaya.",
        mainTheme: "Caddaynta in cibaadadu aysan ka go'naan karin naxariista bini-aadamka iyo kaalmaynta dadka dhibaataysan."
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
            <FloatingDecorations />
            {/* Navbar with Fihras */}
            <Navbar currentSurahId={107} />

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-8">
                {/* VIDEO PLAYER: Active Learning Session */}
                <div className="w-full -mt-8 relative">

                    {/* The Player Logic - Will still render the list below */}
                    <SmartVideoPlayer
                        onLessonsReady={handleLessonsReady}
                        onLessonChange={handleLessonChange}
                        onLessonCompleted={handleLessonCompleted}
                        currentLessonIndex={currentLessonIndex}
                        lessons={lessons}
                        surahId={107}
                    />
                </div>

                {/* Surah Details - High Performance Insight */}
                <CollapsibleSurahGrid data={maunData} />

            </div>
        </div>
    );
};

export default SurahMaunPage;
