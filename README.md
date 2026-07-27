# K2 — Water Bottle Brand Site

A marketing/storefront site for **K2**, a fictional insulated water bottle brand
named after the mountain. Static HTML, CSS, and vanilla JavaScript — no build
step, no dependencies, no framework.

## Running it

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Files

| File | What's in it |
| --- | --- |
| `index.html` | All markup — nav, hero, product grid, tech breakdown, story, impact, newsletter, footer, cart drawer |
| `styles.css` | Design system (custom properties), layout, components, responsive rules |
| `script.js` | Product catalogue, cart, filters, scroll effects, form validation |

## Features

- **Hero** with parallax mountain ridges drawn as inline SVG data URIs, and
  count-up stats.
- **Product grid** of six bottles rendered from the `PRODUCTS` array in
  `script.js`. Each card has selectable colorways that recolor a CSS-drawn
  bottle — no product photography needed.
- **Category filters** (Everyday / Trail / Expedition).
- **Cart drawer** with quantity controls and a subtotal, persisted to
  `localStorage` under the `k2-cart` key. Checkout is a stub — no payment
  processing is wired up.
- **Technology section** where hovering a layer in the list highlights the
  matching ring in the cross-section diagram.
- **Scroll reveals** and count-up numbers via `IntersectionObserver`, with
  graceful fallbacks if it's unavailable.
- **Responsive** down to 390px, with a slide-down mobile nav.
- Honors `prefers-reduced-motion` — parallax, count-ups, and reveals all
  stand down.

## Editing the catalogue

Products live in one array at the top of `script.js`. Add an entry and it
appears in the grid:

```js
{
  id: 'ridgeline-600',          // unique; used as the cart key
  name: 'Ridgeline 600',
  tagline: '600 ml · scrambling',
  price: 38,
  category: 'trail',            // everyday | trail | expedition
  badge: 'New',                 // or null
  colors: [
    // main = body, light = highlight, dark = shaded edge
    { name: 'Glacier', main: '#3aa9d8', light: '#7fd6f2', dark: '#12617f' }
  ]
}
```

To add a filter category, add a `.chip` button in `index.html` with a matching
`data-filter` value.

## Brand notes

Palette and type are set as custom properties at the top of `styles.css`:
glacier blue `#1f9bcf` against granite and snow, Syne for display, Inter for
body. Change them there and the whole site follows.

Fonts load from Google Fonts; the site falls back to system sans-serif offline.

## Notes

This is a front-end demo. There's no backend — the newsletter form validates
and confirms locally, and the cart never leaves the browser.
