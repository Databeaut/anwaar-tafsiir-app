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
    displayOrder: number;
    nameSomali: string;
    nameArabic: string;
    lessons: LessonContent[];
    ayahs: AyahSegment[];
}

export const surahManifest: SurahManifest[] = [
    {
        id: 1,
        displayOrder: 1,
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
        displayOrder: 3,
        nameSomali: "Surah Al-Falaq",
        nameArabic: "سورة الفلق",
        lessons: [
            {
                id: 113,
                surahId: 113,
                lessonNumber: 1,
                title: "Suuradda Al-Falaq",
                subtitle: "Tafsiirka Suuradda Al-Falaq",
                videoId: "KcnTeJvyqr4",
                timestamps: {
                    start: 0,
                    end: 141,
                    hardStop: 136
                },
                isLockedByDefault: true,
                durationFormatted: "2:16"
            }
        ],
        ayahs: [
            { number: 1, text: "قُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ", startTime: 0, endTime: 13 },
            { number: 2, text: "مِن شَرِّ مَا خَلَقَ", startTime: 14, endTime: 20 },
            { number: 3, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", startTime: 21, endTime: 54 },
            { number: 4, text: "وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلۡعُقَدِ", startTime: 55, endTime: 126 },
            { number: 5, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", startTime: 127, endTime: 140 }
        ]
    },
    {
        id: 114,
        displayOrder: 2,
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
    },
    {
        id: 112,
        displayOrder: 4,
        nameSomali: "Surah Al-Ikhlaas",
        nameArabic: "سورة الإخلاص",
        lessons: [
            {
                id: 112,
                surahId: 112,
                lessonNumber: 1,
                title: "Suuradda Al-Ikhlaas",
                subtitle: "Tafsiirka Suuradda Al-Ikhlaas",
                videoId: "ipLrv5nRHLw",
                timestamps: {
                    start: 0,
                    end: 115,
                    hardStop: 113
                },
                isLockedByDefault: true,
                durationFormatted: "1:53"
            }
        ],
        ayahs: [
            { number: 1, text: "قُلۡ هُوَ ٱللَّهُ أَحَدٌ", startTime: 0, endTime: 29 },
            { number: 2, text: "ٱللَّهُ ٱلصَّمَدُ", startTime: 30, endTime: 59 },
            { number: 3, text: "لَمۡ يَلِدۡ وَلَمۡ يُولَدۡ", startTime: 60, endTime: 73 },
            { number: 4, text: "وَلَمۡ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ", startTime: 74, endTime: 113 }
        ]
    },
    {
        id: 111,
        displayOrder: 5,
        nameSomali: "Surah Al-Masad",
        nameArabic: "سورة المسد",
        lessons: [
            {
                id: 111,
                surahId: 111,
                lessonNumber: 1,
                title: "Suuradda Al-Masad",
                subtitle: "Tafsiirka Suuradda Al-Masad",
                videoId: "xMFTWkqtTuw",
                timestamps: {
                    start: 0,
                    end: 120,
                    hardStop: 120
                },
                isLockedByDefault: true,
                durationFormatted: "2:00"
            }
        ],
        ayahs: [
            { number: 1, text: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ", startTime: 0, endTime: 22 },
            { number: 2, text: "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ", startTime: 23, endTime: 43 },
            { number: 3, text: "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ", startTime: 44, endTime: 58 },
            { number: 4, text: "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ", startTime: 59, endTime: 91 },
            { number: 5, text: "فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ", startTime: 91, endTime: 120 }
        ]
    },
    {
        id: 110,
        displayOrder: 6,
        nameSomali: "Surah An-Nasr",
        nameArabic: "سورة النصر",
        lessons: [
            {
                id: 110,
                surahId: 110,
                lessonNumber: 1,
                title: "Suuradda An-Nasr",
                subtitle: "Tafsiirka Suuradda An-Nasr",
                videoId: "VhKBWUukdWo",
                timestamps: {
                    start: 0,
                    end: 78,
                    hardStop: 78
                },
                isLockedByDefault: true,
                durationFormatted: "1:18"
            }
        ],
        ayahs: [
            { number: 1, text: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", startTime: 0, endTime: 10 },
            { number: 2, text: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", startTime: 11, endTime: 27 },
            { number: 3, text: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", startTime: 28, endTime: 78 }
        ]
    },
    {
        id: 109,
        displayOrder: 7,
        nameSomali: "Surah Al-Kaafiruun",
        nameArabic: "سورة الكافرون",
        lessons: [
            {
                id: 109,
                surahId: 109,
                lessonNumber: 1,
                title: "Suuradda Al-Kaafiruun",
                subtitle: "Tafsiirka Suuradda Al-Kaafiruun",
                videoId: "cgk7sk4Vagc",
                timestamps: {
                    start: 0,
                    end: 38,
                    hardStop: 38
                },
                isLockedByDefault: true,
                durationFormatted: "0:38"
            }
        ],
        ayahs: [
            { number: 1, text: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", startTime: 0, endTime: 8 },
            { number: 2, text: "لَا أَعْبُدُ مَا تَعْبُدُونَ", startTime: 9, endTime: 15 },
            { number: 3, text: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", startTime: 16, endTime: 23 },
            { number: 6, text: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", startTime: 24, endTime: 38 }
        ]
    },
    {
        id: 108,
        displayOrder: 8,
        nameSomali: "Surah Al-Kawthar",
        nameArabic: "سورة الكوثر",
        lessons: [
            {
                id: 108,
                surahId: 108,
                lessonNumber: 1,
                title: "Suuradda Al-Kawthar",
                subtitle: "Tafsiirka Suuradda Al-Kawthar",
                videoId: "oHN86ZWGwJU",
                timestamps: {
                    start: 0,
                    end: 59,
                    hardStop: 59
                },
                isLockedByDefault: true,
                durationFormatted: "0:59"
            }
        ],
        ayahs: [
            { number: 1, text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", startTime: 0, endTime: 30 },
            { number: 2, text: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", startTime: 32, endTime: 45 },
            { number: 3, text: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", startTime: 45, endTime: 59 }
        ]
    },
    {
        id: 107,
        displayOrder: 9,
        nameSomali: "Surah Al-Maacun",
        nameArabic: "سورة الماعون",
        lessons: [
            {
                id: 107,
                surahId: 107,
                lessonNumber: 1,
                title: "Suuradda Al-Maacun",
                subtitle: "Tafsiirka Suuradda Al-Maacun",
                videoId: "LCBvtAp484Y",
                timestamps: {
                    start: 0,
                    end: 306,
                    hardStop: 306
                },
                isLockedByDefault: true,
                durationFormatted: "5:06"
            }
        ],
        ayahs: [
            { number: 1, text: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ", startTime: 0, endTime: 30 },
            { number: 2, text: "فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ", startTime: 31, endTime: 68 },
            { number: 3, text: "وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ", startTime: 69, endTime: 91 },
            { number: 4, text: "فَوَيْلٌ لِّلْمُصَلِّينَ", startTime: 92, endTime: 112 },
            { number: 5, text: "الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ", startTime: 113, endTime: 208 },
            { number: 4, text: "فَوَيْلٌ لِّلْمُصَلِّينَ", startTime: 208, endTime: 216 },
            { number: 5, text: "الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ", startTime: 217, endTime: 222 },
            { number: 6, text: "الَّذِينَ هُمْ يُرَاءُونَ", startTime: 223, endTime: 255 },
            { number: 7, text: "وَيَمْنَعُونَ الْمَاعُونَ", startTime: 256, endTime: 306 }
        ]
    },
    {
        id: 106,
        displayOrder: 10,
        nameSomali: "Surah Quraysh",
        nameArabic: "سورة قريش",
        lessons: [
            {
                id: 106,
                surahId: 106,
                lessonNumber: 1,
                title: "Suuradda Quraysh",
                subtitle: "Tafsiirka Suuradda Quraysh",
                videoId: "CG6r7RWsxS4",
                timestamps: {
                    start: 0,
                    end: 140,
                    hardStop: 140
                },
                isLockedByDefault: true,
                durationFormatted: "2:20"
            }
        ],
        ayahs: [
            { number: 1, text: "لِإِيلَافِ قُرَيْشٍ", startTime: 0, endTime: 42 },
            { number: 2, text: "إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ", startTime: 43, endTime: 74 },
            { number: 3, text: "فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ", startTime: 75, endTime: 96 },
            { number: 4, text: "الَّذِي أَطْعَمَهُم مِّن جُوعٍ", startTime: 97, endTime: 109 },
            { number: 5, text: "وَآمَنَهُم مِّنْ خَوْفٍ", startTime: 110, endTime: 140 }
        ]
    }
];
