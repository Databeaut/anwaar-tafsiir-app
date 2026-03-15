import { useState } from "react";
import { surahManifest } from "@/data/surah-manifest";

export const useSurahAccess = (studentKeyId: string | undefined, currentSurahId?: number) => {
    // Initialize with ALL surah IDs unlocked
    // This effectively removes the locking concept as requested
    const allSurahIds = new Set(surahManifest.map(s => s.id));

    // State remains compatible with existing consumers
    const [unlockedSurahs] = useState<Set<number>>(allSurahIds);
    const [isLoading] = useState(false);

    // Always return false for isLockedCheck
    const isLocked = (surahId: number) => false;

    return { unlockedSurahs, isLocked, isLoading };
};
