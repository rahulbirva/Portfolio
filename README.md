# Rahul Poojary Portfolio

The portfolio for [rahulpoojary.in](https://rahulpoojary.in), built as a React + Vite single-page experience with a fixed React Three Fiber background.

## Features

- Existing portfolio copy and section order retained in the React overlay.
- Procedural refractive ice monoliths rendered with `MeshTransmissionMaterial`.
- A 3,200-particle custom GPU shader data stream.
- HDRI environment reflections, bloom, and scroll-velocity chromatic aberration.
- GSAP and ScrollTrigger section choreography.
- Lenis smooth scrolling synchronized with ScrollTrigger and the WebGL scene.
- Reduced-motion fallback that disables continuous motion and reveals content immediately.
- Responsive 375px-first layout with lazy-loaded profile and skill images.

## Tech Stack

- React 18 and Vite
- React Three Fiber, Three.js, Drei, and React Three Postprocessing
- GSAP, ScrollTrigger, and Lenis
- Tailwind CSS build tooling with project-specific CSS for the editorial layout
- Lucide React for small external-link affordances

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite. To create a production build:

```bash
npm run build
```

## Project structure

```text
Portfolio/
├── index.html
├── style.css
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── App.jsx
│   ├── BackgroundScene.jsx
│   ├── IceMonolith.jsx
│   ├── ParticleField.jsx
│   ├── content.js
│   ├── main.jsx
│   ├── motionState.js
│   └── tailwind.css
└── rahul.jpeg
```
