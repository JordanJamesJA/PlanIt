# Planit — Project & Task Tracker

A general-purpose project tracker built with React + Vite. Organize any project into phases and tasks with priorities, statuses, assignees, due dates, and tags.

## Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Features

- **Multiple projects** — each with its own colour and emoji
- **Templates** — Hackathon, Web App, Sprint, Research, or Blank
- **Phases** — break work into sections (Design, Build, QA, etc.)
- **Tasks** — title, description, status, priority, assignee, due date, tags, reference links
- **Search & filter** — by status and priority across all phases
- **Progress tracking** — per-phase and per-project completion bars
- **Persistent** — auto-saves to `localStorage` 
- **Collapsible sidebar** — collapses to icon rail

## Project Structure

```
src/
├── constants/config.js         — status, priority, templates, colours
├── utils/
│   ├── id.js                   — ID generation
│   ├── stats.js                — progress calculations, filtering
│   └── storage.js              — localStorage / window.storage adapter
├── store/
│   ├── reducer.js              — all state mutations
│   └── AppContext.jsx          — global context + action creators
├── hooks/
│   ├── useAppStore.js          — context consumer hook
│   └── useDebounce.js
├── components/
│   ├── ui/                     — Button, Badge, Input, Modal, ProgressBar
│   ├── layout/                 — AppLayout, Sidebar
│   ├── projects/               — ProjectCard, ProjectModal
│   ├── board/                  — Board, BoardHeader, PhaseSection, TaskCard
│   ├── phase/                  — PhaseModal
│   └── task/                   — TaskModal
└── styles/globals.css          — design tokens, reset, animations
```

## Data Model

```
Project  { id, name, description, emoji, color, createdAt }
Phase    { id, projectId, name, description, order }
Task     { id, phaseId, projectId, title, description, status, priority,
           assignee, dueDate, tags[], references[], createdAt, updatedAt }
```
