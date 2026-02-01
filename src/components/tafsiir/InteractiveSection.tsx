import { BookOpen, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import SmartQuizCard from "./SmartQuizCard";
import ShareProgressCard from "./ShareProgressCard";
import { type Lesson } from "./surahData";

interface InteractiveSectionProps {
  currentLessonIndex: number;
  lessons: Lesson[];
  isLessonCompleted: boolean;
  isQuizCompleted: boolean;
  isShareCompleted: boolean;
  onQuizCompleted: () => void;
  onShareCompleted: () => void;
}

const InteractiveSection = ({
  currentLessonIndex,
  lessons,
  isLessonCompleted,
  isQuizCompleted,
  isShareCompleted,
  onQuizCompleted,
  onShareCompleted,
}: InteractiveSectionProps) => {
  const currentLesson = lessons[currentLessonIndex];
  
  // Progression steps
  const steps = [
    { 
      id: 1, 
      label: "Daawo Casharka", 
      completed: isLessonCompleted,
      active: !isLessonCompleted
    },
    { 
      id: 2, 
      label: "Dhamaystir Imtixaanka", 
      completed: isQuizCompleted,
      active: isLessonCompleted && !isQuizCompleted,
      locked: !isLessonCompleted
    },
    { 
      id: 3, 
      label: "Wadaag Macalinka", 
      completed: isShareCompleted,
      active: isQuizCompleted && !isShareCompleted,
      locked: !isQuizCompleted
    },
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Barashada Interactive</h2>
            <p className="text-sm text-muted-foreground">Tijaabi aqoontaada ka dib casharka</p>
          </div>
        </div>

        {/* Progress Chain Indicator */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#141414] border border-white/5">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step */}
                <div className="flex items-center gap-2">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${step.completed 
                      ? "bg-emerald-500 text-black" 
                      : step.active 
                        ? "bg-amber-500 text-black animate-pulse" 
                        : "bg-white/10 text-muted-foreground"
                    }
                  `}>
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : step.locked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={`text-xs hidden sm:block ${
                    step.completed 
                      ? "text-emerald-400" 
                      : step.active 
                        ? "text-amber-400" 
                        : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </div>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="flex-1 flex items-center justify-center px-2">
                    <ArrowRight className={`w-4 h-4 ${
                      step.completed ? "text-emerald-400" : "text-white/20"
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <SmartQuizCard
            currentSegmentIndex={currentLessonIndex}
            isSegmentCompleted={isLessonCompleted}
            onQuizCompleted={onQuizCompleted}
            segmentStartTime={currentLesson?.startTime}
            segmentEndTime={currentLesson?.endTime}
          />
          <ShareProgressCard
            currentSegmentIndex={currentLessonIndex}
            isQuizCompleted={isQuizCompleted}
            isShareCompleted={isShareCompleted}
            segmentLabel={currentLesson?.title}
            onShareCompleted={onShareCompleted}
          />
        </div>
      </div>
    </section>
  );
};

export default InteractiveSection;
