---
name: MenoVerse Ethereal
colors:
  surface: '#FAF7F0'
  surface-dim: '#e0dac6'
  surface-bright: '#fff9e8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf4df'
  surface-container: '#F4F1E8'
  surface-container-high: '#EBE7D9'
  surface-container-highest: '#e8e2cf'
  on-surface: '#3F3D35'
  on-surface-variant: '#6B695E'
  inverse-surface: '#333123'
  inverse-on-surface: '#f7f1dc'
  outline: '#A8A596'
  outline-variant: '#D1CEC0'
  surface-tint: '#5c614d'
  primary: '#535845'
  on-primary: '#ffffff'
  primary-container: '#6b705c'
  on-primary-container: '#eff4db'
  inverse-primary: '#c4c9b1'
  secondary: '#5f604b'
  on-secondary: '#ffffff'
  secondary-container: '#e2e1c7'
  on-secondary-container: '#63644f'
  tertiary: '#744c36'
  on-tertiary: '#ffffff'
  tertiary-container: '#8f644c'
  on-tertiary-container: '#ffeee6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e5cc'
  primary-fixed-dim: '#c4c9b1'
  on-primary-fixed: '#191d0e'
  on-primary-fixed-variant: '#444937'
  secondary-fixed: '#e5e4ca'
  secondary-fixed-dim: '#c8c8af'
  on-secondary-fixed: '#1c1d0c'
  on-secondary-fixed-variant: '#474835'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#f1bb9e'
  on-tertiary-fixed: '#301403'
  on-tertiary-fixed-variant: '#633e28'
  background: '#fff9e8'
  on-background: '#1e1c10'
  surface-variant: '#e8e2cf'
  risk-high: '#BC6C4D'
  risk-low: '#84A59D'
  lavender-mist: '#E7E4D5'
  plum-deep: '#3F3D35'
  glass-bg: rgba(255, 251, 240, 0.6)
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max-width: 1200px
  margin-mobile: 24px
  margin-desktop: 64px
  gutter: 20px
  base-unit: 8px
  section-gap: 48px
---

## Brand & Style
MenoVerse AI embodies a warm, empathetic, and sophisticated personality designed for health and wellness during perimenopause. The brand avoids clinical sterility in favor of a "sanctuary" aesthetic—balancing medical reliability with an organic, editorial feel.

The design style is a hybrid of **Glassmorphism** and **Minimalism**, utilizing soft background blurs, translucent layers (glass-warm), and significant whitespace to reduce cognitive load. The emotional response is intended to be calm, grounded, and supportive, achieved through a "Warm Sand" foundation and "Sage Green" accents.

## Colors
The palette is rooted in earth tones and desaturated naturals.
- **Primary (Sage Green):** Used for key actions and brand identity.
- **Secondary (Muted Moss):** Supporting accents and secondary containers.
- **Tertiary (Sand/Earth):** High-priority status indicators and empathetic highlights (e.g., cycle phases).
- **Background (Warm Sand):** A low-blue-light base that reduces eye strain.
- **Semantic Colors:** "Risk-high" uses a terracotta red instead of a harsh scarlet to maintain the calm aesthetic, while "Risk-low" uses a soft seafoam.

## Typography
The system uses a pairing of a high-contrast serif and a modern geometric sans-serif.
- **Playfair Display:** Used for headlines and emphasis. It should often be styled with a "Semi-bold" weight or "Italic" to lean into the editorial, premium health brand feel.
- **Plus Jakarta Sans:** Used for all functional text, data points, and labels. Its slightly rounded terminals complement the overall soft UI.
- **Scaling:** Large headlines (XL) scale down on mobile, while body text remains consistent for legibility.

## Layout & Spacing
The layout follows a **Fixed Grid** approach for desktop (max 1200px) and a fluid single-column approach for mobile.
- **Grid:** 12-column system on desktop with 20px gutters.
- **Rhythm:** Spacing is strictly based on 8px increments. Cards use 24px (3 units) or 32px (4 units) internal padding to maintain a spacious feel.
- **Margins:** Generous 64px horizontal margins on desktop create a "center-stage" effect for the dashboard content.
- **Mobile Adaption:** Bottom navigation is used on mobile for ergonomic reach, while desktop uses a traditional top-header layout.

## Elevation & Depth
Hierarchy is established through **Tonal Layers** and **Ambient Shadows** rather than stark borders.
- **Base Layer:** Background (#F0EAD6).
- **Surface Layer:** White or Off-white (#FAF7F0) cards.
- **Shadows:** Use a "soft-shadow" approach: `0 10px 30px -10px` with a primary-tinted color at 15% opacity. This makes elements feel like they are floating gently on the warm background.
- **Glass Effects:** Top navigation and specific high-interest sections (like the voice FAB or hero card) utilize `backdrop-blur-md` and `bg-surface/80` to create a sense of translucency and breathability.

## Shapes
The shape language is organic and approachable.
- **Primary Corners:** 1rem (16px) for main dashboard cards and buttons.
- **Large Surfaces:** 1.5rem (24px) for hero containers and large background sections to emphasize the "soft sanctuary" feel.
- **Interactive Elements:** Buttons and symptom logs use 12px or pill-shaped (full) rounding to differentiate them from structural layout cards.

## Components
- **Buttons:**
    - *Primary:* Filled with Sage Green (#6B705C), using white text and 12px-16px rounding.
    - *Action:* High-contrast (e.g., White on Sage) for AI-driven features.
- **Cards:** White or very light beige backgrounds with subtle `outline-variant/10` borders and soft shadows. Use "Internal Grouping" (e.g., background-filled icons) to organize content within the card.
- **Chips/Symptom Logs:** Ghost-style buttons with `outline-variant` borders that transition to a soft Sage-tinted background on hover.
- **Data Visualization:** Progress rings and bar charts use semantic colors (Terracotta for risk, Sage for sleep) with rounded caps and high-contrast labels.
- **Navigation:**
    - *Desktop:* Minimalist top bar with active state indicated by a 2px primary-colored bottom border.
    - *Mobile:* Floating glass-morphic bottom bar with large icons and labels for accessibility.
- **FAB:** The Voice FAB is a large, square-rounded (2xl) icon button in Tertiary (#CB997E) with a heavy shadow to indicate it is the most important contextual action.