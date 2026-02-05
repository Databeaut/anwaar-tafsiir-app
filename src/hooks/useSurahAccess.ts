import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSurahAccess = (studentKeyId: string | undefined, currentSurahId?: number) => {
    const [unlockedSurahs, setUnlockedSurahs] = useState<Set<number>>(new Set([1])); // Fatiha always unlocked
    const [isLoading, setIsLoading] = useState(true);

    const fetchAccess = async () => {
        if (!studentKeyId) {
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('student_surah_access')
                .select('surah_id, is_unlocked')
                .eq('student_key_id', studentKeyId);

            if (data && !error) {
                const unlocked = new Set<number>();
                unlocked.add(1); // Fatiha always unlocked

                data.forEach(record => {
                    if (record.is_unlocked) {
                        unlocked.add(record.surah_id);
                    }
                });

                // Helper for Surah 110 (An-Nasr) special case
                if (currentSurahId === 110) {
                    // Check specifically for 110 if needed, but the main fetch should cover it.
                    // Kept logic minimal to avoid over-fetching.
                }

                setUnlockedSurahs(unlocked);
            }
        } catch (err) {
            console.error("Access Fetch Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccess();

        if (!studentKeyId) return;

        // Optimized Realtime Subscription
        const channel = supabase
            .channel('access-changes')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT and UPDATE
                    schema: 'public',
                    table: 'student_surah_access',
                    filter: `student_key_id=eq.${studentKeyId}`
                },
                (payload: any) => {
                    console.log("🔔 Realtime Access Update Detected:", payload);

                    // Immediate Local Update (No Re-fetch needed)
                    if (payload.new) {
                        const { surah_id, is_unlocked } = payload.new;
                        setUnlockedSurahs(prev => {
                            const newSet = new Set(prev);
                            if (is_unlocked) {
                                newSet.add(surah_id);
                                console.log(`🔓 Instantly Unlocked Surah ${surah_id}`);
                            } else {
                                newSet.delete(surah_id);
                                console.log(`🔒 Instantly Locked Surah ${surah_id}`);
                            }
                            return newSet;
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [studentKeyId]);

    const isLocked = (surahId: number) => !unlockedSurahs.has(surahId);

    return { unlockedSurahs, isLocked, isLoading };
};
