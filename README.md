# Jino Sabu — Digital Architect Portfolio

A futuristic, mobile-first personal portfolio and creator hub built as a single-page web app. It combines portfolio sections, a live GitHub/open-source dashboard, a creator store, support links, and a browser-native productivity toolkit.

> Built for GitHub Pages with optional PWA/offline support through `sw.js`.

---

## 🌐 Live Site

https://jinosabu1999.github.io/About-Me/

---

## ✨ Features

### Portfolio

- Futuristic mobile-first landing page
- About/intro section
- Social links
- Experience timeline
- Selected projects with case-study sheets
- Creator Store + Support Hub
- Recent updates/changelog
- Feedback shortcut through Telegram

### Creator Store + Support Hub

- Gumroad product cards
- Product category labels
- Product preview images
- Price badges
- File type and file metadata
- Instant download badges
- Product update dates
- Native share support with copy fallback
- Support links for Ko-fi and Patreon
- Goal/progress support meter

### Open Source Dashboard

- Live GitHub repository dashboard
- Manual featured repositories
- Repository search
- Search result count
- Sort options:
  - Recently updated
  - Stars
  - Name
  - Language
- Repository topics as chips
- Live demo badge when a repo has a homepage/demo URL
- Previous/next carousel controls
- Refresh button
- Direct GitHub profile link

### Digital Toolkit

Includes browser-based utilities such as:

- Focus timer
- Planner/tasks
- Stopwatch
- Password generator
- Smart Clipboard
- Counters/goals
- QR generator
- WiFi QR generator
- Camera scanner
- Gallery QR/barcode scan
- OCR support
- Local data controls

### Smart Scratchpad

- Block-style note editor
- Slash command menu
- Slash command hints
- Keyboard navigation inside slash menu
- Mobile formatting toolbar
- Drag handles on touch devices
- Markdown preview
- Markdown import/export
- Notes organization:
  - Collections
  - Tags
  - Favorites/pinned notes
  - Backlinks
- Search saved notes with snippets
- Local browser storage

### PWA / Offline

- Installable web app support
- `site.webmanifest`
- `sw.js` service worker
- Offline fallback page
- Runtime caching for same-origin assets and selected CDN files

---

## 📁 File Structure

```txt
.
├── index.html
├── sw.js
├── profile.jpg
├── site.webmanifest
├── browserconfig.xml
├── favicon.ico
├── favicon.svg
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon-48x48.png
├── favicon-64x64.png
├── favicon-96x96.png
├── favicon-128x128.png
├── favicon-256x256.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── maskable-icon-512x512.png
├── apple-touch-icon.png
├── safari-pinned-tab.svg
└── README.md
```

---

## ⚡ Performance Notes

The page includes several optimizations:

- `jsQR` lazy-loads only when scanner tools are opened
- Prism lazy-loads only when code blocks are used
- Font Awesome stylesheet is preloaded/lazy-loaded
- Images use fixed dimensions where possible
- Notes and tools are local-first
- Service worker caches app assets

For even better performance in the future:

- Self-host and subset fonts
- Replace Font Awesome icons with inline SVGs
- Move inline CSS/JS into separate minified files
- Use image compression for previews/icons

---

## 🧠 Local Data / Privacy

Some tools use browser storage, including:

- Notes
- Clipboard entries
- Tasks
- Counters
- Preferences

This data stays in the user's browser unless they manually export/share it.

Clearing browser data may remove locally saved notes/tool data.

---

## 🧪 Browser Support

Recommended browsers:

- Chrome / Chromium
- Edge
- Brave
- Safari
- Firefox

Some features require browser support and HTTPS:

- Camera scanner
- PWA install
- Service worker
- Clipboard APIs
- OCR loading

GitHub Pages uses HTTPS, so these features should work after deployment.

---

## 📝 Tech Stack

- HTML
- CSS
- JavaScript
- Browser APIs
- LocalStorage
- Service Worker
- GitHub REST API
- Gumroad product data
- Optional lazy-loaded libraries:
  - jsQR
  - Tesseract.js
  - Prism.js
  - html2canvas

---

## ✅ Upload Checklist

Make sure the repo contains:

```txt
index.html
sw.js
profile.jpg
site.webmanifest
favicon.ico
favicon.svg
favicon-16x16.png
favicon-32x32.png
android-chrome-192x192.png
android-chrome-512x512.png
apple-touch-icon.png
README.md
```

Optional but recommended if available:

```txt
favicon-48x48.png
favicon-64x64.png
favicon-96x96.png
favicon-128x128.png
favicon-256x256.png
maskable-icon-512x512.png
browserconfig.xml
safari-pinned-tab.svg
```

---

## 📄 License

This is a personal portfolio project by **Jino Sabu**.

If you reuse the structure, design, or toolkit ideas, please give credit.

---

## 👤 Author

**Jino Sabu**

- GitHub: [jinosabu1999](https://github.com/jinosabu1999)
- X / Twitter: [@jinosabu1999](https://www.x.com/jinosabu1999)
- Instagram: [@jinosabu1999](https://www.instagram.com/jinosabu1999)
- YouTube: [@JinoSabu1999](https://www.youtube.com/@JinoSabu1999)
- Gumroad: [jinosabu1999.gumroad.com](https://jinosabu1999.gumroad.com/)

---

## ⭐ Support

If this portfolio or toolkit inspires you, consider supporting future drops:

- [Ko-fi](https://ko-fi.com/jinosabu1999)
- [Patreon](https://www.patreon.com/jinosabu1999)
- [Gumroad Store](https://jinosabu1999.gumroad.com/)
