# frontend-a11y-panel

A modern, animated, mobile-responsive accessibility settings panel for React & Next.js apps. Built with GSAP animations and zero external CSS dependencies.

![Mobile & Desktop](https://img.shields.io/badge/Responsive-Mobile%20%26%20Desktop-blue)
![React](https://img.shields.io/badge/React-%3E%3D17-61dafb)
![Next.js](https://img.shields.io/badge/Next.js-Compatible-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Supported-3178c6)
![WCAG](https://img.shields.io/badge/WCAG-Accessible-green)

---

## Features

- **Typography controls** - Font size, line height, letter spacing, bold, italic, text alignment, text case
- **Color settings** - Font color, title color, title background color with swatch picker
- **Display options** - Highlight titles/links, hide images, monochrome, high/low contrast filters
- **Flexible positioning** - Place the FAB in any corner: bottom-right, bottom-left, top-right, or top-left
- **GSAP animations** - Smooth panel open/close with position-aware slide direction, staggered content animations
- **Mobile bottom sheet** - Full-width bottom sheet on mobile (< 600px)
- **Desktop panel** - Anchored panel next to the FAB button, adapts to any corner position
- **Persistent settings** - Auto-saves to localStorage, syncs across tabs
- **Fully themeable** - Accent color, header gradient, button colors via props
- **SSR safe** - Works with Next.js (App Router & Pages Router)
- **Zero CSS imports** - Styles are injected automatically

---

## Installation

```bash
npm install frontend-a11y-panel
```

```bash
yarn add frontend-a11y-panel
```

```bash
pnpm add frontend-a11y-panel
```

---

## Quick Start

### Next.js (App Router)

Since this component uses browser APIs (localStorage, DOM), wrap it in a client component:

```tsx
// components/A11yButton.tsx
"use client";

import { AccessibilityButton } from "frontend-a11y-panel";

export default function A11yButton() {
  return (
    <AccessibilityButton
      accentColor="#38439A"
      resetColor="#e53935"
    />
  );
}
```

Then use it in your layout or page:

```tsx
// app/layout.tsx
import A11yButton from "@/components/A11yButton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <A11yButton />
      </body>
    </html>
  );
}
```

### Next.js (Pages Router)

```tsx
// pages/_app.tsx
import dynamic from "next/dynamic";

const AccessibilityButton = dynamic(
  () => import("frontend-a11y-panel").then((mod) => mod.AccessibilityButton),
  { ssr: false }
);

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <AccessibilityButton accentColor="#38439A" />
    </>
  );
}
```

### React (Vite / CRA)

```tsx
import { AccessibilityButton } from "frontend-a11y-panel";

function App() {
  return (
    <div>
      <h1>My App</h1>
      <AccessibilityButton accentColor="#38439A" />
    </div>
  );
}
```

---

## Components

### `<AccessibilityButton />`

All-in-one floating action button (FAB) that opens the accessibility panel on click.

```tsx
<AccessibilityButton
  accentColor="#38439A"
  headerGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  resetColor="#e53935"
  position="bottom-right"
  bottom={28}
  right={28}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | `"bottom-right"` | Corner position of the FAB and panel |
| `accentColor` | `string` | `"#2e7d32"` | Primary color for FAB, header, buttons, active states |
| `headerGradient` | `string` | green gradient | CSS gradient for the panel header background |
| `doneButtonGradient` | `string` | uses `accentColor` | CSS gradient for the Done button |
| `doneButtonHoverGradient` | `string` | uses `accentColor` | CSS gradient for Done button hover |
| `resetColor` | `string` | `"#e53935"` | Color for Reset button text & border |
| `iconBgColor` | `string` | `"rgba(255,255,255,0.18)"` | Background of the header icon circle |
| `bottom` | `number \| string` | `28` | FAB vertical offset from edge (px) |
| `right` | `number \| string` | `28` | FAB horizontal offset from edge (px) |
| `storageKey` | `string` | `"a11y-settings"` | localStorage key for persisting settings |

#### Position Examples

```tsx
// Bottom-right (default)
<AccessibilityButton position="bottom-right" />

// Top-left
<AccessibilityButton position="top-left" />

// Top-right with custom offset
<AccessibilityButton position="top-right" bottom={20} right={20} />

// Bottom-left
<AccessibilityButton position="bottom-left" />
```

The panel automatically opens adjacent to the FAB and the slide animation adapts to the chosen corner.

### `<AccessibilityPanel />`

Use this if you want to control the open/close state yourself (e.g., custom trigger button).

```tsx
import { useState } from "react";
import { AccessibilityPanel } from "frontend-a11y-panel";

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Accessibility</button>
      <AccessibilityPanel
        open={open}
        onClose={() => setOpen(false)}
        position="bottom-right"
        accentColor="#38439A"
      />
    </>
  );
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | required | Controls panel visibility |
| `onClose` | `() => void` | required | Called when panel should close |
| `position` | `"bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | `"bottom-right"` | Corner where the panel appears |
| `accentColor` | `string` | `"#2e7d32"` | Primary accent color |
| `headerGradient` | `string` | uses `accentColor` | Header background gradient |
| `doneButtonGradient` | `string` | uses `accentColor` | Done button gradient |
| `resetColor` | `string` | `"#e53935"` | Reset button color |
| `storageKey` | `string` | `"a11y-settings"` | localStorage key |
| `fabBottom` | `number \| string` | `28` | Vertical offset for panel positioning |
| `fabRight` | `number \| string` | `28` | Horizontal offset for panel positioning |

---

## Hooks

### `useA11ySettings(storageKey?)`

Access the current accessibility settings anywhere in your app.

```tsx
import { useA11ySettings } from "frontend-a11y-panel";

function MyComponent() {
  const settings = useA11ySettings();

  return (
    <div>
      <p>Current font size: {settings.fontSize}%</p>
      <p>High contrast: {settings.highContrast ? "ON" : "OFF"}</p>
    </div>
  );
}
```

---

## Theming Examples

### Brand Colors

```tsx
<AccessibilityButton
  accentColor="#1a73e8"
  resetColor="#d32f2f"
/>
```

### Custom Gradients

```tsx
<AccessibilityButton
  accentColor="#6200ea"
  headerGradient="linear-gradient(135deg, #6200ea 0%, #b388ff 100%)"
  doneButtonGradient="linear-gradient(120deg, #6200ea, #7c4dff)"
  doneButtonHoverGradient="linear-gradient(120deg, #4a00b0, #6200ea)"
/>
```

### Positioned with Custom Theme

```tsx
<AccessibilityButton
  position="top-left"
  accentColor="#00897b"
  headerGradient="linear-gradient(135deg, #00897b 0%, #4db6ac 100%)"
  bottom={20}
  right={20}
/>
```

---

## Settings Stored

All settings are persisted to `localStorage` and automatically applied to the page:

| Setting | Type | Range / Values |
|---------|------|----------------|
| `fontSize` | `number` | -50 to 100 (%) |
| `lineHeight` | `number` | -50 to 100 (%) |
| `letterSpacing` | `number` | -50 to 100 (%) |
| `fontColor` | `string` | hex color |
| `titleColor` | `string` | hex color |
| `titleBackgroundColor` | `string` | hex color |
| `textCase` | `string` | `"initial"`, `"uppercase"`, `"lowercase"` |
| `textAlign` | `string` | `"left"`, `"center"`, `"right"` |
| `bold` | `boolean` | - |
| `italic` | `boolean` | - |
| `highlightTitles` | `boolean` | - |
| `highlightLinks` | `boolean` | - |
| `hideImages` | `boolean` | - |
| `monochrome` | `boolean` | - |
| `highContrast` | `boolean` | - |
| `lowContrast` | `boolean` | - |

---

## Responsive Behavior

| Viewport | Behavior |
|----------|----------|
| **Mobile** (< 600px) | Full-width bottom sheet with drag handle, slides up/down based on position |
| **Desktop** (>= 600px) | 360px panel anchored next to the FAB button, slides in from the nearest edge |

---

## Peer Dependencies

- `react` >= 17
- `react-dom` >= 17

## Dependencies

- `gsap` ^3.14.2 (included automatically)

---

## License

MIT
# accessibiliity
