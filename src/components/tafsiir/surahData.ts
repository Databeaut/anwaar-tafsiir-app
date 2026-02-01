
export interface Lesson {
    id: number;
    title: string;
    videoId: string;
    startTime: number;
    endTime: number;
    isLocked: boolean;
    duration?: string;
    subtitle?: string;
}

export const courseConfig = {
    surahName: "Surah Al-Faatixa",
    surahNameArabic: "سورة الفاتحة",
    totalDuration: 660,
    videoId: "Zf0Ww_ucs4o"
};

export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const getWhatsAppShareUrl = (lessonNumber: number, title: string) => {
    const text = `Waan dhameeyay ${title} (Casharka ${lessonNumber}) ee Surada Fatiha! 
Ku baro Tafsiirka Qur'aanka halkan: https://anwaar-tafsiir.com`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

export interface AyahSegment {
    number: number;
    text: string;
    startTime: number;
    endTime: number;
}

export const ayahSegments: AyahSegment[] = [
    { number: 1, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", startTime: 0, endTime: 165 },
    { number: 2, text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", startTime: 166, endTime: 305 },
    {
        number: 3,
        text: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
        startTime: 306.5,
        endTime: 320.2
    },
    {
        number: 4,
        text: "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
        startTime: 320.3,
        endTime: 361.5  // Switches earlier to match transcription
    },
    {
        number: 5,
        text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        startTime: 361.6, // Will be active at your 1:06 mark (366s)
        endTime: 454.4
    },
    {
        number: 6,
        text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
        startTime: 454.5,
        endTime: 546.5
    },
    {
        number: 7,
        text: "صِرَٰطَ ٱلَّذِينَ أَنعَمتَ عَلَيهِمْ غَيرِ ٱلمَغضُوبِ عَلَيهِمْ وَلاَ ٱلضَّالِّينَ",
        startTime: 546.6,
        endTime: 637.0
    }];
