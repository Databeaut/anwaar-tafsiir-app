import { useState } from "react";
import { CheckCircle2, Circle, Lock, HelpCircle } from "lucide-react";
import { formatTime } from "./surahData";

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface SegmentQuiz {
  question: string;
  options: QuizOption[];
}

// Quiz questions for each segment
const segmentQuizzes: Record<number, SegmentQuiz> = {
  1: {
    question: "Waa maxay macnaha Aayaddan (0:00-5:00)?",
    options: [
      { id: "a", text: "Naxariis badan", isCorrect: true },
      { id: "b", text: "Awood badan", isCorrect: false },
      { id: "c", text: "Caddaalad", isCorrect: false },
    ],
  },
  2: {
    question: "Maxaa looga hadlay qeybtan (5:00-10:00)?",
    options: [
      { id: "a", text: "Maalinta Qiyaame", isCorrect: false },
      { id: "b", text: "Jannada iyo Naarta", isCorrect: true },
      { id: "c", text: "Nabiyada", isCorrect: false },
    ],
  },
  3: {
    question: "Maxay tilmaamaysaa qeybta saddexaad?",
    options: [
      { id: "a", text: "Caabudaadda Ilaahay", isCorrect: true },
      { id: "b", text: "Taariikhda", isCorrect: false },
      { id: "c", text: "Shuruucda", isCorrect: false },
    ],
  },
};

// Default quiz for segments without specific questions
const defaultQuiz: SegmentQuiz = {
  question: "Maxaad ka faa'iideysatay casharkaan?",
  options: [
    { id: "a", text: "Waan fahmay si fiican", isCorrect: true },
    { id: "b", text: "Waxaan u baahanahay in aan dib u daawado", isCorrect: false },
    { id: "c", text: "Waxaan rabaa sharaxaad dheeraad ah", isCorrect: false },
  ],
};

interface SmartQuizCardProps {
  currentSegmentIndex: number;
  isSegmentCompleted: boolean;
  onQuizCompleted: () => void;
  segmentStartTime?: number;
  segmentEndTime?: number;
}

const SmartQuizCard = ({
  currentSegmentIndex,
  isSegmentCompleted,
  onQuizCompleted,
  segmentStartTime = 0,
  segmentEndTime = 300,
}: SmartQuizCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const segmentNumber = currentSegmentIndex + 1;
  const quiz = segmentQuizzes[segmentNumber] || defaultQuiz;
  
  // Dynamic question with time range
  const questionWithTime = quiz.question.includes("(")
    ? quiz.question
    : `${quiz.question} (${formatTime(segmentStartTime)}-${formatTime(segmentEndTime)})`;

  const handleOptionClick = (optionId: string) => {
    if (isAnswered || !isSegmentCompleted) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption || !isSegmentCompleted) return;
    
    const selected = quiz.options.find(opt => opt.id === selectedOption);
    const correct = selected?.isCorrect || false;
    
    setIsCorrect(correct);
    setIsAnswered(true);
    
    if (correct) {
      onQuizCompleted();
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  // Locked state - segment not completed
  if (!isSegmentCompleted) {
    return (
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#141414] rounded-2xl border border-white/5 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Imtixaan</h3>
            <p className="text-sm text-muted-foreground">Qaybta {segmentNumber}</p>
          </div>
        </div>

        {/* Locked Message */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground text-sm">
            Daawo casharka si aad u furto imtixaanka
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Qaybta {segmentNumber}: {formatTime(segmentStartTime)} - {formatTime(segmentEndTime)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#141414] rounded-2xl border border-white/5 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          isAnswered && isCorrect ? "bg-emerald-500/20" : "bg-emerald-500/20"
        }`}>
          {isAnswered && isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <HelpCircle className="w-5 h-5 text-emerald-400" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-white">
            {isAnswered && isCorrect ? "Hambalyo! ✨" : "Imtixaan"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isAnswered && isCorrect ? "Jawaab sax ah!" : `Qaybta ${segmentNumber}`}
          </p>
        </div>
      </div>

      {/* Success State */}
      {isAnswered && isCorrect ? (
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <p className="text-emerald-400 font-medium mb-2">Waad guulaysatay!</p>
            <p className="text-sm text-muted-foreground">
              Cashar cusub ayaad furatay
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Question */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
            <p className="text-sm text-amber-400">{questionWithTime}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {quiz.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const showResult = isAnswered;
              const isOptionCorrect = option.isCorrect;
              
              let optionClasses = "flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 cursor-pointer";
              
              if (showResult) {
                if (isOptionCorrect) {
                  optionClasses += " bg-emerald-500/10 border-emerald-500/30";
                } else if (isSelected && !isOptionCorrect) {
                  optionClasses += " bg-red-500/10 border-red-500/30";
                } else {
                  optionClasses += " bg-white/5 border-white/5 opacity-50";
                }
              } else if (isSelected) {
                optionClasses += " bg-emerald-500/10 border-emerald-500/30";
              } else {
                optionClasses += " bg-white/5 border-white/10 hover:border-white/20";
              }

              return (
                <div
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={optionClasses}
                >
                  <div className="flex-shrink-0">
                    {showResult && isOptionCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isSelected ? (
                      <CheckCircle2 className={`w-5 h-5 ${showResult && !isOptionCorrect ? "text-red-400" : "text-emerald-400"}`} />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className={`text-sm ${
                    showResult && isOptionCorrect 
                      ? "text-emerald-400" 
                      : showResult && isSelected && !isOptionCorrect
                        ? "text-red-400"
                        : isSelected 
                          ? "text-emerald-400" 
                          : "text-white"
                  }`}>
                    {option.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Submit / Retry Button */}
          {isAnswered && !isCorrect ? (
            <button
              onClick={handleRetry}
              className="w-full py-3 rounded-xl bg-amber-500/20 text-amber-400 font-medium hover:bg-amber-500/30 transition-all duration-300"
            >
              Isku day mar kale
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedOption
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-white/10 text-muted-foreground cursor-not-allowed"
              }`}
            >
              Xaqiiji Jawaabta
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SmartQuizCard;
