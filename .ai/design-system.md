Here is the comprehensive Design System documentation for **"The Ether"** Meditation App. This document is structured to be directly handed over to a frontend developer using Next.js, Tailwind CSS, and Framer Motion.

***

# Design System: The Ether

## 1. Design Philosophy
**"Digital Sacred Geometry"**
The interface should feel less like a tool and more like a vessel. We move away from rigid grids and corporate structures into fluid, organic, and celestial layouts.
*   **Core Values:** Serenity, Fluidity, Depth, Mystery.
*   **Visual Metaphor:** Glass floating in a nebula (Dark Mode) / Stones resting on sand (Light Mode).

---

## 2. Color Palette

We use a semantic color system. In Next.js/Tailwind, these should be defined as CSS variables to handle Light/Dark mode switching seamlessly.

### Dark Mode (The Astral Plane)
*Used for night meditation and

 default deep focus.*

| Semantic Name | Hex Code | Description | Usage |
|:---|:---|:---|:---|
| `bg-main` | `#121216` | Deep Void | Main background (Not pure black) |
| `bg-surface` | `#1E1E24` | Astral Glass | Cards, Modals (with opacity) |
| `text-primary` | `#EAEAEA` | Starlight | Main Headings, Timer Digits |
| `text-secondary`| `#A0A0B2` | Mist | Subtitles, Body text |
| `accent-primary`| `#D4AF37` | Alchemic Gold | Primary Actions, Active States |
| `accent-glow` | `#D4AF37` | (RGBA 0.4) | Box-shadow glows for active elements |

### Light Mode (The Earth Plane)
*Used for day meditation and history reviewing.*

| Semantic Name | Hex Code | Description | Usage |
|:---|:---|:---|:---|
| `bg-main` | `#F3F2ED` | Warm Sand | Main background (Paper texture feel) |
| `bg-surface` | `#FFFFFF` | White Stone | Cards, Modals |
| `text-primary` | `#2C3E50` | Deep Slate | Main Headings |
| `text-secondary`| `#6B7C93` | River Stone | Subtitles |
| `accent-primary`| `#6B8E23` | Olive/Sage | Primary Actions |
| `accent-glow` | `#6B8E23` | (RGBA 0.2) | Soft shadows |

---

## 3. Typography

We mix a mystical Serif for headers with a clean Sans-Serif for data to ensure readability.

### Font Families
1.  **Display (Headings):** `Cinzel` or `Cormorant Garamond`
    *   *Vibe:* Ancient, Editorial, Spiritual.
2.  **UI (Body/Data):** `Quicksand` or `Nunito`
    *   *Vibe:* Rounded, Friendly, Modern.

### Type Scale
| Level | Font | Size | Weight | Letter Spacing | Usage |
|:---|:---|:

---|:---|:---|:---|
| **Display XL** | Cinzel | 3.5rem | 400 | `tracking-widest` | Main Timer Countdown |
| **H1** | Cinzel | 2rem | 600 | `tracking-wide` | Page Titles (The Void, The Sanctuary) |
| **H2** | Cinzel | 1.5rem | 500 | `tracking-normal`| Section Headers |
| **Body** | Quicksand| 1rem | 400 | `tracking-normal`| General Text |
| **Label** | Quicksand| 0.875rem| 600 | `tracking-widest` | Buttons, Metadata, Stats Labels |

---

## 4. Iconography & Imagery

*   **Style:** Thin line weight (1.5px or 2px), SVG based.
*   **Forms:** Geometric, Celestial, Esoteric.
*   **Libraries:** Lucide React (customized) or custom SVGs.
*   **Key Icons:**
    *   *Home:* A simple Lotus or Enso circle.
    *   *Stats:* A Constellation map.
    *   *Settings:* An Eclipse or Third Eye.

---

## 5. Layout & Spacing (Tailwind)

*   **Border Radius:**
    *   Everything is organic. Avoid sharp corners.
    *   Standard Card: `rounded-2xl` or `rounded-3xl`.
    *   Buttons: `rounded-full` (Pill shape).
*   **Glassmorphism (The Glass Effect):**
    *   To achieve the "Ethereal" look, UI elements (Dock, Cards) use backdrop blur.
    *   *CSS Class:* `bg-surface/30 backdrop-blur-md border border-white/10`

---

## 6. Motion Physics (Framer Motion)

Motion is not just a transition; it is the heartbeat of the app.

### The "Breathing" Preset
Used for the Timer animation and idle states of floating elements.
```javascript
transition: {
  duration: 4,
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "mirror"
}
```

### The "Heavy Spirit" Preset
Used for page transitions and opening modals. It should feel like moving through water—slow but responsive.
```javascript
transition: {
  type: "spring",
  stiffness: 10

0,
  damping: 20,
  mass: 1.2
}
```

---

## 7. Component Architecture

### A. The Orb Button (Primary Action)
Instead of a rectangular "Start" button.
*   **Shape:** Perfect Circle.
*   **Effect:** Slowly pulsing shadow (`box-shadow`).
*   **Interaction:** `WhileHover` scale up 1.05, `WhileTap` scale down 0.95.

### B. The Constellation Card (Stats)
*   **Background:** Transparent with heavy blur.
*   **Border:** 1px solid with very low opacity (10%).
*   **Content:** Data points are connected by thin lines (SVG lines) mimicking star charts.

### C. The Celestial Dial (Time Input)
*   **Input Method:** Circular SVG stroke.
*   **Handle:** A glowing dot (Sun or Moon).
*   **Feedback:** Haptic vibration on every 5-minute increment tick.

---

## 8. PWA Specifics (Mobile UI)

*   **Safe Areas:** Respect the notch and home indicator.
    *   `padding-top: env(safe-area-inset-top)`
    *   `padding-bottom: env(safe-area-inset-bottom)`
*   **Touch Targets:** Minimum 44x44px for all interactive stars or runes.
*   **Gestures:**
    *   *Swipe Down* on the timer screen to cancel/minimize.
    *   *Swipe Left/Right* to switch between Home and Stats.

