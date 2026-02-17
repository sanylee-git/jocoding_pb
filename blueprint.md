# Project Blueprint: Yearly Week Selector Component

## 1. Overview

This project is evolving from a simple CW viewer into a professional, reusable **Yearly Week Selector** component. It is designed for use in data analytics dashboards where users need to filter time-series data by selecting a specific week.

The component displays a full year at a glance, with all 12 months presented as individual cards in a responsive grid. The core interaction is centered around selecting an entire week (Monday to Sunday) globally. The design prioritizes a clean, information-dense, and modern SaaS aesthetic, now with added theme support and enhanced display details.

## 2. Design & Features

The component is being re-imagined as a high-fidelity dashboard element with further refinements.

### 2.1. Visual Design
- **Aesthetic:** Clean, modern, and professional SaaS/data dashboard.
- **Layout:** A full-width container housing a responsive grid of 12 month cards.
- **Compactness:** The main application container will have a `max-width` (e.g., 1400px) to prevent the layout from stretching uncomfortably on very wide screens, ensuring a more focused and readable view.
- **Theming:**
  - **Light/Dark/System Modes:** The component will support manual switching between a light theme (default) and a full dark theme. A "System" option will respect the user's OS-level preference.
  - **Theme Switcher:** A simple, unobtrusive UI control will be added to the main header to manage theme selection.
- **Color Palette (Light - Default):**
  - `--background-color`: `#f8f9fa`
  - `--card-background`: `#ffffff`
  - `--text-color`: `#212529`
  - `--muted-text-color`: `#adb5bd`
  - `--header-text-color`: `#495057`
  - `--accent-color`: `#cfe2ff`
  - `--accent-text-color`: `#004085`
  - `--border-color`: `#dee2e6`
- **Color Palette (Dark):**
  - `--background-color`: `#1a1a1a`
  - `--card-background`: `#2c2c2c`
  - `--text-color`: `#e8e6e3`
  - `--muted-text-color`: `#8f8f8f`
  - `--header-text-color`: `#c7c7c7`
  - `--accent-color`: `#004085`
  - `--accent-text-color`: `#cfe2ff`
  - `--border-color`: `#4d4d4d`
- **Typography:** A neutral, sans-serif font like 'Inter'.
- **Effects:** Subtle `box-shadow` and `border-radius` for a clean, card-based UI.

### 2.2. Core Features
- **Main Header:** A global header displays the current year and the selected week.
- **Year Navigation:** Simple icon buttons for year-over-year navigation.
- **Enhanced Selection Display:** The selected week's display is now more informative.
  - **Format:** `선택: {Year}년 CW{Week} · {YYYY-MM-DD}~{YYYY-MM-DD}`
  - **Example:** `선택: 2026년 CW9 · 2026-02-23~2026-03-01`
- **Month Cards (`<month-calendar>`):** The core component for displaying each month's calendar.

## 3. Architecture & Implementation
- **HTML (`index.html`):** The main shell, now including controls for the theme switcher in the header.
- **CSS (`style.css`):** Will be updated with a `max-width` for the container and a full set of dark mode color variables under an `html[data-theme="dark"]` selector.
- **JavaScript (`main.js`):**
  - **Theme Logic:** New functions to manage theme state (Light/Dark/System), handle user selection, and persist the choice in `localStorage`.
  - **Date Range Calculation:** A new helper function, `getDatesForWeek(weekId)`, will be created to calculate the start (Monday) and end (Sunday) dates for a given ISO week.
  - **State Management:** The main script continues to manage `currentYear` and `selectedWeek`. The `updateSelection` function will be enhanced to use the new date range calculation.

## 4. Current Development Plan

1.  **[completed]** Update `blueprint.md` with new UI/UX enhancements.
2.  **[in_progress]** Refine `style.css` for compactness and add a full dark mode theme.
3.  **[pending]** Add theme switcher controls to `index.html`.
4.  **[pending]** Implement theme switching logic in `main.js`.
5.  **[pending]** Implement logic to calculate and display the week's date range.
6.  **[pending]** Commit and deploy the final polished version.
