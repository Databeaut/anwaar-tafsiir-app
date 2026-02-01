// AI Service for Surah Details (using Lovable AI)
import { supabase } from "@/integrations/supabase/client";

const SURAH_DETAILS_CACHE_PREFIX = "anwaar_surah_details_";

export interface SurahDetails {
  nameMeaning: string;
  revelationType: string;
  revelationContext: string;
  mainTheme: string;
}

// Check if cached Surah details exist
export const hasCachedSurahDetails = (surahName: string): boolean => {
  const cacheKey = SURAH_DETAILS_CACHE_PREFIX + surahName.toLowerCase().replace(/\s+/g, "_");
  const cached = localStorage.getItem(cacheKey);
  return !!cached;
};

// Get cached Surah details
export const getCachedSurahDetails = (surahName: string): SurahDetails | null => {
  const cacheKey = SURAH_DETAILS_CACHE_PREFIX + surahName.toLowerCase().replace(/\s+/g, "_");
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached) as SurahDetails;
    } catch {
      return null;
    }
  }
  return null;
};

// Save Surah details to cache
const cacheSurahDetails = (surahName: string, details: SurahDetails): void => {
  const cacheKey = SURAH_DETAILS_CACHE_PREFIX + surahName.toLowerCase().replace(/\s+/g, "_");
  localStorage.setItem(cacheKey, JSON.stringify(details));
};

// Get Surah details using Lovable AI (via edge function)
export const getSurahDetails = async (surahName: string): Promise<SurahDetails> => {
  // Check cache first
  const cached = getCachedSurahDetails(surahName);
  if (cached) {
    return cached;
  }

  const { data, error } = await supabase.functions.invoke('get-surah-details', {
    body: { surahName }
  });

  if (error) {
    console.error('Error fetching Surah details:', error);
    throw new Error(error.message || 'Failed to fetch Surah details');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  const details: SurahDetails = {
    nameMeaning: data.nameMeaning,
    revelationType: data.revelationType,
    revelationContext: data.revelationContext,
    mainTheme: data.mainTheme,
  };

  // Cache the result
  cacheSurahDetails(surahName, details);

  return details;
};
