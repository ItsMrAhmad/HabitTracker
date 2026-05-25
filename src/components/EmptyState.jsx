export default function EmptyState({ onFocusInput }) {
  return (
    <div className="empty" role="status" aria-live="polite">
      <div className="empty__art" aria-hidden="true">
        {/* Abstract grid illustration — empty cells waiting to be filled */}
        <svg width="120" height="96" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Grid lines */}
          {[0, 1, 2, 3].map(r =>
            [0, 1, 2, 3, 4, 5, 6].map(c => (
              <rect
                key={`${r}-${c}`}
                x={c * 17 + 1}
                y={r * 23 + 1}
                width="14"
                height="19"
                rx="3"
                fill={r === 1 && c === 2 ? 'var(--accent)' : 'var(--surface-2)'}
                opacity={r === 1 && c === 2 ? 0.9 : 0.5}
              />
            ))
          )}
          {/* One checkmark in the highlighted cell */}
          <path
            d="M36 36.5l3 3 5-5"
            stroke="var(--bg)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* "Today" column indicator */}
          <rect x="35" y="1" width="14" height="89" rx="3" fill="var(--accent)" opacity="0.06"/>
        </svg>
      </div>

      <h2 className="empty__heading">No habits yet</h2>
      <p className="empty__body">
        Add your first habit above — something small and specific<br />
        works best. <em>Read 10 pages</em>. <em>Drink 2L water</em>. <em>Stretch 5 min</em>.
      </p>

      <button
        className="empty__cta"
        onClick={onFocusInput}
        aria-label="Add your first habit"
      >
        Add your first habit →
      </button>
    </div>
  );
}
