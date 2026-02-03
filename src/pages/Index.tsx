import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/tafsiir/Navbar";
import FloatingDecorations from "@/components/tafsiir/FloatingDecorations";
import HeroSection from "@/components/tafsiir/HeroSection";
import LoginSection from "@/components/tafsiir/LoginSection";
import SmartVideoPlayer from "@/components/tafsiir/SmartVideoPlayer";
import SurahInfoCard from "@/components/tafsiir/SurahInfoCard";
import { type Lesson, courseConfig } from "@/components/tafsiir/surahData";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessonIndices, setCompletedLessonIndices] = useState<Set<number>>(new Set());
  const [shareCompletedLessons, setShareCompletedLessons] = useState<Set<number>>(new Set());

  const handleLessonsReady = useCallback((newLessons: Lesson[]) => {
    setLessons(newLessons);
  }, []);

  const handleLessonChange = useCallback((index: number) => {
    setCurrentLessonIndex(index);
  }, []);

  const handleLessonClick = useCallback((index: number) => {
    setCurrentLessonIndex(index);
  }, []);

  const handleLessonCompleted = useCallback((index: number) => {
    setCompletedLessonIndices(prev => new Set([...prev, index]));

    // Auto-Unlock Next Lesson Logic
    setLessons(prev => prev.map((lesson, idx) => {
      if (idx === index + 1) { // Next lesson
        return { ...lesson, isLocked: false };
      }
      return lesson;
    }));
  }, []);

  const handleShareCompleted = useCallback(() => {
    setShareCompletedLessons(prev => new Set([...prev, currentLessonIndex]));
  }, [currentLessonIndex]);

  const isCurrentLessonCompleted = completedLessonIndices.has(currentLessonIndex);
  const isShareCompleted = shareCompletedLessons.has(currentLessonIndex);
  const showSuccessOverlay = isCurrentLessonCompleted && !isShareCompleted;
  const completedLessons = currentLessonIndex;

  // Show loading state while verifying session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Sugaya...</p>
        </div>
      </div>
    );
  }
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
        <FloatingDecorations />
        <Navbar currentSurahId={1} />

        <main className="relative z-10">
          {/* Video Player Section */}
          <SmartVideoPlayer
            onLessonsReady={handleLessonsReady}
            onLessonChange={handleLessonChange}
            onLessonCompleted={handleLessonCompleted}

            currentLessonIndex={currentLessonIndex}

            lessons={lessons}
            surahId={1}
          />

          {/* Surah Details Card */}
          <div className="max-w-5xl mx-auto px-4 py-8">
            <SurahInfoCard surahName={courseConfig.surahName} />
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-8 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Tafsiir App. Dhammaan xuquuqda waa la ilaaliyey.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // CASE 2: User is Guest -> Show Landing Page & Login
  return (
    <div className="min-h-screen bg-[#0f0f0f] relative overflow-x-hidden">
      <FloatingDecorations />
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Login Section */}
        <div id="login-section" className="py-20">
          <LoginSection />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Tafsiir App. Dhammaan xuquuqda waa la ilaaliyey.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
