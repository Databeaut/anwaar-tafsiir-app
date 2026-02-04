import { useEffect, useRef, useState } from "react";
import { type Lesson, formatTime } from "./surahData";
import { surahManifest } from "@/data/surah-manifest";
import { Play, Pause, Lock, CheckCircle2, Volume2, VolumeX, Maximize, RefreshCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
    surahId?: number;
}

const SmartVideoPlayer = ({
    onLessonsReady,
    onLessonChange,
    onLessonCompleted,
    currentLessonIndex,
    lessons,
    surahId
}: SmartVideoPlayerProps) => {
    const { session } = useAuth();

    // Core Player State
    const [player, setPlayer] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    // Dynamic Content State
    const [currentAyahText, setCurrentAyahText] = useState<string | null>(null);
    const [activeAyahs, setActiveAyahs] = useState<any[]>([]);
    const [surahNameArabic, setSurahNameArabic] = useState<string>("سورة الفاتحة");

    // Completion & Progress State
    const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
    const [isSurahCompleted, setIsSurahCompleted] = useState(false);
    const [resumePositions, setResumePositions] = useState<Record<number, number>>({});
    const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set());
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);

    // Initialization Safety
    const [playerError, setPlayerError] = useState(false);

    const lastSyncTimeRef = useRef<number>(0);
    const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 1. MANIFEST LOADING (The Brain)
    useEffect(() => {
        const targetSurahId = surahId || 1;
        console.log("SmartVideoPlayer: Loading Manifest for Surah ID:", targetSurahId);

        const activeSurah = surahManifest.find(s => s.id === targetSurahId);

        if (activeSurah) {
            setActiveAyahs(activeSurah.ayahs || []);
            setSurahNameArabic(activeSurah.nameArabic);

            if (lessons.length === 0) {
                console.log("Mapping lessons from manifest for Surah:", activeSurah.id);
                const mappedLessons: Lesson[] = activeSurah.lessons.map(l => ({
                    id: l.id,
                    title: l.title,
                    subtitle: l.subtitle,
                    videoId: l.videoId,
                    startTime: l.timestamps.start,
                    endTime: l.timestamps.hardStop || l.timestamps.end, // Use hardStop for absolute end
                    isLocked: l.isLockedByDefault,
                    duration: l.durationFormatted
                }));
                onLessonsReady(mappedLessons);
            }
        }
    }, [surahId]);

    // 2. YT API LOADER (Global Singleton Pattern)
    useEffect(() => {
        if (!window.YT) {
            console.log("Loading YouTube API script...");
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                console.log("YT API Ready Global Callback Fired");
                // Trigger re-render to allow init to proceed
            };
        }
    }, []);

    // 3. PROGRESS SYNC (Supabase)
    const syncProgressToSupabase = async (lessonId: number, position: number, completed: boolean) => {
        if (!session?.keyId) return;

        // Never un-complete a lesson
        const isAlreadyCompleted = completedLessonIds.has(lessonId);
        const finalCompletedStatus = completed || isAlreadyCompleted;

        try {
            await supabase.from('student_progress').upsert({
                student_access_key_id: session.keyId,
                lesson_id: lessonId,
                last_position: position,
                is_completed: finalCompletedStatus,
                updated_at: new Date().toISOString()
            }, { onConflict: 'student_access_key_id, lesson_id' });
        } catch (err) {
            console.error("Sync Exception:", err);
        }
    };

    useEffect(() => {
        const fetchProgress = async () => {
            if (!session?.keyId || lessons.length === 0) {
                if (!session?.keyId) setIsLoadingProgress(false);
                return;
            }

            const activeLessonIds = lessons.map(l => l.id);

            const { data, error } = await supabase
                .from('student_progress')
                .select('lesson_id, last_position, is_completed')
                .eq('student_access_key_id', session.keyId)
                .in('lesson_id', activeLessonIds);

            if (data && !error) {
                const positions: Record<number, number> = {};
                const completedSet = new Set<number>();

                data.forEach(row => {
                    if (row.is_completed) {
                        onLessonCompleted(row.lesson_id);
                        completedSet.add(row.lesson_id);
                    }
                    if (row.last_position > 0) {
                        positions[row.lesson_id] = row.last_position;
                    }
                });
                setResumePositions(positions);
                setCompletedLessonIds(completedSet);
            }
            setIsLoadingProgress(false);
        };
        fetchProgress();
    }, [session?.keyId, lessons]);

    // 4. MAIN PLAYER ENGINE (Robust Initialization)
    // Condition: All data must be ready before we touch the DOM
    const currentLesson = lessons[currentLessonIndex];
    const readyToPlay = !isLoadingProgress && !!currentLesson && !!currentLesson.videoId;

    useEffect(() => {
        // Cleanup Force
        if (player) {
            try { player.destroy(); } catch (e) { /* ignore */ }
            setPlayer(null);
        }
        if (playIntervalRef.current) clearInterval(playIntervalRef.current);

        // Reset State
        setIsPlaying(false);
        setCurrentTime(0);
        setShowCompletionOverlay(false);
        setPlayerError(false);

        if (!readyToPlay) {
            console.log("Engine Waiting: Not Ready To Play");
            return;
        }

        // Calculate Duration
        setDuration(currentLesson.endTime - currentLesson.startTime);

        const playerContainerId = "yt-main-player";
        let retryCount = 0;
        let isReadied = false;

        const initPlayer = () => {
            // Safety: Component unmounted
            const container = document.getElementById(playerContainerId);
            if (!container) return;

            if (window.YT && window.YT.Player) {
                console.log("Initializing Player Engine...", currentLesson.videoId);

                const startSeconds = Number(currentLesson.startTime);
                const endSeconds = Number(currentLesson.endTime);

                const playerVars = {
                    start: startSeconds,
                    end: endSeconds,
                    controls: 0,
                    modestbranding: 1,
                    disablekb: 1,
                    rel: 0,
                    fs: 0,
                    iv_load_policy: 3,
                    autoplay: 0,
                    playsinline: 1,
                };

                const newPlayer = new window.YT.Player(playerContainerId, {
                    height: '100%',
                    width: '100%',
                    videoId: currentLesson.videoId,
                    playerVars: playerVars,
                    events: {
                        onStateChange: (event: any) => {
                            const state = event.data;
                            setIsPlaying(state === window.YT.PlayerState.PLAYING);

                            if (state === window.YT.PlayerState.ENDED) {
                                handleSegmentEnd(newPlayer);
                            }
                        },
                        onReady: (event: any) => {
                            console.log("Player Engine READY.");
                            isReadied = true;

                            const isLessonCompleted = completedLessonIds.has(currentLesson.id);
                            const hasSavedPosition = resumePositions[currentLesson.id] && resumePositions[currentLesson.id] > 5;

                            // SECOND-TIMER LOGIC:
                            // If completed, Start at 0 (Auto-Reset).
                            // If NOT completed AND has saved position, Resume.
                            if (!isLessonCompleted && hasSavedPosition) {
                                const seekAbs = startSeconds + resumePositions[currentLesson.id];
                                event.target.seekTo(seekAbs, true);
                                console.log("Resuming student at:", resumePositions[currentLesson.id]);
                            } else {
                                // Default / Completed Student -> Start from 0
                                event.target.cueVideoById({
                                    videoId: currentLesson.videoId,
                                    startSeconds: startSeconds,
                                    endSeconds: endSeconds
                                });
                                setCurrentTime(0);
                            }
                        },
                        onError: (e: any) => {
                            console.error("YT Player Error:", e);
                            setPlayerError(true);
                        }
                    },
                });
                setPlayer(newPlayer);

                // Polling for UI Sync
                playIntervalRef.current = setInterval(() => {
                    if (newPlayer && newPlayer.getCurrentTime && typeof newPlayer.getCurrentTime === 'function') {
                        const rawTime = newPlayer.getCurrentTime();
                        const relTime = Math.max(0, rawTime - startSeconds);
                        setCurrentTime(relTime);

                        // Sync to DB (15s interval)
                        const now = Date.now();
                        if (now - lastSyncTimeRef.current > 15000 && isPlaying && session?.keyId) {
                            syncProgressToSupabase(currentLesson.id, Math.floor(relTime), false);
                            lastSyncTimeRef.current = now;
                        }

                        // Ayah Sync
                        const activeAyah = activeAyahs.find(a => rawTime >= a.startTime && rawTime < a.endTime);
                        setCurrentAyahText(activeAyah ? activeAyah.text : null);

                        // Kill Switch for End
                        if (rawTime >= endSeconds + 0.5) { // 0.5s tolerance
                            newPlayer.pauseVideo();
                            handleSegmentEnd(newPlayer);
                        }
                    }
                }, 100);

            } else {
                retryCount++;
                if (retryCount < 50) {
                    setTimeout(initPlayer, 100);
                } else {
                    console.error("YT API Timeout - Hard Reset Required");
                    setPlayerError(true);
                }
            }
        };

        // Start Init Pipeline
        const timerId = setTimeout(initPlayer, 100);

        // 5. GLOBAL FALLBACK WATCHDOG
        const watchdogId = setTimeout(() => {
            if (!isReadied && !player) {
                console.warn("Watchdog: Player failed to initialize in 5s.");
                setPlayerError(true);
            }
        }, 5000);

        return () => {
            clearTimeout(timerId);
            clearTimeout(watchdogId);
            if (playIntervalRef.current) clearInterval(playIntervalRef.current);
        };

    }, [currentLessonIndex, readyToPlay]); // Clean dependencies

    // LOGIC: End of Segment & Modal Suppression
    const handleSegmentEnd = (activePlayer: any, forceIsComplete = false) => {
        if (playIntervalRef.current) clearInterval(playIntervalRef.current);
        setIsPlaying(false);

        const currentLesson = lessons[currentLessonIndex];
        const isAlreadyCompleted = completedLessonIds.has(currentLesson.id);

        // GATEKEEPER: Silent Review Mode
        // If the student has already completed this lesson (Second Timer), the modal must NEVER appear.
        if (!isAlreadyCompleted) {
            const isSurahFinish = currentLessonIndex === lessons.length - 1 || forceIsComplete;
            setIsSurahCompleted(isSurahFinish);
            setShowCompletionOverlay(true);

            // Auto-complete ONLY for non-final lessons
            // Final lesson requires manual "Send to Teacher" to complete
            if (!isSurahFinish) {
                setCompletedLessonIds(prev => new Set(prev).add(currentLesson.id));
                syncProgressToSupabase(currentLesson.id, duration, true);
            } else {
                // For final lesson, just sync position, don't mark complete yet
                syncProgressToSupabase(currentLesson.id, duration, false);
            }
        } else {
            console.log("Lesson completed previously. Suppressing modal/logic.");
        }
    };

    const handleContinue = () => {
        const currentLesson = lessons[currentLessonIndex];
        onLessonCompleted(currentLesson.id);
        onLessonChange(currentLessonIndex + 1);
        setShowCompletionOverlay(false);
    };

    const [isSending, setIsSending] = useState(false);
    const [messageSent, setMessageSent] = useState(false);

    const handleSendToTeacher = async () => {
        setIsSending(true);
        const currentLesson = lessons[currentLessonIndex];

        // 1. Mark Complete in DB with CORRECT ID
        await syncProgressToSupabase(currentLesson.id, duration, true);
        setCompletedLessonIds(prev => new Set(prev).add(currentLesson.id));

        // 2. Open WhatsApp
        const waLink = "https://wa.me/252672441316?text=Assalamu%20alaykum%20Macalin,%20waxaan%20si%20guul%20leh%20u%20dhameeyay%20Tafsiirka%20Surah%20Al-Fatiha.";
        window.open(waLink, '_blank');

        // 3. Update UI & Fade Away
        setIsSending(false);
        setMessageSent(true);

        // 4. Auto-Close so student can replay
        setTimeout(() => {
            setShowCompletionOverlay(false);
            setMessageSent(false);
        }, 2500);
    };

    // UI CONTROLS
    const togglePlay = () => {
        if (!player) return;

        if (isPlaying) {
            player.pauseVideo();
            setIsPlaying(false);
        } else {
            // Auto-Restart if at end
            if (currentTime >= duration - 1) {
                const currentLesson = lessons[currentLessonIndex];
                if (currentLesson) {
                    player.seekTo(currentLesson.startTime, true);
                    setCurrentTime(0);
                }
            }
            player.playVideo();
            setIsPlaying(true);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!player || !currentLesson) return;
        let seekTime = parseFloat(e.target.value);
        if (seekTime > duration) seekTime = duration;
        const absSeekTime = currentLesson.startTime + seekTime;
        player.seekTo(absSeekTime, true);
        setCurrentTime(seekTime);
    };

    const toggleMute = () => {
        if (!player) return;
        if (isMuted) { player.unMute(); setIsMuted(false); }
        else { player.mute(); setIsMuted(true); }
    };

    const handleLessonCardClick = (idx: number) => {
        if (idx !== currentLessonIndex) {
            onLessonChange(idx);
            setIsPlaying(false);
        } else {
            togglePlay();
        }
    };

    // Fullscreen
    const toggleFullScreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await containerRef.current?.requestFullscreen();
                if (screen.orientation && 'lock' in screen.orientation) {
                    await (screen.orientation as any).lock('landscape').catch(() => { });
                }
            } else if (document.exitFullscreen) {
                await document.exitFullscreen();
            }
        } catch (err) { console.error(err); }
    };

    if (!readyToPlay && !playerError) {
        // Simple loading state
        return <div className="w-full aspect-video bg-black/5 animate-pulse rounded-3xl" />;
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-4 md:p-6 space-y-8 flex flex-col">
            {/* Header */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-center mb-4 md:mb-8 mt-4 font-arabic bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-sm order-1">
                {surahNameArabic}
            </h1>

            {/* Main Player */}
            <div ref={containerRef} className="relative w-full aspect-video min-h-[250px] bg-transparent rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/20 border border-white/5 ring-1 ring-white/5 group/player order-2 fullscreen:w-screen fullscreen:h-screen fullscreen:rounded-none fullscreen:border-0 fullscreen:bg-black">

                {/* Fallback Error View */}
                {playerError && (
                    <div className="absolute inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center space-y-4">
                        <p className="text-white text-lg">Khalad baa ka dhacay loading-ka videoga</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 rounded-xl text-black font-bold hover:bg-emerald-400"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            Reload Page
                        </button>
                    </div>
                )}

                {/* Backplate / Frame */}
                <div className="absolute inset-0 flex items-center justify-center z-0">
                    <img src="/quran-frame.jpg" alt="Quran Frame" className="w-full h-full object-cover select-none pointer-events-none transition-all duration-300 fullscreen:object-contain fullscreen:w-full fullscreen:h-full" />
                </div>

                {/* Ayah Overlay */}
                <div className={`absolute inset-0 flex justify-center items-center z-10 pointer-events-none transition-opacity duration-700 ease-in-out ${currentAyahText ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-black/50 px-4 py-3 md:px-8 md:py-6 rounded-full backdrop-blur-md border border-white/10 shadow-2xl max-w-[85%] md:max-w-[80%] text-center transform transition-transform duration-700 hover:scale-105 mt-2 md:mt-0">
                        <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center leading-normal font-arabic" dir="rtl">{currentAyahText}</p>
                    </div>
                </div>

                {/* Hidden Player Engine */}
                <div className="absolute inset-0 z-0 opacity-0 pointer-events-none">
                    <div id="yt-main-player" className="w-full h-full" />
                </div>

                {/* Completion Modal */}
                {showCompletionOverlay && (
                    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
                        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 w-[90%] max-w-sm shadow-2xl shadow-emerald-900/20">
                            {isSurahCompleted ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative inline-flex mb-6">
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                        <CheckCircle2 className="relative w-16 h-16 text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Casharka Waa Dhamaaday!</h3>
                                    <p className="text-zinc-400 text-sm mb-8">Alhamdulillah, waxaad dhamaysatay tafsiirka suuradan.</p>

                                    {messageSent ? (
                                        <div className="flex items-center justify-center gap-2 w-full py-3.5 bg-zinc-800 rounded-xl text-emerald-400 font-bold border border-emerald-500/20">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Farriinta waa la diray!</span>
                                        </div>
                                    ) : completedLessonIds.has(lessons[currentLessonIndex]?.id) ? (
                                        <button
                                            disabled={true}
                                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-zinc-800 rounded-xl text-zinc-400 font-bold border border-white/10 opacity-70 cursor-not-allowed"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Casharka Horay Ayaad U Dirtay</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSendToTeacher}
                                            disabled={isSending}
                                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-wait"
                                        >
                                            {isSending ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <span>U Dir Macalinka</span>
                                            )}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Qaybtan Waa Dhamaatay</h3>
                                    <button onClick={handleContinue} className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg">Sii Wada Casharka</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Overlay Controls */}
                <div className={`absolute inset-0 z-50 flex flex-col justify-between transition-opacity duration-300 ${isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"}`}>
                    {!isPlaying && !showCompletionOverlay && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button onClick={togglePlay} className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-2xl shadow-emerald-500/40 transform hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 md:w-12 md:h-12 text-black ml-1 fill-current" />
                            </button>
                        </div>
                    )}

                    <div className="flex-1 w-full" onClick={togglePlay} />

                    <div className="px-4 pb-4 md:px-12 md:pb-10 w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 md:gap-4 mb-4">
                            <span className="text-xs font-mono text-emerald-100 font-bold min-w-[32px] md:min-w-[40px] px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/5">{formatTime(currentTime)}</span>
                            <div className="relative flex-1 h-1.5 md:h-2 bg-black/40 backdrop-blur-sm rounded-full cursor-pointer group/progress border border-white/10">
                                <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full z-10 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(currentTime / duration) * 100}%` }} />
                                <input type="range" min={0} max={duration} value={currentTime} onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" />
                            </div>
                            <span className="text-xs font-mono text-emerald-100 font-bold min-w-[32px] md:min-w-[40px] text-right px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/5">{formatTime(duration)}</span>
                        </div>

                        <div className="flex items-center justify-between px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5">
                            <div className="flex items-center gap-4 md:gap-6">
                                <button onClick={togglePlay} className="text-white hover:text-emerald-400 transition-colors transform hover:scale-105 active:scale-95">
                                    {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />}
                                </button>
                                <button onClick={toggleMute} className="text-white/80 hover:text-white">
                                    {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
                                </button>
                            </div>

                            <div className="flex items-center gap-4 text-center">
                                <div className="hidden sm:block text-xs font-bold text-emerald-50 tracking-wide uppercase px-3 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/5">
                                    {lessons[currentLessonIndex]?.title}
                                </div>
                                <button onClick={toggleFullScreen} className="text-white hover:text-emerald-400 transition-colors transform hover:scale-105">
                                    <Maximize className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {isPlaying && !showCompletionOverlay && <div className="absolute inset-0 z-10" onClick={togglePlay} />}
            </div>

            {/* Navigation Cards */}
            <div className="order-3">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-emerald-500 rounded-full" />
                    Qaybaha Casharka
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lessons.map((lesson, idx) => {
                        const isActive = idx === currentLessonIndex;
                        const isCompleted = completedLessonIds.has(idx) || (!lesson.isLocked && idx < currentLessonIndex);
                        const isActuallyLocked = lesson.isLocked && !isCompleted;
                        // Single lesson fix: If there's only 1 lesson, it should never LOOK locked/disabled
                        const isVisuallyLocked = isActuallyLocked && lessons.length > 1;

                        return (
                            <button key={lesson.id} onClick={() => !isVisuallyLocked && handleLessonCardClick(idx)} className={`relative group text-left rounded-2xl transition-all duration-200 border backdrop-blur-xl overflow-hidden focus:outline-none ${isActive ? "bg-white/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5 scale-[1.02]" : "bg-white/5 border-white/10 hover:bg-white/10"} ${isVisuallyLocked ? "opacity-40 cursor-not-allowed grayscale" : "cursor-pointer"}`}>
                                <div className="p-6 flex flex-row items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors ${isActive ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : isCompleted ? "bg-emerald-500/20 text-emerald-500" : "bg-white/10 text-zinc-400"}`}>
                                        {isVisuallyLocked ? <Lock className="w-5 h-5" /> : isActive && isPlaying ? <Pause className="w-6 h-6 fill-current" /> : isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Qaybta {idx + 1}</span>
                                            {isCompleted && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />}
                                        </div>
                                        <div className="text-white text-lg font-semibold truncate leading-tight mb-1">{lesson.subtitle}</div>
                                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                                            <span>{lesson.duration}</span>
                                            {isActive && <span className="text-emerald-400 text-xs font-medium px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">Fudud oo gaaban</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                                    <div className={`h-full transition-all duration-500 ${isCompleted || isActive ? "bg-emerald-500" : "bg-transparent"}`} style={{ width: isCompleted ? '100%' : isActive ? `${(currentTime / duration) * 100}%` : '0%' }} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div >
    );
};
export default SmartVideoPlayer;