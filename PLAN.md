# Kanban App - Implementation Plan

## Overview

A single-board Kanban web app built with Next.js (App Router, client-rendered), React, Tailwind CSS, and @hello-pangea/dnd. State is in-memory only. No persistence, no auth.

**Root:** `d:/ProjectsAI/kanban/`
**App:** `d:/ProjectsAI/kanban/frontend/`

---

## Phase 1: Next.js Project Scaffold

**Goal:** Bootstrap the Next.js project into `frontend/` with TypeScript, Tailwind CSS, ESLint, App Router. Install all runtime and dev dependencies.

### Steps

1. `npx create-next-app@latest frontend` with TypeScript, Tailwind, ESLint, App Router, no src dir, import alias `@/*`
2. Install runtime deps: `@hello-pangea/dnd`, `uuid`
3. Install dev deps: `jest`, `jest-environment-jsdom`, `ts-jest`, `@types/jest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `@types/uuid`, `@playwright/test`
4. Install Playwright browsers: `npx playwright install --with-deps chromium`
5. Add `test` and `test:e2e` scripts to `package.json`
6. Strip boilerplate from `app/page.tsx` and `app/globals.css`
7. Replace `globals.css` with Tailwind import and CSS custom properties for the 5 brand colors
8. Create `jest.config.ts` and `jest.setup.ts`
9. Create `playwright.config.ts` pointing at `http://localhost:3000` with `webServer` set to `npm run dev`

---

## Phase 2: Data Model and State

**Goal:** Define TypeScript types and a React context that owns all board state. No components yet.

### Files

- `frontend/types/kanban.ts` — `Card`, `Column`, `Board` interfaces
- `frontend/data/initialBoard.ts` — 5 columns, 10 cards, static deterministic UUIDs
- `frontend/context/BoardContext.tsx` — `BoardProvider` + `useBoard()` hook using `useReducer`

### Actions

| Action | Effect |
|--------|--------|
| `MOVE_CARD` | Move card between or within columns |
| `ADD_CARD` | Append card to a column |
| `DELETE_CARD` | Remove card from a column |
| `RENAME_COLUMN` | Update a column's name |


---

## Phase 3: UI Components

**Goal:** Build the complete component tree. All components are client components.

### Component Tree

```
app/
  layout.tsx        server — wraps children in BoardProvider, adds modal-root div
  page.tsx          client — renders <Board />

components/
  Board.tsx         DragDropContext, header, 5 columns in horizontal flex
  Column.tsx        Droppable, column header, card list, add-card button
  ColumnHeader.tsx  inline rename on double-click
  Card.tsx          Draggable, delete button on hover, click opens modal
  CardModal.tsx     portal modal, read-only title + details
  AddCardForm.tsx   inline form, title required, details optional
```

### Design

| Element | Color |
|---------|-------|
| App background | `#032147` (navy) |
| Column background | white at 8% opacity over navy |
| Card background | `#ffffff` |
| Card title | `#032147` |
| Card details | `#888888` |
| Accent / highlights | `#ecad0a` (yellow) |
| Links / interactive | `#209dd7` (blue) |
| Badges / pills | `#753991` (purple) |
| Dragging card ring | `#209dd7` |

## Phase 4: Unit Tests

**Goal:** All critical logic and component behaviors covered. `npm test` passes.

### Test Files

| File | Covers |
|------|--------|
| `__tests__/boardReducer.test.ts` | All 4 actions, edge cases |
| `__tests__/ColumnHeader.test.tsx` | Display, rename, Escape cancel |
| `__tests__/Card.test.tsx` | Render, delete dispatch, modal open |
| `__tests__/AddCardForm.test.tsx` | Submit, validation, Escape, autofocus |
| `__tests__/CardModal.test.tsx` | Render, backdrop close, Escape close |
| `__tests__/initialBoard.test.ts` | 5 columns, all IDs unique, required fields |

---

## Phase 5: Integration / E2E Tests

**Goal:** Playwright tests verify the full user journey against the live dev server.

### Scenarios

| Test | Steps |
|------|-------|
| Board loads | 5 column headers visible, at least 10 cards visible |
| Rename column | Double-click header, type "Sprint 1", Enter → header updated |
| Add card | Click "+ Add card", fill title + details, submit → card appears |
| Delete card | Hover card, click x → card removed from column |
| Open/close modal | Click card body → modal visible; Escape → modal gone |
| Drag between columns | Drag card from column 1 to column 2 → card moved |

---

## Phase 6: Polish and Server Readiness

**Goal:** Lint-clean, type-clean, visually polished, server running for the user.

### Checklist

- [ ] `npm run lint` exits 0
- [ ] `npx tsc --noEmit` exits 0
- [ ] `npm test` exits 0
- [ ] `npm run test:e2e` exits 0
- [ ] `http://localhost:3000` is accessible and functional
- [ ] Cards show shadow lift while dragging
- [ ] Long titles truncate gracefully
- [ ] Add-card form closes on Escape
- [ ] Modal has smooth fade-in
- [ ] No browser console errors

---

## File Tree at Completion

```
d:/ProjectsAI/kanban/
├── .gitignore
├── README.md
├── PLAN.md
├── CLAUDE.md
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── jest.config.ts
    ├── jest.setup.ts
    ├── playwright.config.ts
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── types/
    │   └── kanban.ts
    ├── data/
    │   └── initialBoard.ts
    ├── context/
    │   └── BoardContext.tsx
    ├── components/
    │   ├── Board.tsx
    │   ├── Column.tsx
    │   ├── ColumnHeader.tsx
    │   ├── Card.tsx
    │   ├── CardModal.tsx
    │   └── AddCardForm.tsx
    ├── __tests__/
    │   ├── boardReducer.test.ts
    │   ├── ColumnHeader.test.tsx
    │   ├── Card.test.tsx
    │   ├── AddCardForm.test.tsx
    │   ├── CardModal.test.tsx
    │   └── initialBoard.test.ts
    └── e2e/
        └── kanban.spec.ts
```

---

## Phase Execution Order

```
Phase 0 (Scaffolding)
  └── Phase 1 (Next.js scaffold + deps)
        └── Phase 2 (Types + State)
              └── Phase 3 (UI Components)
                    ├── Phase 4 (Unit Tests)
                    └── Phase 5 (E2E Tests)
                          └── Phase 6 (Polish + Readiness)
```
