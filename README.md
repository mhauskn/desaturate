# Desaturate

A Chrome extension that drains the color out of doomscrolling sites — and
makes it deliberately inconvenient to get the color back.

Pick your sites once during onboarding; from then on they render in grayscale
from the first paint. There is no toolbar button and no quick toggle:
re-saturating a site means digging into Chrome's extension settings. Friction
by design.

## Repository layout

| Path | Contents |
|---|---|
| [`desaturate/`](desaturate/) | The extension source (MV3). See its README for architecture and local-install steps. |
| [`store-assets/`](store-assets/) | Chrome Web Store listing assets: icon, screenshots, promo tiles, listing copy. |

## Links

- **Chrome Web Store**: submitted for review July 2026 — link forthcoming
- **Privacy policy**: https://mhauskn.github.io/desaturate/privacy.html

## Privacy

No data collection, no analytics, no network requests, no remote code. The
only stored data is the user's own site list, in Chrome sync storage.
