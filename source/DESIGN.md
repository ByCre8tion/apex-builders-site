# Apex Builders design system

Architectural gallery. White canvas, ink text, one orange action per screen, square corners, raw photography, and line drawings of a house as the signature. Every page and every edit follows this file. If a change breaks a rule here, change the rule here first.

## Principles

1. Photography sells the work. Show it full bleed or as a plain rectangle with a ruled caption. Never put a photo inside a padded card.
2. Depth comes from surface steps (White, Chalk) and hairline rules. No drop shadows, no glass blur, no gradients on interface parts.
3. Orange means "do this". One filled orange button per screen. Orange text on white only in the darker Ember tone.
4. Type does the hierarchy: very large condensed display, calm body, small tracked labels.
5. Motion explains, it does not decorate. One signature move per section. Phones get a lighter version.

## Color

| Token | Value | Use |
| --- | --- | --- |
| `--white` | #FFFFFF | Page canvas, nav once scrolled, inputs |
| `--chalk` | #F6F4F1 | Alternate sections (Services, FAQ), widget surfaces, form panel |
| `--stone` | #ECE8E3 | Empty bars, placeholder fills |
| `--ink` | #191C1D | Headings, body, footer canvas, dark buttons |
| `--ink-2` | #4A4F51 | Long body copy on white and chalk |
| `--muted` | #55595C | Captions, labels, metadata (6:1 on white) |
| `--rule` | rgba(25,28,29,.1) | Hairlines between items |
| `--rule-strong` | rgba(25,28,29,.24) | Input borders, outline buttons |
| `--orange` | #FD6002 | The one primary button, large numerals, progress fills |
| `--ember` | #B84500 | Orange text on white or chalk (4.7:1) |
| `--plaster` | #F5EEE9 | Text on dark photos and on the footer |

Contrast floors: body and labels 4.5:1, large display and UI boundaries 3:1. Text over photos always sits on a scrim that is measured against the brightest part of the photo.

## Type

| Role | Face | Size | Line height | Tracking |
| --- | --- | --- | --- | --- |
| Display | Barlow Condensed 700, uppercase | clamp(3.375rem, 8.2vw, 8.25rem) | 0.88 | -0.005em |
| Section title | Barlow Condensed 700, uppercase | clamp(2.625rem, 5.6vw, 5.5rem) | 0.92 | -0.005em |
| Subhead | Barlow Condensed 700, uppercase | clamp(1.5rem, 2.2vw, 2rem) | 1.0 | 0 |
| Lead | Inter 400 | clamp(1rem, 1.25vw, 1.125rem) | 1.6 | 0 |
| Body | Inter 400 | 1rem | 1.6 | 0 |
| Label | Inter 500, uppercase | 0.75rem | 1.3 | 0.16em |
| Caption | Inter 400 | 0.8125rem | 1.4 | 0 |

Rules: body text never under 16px on phones, inputs always 16px, numbers that change use tabular figures, paragraphs cap at 65 characters, headings use balanced wrapping, paragraphs use pretty wrapping. Fonts are self hosted.

## Shape

| Element | Radius |
| --- | --- |
| Buttons, inputs, selects | 2px |
| Photos, video, cards, widgets | 4px |
| Chips and small toggles | 999px |

Nothing else is rounded. Nested surfaces keep the same 4px unless the inset is under 8px.

## Spacing and layout

8px base. Section padding clamp(96px, 12vw, 176px) top and bottom. Max content width 1440px with a side gutter of clamp(16px, 3.2vw, 44px). Grids use CSS grid with `minmax(0, 1fr)` tracks. Every section starts with a numbered label (`01 Services`) above its title.

## Components

- **Nav:** one thin bar, 72px. Clear over the hero with plaster text, white with a hairline once scrolled. Links are labels. One outline button that fills ink once scrolled. Phones: logo plus a "Menu" text button that opens a white sheet with numbered links.
- **Buttons:** primary = orange fill, ink text. Secondary = 1px outline in `--rule-strong`, ink text. Dark = ink fill, white text. All 2px corners, 52px tall (44px in the nav), labels never wrap.
- **Links:** text with a 1px underline offset 4px and a trailing arrow that nudges 4px on hover.
- **Project caption:** title left, Location and Scope as label plus value, one outline button, a hairline under the row.
- **Accordion:** question in Inter 500 17px, a 28px circle with a plus that turns into a minus and fills orange when open.
- **Form:** chalk panel, white inputs with `--rule-strong` borders, labels above, errors in #B42318 with text, required fields marked with an asterisk explained once.

## Motion

- Easing: `cubic-bezier(.16,1,.3,1)` for reveals, `ease-out` for state changes, springs for drag.
- Durations: press 150ms, hover 250ms, reveals 900ms to 1200ms, section scrubs tied to scroll.
- Signature moves: hero mask opens, statement words light up as you read, project cards tuck under each other, process pans sideways, house drawings draw in from the left.
- Phones and touch screens: no smooth scroll, no parallax, no drawing scrub, no card stacking, nav never hides.
- Reduced motion: everything rests in its final state, autoplay video does not start, every moving strip has a pause button.

## Accessibility checklist before shipping

Contrast measured on the rendered page, every control reachable by keyboard with a visible ring, nothing hidden behind the nav when focused, no horizontal scroll at 320px, 200% zoom works, touch targets at least 44px, form errors announced and focused, images have alt text unless decorative.
