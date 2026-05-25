import { useRef } from 'react';
import { useHabits } from './hooks/useHabits';
import { useWeek } from './hooks/useWeek';
import AddHabitForm from './components/AddHabitForm';
import WeekNav from './components/WeekNav';
import HabitGrid from './components/HabitGrid';
import EmptyState from './components/EmptyState';

export default function App() {
  const {
    habits,
    addHabit,
    renameHabit,
    deleteHabit,
    isCompleted,
    toggleCompletion,
    getStreak,
  } = useHabits();

  const { weekDays, goToPrev, goToNext, goToToday, isCurrentWeek, canGoNext } = useWeek();

  const inputFocusRef = useRef(null);

  const focusInput = () => {
    // Dispatch a custom event the form can listen to, or use a ref passed down
    document.querySelector('.add-form__input')?.focus();
  };

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header__inner">
          <div className="header__title-wrap">
            <h1 className="header__title">
              <span className="header__title-accent">H</span>abit
              <span className="header__title-accent">.</span>
            </h1>
            <p className="header__sub">Track what matters, one day at a time.</p>
          </div>
          <AddHabitForm onAdd={addHabit} ref={inputFocusRef} />
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="main">
        <WeekNav
          weekDays={weekDays}
          goToPrev={goToPrev}
          goToNext={goToNext}
          goToToday={goToToday}
          isCurrentWeek={isCurrentWeek}
          canGoNext={canGoNext}
        />

        {habits.length === 0 ? (
          <EmptyState onFocusInput={focusInput} />
        ) : (
          <HabitGrid
            habits={habits}
            weekDays={weekDays}
            isCompleted={isCompleted}
            toggleCompletion={toggleCompletion}
            getStreak={getStreak}
            renameHabit={renameHabit}
            deleteHabit={deleteHabit}
          />
        )}
      </main>

      <footer className="footer">
        <p>Data stored locally in your browser. No account needed.</p>
      </footer>
    </div>
  );
}
