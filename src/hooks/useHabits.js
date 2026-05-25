import { useState, useCallback } from 'react';
import { formatDate } from '../utils/dates';

const HABITS_KEY = 'ht_habits_v1';
const COMPLETIONS_KEY = 'ht_completions_v1';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded — silently fail
  }
}

export function useHabits() {
  const [habits, setHabitsRaw] = useState(() => load(HABITS_KEY, []));
  const [completions, setCompletionsRaw] = useState(() => load(COMPLETIONS_KEY, {}));

  const setHabits = useCallback((next) => {
    const value = typeof next === 'function' ? next(habits) : next;
    setHabitsRaw(value);
    save(HABITS_KEY, value);
  }, [habits]);

  const setCompletions = useCallback((next) => {
    const value = typeof next === 'function' ? next(completions) : next;
    setCompletionsRaw(value);
    save(COMPLETIONS_KEY, value);
  }, [completions]);

  // ─── Habit CRUD ──────────────────────────────────────────────

  const addHabit = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const habit = {
      id: crypto.randomUUID(),
      name: trimmed,
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, habit]);
  }, [setHabits]);

  const renameHabit = useCallback((id, newName) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: trimmed } : h))
    );
  }, [setHabits]);

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    // Remove all completion records for this habit
    setCompletions((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`${id}__`)) delete next[k];
      });
      return next;
    });
  }, [setHabits, setCompletions]);

  // ─── Completions ─────────────────────────────────────────────

  const completionKey = (habitId, date) => `${habitId}__${formatDate(date)}`;

  const isCompleted = useCallback(
    (habitId, date) => !!completions[completionKey(habitId, date)],
    [completions]
  );

  const toggleCompletion = useCallback((habitId, date) => {
    const key = completionKey(habitId, date);
    setCompletions((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
  }, [setCompletions]);

  // ─── Streak ──────────────────────────────────────────────────

  /**
   * Current consecutive streak.
   * Logic: if today is checked, count from today backward.
   * If today is NOT checked, count from yesterday backward.
   * This gives the user credit for an active streak even if they
   * haven't ticked today yet — streak won't reset until midnight
   * of the day after they miss one.
   */
  const getStreak = useCallback((habitId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cursor = new Date(today);

    // If today not done, start looking from yesterday
    if (!completions[completionKey(habitId, today)]) {
      cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;
    while (streak < 1000) {
      if (completions[completionKey(habitId, cursor)]) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [completions]);

  return {
    habits,
    addHabit,
    renameHabit,
    deleteHabit,
    isCompleted,
    toggleCompletion,
    getStreak,
  };
}
