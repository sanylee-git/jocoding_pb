# Project Blueprint

## Overview
This project is a "Calendar Week Information" provider, designed to help users manage their work schedules effectively by providing clear weekly calendar views. The primary goal is to offer a straightforward and powerful tool for professionals to visualize their year and plan tasks, supplemented with useful content about productivity and schedule management.

## Current Features & Design Philosophy

### Implemented
*   **Interactive Yearly Calendar:** A tool to view the calendar by weeks (Calendar Weeks or CW).
*   **Week Selection:** Users can select a week to see its start and end dates.
*   **Theming:** Light, Dark, and System theme options are available.
*   **Core Pages:** The site includes Home, About, and Privacy Policy pages.
*   **AdSense Integration:** Basic AdSense script and `ads.txt` are in place.

### Design & Feature Philosophy
*   **Productivity-Focused:** The main purpose of the tool is to enhance work productivity by simplifying schedule management.
*   **Trust & Transparency:** The site maintains "About" and "Privacy Policy" pages to build user trust.
*   **Modern & Clean Aesthetics:** The UI is designed to be intuitive, professional, and visually pleasing.
*   **Accessibility & Responsiveness:** The application is fully responsive for a seamless experience on all devices.

## Plan for Current Change: Feature Update & UX Refinements

### Objective
To implement user feedback by refining the user experience, updating the site's core concept, and adding significant new features like holiday highlighting.

### Steps

1.  **Update Site Concept & Content (Request 3):**
    *   **Concept Change:** Shift the site's identity from an "Annual Leave Planner" to a "Calendar Week Information Provider" aimed at professional schedule management.
    *   **Content Update:** Rewrite the text content on `index.html`, `about.html`, and `privacy.html` to reflect this new purpose. This includes titles, logos, headers, and descriptive paragraphs.

2.  **Optimize Header Layout (Request 1):**
    *   **Restructure Header:** Modify the header in all HTML files (`index.html`, `about.html`, `privacy.html`). Group the logo and main navigation (`Home`, `About`, `Privacy`) on the left side.
    *   **Position Theme Switcher:** Keep the theme switcher on the right side to prevent overlap with the navigation links, especially on smaller screens.
    *   **Update CSS:** Adjust the `style.css` file to support the new header structure using Flexbox for clean alignment and spacing.

3.  **Implement Persistent Theme Mode (Request 2):**
    *   **Create `theme.js`:** Extract all theme-related JavaScript logic (initialization, setting the theme, handling button clicks) into a new `theme.js` file.
    *   **Load Script in `<head>`:** Include `<script src="theme.js" defer></script>` in the `<head>` of all three HTML files. Using `defer` ensures it runs after the document is parsed but before `DOMContentLoaded`, preventing a flash of unstyled content.
    *   **Clean up `main.js`:** Remove the theme-related logic from `main.js` to avoid duplication.

4.  **Add Weekend & Holiday Highlighting (Request 4):**
    *   **Create `holidays.js`:** Create a new `holidays.js` file containing data for major public holidays in South Korea and the United States for the years 2024-2026.
    *   **Load Holiday Data:** Include the `holidays.js` script in `index.html`.
    *   **Update `MonthCalendar` Component:**
        *   Modify the component's rendering logic in `main.js`.
        *   Check the day of the week for each date cell and add `.saturday` or `.sunday` classes accordingly.
        *   Check if the date matches an entry in the holiday data and add a `.holiday` class.
    *   **Add Styling:** Update the component's internal CSS to apply blue for Saturdays and red for Sundays and holidays.
