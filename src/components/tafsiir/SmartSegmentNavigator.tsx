import { useMemo } from "react";
import { Play, Lock } from "lucide-react";
import { type Lesson } from "./surahData";

interface SmartSegmentNavigatorProps {
  lessons: Lesson[];
  currentLessonIndex: number;
  completedLessons: number;
  onLessonClick: (index: number) => void;
}

const SmartSegmentNavigator = ({
  lessons,
  currentLessonIndex,
  completedLessons,
  onLessonClick
}: SmartSegmentNavigatorProps) => {

  const currentLesson = lessons[currentLessonIndex];
  const currentVideoId = currentLesson?.videoId;

  // CHAPTER VIEW: Filter lessons to only show segments from the CURRENT video
  const { chaptersForCurrentVideo, chapterStartIndex } = useMemo(() => {
    if (!currentVideoId) return { chaptersForCurrentVideo: [], chapterStartIndex: 0 };

    // Find the first index of the current video's lessons
    const startIdx = lessons.findIndex(l => l.videoId === currentVideoId);

    // Filter only lessons that belong to the current video
    const filtered = lessons.filter(l => l.videoId === currentVideoId);

    return { chaptersForCurrentVideo: filtered, chapterStartIndex: startIdx };
  }, [lessons, currentVideoId]);

  // Calculate how many lessons from THIS video are completed
  const completedInChapter = chaptersForCurrentVideo.filter(
    (_, idx) => chapterStartIndex + idx < currentLessonIndex
  ).length;

  const handleLessonClick = (globalIndex: number, lesson: Lesson) => {
    if (!lesson.isLocked) {
      onLessonClick(globalIndex);
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header - Shows current video context */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Qaybaha Fiidiyowga</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {(currentLesson?.subtitle || currentLesson?.title)?.split(' (')[0] || "Loading..."}
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            {completedInChapter}/{chaptersForCurrentVideo.length} Dhammaystiran
          </span>
        </div>

        {/* Lessons Grid - Only shows current video's segments */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {chaptersForCurrentVideo.map((lesson, localIdx) => {
              const globalIndex = chapterStartIndex + localIdx;
              const isActive = globalIndex === currentLessonIndex;
              const isCompleted = globalIndex < currentLessonIndex;

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleLessonClick(globalIndex, lesson)}
                  className={`
                    flex-shrink-0 w-44 p-4 rounded-2xl border transition-all duration-300
                    ${isActive
                      ? "bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border-emerald-500/50 cursor-pointer"
                      : lesson.isLocked
                        ? "glass-card opacity-60 cursor-not-allowed"
                        : "glass-card hover:border-white/20 cursor-pointer"
                    }
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-3
                    ${isActive
                      ? "bg-emerald-500"
                      : isCompleted
                        ? "bg-emerald-500/30"
                        : "bg-white/10"
                    }
                  `}>
                    {lesson.isLocked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Play
                        className={`w-5 h-5 ${isActive ? "text-black" : isCompleted ? "text-emerald-400" : "text-white"}`}
                        fill="currentColor"
                      />
                    )}
                  </div>

                  {/* Locked Badge */}
                  {lesson.isLocked && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-xs text-muted-foreground mb-2">
                      <Lock className="w-3 h-3" />
                      <span>Xiran</span>
                    </div>
                  )}

                  {/* Completed Badge */}
                  {isCompleted && !lesson.isLocked && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/20 text-xs text-emerald-400 mb-2">
                      <span>✓ Dhammaystay</span>
                    </div>
                  )}

                  {/* Content */}
                  <h4 className={`font-medium mb-1 text-sm ${isActive ? "text-emerald-400" : isCompleted ? "text-emerald-400/80" : lesson.isLocked ? "text-gray-500" : "text-white"}`}>
                    Qaybta {localIdx + 1}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {chaptersForCurrentVideo.length === 1 ? "Fiidiyow buuxa" : `${localIdx + 1} ka mid ah ${chaptersForCurrentVideo.length}`}
                  </p>

                  {/* Progress bar for active */}
                  {isActive && (
                    <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scroll indicator - only if more than 3 segments in current video */}
          {chaptersForCurrentVideo.length > 3 && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pt-2">
              <div className="h-1 w-32 bg-emerald-500/50 rounded-full" />
              <div className="h-1 w-8 bg-white/10 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SmartSegmentNavigator;
