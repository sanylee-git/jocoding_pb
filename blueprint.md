# Project Blueprint: Yearly Week Selector Component & Interactive Sections

## 1. Overview

This project provides a professional, reusable **Yearly Week Selector** component for data analytics dashboards. It now also includes a **Partnership Inquiry Form** and a **Disqus Comments** section, strategically placed for user interaction.

The week selector component displays a full year at a glance, with all 12 months presented as individual cards in a responsive grid. The core interaction is centered around selecting an entire week (Monday to Sunday) globally. The design prioritizes a clean, information-dense, and modern SaaS aesthetic, with theme support and enhanced display details.

The partnership inquiry form offers a simple, modern, and user-friendly way for users to contact for collaborations. The Disqus comments section provides a platform for user engagement. Both interactive sections are positioned in a distinct, user-friendly layout at the bottom of the page.

## 2. Design & Features

The component and interactive sections are designed as high-fidelity dashboard elements with further refinements and a new layout.

### 2.1. Visual Design
- **Aesthetic:** Clean, modern, and professional SaaS/data dashboard.
- **Layout:**
  - A full-width container for the overall application.
  - A responsive grid of 12 month cards.
  - **New:** A dedicated "bottom-sections" container at the very bottom of the page, implementing a two-column layout for desktop.
    - Partnership Inquiry Form: Bottom-left.
    - Disqus Comments: Bottom-right.
  - **Desktop:** Two columns (form on left, Disqus on right) within the `bottom-sections` container.
  - **Mobile:** Stacked columns within the `bottom-sections` container.
- **Compactness:** The main application container will have a `max-width` (e.g., 1400px) for readability.
- **Theming:** Light/Dark/System Modes with a UI control for selection.
- **Color Palette:** (Defined in `style.css` and `html[data-theme="dark"]`)
- **Typography:** Neutral, sans-serif font like 'Inter'.
- **Effects:** Subtle `box-shadow` and `border-radius`.

### 2.2. Core Features
- **Main Header:** Displays current year, selected week, and theme switcher.
- **Year Navigation:** Icon buttons for year-over-year navigation.
- **Enhanced Selection Display:** `선택: {Year}년 CW{Week} · {YYYY-MM-DD}~{YYYY-MM-DD}`.
- **Month Cards (`<month-calendar>`):** Displays each month's calendar.
- **Partnership Inquiry Form:**
  - Dedicated section with "제휴 문의" heading.
  - Fields: Name, Email, Message.
  - Submit button.
  - Uses `https://formspree.io/f/xjgerzvd`.
- **Disqus Comments:**
  - Integrated using the provided embed code.
  - Placed in a dedicated section on the bottom-right.
  - `<div id="disqus_thread"></div>` and associated script.

## 3. Architecture & Implementation
- **HTML (`index.html`):** Provides the main application shell. The `partnership-form-section` and the new Disqus thread will be wrapped in a `bottom-sections` container.
- **CSS (`style.css`):** Will be updated with styles for the `bottom-sections` container, ensuring the left/right layout on desktop and stacking on mobile, maintaining the overall aesthetic.
- **JavaScript (`main.js`):** Contains theme logic, date range calculation, and state management for the week selector. No changes required for Disqus integration, as it's a script-based embed.

## 4. Current Development Plan

1.  **[completed]** Update `blueprint.md` with Disqus integration and new layout.
2.  **[in_progress]** Update `index.html` to add Disqus and arrange sections for bottom-left/bottom-right layout.
3.  **[pending]** Update `style.css` for the new bottom sections layout.
4.  **[pending]** Commit and deploy the changes.
