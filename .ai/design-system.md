# Void UI Design System

## 1. Design Philosophy
**Core Concept:** "Cosmic Mindfulness"
The Void UI system is designed to minimize cognitive load through the use of deep contrast, negative space, and organic motion. The interface acts as a window into a void, where UI elements mimic bioluminescent light sources in deep space.

**Principles:**
*   **Absolute Immersion:** No status bars, no chrome. The app owns the pixels.
*   **OLED First:** Optimized for perfect blacks to blur the device boundaries.
*   **Visual Silence:** Information is presented only when necessary.

---

## 2. Color Palette
The system relies on a restricted palette to maintain the meditative atmosphere. The primary color serves as the "light source."

| Token Name | Hex Value | Description | Usage |
|:---|:---|:---|:---|
| `color-bg-deep` | `#050507` | Near-Black | Primary background. Not pure black (`#000`), allowing for subtle star texture depth. |
| `color-primary-glow` | `#4DEEEA` | Electric Cyan | The core color of the breathing ring and active elements. |
| `color-text-primary` | `#FFFFFF` | Pure White | Primary text. Used for the main instruction ("INHALE"). |
| `color-text-secondary` | `#E0E0E0` | Off-White | Secondary data. Used for the timer or subtitles. |
| `color-overlay-star` | `#FFFFFF` | White (20% Opacity) | Used for the noise/grain texture simulating stars. |

---

## 3. Typography
**Font Family:** *Inter* or *San Francisco (SF Pro)*.
The typeface must be a geometric sans-serif with neutral tracking.

| Style | Weight | Size (rem) | Tracking | Usage |
|:---|:---|:---|:---|:---|
| **Display** | Medium (500) | 2.0 | 0.05em | The main action verb ("INHALE"). |
| **Numeric** | Light (300) | 1.5 | 0.02em | The timer display ("00:04"). |
| **Body** | Regular (400) | 1.0 | 0.01em | Settings and secondary text. |

### Typographic Scale
To ensure harmony, font sizes follow a minor third scale ratio \(r = 1.2\).
The base size \(S_0\) is 16px.

\[ S_n = S_0 \cdot (1.2)^n \]

---

## 4. Component: The "Halo"
The central component is the **Halo**, a visual representation of breath capacity. It is not a solid shape, but a light accumulation.

### Visual Specs
*   **Shape:** Perfect Circle.
*   **Fill:** Radial Gradient (Cyan to Transparent).
*   **Border:** None.
*   **Shadows:** Multi-layered box-shadows to create the bloom effect.

**CSS Reference:**
```css
.halo-ring {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,0,0,0) 40%, #4DEEEA 100%);
  box-shadow: 
    0 0 20px #4DEEEA,     /* Inner Glow */
    0 0 60px #4DEEEA80,   /* Mid Glow */
    0 0 100px #4DEEEA33;  /* Outer Atmosphere */
}
5. Motion & Physics
Motion is the primary interaction language. Transitions must mimic organic biology (lungs expanding) rather than mechanical movement.
The Breathing Curve
The expansion and contraction of the Halo follows a sinusoidal function, specifically a sine wave modified for a pause at the peaks (holding breath).
If ( t ) is time in seconds, the scale ( S(t) ) of the ring can be approximated by:
[ S(t) = 1 + 0.4 \cdot \sin\left(\frac{2\pi t}{T}\right) ]
Where:
	•	( T ) is the total duration of one breath cycle (e.g., 8 seconds).	•	( 0.4 ) represents the maximum expansion scale (40% growth).
Transitions
	•	Text Fade: Opacity transitions take 800ms.	•	Easing: Custom cubic-bezier for "lungs" effect: ⁠cubic-bezier(0.45, 0, 0.55, 1) (Ease-In-Out).
6. Layout & Spacing
The layout utilizes a single central axis (y-axis).
	•	Vertical Alignment:
	▪	Halo: Vertically centered (50% from top).	▪	Instructions: Fixed padding from the bottom (approx. 20% from bottom) to prevent thumb obscuration.	•	Safe Areas:
	▪	Avoid placing elements within 40px of screen edges to maintain the "floating" illusion.
7. Assets
	•	Starfield Texture: A transparent PNG or noise shader overlay at 5% opacity is required over the ⁠color-bg-deep to prevent color banding on high-resolution screens.