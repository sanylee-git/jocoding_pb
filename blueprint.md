# Project Blueprint

## Overview
This project is a framework-less web application consisting of HTML, CSS, and JavaScript files, designed to be deployed within Firebase Studio.

## Current Features
- Basic HTML structure (`index.html`)
- Styling (`style.css`, `theme.css`)
- JavaScript logic (`main.js`)

## Plan for Current Change: Integrate Google AdSense

### Objective
Integrate Google AdSense into the website to display advertisements based on the provided AdSense code snippet, Ads.txt snippet, and meta tag.

### Steps
1.  **Add AdSense script and meta tag to `index.html`**:
    *   Locate the `<head>` section in `index.html`.
    *   Insert the provided AdSense script tag.
    *   Insert the provided Google AdSense account meta tag.
2.  **Create `ads.txt`**:
    *   Create a new file named `ads.txt` in the project's root directory.
    *   Add the provided Ads.txt snippet content to this file.