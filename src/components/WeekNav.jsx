import { weekLabel } from '../utils/dates';

export default function WeekNav({ weekDays, goToPrev, goToNext, goToToday, isCurrentWeek, canGoNext }) {
  return (
    <nav className="week-nav" aria-label="Week navigation">
      <button
        className="week-nav__btn"
        onClick={goToPrev}
        aria-label="Previous week"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="week-nav__center">
        <span className="week-nav__label">{weekLabel(weekDays)}</span>
        {!isCurrentWeek && (
          <button
            className="week-nav__today-btn"
            onClick={goToToday}
            aria-label="Back to current week"
          >
            Today
          </button>
        )}
      </div>

      <button
        className="week-nav__btn"
        onClick={goToNext}
        disabled={!canGoNext}
        aria-label="Next week"
        aria-disabled={!canGoNext}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </nav>
  );
}
