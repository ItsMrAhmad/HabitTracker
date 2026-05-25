import { isToday, shortDay, dayNum } from '../utils/dates';
import HabitRow from './HabitRow';

export default function HabitGrid({
  habits,
  weekDays,
  isCompleted,
  toggleCompletion,
  getStreak,
  renameHabit,
  deleteHabit,
}) {
  return (
    <div className="grid-wrap" role="region" aria-label="Habit tracking grid">
      <table className="grid" aria-label="Weekly habits">
        <thead>
          <tr>
            {/* Habit name header */}
            <th className="grid__corner" scope="col">
              <span className="sr-only">Habit</span>
            </th>
            {/* Day headers */}
            {weekDays.map((day) => {
              const today = isToday(day);
              return (
                <th
                  key={day.toISOString()}
                  className={`grid__day-header ${today ? 'grid__day-header--today' : ''}`}
                  scope="col"
                  aria-current={today ? 'date' : undefined}
                >
                  <span className="grid__day-name">{shortDay(day)}</span>
                  <span className="grid__day-num">{dayNum(day)}</span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              weekDays={weekDays}
              isCompleted={isCompleted}
              toggleCompletion={toggleCompletion}
              getStreak={getStreak}
              renameHabit={renameHabit}
              deleteHabit={deleteHabit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
