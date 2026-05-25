import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { isToday, isFuture, shortDay, formatDate } from '../utils/dates';

function StreakBadge({ streak }) {
  if (streak === 0) return null;
  return (
    <span className="streak-badge" aria-label={`${streak} day streak`}>
      <span className="streak-badge__fire" aria-hidden="true">🔥</span>
      <span className="streak-badge__num">{streak}</span>
    </span>
  );
}

function CheckCell({ checked, today, future, onToggle, habitName, dateLabel }) {
  const handleKey = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!future) onToggle();
    }
  };

  return (
    <td
      className={[
        'cell',
        today ? 'cell--today' : '',
        future ? 'cell--future' : '',
        checked ? 'cell--checked' : '',
      ].filter(Boolean).join(' ')}
    >
      <button
        className="cell__btn"
        onClick={!future ? onToggle : undefined}
        onKeyDown={handleKey}
        disabled={future}
        aria-label={`${habitName} on ${dateLabel} — ${checked ? 'completed, click to unmark' : future ? 'future date' : 'not done, click to mark'}`}
        aria-pressed={checked}
        tabIndex={future ? -1 : 0}
      >
        <span className="cell__inner" aria-hidden="true">
          {checked && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
      </button>
    </td>
  );
}

export default function HabitRow({ habit, weekDays, isCompleted, toggleCompletion, getStreak, renameHabit, deleteHabit }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(habit.name);
  const [showActions, setShowActions] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const inputRef = useRef(null);
  const rowRef = useRef(null);
  const nameBtnRef = useRef(null);
  const menuRef = useRef(null);
  const streak = getStreak(habit.id);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  // Close menu only when clicking outside BOTH the row AND the portal menu
  useEffect(() => {
    if (!showActions) return;
    const handler = (e) => {
      const inRow  = rowRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inRow && !inMenu) setShowActions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showActions]);

  const openMenu = () => {
    if (nameBtnRef.current) {
      const rect = nameBtnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.left });
    }
    setShowActions((s) => !s);
  };

  const commitRename = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== habit.name) {
      renameHabit(habit.id, trimmed);
    } else {
      setEditValue(habit.name);
    }
    setEditing(false);
  };

  const handleNameKey = (e) => {
    if (e.key === 'Enter') commitRename();
    if (e.key === 'Escape') {
      setEditValue(habit.name);
      setEditing(false);
    }
  };

  return (
    <tr className="habit-row" ref={rowRef}>
      {/* ── Habit name cell ── */}
      <td className="habit-row__name-cell">
        <div className="habit-row__name-wrap">
          {editing ? (
            <input
              ref={inputRef}
              className="habit-row__rename-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={handleNameKey}
              maxLength={60}
              aria-label="Rename habit"
            />
          ) : (
            <button
              ref={nameBtnRef}
              className="habit-row__name"
              onClick={openMenu}
              aria-expanded={showActions}
              aria-haspopup="true"
              aria-label={`${habit.name} — click for options`}
              title={habit.name}
            >
              <span className="habit-row__name-text">{habit.name}</span>
            </button>
          )}

          <StreakBadge streak={streak} />

          {showActions && !editing && createPortal(
            <div
              ref={menuRef}
              className="habit-row__actions"
              role="menu"
              aria-label="Habit actions"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              <button
                role="menuitem"
                className="habit-row__action-btn"
                onClick={() => { setEditing(true); setShowActions(false); }}
              >
                ✏️ Rename
              </button>
              <button
                role="menuitem"
                className="habit-row__action-btn habit-row__action-btn--danger"
                onClick={() => { deleteHabit(habit.id); setShowActions(false); }}
              >
                🗑 Delete
              </button>
            </div>,
            document.body
          )}
        </div>
      </td>

      {/* ── Day cells ── */}
      {weekDays.map((day) => (
        <CheckCell
          key={formatDate(day)}
          checked={isCompleted(habit.id, day)}
          today={isToday(day)}
          future={isFuture(day)}
          onToggle={() => toggleCompletion(habit.id, day)}
          habitName={habit.name}
          dateLabel={day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        />
      ))}
    </tr>
  );
}
