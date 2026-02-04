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

export interface AyahSegment {
    number: number;
    text: string;
    startTime: number;
    endTime: number;
}

export interface SurahManifest {
    id: number;
    nameSomali: string;
    nameArabic: string;
    lessons: LessonContent[];
    ayahs: AyahSegment[];
}

export const surahManifest: SurahManifest[] = [
    {
        id: 1,
        nameSomali: "Surah Al-Faatixa",
        nameArabic: "سورة الفاتحة",
        lessons: [
            {
                id: 0,
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
                    hardStop: 637
                },
                isLockedByDefault: true,
                durationFormatted: "5:37"
            }
        ],
        ayahs: [
            { number: 1, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", startTime: 0, endTime: 165 },
            { number: 2, text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", startTime: 166, endTime: 305 },
            { number: 3, text: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", startTime: 306.5, endTime: 320.2 },
            { number: 4, text: "مَـٰلِكِ يَوْمِ ٱلدِّينِ", startTime: 320.3, endTime: 361.5 },
            { number: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", startTime: 361.6, endTime: 454.4 },
            { number: 6, text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", startTime: 454.5, endTime: 546.5 },
            { number: 7, text: "صِرَٰطَ ٱلَّذِينَ أَنعَمتَ عَلَيهِمْ غَيرِ ٱلمَغضُوبِ عَلَيهِمْ وَلاَ ٱلضَّالِّينَ", startTime: 546.6, endTime: 637.0 }
        ]
    },
    {
        id: 113,
        nameSomali: "Surah Al-Falaq",
        nameArabic: "سورة الفلق",
        lessons: [
            {
                id: 113,
                surahId: 113,
                lessonNumber: 1,
                title: "Suuradda Al-Falaq",
                subtitle: "Dhawaan Filo",
                videoId: "KcnTeJvyqr4", // Placeholder ID from request
                timestamps: {
                    start: 0,
                    end: 0
                },
                isLockedByDefault: true, // "Status: COMING_SOON" implies locked or special state
                durationFormatted: "0:00"
            }
        ],
        ayahs: [
            // Empty or minimal ayahs since it's "Coming Soon"
            { number: 1, text: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ", startTime: 0, endTime: 0 }
        ]
    },
    {
        id: 114,
        nameSomali: "Surah An-Naas",
        nameArabic: "سورة الناس",
        lessons: [
            {
                id: 114,
                surahId: 114,
                lessonNumber: 1,
                title: "QAYBTA 1",
                subtitle: "Tafsiirka Suuradda An-Naas",
                videoId: "FXIPmuZn9tU",
                timestamps: {
                    start: 0,
                    end: 163,
                    hardStop: 141
                },
                isLockedByDefault: false,
                durationFormatted: "2:20"
            }
        ],
        ayahs: [
            { number: 1, text: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", startTime: 0, endTime: 13 },
            { number: 2, text: "مَلِكِ ٱلنَّاسِ", startTime: 14, endTime: 18 },
            { number: 3, text: "إِلَـٰهِ ٱلنَّاسِ", startTime: 19, endTime: 25 },
            { number: 4, text: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ", startTime: 26, endTime: 81 },
            { number: 5, text: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ", startTime: 81, endTime: 133 },
            { number: 6, text: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", startTime: 134, endTime: 140 }
        ]
    }
];
