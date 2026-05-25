import { useState, useRef } from 'react';

export default function AddHabitForm({ onAdd }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <form className="add-form" onSubmit={handleSubmit} aria-label="Add a new habit">
      <div className={`add-form__field ${focused ? 'add-form__field--focused' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          className="add-form__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="New habit — e.g. Read 30 min"
          maxLength={60}
          aria-label="Habit name"
          autoComplete="off"
        />
        <button
          type="submit"
          className="add-form__btn"
          disabled={!value.trim()}
          aria-label="Add habit"
        >
          <span aria-hidden="true">+</span>
          <span className="sr-only">Add</span>
        </button>
      </div>
    </form>
  );
}
