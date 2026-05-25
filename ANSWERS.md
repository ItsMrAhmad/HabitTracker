# ANSWERS.md

---

## 1. How to run

**Prerequisites:** Node.js ≥ 18 (no other global installs needed)

```bash
git clone <repo-url>
cd habit-tracker
npm install
npm run dev
# → http://localhost:5173
```

To build and preview the production bundle:

```bash
npm run build && npm run preview
```

**Deployed URL:** _(add after deploying to Vercel/Netlify)_

---

## 2. Stack & design choices

**Why React + Vite, no UI library?**

I'm most fluent in React and it's the right fit here: the grid is a table of state (`completions`) that multiple components read simultaneously. React's single-direction data flow makes that clean — one `useHabits` hook owns all state and hands down `isCompleted` / `toggleCompletion`; every cell re-renders only what changed. Vite gets the dev server up in under a second with no config overhead.

I deliberately avoided component libraries (MUI, Radix, etc.) because the grid layout is custom enough that adapting a library's table would create more fighting than writing from scratch. The CSS is ~350 lines of custom properties and targeted rules — fast to reason about, easy to audit.

**Decision 1 — The name column is sticky, not scrollable**

On any screen narrower than ~780px, 7 day columns + a label column overflows horizontally. I made the habit name column `position: sticky; left: 0` so it stays anchored while the user scrolls the day grid right. This is the most important navigation affordance in the whole grid: without it, a user on a phone who scrolls right to see Wednesday loses all context about which row is which. The tradeoff is that sticky cells require the table to stay inside an `overflow-x: auto` wrapper, which I handle in `.grid-wrap`. You can see this in action on any sub-600px viewport.

**Decision 2 — Checked cells animate with a pop + glow, not a flat color swap**

I gave completed cells a CSS `@keyframes checkPop` (scale 0.6 → 1.15 → 1) plus a `box-shadow` ring in green. This is entirely for the dopamine loop: the moment you tick a habit is the moment the app needs to feel satisfying. A flat color change registers as "the state changed." A pop + glow registers as "I did something good." I kept the animation under 350ms and added `prefers-reduced-motion` to disable it, so it's opt-in for users who need calm interfaces.

**Week starts on Monday.** ISO 8601 defines Monday as day 1, and the Mon–Fri workweek is visually centered in the grid — most habits are workday habits. Sunday-first only makes sense if you're American and thinking in terms of a calendar month, which this app isn't.

---

## 3. Responsive & accessibility

**360px phone:**
- The name column narrows to 120–140px; text truncates with ellipsis.
- Day columns shrink from 44px to 34px; touch targets stay acceptable (min 34×34px for a fingertip).
- The form moves below the title into its own full-width row.
- Streak badges hide (they're context that would overlap at this width). The streak is still visible once you tap a habit to open the rename/delete menu.
- The grid wraps in a scrollable container with a right-edge fade to signal scrollability.

**1440px laptop:**
- Everything breathes: 44px cells, 200px name column, generous padding.
- The header lays out horizontally (title left, form right).
- No horizontal scrolling; the grid fills the available width.

**Accessibility I handled — keyboard navigation + ARIA on toggle cells**

Every check cell is a `<button>` with:
- `aria-label`: "Read 30 min on Monday, May 26 — not done, click to mark"
- `aria-pressed`: reflects checked state
- `tabIndex={-1}` on future cells so keyboard users skip them
- `Space` and `Enter` both trigger the toggle (handled in `onKeyDown`)

The week navigation uses a `<nav aria-label="Week navigation">` landmark. Focus-visible rings use the accent amber color on all interactive elements (tested against the dark background at ≥ 3:1 contrast). The grid itself is a real `<table>` with `scope="col"` on day headers, so screen readers can announce "Monday 26 — Read 30 min — not checked."

**Accessibility I knowingly skipped — live region for streak updates**

When a streak increments (you tick today's cell and your streak goes 3 → 4), a screen reader user would benefit from an `aria-live="polite"` announcement: "Read 30 min — 4 day streak." I skipped this because the live region would announce on every toggle, including un-checks and future scrolling, and getting the debounce logic right without being annoying would take another hour. The streak is still visible in the DOM (screen readers can navigate to it), just not announced automatically.

---

## 4. AI usage

**Tool used:** Claude (Anthropic)

### Where I used it and what I changed

**1. Streak logic — changed the boundary condition**

I asked Claude to write `getStreak(habitId, completions)`. It returned a version that always started counting from yesterday, regardless of whether today was checked. The behavior felt wrong: if I check today at 8 AM, my streak should count today. I rewrote the start condition:

```js
// AI gave: always start from yesterday
const cursor = new Date(today);
cursor.setDate(cursor.getDate() - 1);

// I changed it to: start from today IF today is checked
const cursor = new Date(today);
if (!completions[completionKey(habitId, today)]) {
  cursor.setDate(cursor.getDate() - 1);
}
```

This matters for the core UX: the streak badge updates immediately when you tick today, rather than waiting until tomorrow.

**2. Date formatting — caught a UTC bug and fixed it**

AI suggested `date.toISOString().split('T')[0]` for formatting dates as `YYYY-MM-DD`. I caught that this converts to UTC before splitting, which shifts the date backward by 1 day for users in UTC+5 (Pakistan) or any timezone east of UTC. I replaced it with a local-time formatter:

```js
// AI's version (wrong for UTC+ users)
date.toISOString().split('T')[0]

// My fix — uses local year/month/date
const y = date.getFullYear();
const m = String(date.getMonth() + 1).padStart(2, '0');
const d = String(date.getDate()).padStart(2, '0');
return `${y}-${m}-${d}`;
```

**3. CSS cell hover state — simplified specificity**

AI generated hover rules using `.cell:not(.cell--future):not(.cell--checked) .cell__btn:hover .cell__inner`. I collapsed this into behavior on the button directly (`cursor: default` on disabled) and removed the compound selector, which was fragile if I added more cell modifiers later.

**4. Empty state illustration — replaced the component**

AI gave me an emoji-based empty state ("📋 No habits yet"). I replaced it entirely with an inline SVG that echoes the actual grid structure — empty cells, one amber highlighted column, one green checked cell — because the empty state should preview the interface, not describe it. The SVG is 120×96px, uses CSS variables so it inherits the theme, and communicates "this is what the grid will look like" without any text.

---

## 5. Honest gap

**The rename UX is underdeveloped.**

Right now: click a habit name → a small dropdown appears → click "Rename" → the name cell turns into an inline input → type → press Enter or click away.

The problem: on mobile (especially at 360px) the dropdown appears partially off-screen if the habit is near the top of the list. The inline input also has no visible character count, so a long habit name silently gets capped at 60 chars without feedback.

**What I'd fix with another day:**

1. Replace the dropdown with a long-press gesture on mobile and a right-click context menu on desktop.
2. Add a subtle char counter that appears at 40+ characters: `"…18 left"`.
3. Make the rename field animate in (height expand) rather than abruptly swap, so the row doesn't shift layout.
4. Add a `useClickOutside` hook that correctly handles both touch and mouse events — the current version uses `mousedown` which misses touch taps on iOS.
