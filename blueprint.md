# Project Blueprint: Yearly Week Selector Component

## 1. Overview

This project is evolving from a simple CW viewer into a professional, reusable **Yearly Week Selector** component. It is designed for use in data analytics dashboards where users need to filter time-series data by selecting a specific week.

The component displays a full year at a glance, with all 12 months presented as individual cards in a responsive grid. The core interaction is centered around selecting an entire week (Monday to Sunday) globally. The design prioritizes a clean, information-dense, and modern SaaS aesthetic.

## 2. Design & Features

The component is being re-imagined as a high-fidelity dashboard element.

### 2.1. Visual Design
- **Aesthetic:** Clean, modern, and professional SaaS/data dashboard.
- **Layout:** A full-width container housing a responsive grid of 12 month cards.
  - **Desktop:** 4 columns x 3 rows.
  - **Tablet:** 2 columns.
  - **Mobile:** 1 column (stacked).
- **Color Palette:**
  - `--background-color`: `#f8f9fa` (Soft gray)
  - `--card-background`: `#ffffff`
  - `--text-color`: `#212529` (Neutral dark gray)
  - `--muted-text-color`: `#adb5bd` (For overflow days)
  - `--header-text-color`: `#495057`
  - `--accent-color`: `#cfe2ff` (Subtle blue for selection highlight)
  - `--border-color`: `#dee2e6`
- **Typography:** A neutral, sans-serif font like 'Inter'. The layout will be dense and information-efficient, using smaller font sizes.
- **Effects:**
  - `box-shadow`: Very subtle shadows on cards to lift them from the background.
  - `border-radius`: Standardized rounded corners for all cards and interactive elements.

### 2.2. Core Features
- **Main Header:** A global header will display the current year and the selected week.
  - e.g., `<h2>2026</h2><p>Selected: CW 35</p>`
- **Year Navigation:** Simple `<` and `>` icon buttons to navigate between years.
- **Month Cards (`<month-calendar>`):**
  - Each card represents one month and is a custom Web Component.
  - **Header:** Displays the month name (e.g., "February").
  - **Calendar Table:**
    - **Week Starts Monday:** Adheres to the ISO-8601 standard.
    - **Columns:** The table will have 8 columns: `CW | Mo | Tu | We | Th | Fr | Sa | Su`.
    - **Week Numbers:** The first column of each row will display the ISO week number.
    - **Overflow Days:** Days from adjacent months that complete a week are displayed with muted text.
- **Interaction:**
  - **Global Week Selection:** Clicking any part of a week row (`<tr>`) selects that week across the entire application.
  - **Single Source of Truth:** Only one week can be active at any time.
  - **Output:** The component's state (selected year and week number) is clearly displayed in the main header.

## 3. Architecture & Implementation

The architecture will be refactored to support the new component-based, full-year view.

- **HTML (`index.html`):** Provides the main application shell, including the header, year navigation controls, and a grid container for the month cards.
- **CSS (`style.css`):** Completely rewritten to implement the new responsive grid, card styling, and overall SaaS dashboard aesthetic.
- **JavaScript (`main.js`):**
  - **`<month-calendar>` Web Component:** A new, highly specialized component to render a single month's calendar based on the new requirements. It will manage its own rendering but will be controlled by global state.
  - **Global State Management:** The main script will manage the `currentYear` and `selectedWeek` (e.g., `{year, weekNumber}`).
  - **Event-Driven:** The `<month-calendar>` components will emit a `week-selected` event. The main script will listen for this, update the global state, and then instruct all 12 components to re-synchronize their display to show the new selection.

## 4. Current Development Plan

1.  **[completed]** Update the `blueprint.md` file with the new project vision.
2.  **[in_progress]** Restructure `index.html` for the yearly grid view.
3.  **[pending]** Rewrite `style.css` for the new SaaS dashboard aesthetic.
4.  **[pending]** Create a new `<month-calendar>` Web Component in `main.js`.
5.  **[pending]** Implement new calendar logic (Monday start, week numbers, overflow days).
6.  **[pending]** Manage global week selection state and interactions.
7.  **[pending]** Deploy the final component.
