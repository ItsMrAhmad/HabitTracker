import { useState, useMemo } from 'react';
import { getWeekDays } from '../utils/dates';

export function useWeek() {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);

  const goToPrev = () => setWeekOffset((o) => o - 1);
  const goToNext = () => setWeekOffset((o) => o + 1);
  const goToToday = () => setWeekOffset(0);

  const isCurrentWeek = weekOffset === 0;
  // Don't allow navigating beyond 4 weeks into the future
  const canGoNext = weekOffset < 1;

  return { weekOffset, weekDays, goToPrev, goToNext, goToToday, isCurrentWeek, canGoNext };
}
