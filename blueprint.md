# Project Blueprint: Yearly Week Selector Component & Partnership Inquiry Form

## 1. Overview

This project provides a professional, reusable **Yearly Week Selector** component for data analytics dashboards, and now includes a **Partnership Inquiry Form**.

The week selector component displays a full year at a glance, with all 12 months presented as individual cards in a responsive grid. The core interaction is centered around selecting an entire week (Monday to Sunday) globally. The design prioritizes a clean, information-dense, and modern SaaS aesthetic, now with added theme support and enhanced display details.

The partnership inquiry form offers a simple, modern, and user-friendly way for users to contact for collaborations, utilizing Formspree for backend submission handling.

## 2. Design & Features

The component and form are designed as high-fidelity dashboard elements with further refinements.

### 2.1. Visual Design
- **Aesthetic:** Clean, modern, and professional SaaS/data dashboard.
- **Layout:** A full-width container housing a responsive grid of 12 month cards and a dedicated section for the partnership form.
- **Compactness:** The main application container will have a `max-width` (e.g., 1400px) to ensure a focused and readable view.
- **Theming:** Light/Dark/System Modes with a UI control for selection.
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
- **Partnership Inquiry Form:**
  - A dedicated section with a clear "제휴 문의" (Partnership Inquiry) heading.
  - Fields: `이름` (Name), `이메일` (Email), `메시지` (Message - a textarea).
  - A submit button (`제출`).
  - Uses `https://formspree.io/f/xjgerzvd` as the submission endpoint.
  - Styled to fit the overall modern, clean aesthetic.

## 3. Architecture & Implementation
- **HTML (`index.html`):** The main shell, including theme switcher controls, calendar grid, and the new partnership inquiry form section.
- **CSS (`style.css`):** Updated with `max-width` for the container, full dark mode color variables, and styling for the new form elements.
- **JavaScript (`main.js`):** Contains theme logic, date range calculation, and state management for the week selector. No direct changes for the form submission are needed here, as Formspree handles it.

## 4. Current Development Plan

1.  **[completed]** Update `blueprint.md` with the new partnership inquiry form feature.
2.  **[in_progress]** Add the partnership inquiry form HTML to `index.html`.
3.  **[pending]** Add styles for the new form in `style.css`.
4.  **[pending]** Commit and deploy the changes.
