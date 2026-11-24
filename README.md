# A Universe Made Just for You, Orni

An interactive, single-page animated fantasy short-film surprise website — **"A Universe Made Just for You, Orni"** — built with React, CSS 3D transforms, SVG art, HTML5 Canvas particle choreography, and an original Web Audio API cinematic piano & chime engine.

---

## Main Features

- **Scene 1 — The Mysterious Beginning**: Opens from near-black into a deep midnight purple and navy galaxy with moving nebula clouds, distant stars, floating cosmic particles, and a glowing 3D crystal orb (`"Somewhere in this universe..."` / `"Something special is waiting for you."` / `"Touch to discover ✨"`).
- **Scene 2 — The Crystal Secret**: Tapping the crystal orb rotates particles around it, expands a magical energy wave, parts the 3D crystal hemispheres, starts the ambient piano soundtrack, and releases a luminous butterfly with a glowing trail.
- **Scene 3 — The Secret Letter**: A floating dark-purple envelope with golden edges opens with a realistic 3D CSS flap animation when tapped, revealing and unfolding the letter card (`"Hey Orni, This little universe has a tiny surprise waiting for you. ✨"`) and a `"Continue the Journey"` button.
- **Scene 4 — The Galaxy Transformation**: Dissolves the letter into spiraling cosmic particles while multiple butterflies dance in a circular pattern and gather at the center to reveal **`ORNI 🦋`** formed from glowing particles.
- **Scene 5 — The Secret Gift**: Features a floating dark-violet gift box with glowing golden ribbons (`"One last surprise..."` / `"Open your little gift 🎁"`). Tapping it unwraps the ribbons, opens the 3D lid, and blooms a layered translucent crystal flower from inside.
- **Scene 6 — The Final Secret Message & Unlockable Mini Letter**: Reveals the heartfelt message around the glowing crystal flower and floating butterflies, plus an **`Unlock One Last Secret 🔐`** interactive sealed mini letter (customizable via `src/config/universeConfig.ts`) and **`Experience Again ↻`** replay button.
- **Adaptive Mobile Performance**: Automatically scales particle counts, DPR, and filter effects across `high`, `balanced`, and `lightweight` device profiles, respects `prefers-reduced-motion`, and persists music mute preferences during the session.

---

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 + Custom CSS 3D Keyframes
- **Graphics & Motion**: SVG, CSS 3D Transforms, HTML5 2D Canvas (`requestAnimationFrame`)
- **Audio**: Web Audio API (`AudioContext` + `BiquadFilterNode` + `DelayNode`)
- **Icons**: `lucide-react`

---

## Project Folder Structure

```text
.
├── public/
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── favicon.svg
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── CrystalOrb.tsx          # Interactive 3D crystal orb with internal particles
│   │   ├── EnchantedFlower.tsx     # 3D faceted crystal flower with layered petals
│   │   ├── GalaxyBackdrop.tsx      # Deep midnight purple & navy nebula sky
│   │   ├── LuminousButterfly.tsx   # Luminous SVG butterfly with GPU wing flapping
│   │   ├── MagicalCanvas.tsx       # Starfield, cosmic dust, trails & swirl-to-ORNI morph
│   │   ├── MagicalEnvelope.tsx     # Tap-to-open 3D envelope & unfolding letter card
│   │   ├── MagicalGiftBox.tsx      # Interactive 3D gift box with unwrapping golden ribbons
│   │   ├── MusicToggle.tsx         # Accessible mute/unmute audio control
│   │   └── SecretLetterModal.tsx   # Unlockable sealed mini letter overlay
│   ├── config/
│   │   └── universeConfig.ts       # Easily editable story copy & PERSONAL_SECRET_MESSAGE
│   ├── utils/
│   │   ├── deviceQuality.ts        # Adaptive quality profile & reduced-motion check
│   │   └── dreamyPiano.ts          # Original Web Audio piano & chime synthesizer
│   ├── App.tsx                     # 6-scene interactive storytelling state machine
│   ├── index.css                   # Global styles, safe-area rules & keyframes
│   └── main.tsx                    # React DOM entry point
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── README.md
├── tsconfig.json
└── vercel.json
```

---

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd a-little-magic-for-orni
```

2. Install dependencies:

```bash
npm install
```

---

## Development

Start the local development server on port `3000`:

```bash
npm run dev
```

Type-check the project:

```bash
npm run lint
```

---

## Production Build

Generate the optimized production bundle in `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment (Vercel & GitHub)

This repository includes `vercel.json` for zero-configuration static deployment on **Vercel**:

1. Push the repository to **GitHub**.
2. Import the repository in **Vercel** (`Framework Preset: Vite`, `Build Command: npm run build`, `Output Directory: dist`).
3. Deploy — all favicons, web manifest, and client-side Web Audio assets are bundled cleanly with no required environment secrets.

---

## Screenshots

> Add screenshots or screen recordings of the 6 scenes after deployment:

- `[Scene 1 — Crystal Orb in the Mysterious Universe]`
- `[Scene 3 — 3D Secret Letter Envelope]`
- `[Scene 4 — Swirling Particle ORNI Reveal]`
- `[Scene 5 — Secret Gift Box & Blooming Crystal Flower]`
- `[Scene 6 — Final Message & Unlockable Mini Secret]`
