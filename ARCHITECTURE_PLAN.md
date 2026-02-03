# Scalability Audit and Multi-Surah Architecture Plan

## 1. Code Health Check & "Hard Trim" Analysis

### Diagnosis
The current "Hard Trim" logic relies on a `setInterval` loop (100ms) to check `getCurrentTime()`. This is brittle because:
1.  **Race Conditions:** Browser throttling (background tabs) can reduce interval frequency to 1s+, causing the player to overshoot the trim point.
2.  **Lag:** The event loop might be blocked by other React renders.
3.  **Tight Coupling:** The logic `if (currentLessonIndex === 1)` is hardcoded inside the generic player component, which violates separation of concerns.

### Architectural Solution (Event-Driven)
Instead of polling, we should leverage the **YouTube Iframe API's native `end` parameter** more effectively, combined with a **Data-Driven Configuration**.
*   **Action:** When loading the video, strictly pass the `end` parameter to `playerVars`. This forces the YouTube internal player to stop exactly at that second.
*   **Seek Constraint:** The slider (UI) uses `effectiveDuration`. If the user seeks, we clamp the value.
*   **State Machine:** The Player should interpret a "Segment" object that defines its own constraints, rather than hardcoding business rules in the view component.

## 2. Scalability Planning: Universal Data Schema

To add Surah An-Naas without rewriting code, we need a normalized content schema.

### Proposed Schema (TypeScript Interface)

```typescript
// src/components/tafsiir/types.ts

export interface TrimConfig {
    start: number; // Absolute YouTube timestamp
    end: number;   // Absolute YouTube timestamp (Natural end)
    hardStop?: number; // Optional: Force stop earlier (e.g., cut outro)
}

export interface LessonContent {
    id: string; // e.g., "001_01" (Surah_Lesson)
    surahId: number;
    lessonNumber: number;
    title: string;       // "Qaybta 1aad"
    subtitle: string;    // "Hordhaca & Akhriska"
    videoId: string;     // YouTube ID
    timestamps: TrimConfig;
    isLockedByDefault: boolean;
}

export interface SurahManifest {
    id: number;
    nameSomali: string;
    nameArabic: string;
    videoId: string; // Default video ID (if one video covers all)
    lessons: LessonContent[];
}
```

### Example: Surah Data JSON

```json
{
  "id": 1,
  "name": "Al-Fatiha",
  "lessons": [
    {
      "id": "1_2",
      "lessonNumber": 2,
      "title": "Qaybta 2aad",
      "videoId": "Zf0Ww_ucs4o",
      "timestamps": {
        "start": 300,
        "end": 660,
        "hardStop": 637 // 5:37 relative (+300) = 637 absolute
      }
    }
  ]
}
```

## 3. Database Optimization Strategy

### The Bottleneck
Fetching `student_progress` currently retrieves *all* records for a student. As the user completes more Surahs, this query (`select * from student_progress where key_id = ...`) will slow down, causing the "Second Timer" freeze.

### Optimization Plan
1.  **Composite Index:** Ensure `(student_access_key_id, lesson_id)` is indexed.
    *   *SQL:* `CREATE INDEX idx_student_lesson_progress ON student_progress(student_access_key_id, lesson_id);`
2.  **Scoped Fetching:**
    *   When entering "Surah Al-Fatiha", fetch *only* progress for lessons belonging to Surah 1.
    *   *Requires:* Adding `surah_id` column to `student_progress` for faster partitioning, OR filtering by a list of `lesson_ids` known to the frontend.
3.  **Optimistic UI:**
    *   Cache progress locally (LocalStorage) for immediate "resume" position while the DB syncs in the background.

## 4. Immediate Action Plan (Refactoring)

1.  **Extract Data:** Move all hardcoded Lesson generation from `SmartVideoPlayer.tsx` to a static `surah-content.ts` factory function.
2.  **Generic Player:** Rewrite `SmartVideoPlayer` to accept a single `activeLesson` prop containing all timing rules (`hardStop`, `start`, `end`).
3.  **Strict Prop Passing:** The parent component (`Index.tsx` or `SurahPage`) handles the logic of "which lesson is active". The Player becomes a "dumb" component that just plays the segment it's given.
