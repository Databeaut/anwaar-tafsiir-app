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
            // 1. Fetch All Access for Student
            const { data, error } = await supabase
                .from('student_surah_access')
                .select('surah_id, is_unlocked')
                .eq('student_key_id', studentKeyId);

            if (data && !error) {
                const unlocked = new Set<number>();
                unlocked.add(1); // Ensure Fatiha

                data.forEach(record => {
                    if (record.is_unlocked) {
                        unlocked.add(record.surah_id);
                    }
                });

                // FORCE REFRESH FOR SURAH 110 if it's the current one
                // This bypasses any potential stale state
                if (currentSurahId === 110) {
                    const { data: nasrData } = await supabase
                        .from('student_surah_access')
                        .select('is_unlocked')
                        .eq('student_key_id', studentKeyId)
                        .eq('surah_id', 110)
                        .single();

                    if (nasrData?.is_unlocked) {
                        unlocked.add(110);
                    }
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

        // Realtime Subscription
        const channel = supabase
            .channel('public:student_surah_access')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'student_surah_access',
                    filter: `student_key_id=eq.${studentKeyId}`
                },
                (payload) => {
                    console.log("🔔 Realtime Access Update Detected:", payload);
                    fetchAccess();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [studentKeyId, currentSurahId]);

    const isLocked = (surahId: number) => !unlockedSurahs.has(surahId);

    return { unlockedSurahs, isLocked, isLoading };
};
