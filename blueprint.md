# Project Blueprint: CW (Current Week) Viewer

## 1. Overview

This project is a single-page web application designed to calculate and display the ISO 8601 week number (CW) for any selected date. It provides a user-friendly interface to navigate through years and select dates, focusing on a clean design and intuitive user experience. The application will cover a range of 11 years (the current year ±5 years).

## 2. Design & Features

As a senior developer, the goal is to create a polished, robust, and maintainable application.

### 2.1. Visual Design
- **Theme:** Modern, clean, and minimalist.
- **Layout:** A centered, card-based interface on a subtle background. The layout will be fully responsive and mobile-first.
- **Color Palette:** A professional palette with a primary accent color.
  - `--background-color`: `#f0f2f5`
  - `--card-background`: `#ffffff`
  - `--text-color`: `#1c1e21`
  - `--primary-color`: `#4a69bd`
  - `--secondary-text-color`: `#65676b`
  - `--highlight-color`: `#e7f3ff`
- **Typography:** `Inter` from Google Fonts for its clean and modern look.
- **Effects:**
  - Soft `box-shadow` on the main card and interactive elements to create depth.
  - Smooth `transition` effects for hover states and layout changes.
  - A subtle "glow" effect on active/selected elements.

### 2.2. Core Features
- **Week Display:** A large, prominent display showing the calculated week number for the selected date (e.g., "CW 35").
- **Year Selector:** A dynamic list of buttons for the relevant years (2021-2031). The current year will be highlighted.
- **Calendar Component:** A custom `<calendar-view>` Web Component will display a monthly calendar.
  - The current date will be highlighted by default.
  - The selected date will be clearly marked.
  - Users can navigate between months.
- **Responsiveness:** The layout will seamlessly adapt to all screen sizes, from mobile phones to desktop monitors.

## 3. Architecture & Implementation

The application will be built using modern, framework-less web standards, adhering to the guidelines in `GEMINI.md`.

- **HTML (`index.html`):** The main entry point, containing the structure and linking to CSS/JS. It will use the `<calendar-view>` custom element.
- **CSS (`style.css`):** Modern CSS features will be used for styling.
  - **CSS Variables:** For easy theming and maintenance.
  - **Flexbox & Grid:** For robust and responsive layouts.
  - **Logical Properties:** For better internationalization support.
- **JavaScript (`main.js`):**
  - **Web Components:** The UI will be structured using a `CalendarView` custom element for encapsulation and reusability. This component will manage its own state and rendering via the Shadow DOM.
  - **ES Modules:** The code will be organized logically.
  - **ISO 8601 Week Logic:** A dedicated function `getISOWeek(date)` will accurately calculate the week number.

## 4. Current Development Plan

1.  **[completed]** Create a `blueprint.md` file to outline the project plan.
2.  **[in_progress]** Structure the main `index.html` file.
3.  **[pending]** Develop the core layout and styles in `style.css`.
4.  **[pending]** Create a `CalendarView` Web Component in `main.js`.
5.  **[pending]** Implement the ISO 8601 week calculation logic.
6.  **[pending]** Add UI controls and connect the application logic.
7.  **[pending]** Finalize and polish the design and user experience.
