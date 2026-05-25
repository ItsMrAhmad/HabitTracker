# Habit Tracker

A single-page habit tracker with weekly streaks, built with React + Vite.

## Quick start (fresh machine)

**Prerequisites:** Node.js ≥ 18

```bash
git clone <your-repo-url>
cd habit-tracker
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for production

```bash
npm run build
npm run preview   # serves the dist/ build locally
```

### Deploy to Vercel (one command after `npm i -g vercel`)

```bash
vercel
```

> **Deployed URL:** _Add your Vercel/Netlify URL here after deploying_

---

## What it does

- **Add habits** — type a name and press `+` or Enter
- **Weekly grid** — Mon–Sun across the top, habits down the left
- **Toggle days** — click any cell to mark/unmark (past and today only)
- **Streak counter** — 🔥 N shows next to each habit name
- **Week navigation** — prev / next arrows, "Today" shortcut to jump back
- **Rename** — click a habit name → Rename option → type → Enter
- **Delete** — click a habit name → Delete option
- **Persistence** — everything stored in `localStorage`; survives full reload

## Stack

React 18 · Vite 5 · plain CSS (no UI library)

## Fonts used

- **Cormorant Garamond** — display heading
- **Outfit** — UI text
- **JetBrains Mono** — grid data / day labels
