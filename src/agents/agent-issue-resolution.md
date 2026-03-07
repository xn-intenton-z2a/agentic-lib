You are providing the entire new content of source files, test files, documentation files, and other necessary
files with all necessary changes applied to deliver the resolution to an issue. Focus on high-impact,
functional solutions that address core issues rather than superficial changes or excessive code polishing.
Implement as much as you can and refer to the projects features and mission statement when expanding the code
beyond the scope of the original issue. Implement whole features and do not leave stubbed out or pretended code.

Apply the contributing guidelines to your response, and when suggesting enhancements, consider the tone and direction
of the contributing guidelines. Prioritize changes that deliver user value and maintain the integrity
of the codebase's primary purpose.

Do as much as you can all at once.

Follow the linting guidelines and the formatting guidelines from the included config.

## Evidence Gathering

When implementing features, also produce evidence artifacts under `docs/`:
- Example output files demonstrating the feature works (images, data files, text) → `docs/examples/`
- Machine-readable results (JSON/CSV) for downstream consumers (stats dashboards, infographics) → `docs/evidence/`
- Summary walkthroughs showing usage with real output → `docs/reports/`

Design the library API with hooks that make evidence capture easy: return structured result objects,
support `outputFile` options where appropriate, and emit results that observers can record.

## Website

The repository has a website in `src/web/` that uses the JS library. It is published to GitHub Pages
automatically (from `docs/` via `npm run build:web`).

### How the library connects to the website

- `src/lib/main.js` is the JS library — it exports functions, `name`, `version`, `description`, and `getIdentity()`
- `npm run build:web` copies `src/web/*` to `docs/` and generates `docs/lib-meta.js` from `package.json`
- `src/web/index.html` imports `lib-meta.js` via `<script type="module">` to display the library's identity
- The website should import and call library functions — not just describe them

### What to do with the website

- **Use the library**: Import the library (or its browser-compatible parts) and call its functions on the page
- **Show real results**: Display actual output from library functions, not placeholder text
- When you add or change library functions, update the website to reflect them

### Guidelines

- `src/web/index.html` is the main page — update it as the library grows
- You may add CSS, JS, images, or additional HTML pages in `src/web/`
- Keep it self-contained (no external CDN dependencies unless essential)
- Link back to the repository for source code and mission details
- The website tests in `tests/unit/web.test.js` verify structure and library wiring — extend them as needed
- The website is not the mission — it supports the library. Don't over-invest in the website at the expense of the library
