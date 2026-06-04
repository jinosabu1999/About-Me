<div align="center">

# Jino Sabu — Digital Architect Portfolio

### A mobile-first portfolio, creator storefront, and browser-native productivity toolkit.

**Portfolio · Toolkit · Project Case Studies · Storefront · Local-first Utilities**

</div>

---

## Table of Contents

- [Overview](#overview)
- [What Makes This Portfolio Different](#what-makes-this-portfolio-different)
- [Core Features](#core-features)
- [Interactive Sections](#interactive-sections)
- [Digital Toolkit](#digital-toolkit)
- [Project Showcase](#project-showcase)
- [Storefront](#storefront)
- [Local-first Privacy](#local-first-privacy)
- [Accessibility](#accessibility)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Favicon Pack](#favicon-pack)
- [Run Locally](#run-locally)
- [Deployment Checklist](#deployment-checklist)
- [Browser Requirements](#browser-requirements)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Future Improvements](#future-improvements)

---

## Overview

This repository contains the personal portfolio website of **Jino Sabu** — a Mechanical Engineer turned Frontend Developer and Digital Architect.

The site is designed to be more than a static profile page. It works like a compact web app with portfolio sections, project case studies, creator-store previews, productivity tools, local data controls, and accessibility preferences.

The main goal:

> Show skill through interaction, not just description.

---

## What Makes This Portfolio Different

Most portfolios only show text, links, and project cards. This portfolio includes real browser-native utilities and interactive workflows directly inside the page.

| Area | Purpose |
|---|---|
| Hero section | Introduces the personal brand with motion and engineering-style visuals |
| Skill radar | Shows real areas demonstrated by the portfolio instead of fake percentages |
| Project cards | Open detailed case-study sheets instead of only linking away |
| Storefront | Shows product previews with a Gumroad and Patreon support path |
| Toolkit | Includes useful local-first tools inside the portfolio |
| Appearance panel | Lets users customize theme, mood, accent, and accessibility preferences |
| Data control | Lets users export or clear local browser data |

---

## Core Features

### Portfolio Experience

- Mobile-first layout
- App-like bottom navigation dock
- Visual table of contents
- Canvas-based hero background
- Skill radar / engineering stack section
- Tool stack conveyor strip
- Recent updates section
- Telegram feedback flow
- Creator Store + Support Hub

### Toolkit Experience

- Focus timer
- Daily mission planner
- Stopwatch
- Password workbench
- Smart clipboard
- Counters
- QR generator
- Camera scanner
- Local data control center

---

## Interactive Sections

GitHub READMEs support reliable interaction through expandable sections. Open the panels below to explore the site features.

<details open>
<summary><strong>Command Palette</strong></summary>

The website includes a command-palette style interface.

Shortcut:

```txt
Ctrl + K / Cmd + K
```

Suggested commands include:

- Open Toolkit
- Start Focus Timer
- Generate QR
- Open Projects
- Change Theme

</details>

<details>
<summary><strong>Bottom Sheets</strong></summary>

Most major actions open in mobile-friendly bottom sheets:

- Search / commands
- Smart scratchpad
- Digital toolkit
- Appearance settings
- Product preview
- Project case study

This keeps the interface usable on phones while still working well on desktop.

</details>

<details>
<summary><strong>Camera Scanner</strong></summary>

The scanner uses browser camera access to scan:

- QR codes
- supported barcodes
- text through OCR

Scanned text is automatically copied into the Smart Clipboard.

Camera access requires:

```txt
HTTPS or localhost
```

</details>

<details>
<summary><strong>Password Workbench</strong></summary>

The password generator includes:

- length slider
- max length of 28 characters
- uppercase toggle
- lowercase toggle
- number toggle
- symbol toggle
- strength indicator
- save action
- copy action

</details>

<details>
<summary><strong>Local Data Control</strong></summary>

The Data Control Center can:

- export notes
- export clipboard history
- clear clipboard
- clear tasks
- clear passwords
- clear all local toolkit data

No backend is required.

</details>

<details>
<summary><strong>Appearance and Accessibility</strong></summary>

The Appearance panel supports:

- dark theme
- light theme
- system theme
- mood presets
- accent colors
- reduce motion
- high contrast
- larger text
- disable sounds

</details>

---

## Digital Toolkit

The built-in toolkit turns the portfolio into a practical browser utility.

| Tool | Description |
|---|---|
| Focus | Timer for deep-work sessions |
| Plan | Local daily mission/task board |
| Clock | Stopwatch with lap support |
| Key | Password workbench with strength feedback |
| Clip | Smart clipboard history stored locally |
| Count | Custom counters for habits or repeated actions |
| Scan | Camera scanner for QR, barcode, and OCR workflows |
| QR Gen | QR code generator for text or links |
| Data | Export and clear local browser data |

---

## Project Showcase

Projects are organized by outcome instead of only technology labels.

Current filter types:

- Productivity
- UI Systems
- Browser Tools
- Experiments

Each project can open a case-study sheet with:

- Problem
- Solution
- Features
- Tech used
- What was learned
- Live project link

This makes the project section more useful for visitors, recruiters, and potential clients.

---

## Storefront

The storefront section is designed as a **Creator Store + Support Hub**.

It includes:

- Gumroad product preview cards
- product detail bottom sheet
- price label area
- what is included
- who the product is for
- benefits
- Gumroad button
- Patreon support button

This makes the store section feel like a small product catalog instead of a single external link.

---

## Local-first Privacy

This portfolio is intentionally designed to avoid unnecessary backend dependency.

| Data | Storage |
|---|---|
| Notes | Browser localStorage |
| Tasks | Browser localStorage |
| Clipboard history | Browser localStorage |
| Password history | Browser localStorage |
| Counters | Browser localStorage |
| Accessibility preferences | Browser localStorage |

The user can export or clear stored data from the Data Control Center.

---

## Accessibility

Accessibility-focused features include:

- visible focus states
- aria labels for icon-only controls
- reduce motion preference
- high contrast preference
- larger text preference
- optional sound disabling
- mobile-friendly tap targets
- readable empty states

---

## Tech Stack

| Category | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3, custom properties, responsive layout |
| Logic | Vanilla JavaScript |
| Motion / Graphics | Canvas 2D |
| Camera | getUserMedia API |
| QR scanning | jsQR |
| OCR | Tesseract.js |
| Clipboard | Clipboard API with fallback copy |
| Storage | localStorage |
| Export | JSON download, Markdown export, image export |
| Store | Gumroad link / overlay support |
| Feedback | Telegram share flow |

---

## Repository Structure

```txt
.
├── index.html
├── favicon-pack.zip
└── README.md
```

### File descriptions

| File | Purpose |
|---|---|
| `index.html` | Main portfolio website |
| `favicon-pack.zip` | Complete favicon and app icon pack |
| `README.md` | Repository documentation |

---

## Favicon Pack

The favicon pack contains the icons needed for browser tabs, pinned tabs, mobile shortcuts, Android install icons, and Apple touch icons.

To use the icons in production:

1. Unzip `favicon-pack.zip`.
2. Place the extracted files beside `index.html`.
3. Deploy all files together.

### Chrome shortcut icon note

For Chrome New Tab shortcuts, Chrome commonly uses:

```txt
favicon.ico
favicon-32x32.png
favicon.svg
```

For Add to Home Screen / installable shortcuts, Chrome mainly uses the icons referenced by:

```txt
site.webmanifest
```

Usually these are:

```txt
android-chrome-192x192.png
android-chrome-512x512.png
maskable-icon-512x512.png
```

Chrome may cache old icons. If the icon does not update, remove the old shortcut and revisit the deployed page after the favicon files are publicly available.

---

## Run Locally

### Open directly

```bash
open index.html
```

or double-click the file.

### Recommended local server

Use a local server for better browser API behavior:

```bash
python -m http.server 8000
```

Then open:

```txt
http://localhost:8000
```

---

## Deployment Checklist

- [ ] Unzip `favicon-pack.zip` beside `index.html`
- [ ] Confirm `favicon.ico` is publicly accessible
- [ ] Confirm `site.webmanifest` is publicly accessible
- [ ] Deploy using HTTPS
- [ ] Test Chrome shortcut icon after deployment
- [ ] Test camera scanner on mobile
- [ ] Test toolkit tabs on mobile
- [ ] Test password generator
- [ ] Test local data export and clear actions
- [ ] Test Gumroad and Patreon links
- [ ] Test Telegram feedback link
- [ ] Test accessibility preferences

---

## Browser Requirements

| Feature | Requirement |
|---|---|
| Camera scanner | HTTPS or localhost |
| Clipboard write | Secure context recommended |
| OCR | Tesseract.js access |
| Gumroad overlay | Internet access |
| Font Awesome icons | Internet access unless self-hosted |
| Google Fonts | Internet access unless self-hosted |
| Local toolkit storage | localStorage enabled |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` / `Cmd + K` | Open command palette |
| `N` | New note |
| `T` | New task |
| `C` | New counter |

---

## Design Direction

The visual style is built around:

- dark glass panels
- engineering-inspired spacing
- glowing accent colors
- mobile-first bottom sheets
- rounded bento cards
- practical utility flows
- futuristic but readable UI

The result is a portfolio that feels more like a compact product than a simple landing page.

---

## Future Improvements

Potential upgrades:

- PWA service worker
- fully offline toolkit mode
- self-hosted fonts and icons
- recruiter mode
- Telegram contact intent builder
- more project screenshots
- more detailed Gumroad product data if API access is available
- optional analytics-free visitor counter

---

## Credit

This is the personal portfolio and digital toolkit of **Jino Sabu**.

If you reuse or adapt the interface, please provide proper credit.

---

<div align="center">

### Built with precision. Designed for interaction. Engineered for the browser.

**Jino Sabu — Digital Architect**

</div>
