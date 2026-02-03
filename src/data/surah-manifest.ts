
export interface TrimConfig {
    start: number; // Absolute YouTube timestamp
    end: number;   // Absolute YouTube timestamp (Natural end)
    hardStop?: number; // Optional: Force stop earlier (e.g., cut outro)
}

export interface LessonContent {
    id: number; // Changed to number to match existing DB schema (int)
    surahId: number;
    lessonNumber: number;
    title: string;       // "Qaybta 1aad"
    subtitle: string;    // "Hordhaca & Akhriska"
    videoId: string;     // YouTube ID
    timestamps: TrimConfig;
    isLockedByDefault: boolean;
    durationFormatted: string; // "5:00"
}

export interface SurahManifest {
    id: number;
    nameSomali: string;
    nameArabic: string;
    lessons: LessonContent[];
}

export const surahManifest: SurahManifest[] = [
    {
        id: 1,
        nameSomali: "Surah Al-Faatixa",
        nameArabic: "سورة الفاتحة",
        lessons: [
            {
                id: 0, // Using 0-index for compatibility with array index for now, or we map it. 
                // DB uses ID, but frontend often uses Index. 
                // Wait, previous code used `currentLessonIndex`. 
                // The `student_progress` table has `lesson_id`.
                // Previous logic: generatedLessons pushed with `id: partNumber` (1, 2).
                // Let's stick to 1-based IDs for DB compatibility if that's what was used, 
                // OR 0-based if we want array index alignment. 
                // The prompt says "Part 1... Part 2". 
                // Let's use 0 and 1 as IDs to match currentLessonIndex for simplicity in this refactor, 
                // strictly mapping index to ID.
                surahId: 1,
                lessonNumber: 1,
                title: "Qaybta 1aad",
                subtitle: "Hordhaca & Akhriska",
                videoId: "Zf0Ww_ucs4o",
                timestamps: {
                    start: 0,
                    end: 300,
                    hardStop: 300
                },
                isLockedByDefault: false,
                durationFormatted: "5:00"
            },
            {
                id: 1,
                surahId: 1,
                lessonNumber: 2,
                title: "Qaybta 2aad",
                subtitle: "Daawashada Casharka",
                videoId: "Zf0Ww_ucs4o",
                timestamps: {
                    start: 300,
                    end: 660,
                    hardStop: 637 // 5:37 relative? No, 300+337 = 637 absolute.
                    // Wait, 5:37 video time is 337s.
                    // Relative to the segment start (300)? 
                    // The prompt says: "Part 2: start: 300, end: 660, hardStop: 637 (5:37)."
                    // If the video is one long file (Zf0Ww_ucs4o), absolute 637 is correct.
                },
                isLockedByDefault: true,
                durationFormatted: "5:37"
            }
        ]
    }
];
