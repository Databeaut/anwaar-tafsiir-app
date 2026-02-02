import { useEffect, useRef, useState } from "react";
import { type Lesson, courseConfig, formatTime, ayahSegments } from "./surahData";
import { Play, Pause, Lock, CheckCircle2, RotateCcw, Volume2, VolumeX, Maximize } from "lucide-react";

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

interface SmartVideoPlayerProps {
    onLessonsReady: (lessons: Lesson[]) => void;
    onLessonChange: (index: number) => void;
    onLessonCompleted: (index: number) => void;
    currentLessonIndex: number;
    lessons: Lesson[];
}

const SmartVideoPlayer = ({
    onLessonsReady,
    onLessonChange,
    onLessonCompleted,
    currentLessonIndex,
    lessons,
}: SmartVideoPlayerProps) => {
    const [player, setPlayer] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [currentAyahText, setCurrentAyahText] = useState<string | null>(null);

    // COMPLETION STATE
    const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
    const [isSurahCompleted, setIsSurahCompleted] = useState(false);

    const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // 1. The Brain: Dynamic Segmentation
    useEffect(() => {
        if (lessons.length === 0) {
            console.log("SmartVideoPlayer: Generating Custom Shell Segments...");
            const { totalDuration, videoId } = courseConfig;
            const generatedLessons: Lesson[] = [];

            const SEGMENT_SIZE = 300; // 5 minutes standard
            let currentTime = 0;
            let partNumber = 1;

            while (currentTime < totalDuration) {
                let endTime = currentTime + SEGMENT_SIZE;

                // Remainder Logic: If remaining time is less than a full segment, merge it.
                if (totalDuration - endTime < SEGMENT_SIZE) {
                    endTime = totalDuration;
                }

                // Determine Titles based on part number
                let title = `Qaybta ${partNumber}aad`;
                let subtitle = "Daawashada Casharka";

                if (currentTime === 0 && endTime === totalDuration) {
                    title = "Casharka oo Dhamaystiran"; // Single segment case
                    subtitle = "Daawo";
                } else if (partNumber === 1) {
                    subtitle = "Hordhaca & Akhriska";
                } else if (endTime === totalDuration) {
                    subtitle = "Dhamaystirka & Tafsiirka";
                }

                generatedLessons.push({
                    id: partNumber,
                    title: title,
                    subtitle: subtitle,
                    videoId: videoId,
                    startTime: currentTime,
                    endTime: endTime,
                    isLocked: partNumber !== 1, // Only first part unlocked initially
                    duration: formatTime(endTime - currentTime)
                });

                currentTime = endTime;
                partNumber++;
            }
            onLessonsReady(generatedLessons);
        }
    }, []);

    // 2. Load YouTube API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }
    }, []);

    // 3. The Engine: Custom Shell Player
    useEffect(() => {
        // Cleanup
        if (player) {
            player.destroy();
            setPlayer(null);
            setIsPlaying(false);
            setCurrentTime(0);
            setShowCompletionOverlay(false);
            setCurrentAyahText(null);
        }
        if (playIntervalRef.current) clearInterval(playIntervalRef.current);

        const currentLesson = lessons[currentLessonIndex];
        if (!currentLesson) return;

        setDuration(currentLesson.endTime - currentLesson.startTime);
        const playerContainerId = "yt-main-player";

        const initPlayer = () => {
            if (window.YT && window.YT.Player) {
                const elementId = playerContainerId;
                if (!document.getElementById(elementId)) {
                    setTimeout(initPlayer, 100);
                    return;
                }

                const newPlayer = new window.YT.Player(elementId, {
                    height: '0',
                    width: '0',
                    videoId: currentLesson.videoId,
                    playerVars: {
                        start: currentLesson.startTime,
                        end: currentLesson.endTime,
                        controls: 0,
                        modestbranding: 1,
                        disablekb: 1,
                        rel: 0,
                        fs: 0,
                        iv_load_policy: 3,
                        autoplay: 0,
                        playsinline: 1,
                    },
                    events: {
                        onStateChange: (event: any) => {
                            const state = event.data;
                            setIsPlaying(state === window.YT.PlayerState.PLAYING);

                            if (state === window.YT.PlayerState.ENDED) {
                                // Native end (backup)
                                handleSegmentEnd(newPlayer);
                            }
                        },
                        onReady: (event: any) => {
                            // Correctly set initial time
                            setCurrentTime(0);
                        }
                    },
                });
                setPlayer(newPlayer);

                // 4. Custom Polling Loop
                playIntervalRef.current = setInterval(() => {
                    if (newPlayer && newPlayer.getCurrentTime) {
                        const rawTime = newPlayer.getCurrentTime();
                        const relTime = Math.max(0, rawTime - currentLesson.startTime);
                        setCurrentTime(relTime);

                        // AYAH TRACKING BRAIN
                        const activeAyah = ayahSegments.find(a => rawTime >= a.startTime && rawTime < a.endTime);
                        setCurrentAyahText(activeAyah ? activeAyah.text : null);

                        // SPECIAL LOGIC: Part 2 Hard Trim (5:37 / 337s)
                        if (currentLessonIndex === 1 && relTime >= 337) {
                            newPlayer.pauseVideo();
                            handleSegmentEnd(newPlayer, true); // Force Surah Completion
                            return;
                        }

                        // Strict Stop at Segment End
                        if (rawTime >= currentLesson.endTime - 0.5) {
                            newPlayer.pauseVideo();
                            handleSegmentEnd(newPlayer);
                        }
                    }
                }, 500);

            } else {
                setTimeout(initPlayer, 100);
            }
        };

        setTimeout(initPlayer, 300);

        return () => {
            if (playIntervalRef.current) clearInterval(playIntervalRef.current);
        };
    }, [currentLessonIndex, lessons]);

    // LOGIC: Handle End of Segment
    const handleSegmentEnd = (activePlayer: any, forceIsComplete = false) => {
        if (playIntervalRef.current) clearInterval(playIntervalRef.current); // Stop polling
        setIsPlaying(false);

        // Check if Last Segment OR Forced Complete
        if (currentLessonIndex === lessons.length - 1 || forceIsComplete) {
            setIsSurahCompleted(true);
            setShowCompletionOverlay(true);
        } else {
            setIsSurahCompleted(false);
            setShowCompletionOverlay(true);
        }
    };

    const handleContinue = () => {
        // Unlock next and mark current as complete
        onLessonCompleted(currentLessonIndex);
        // Move to next lesson immediately
        onLessonChange(currentLessonIndex + 1);
        setShowCompletionOverlay(false);
    };

    // CUSTOM CONTROLS
    const togglePlay = () => {
        if (!player) return;
        if (isPlaying) {
            player.pauseVideo();
            setIsPlaying(false);
        } else {
            player.playVideo();
            setIsPlaying(true);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!player || !lessons[currentLessonIndex]) return;
        const seekTime = parseFloat(e.target.value);
        const absSeekTime = lessons[currentLessonIndex].startTime + seekTime;
        player.seekTo(absSeekTime, true);
        setCurrentTime(seekTime);
    };

    const toggleMute = () => {
        if (!player) return;
        if (isMuted) {
            player.unMute();
            setIsMuted(false);
        } else {
            player.mute();
            setIsMuted(true);
        }
    };

    // Handle lesson card click to ensure audio sync
    const handleLessonCardClick = (idx: number) => {
        if (idx !== currentLessonIndex) {
            onLessonChange(idx);
            setIsPlaying(false); // Reset play state when changing lesson
        }
    };

    if (lessons.length === 0) return null;

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-8 flex flex-col">
            {/* 0. HEADER TITLE - Mobile Responsive */}
            <h1 className="text-3xl md:text-5xl font-semibold text-center mb-4 md:mb-8 font-arabic bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-sm order-1">
                سورة الفاتحة
            </h1>

            {/* 1. LARGE MAIN PLAYER - FIXED CONTAINER - Force Order 2 on Mobile */}
            <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/20 border border-white/5 ring-1 ring-white/5 group/player order-2">

                {/* A. THE FRAME (CONTAINED MASK) */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <img
                        src="/quran-frame.jpg"
                        alt="Quran Frame"
                        className="w-full h-full object-contain select-none pointer-events-none"
                    />
                </div>

                {/* AYAH DISPLAY OVERLAY - Mobile Optimized */}
                <div
                    className={`absolute inset-0 flex justify-center items-center z-30 pointer-events-none transition-opacity duration-700 ease-in-out ${currentAyahText ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="bg-black/50 px-4 py-3 md:px-8 md:py-6 rounded-full backdrop-blur-md border border-white/10 shadow-2xl max-w-[85%] md:max-w-[80%] text-center transform transition-transform duration-700 hover:scale-105 mt-2 md:mt-0">
                        <p
                            className="text-xl md:text-5xl font-bold text-white text-center leading-normal font-arabic"
                            dir="rtl"
                        >
                            {currentAyahText}
                        </p>
                    </div>
                </div>

                {/* B. AUDIO ENGINE (HIDDEN) */}
                <div className="absolute inset-0 z-0 opacity-0 pointer-events-none">
                    <div id="yt-main-player" className="w-full h-full" />
                </div>

                {/* C. COMPLETION OVERLAY */}
                {showCompletionOverlay && (
                    <div className="absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                        <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-12 shadow-2xl shadow-emerald-950/20 max-w-lg w-full transform transition-all hover:scale-[1.02]">
                            {isSurahCompleted ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative inline-flex mb-8">
                                        <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full" />
                                        <CheckCircle2 className="relative w-24 h-24 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] shadow-[0_0_50px_rgba(16,185,129,0.3)] rounded-full bg-black/20" />
                                    </div>

                                    <h3 className="text-3xl font-bold text-white mt-8 tracking-tight">Casharka Waa Dhamaaday!</h3>
                                    <p className="text-zinc-300/80 text-lg mt-3 mb-12 font-medium leading-relaxed">Alhamdulillah, waxaad dhamaysatay tafsiirka suuradan.</p>

                                    <a
                                        href="https://wa.me/632441316?text=Assalamu%20alaykum%20Macalin,%20waxaan%20si%20guul%20leh%20u%20dhameeyay%20Tafsiirka%20Surah%20Al-Fatiha."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-3 px-12 py-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-xl font-extrabold text-white hover:scale-105 hover:shadow-emerald-900/40 transition-transform duration-300 shadow-lg"
                                    >
                                        <span>U Dir Macalinka</span>
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Qaybtan Waa Dhamaatay</h3>
                                    <button
                                        onClick={handleContinue}
                                        className="w-full px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl shadow-emerald-500/20"
                                    >
                                        Sii Wada Casharka
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* D. INTERACTIVE OVERLAY CONTROLS */}
                {/* Sits on top of the frame (z-20) */}
                <div className={`absolute inset-0 z-20 flex flex-col justify-between transition-opacity duration-300 ${isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"}`}>

                    {/* Big Center Play Button (Only when paused) */}
                    {!isPlaying && !showCompletionOverlay && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button
                                onClick={togglePlay}
                                className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center transition-transform hover:scale-110 shadow-2xl shadow-emerald-500/40"
                            >
                                <Play className="w-8 h-8 md:w-12 md:h-12 text-black ml-1 fill-current" />
                            </button>
                        </div>
                    )}

                    {/* Spacer for top interaction area */}
                    <div className="flex-1 w-full" onClick={togglePlay} />

                    {/* Bottom Controls Bar */}
                    <div className="px-4 pb-4 md:px-12 md:pb-10 w-full" onClick={(e) => e.stopPropagation()}>

                        {/* Progress Bar Container */}
                        <div className="flex items-center gap-2 md:gap-4 mb-4">
                            <span className="text-[10px] md:text-xs font-mono text-emerald-100 font-bold min-w-[32px] md:min-w-[40px] px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/5">{formatTime(currentTime)}</span>

                            <div className="relative flex-1 h-1.5 md:h-2 bg-black/40 backdrop-blur-sm rounded-full cursor-pointer group/progress border border-white/10">
                                {/* Fill */}
                                <div
                                    className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full z-10 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                />
                                {/* Scrubber Knob */}
                                <div className="absolute top-0 left-0 h-full w-full opacity-0 hover:opacity-100 transition-opacity">
                                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg z-20 pointer-events-none transform scale-110" style={{ left: `${(currentTime / duration) * 100}%` }} />
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={duration}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                                />
                            </div>

                            <span className="text-[10px] md:text-xs font-mono text-emerald-100 font-bold min-w-[32px] md:min-w-[40px] text-right px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/5">{formatTime(duration)}</span>
                        </div>

                        {/* Buttons Row with Backdrop for readability */}
                        <div className="flex items-center justify-between px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5">
                            <div className="flex items-center gap-4 md:gap-6">
                                <button onClick={togglePlay} className="text-white hover:text-emerald-400 transition-colors transform hover:scale-105 active:scale-95">
                                    {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />}
                                </button>
                                <div className="flex items-center gap-2">
                                    <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                                        {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-center">
                                {/* Title Display */}
                                <div className="hidden sm:block text-xs font-bold text-emerald-50 tracking-wide uppercase px-3 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/5">
                                    {lessons[currentLessonIndex]?.title}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Invisible Click Area for Play/Pause when controls hidden */}
                {isPlaying && !showCompletionOverlay && (
                    <div className="absolute inset-0 z-10" onClick={togglePlay} />
                )}
            </div>

            {/* 2. NAVIGATION BAR (HORIZONTAL ROW) - Order 3 on Mobile */}
            <div className="order-3">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-emerald-500 rounded-full" />
                    Qaybaha Casharka
                </h2>

                <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-emerald-500/50 scrollbar-track-transparent snap-x">
                    {lessons.map((lesson, idx) => {
                        const isActive = idx === currentLessonIndex;
                        const isCompleted = !lesson.isLocked && idx < currentLessonIndex;

                        return (
                            <button
                                key={lesson.id}
                                onClick={() => !lesson.isLocked && handleLessonCardClick(idx)}
                                className={`
                                    relative flex-shrink-0 w-40 snap-start group text-left m-1
                                    rounded-2xl transition-all duration-200 border backdrop-blur-xl overflow-hidden
                                    focus:outline-none active:outline-none active:ring-4 active:ring-emerald-500/10
                                    ${isActive
                                        ? "bg-white/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5 scale-[1.02]"
                                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                    }
                                    ${lesson.isLocked ? "opacity-40 cursor-not-allowed grayscale" : "cursor-pointer"}
                                `}
                            >
                                <div className="p-6 flex flex-col h-full gap-3">
                                    {/* Top Icon */}
                                    <div className="flex justify-between items-start">
                                        <div className={`
                                            w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                                            ${isActive ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" :
                                                isCompleted ? "bg-emerald-500/20 text-emerald-500" : "bg-white/10 text-zinc-400"}
                                        `}>
                                            {lesson.isLocked ? <Lock className="w-3.5 h-3.5" /> :
                                                isActive && isPlaying ? <Pause className="w-4 h-4 fill-current" /> :
                                                    isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                                        </div>

                                        {isCompleted && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                                        )}
                                    </div>

                                    {/* Text Info */}
                                    <div className="mt-auto">
                                        <div className="text-[10px] font-medium text-zinc-300 uppercase tracking-widest mb-0.5">Qaybta {idx + 1}</div>
                                        <div className="text-white text-lg font-semibold leading-tight">
                                            {lesson.duration}
                                        </div>

                                        {/* Progress Line */}
                                        <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden mt-3">
                                            <div className={`h-full rounded-full transition-all duration-500 ${isCompleted || isActive ? "bg-emerald-500" : "bg-transparent"}`}
                                                style={{ width: isCompleted ? '100%' : isActive ? `${(currentTime / duration) * 100}%` : '0%' }} />
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default SmartVideoPlayer;
