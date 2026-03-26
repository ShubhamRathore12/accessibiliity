# QA Test Cases — frontend-a11y-panel

## TC-01: FAB Button Renders & Opens Panel

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load page with `<AccessibilityButton />` | FAB button appears with pulse animation |
| 2 | Click the FAB button | Panel dialog opens with slide-in animation **adjacent to the FAB** |
| 3 | Verify backdrop | Semi-transparent backdrop with blur covers the page behind the panel |

---

## TC-02: Panel Positioning (All 4 Corners)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Set `position="bottom-right"` | FAB in bottom-right, panel opens above/left of FAB |
| 2 | Set `position="bottom-left"` | FAB in bottom-left, panel opens above/right of FAB |
| 3 | Set `position="top-right"` | FAB in top-right, panel opens below/left of FAB |
| 4 | Set `position="top-left"` | FAB in top-left, panel opens below/right of FAB |
| 5 | Resize to mobile (<600px) | Panel becomes full-width bottom sheet regardless of position |

---

## TC-03: Panel Close

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click the X button in panel header | Panel closes with slide-out animation |
| 2 | Click the backdrop (outside panel) | Panel closes |
| 3 | Click the "Done" button | Panel closes |
| 4 | Verify after close | FAB button is still visible and clickable |

---

## TC-04: Typography — Font Size Increase

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open panel > Typography tab | Font Size shows 0% |
| 2 | Click **+** button once | Font Size shows +10% |
| 3 | Click **+** button 5 more times | Font Size shows +60% |
| 4 | Verify page text | **All text on page visibly increases** (both px and rem-based) |
| 5 | Verify panel text | Panel's own text remains unchanged (not scaled) |

---

## TC-05: Typography — Font Size Decrease

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Reset settings | Font Size shows 0% |
| 2 | Click **−** button once | Font Size shows -10% |
| 3 | Click **−** button 4 more times | Font Size shows -50% (minimum) |
| 4 | Click **−** again | Font Size stays at -50% (clamped) |
| 5 | Verify page text | **All text on page visibly decreases** |
| 6 | Verify panel text | Panel's own text remains unchanged (not scaled) |

---

## TC-06: Typography — Line Height & Letter Spacing

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Increase Line Height to +30% | Page text has more vertical spacing between lines |
| 2 | Increase Letter Spacing to +20% | Page text has more horizontal spacing between characters |
| 3 | Decrease both to -20% | Tighter line height and letter spacing on page text |
| 4 | Verify panel | Panel's own spacing is unaffected |

---

## TC-07: Typography — Bold & Italic

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click Bold (B) button | Button shows active state; all page text becomes bold |
| 2 | Click Italic (I) button | Button shows active state; all page text becomes italic |
| 3 | Click Bold again to deactivate | Page text returns to normal weight |
| 4 | Verify panel | Panel's own text is unaffected by bold/italic |

---

## TC-08: Typography — Style Buttons Size (Regression)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Typography tab | B, I, align-left, align-center, align-right buttons visible |
| 2 | Verify button dimensions | Each button is **38x38px square**, not stretched full-width |
| 3 | Click Bold to activate | Button gets green border/bg, stays 38x38px |
| 4 | Verify on host app with global CSS | Buttons maintain their size regardless of host CSS |

---

## TC-09: Typography — Text Alignment

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click align-center button | Page text becomes center-aligned |
| 2 | Click align-right button | Page text becomes right-aligned |
| 3 | Click align-left button | Page text returns to left-aligned |

---

## TC-10: Typography — Text Case

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "UPPERCASE" chip | Chip shows active (green); all page text is uppercase |
| 2 | Click "lowercase" chip | Chip active; all page text is lowercase |
| 3 | Click "Initial" chip | Text returns to original case |

---

## TC-11: Colors — Font Color Swatches (Regression)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Switch to Colors tab | Color swatches visible for Font Color |
| 2 | Verify swatch dimensions | Each swatch is a **34px circle**, not stretched full-width |
| 3 | Click Red swatch | Swatch gets green border ring; all page body text turns red |
| 4 | Click Blue swatch | Page text turns blue |
| 5 | Click Black swatch | Page text returns to black |

---

## TC-12: Colors — Title Color & Title Background

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Set Title Color to Blue | All h1-h6 headings turn blue |
| 2 | Set Title Background to Green | All h1-h6 headings get green background |
| 3 | Reset to Black / White | Headings return to default appearance |

---

## TC-13: Display — Highlight Titles & Links

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Switch to Display tab | Toggle rows visible |
| 2 | Enable "Highlight Titles" | All h1-h6 get yellow background highlight |
| 3 | Enable "Highlight Links" | All `<a>` tags get yellow background highlight |
| 4 | Disable both | Highlights removed |

---

## TC-14: Display — Hide Images

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enable "Hide Images" | All `<img>` elements hidden (display:none) |
| 2 | Disable "Hide Images" | Images reappear |

---

## TC-15: Display — Color Filters

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enable "Monochrome" | Entire page becomes grayscale |
| 2 | Disable Monochrome, Enable "High Contrast" | Page contrast increases (1.5x) |
| 3 | Disable High Contrast, Enable "Low Contrast" | Page contrast softens (0.7x) |
| 4 | Only one filter active at a time | Enabling one doesn't stack with others |

---

## TC-16: Toggle Row Hover Animation

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Hover over any toggle row (Display tab) | Row lifts up (-2px), slight scale (1.015), shadow appears, green border |
| 2 | Mouse leaves row | Row returns to normal position smoothly |
| 3 | Click (active) on row | Brief press-down animation (scale 0.995) |

---

## TC-17: Reset Button

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Change multiple settings (font size, bold, color, etc.) | Settings applied to page |
| 2 | Click "Reset" button | All settings revert to defaults |
| 3 | Verify page | Page returns to original appearance |
| 4 | Verify panel | All counters show 0%, no active style buttons, black color selected |

---

## TC-18: Persistence (localStorage)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Change Font Size to +20%, enable Bold | Settings applied |
| 2 | Close the panel | Settings persist |
| 3 | Refresh the page | Settings are restored from localStorage |
| 4 | Open panel | Font Size shows +20%, Bold is active |

---

## TC-19: CSS Isolation from Host App

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Host app has global `button { width: 100% }` | Panel buttons are NOT full-width |
| 2 | Host app has global `* { font-weight: bold }` | Panel text maintains its own weights |
| 3 | Host app has global `input { height: 50px }` | Panel toggle switches are unaffected |
| 4 | Enable Bold from panel | Panel's own text stays normal; only page text becomes bold |

---

## TC-20: Theming Props

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Set `accentColor="#6200ea"` | FAB, header, active states, labels all use purple |
| 2 | Set `headerGradient="linear-gradient(...)"` | Panel header uses custom gradient |
| 3 | Set `resetColor="#ff5722"` | Reset button text and border use orange |

---

## TC-21: Mobile Responsive (< 600px)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Resize browser to < 600px | Panel becomes full-width bottom sheet |
| 2 | Drag handle visible at top of sheet | Small gray pill-shaped handle visible |
| 3 | Panel slides up from bottom | Smooth GSAP animation |
| 4 | Resize back to > 600px | Panel returns to positioned mode near FAB |

---

## TC-22: Tabs Navigation

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Panel opens on Typography tab | Typography tab is active (white bg, black text, bold) |
| 2 | Click "Colors" tab | Colors tab becomes active; Typography content replaced by color swatches |
| 3 | Click "Display" tab | Display tab active; toggle rows shown |
| 4 | Content animates in | Staggered fade-in animation on tab content items |

---

## TC-23: SSR / Next.js Compatibility

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Use in Next.js App Router with `"use client"` | No SSR errors, component renders on client |
| 2 | Use in Pages Router with `dynamic(..., { ssr: false })` | Component loads without hydration errors |
| 3 | Check server logs | No `window is not defined` or `document is not defined` errors |

---

## TC-24: Multiple Instances

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Render two `<AccessibilityButton />` with different storageKeys | Both FABs visible |
| 2 | Change settings in one | Only affects its own storageKey |
| 3 | Other instance retains independent settings | Settings are isolated |
