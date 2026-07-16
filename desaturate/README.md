# Desaturate

A Chrome extension that drains the color out of doomscrolling sites — and
makes it deliberately inconvenient to get the color back.

## How it's designed

- **Onboarding on install**: a setup page opens once, with checkboxes for
  commonly doomscrolled sites (Facebook pre-checked). One Chrome permission
  prompt covers everything selected.
- **No toolbar button, no quick toggle**: the manifest declares no `action`,
  so there is nothing to click. Re-saturating a site requires digging into
  `chrome://extensions` → Desaturate → Details → Extension options — friction
  by design.
- **Instant effect**: sites go gray without a reload, both when added and on
  already-open tabs.
- **Minimal permissions**: only `storage` + `scripting`, with host access
  granted per-site by the user. No data collection, no network requests,
  no remote code.

## Files

| File | Purpose |
|---|---|
| `manifest.json` | MV3 manifest — no `action` key (no toolbar icon) |
| `background.js` | Service worker; syncs registered content scripts with the stored site list, opens onboarding on install |
| `common.js` | Preset site list + helpers shared by onboarding/options pages |
| `onboarding.html/js` | First-run setup page with site checkboxes |
| `options.html/js` | The buried edit page (presets + custom sites) |
| `desaturate.css` | The entire mechanism: `html { filter: grayscale(1) }` |
| `style.css` | Shared page styling (light/dark aware) |
| `icons/` | 16/32/48/128 PNG icons |

## Test locally

1. `chrome://extensions` → enable **Developer mode** → **Load unpacked** →
   select this folder.
2. The onboarding page opens automatically. Check some sites and click the
   button; accept Chrome's permission prompt.
3. Visit a selected site — gray from first paint. Already-open tabs go gray
   immediately.
4. To edit: `chrome://extensions` → Desaturate → Details → Extension options.

## Publish to the Chrome Web Store

1. Register a developer account (one-time $5): https://chrome.google.com/webstore/devconsole
2. Bump `version` in `manifest.json` for each upload.
3. Zip the folder contents (not the folder itself):
   `cd desaturate && zip -r ../desaturate-1.0.0.zip . -x '.*'`
4. In the dev console: new item → upload zip.
5. Listing requirements:
   - At least one 1280×800 (or 640×400) screenshot
   - Category: e.g. "Workflow & Planning" or "Accessibility"
   - Single-purpose description: "Removes color from user-selected websites
     to reduce compulsive browsing."
   - Privacy tab: declare **no data collected**; justify `storage` (saves the
     user's site list), `scripting` (applies the grayscale stylesheet), and
     host permissions (user-selected sites only).
6. Review typically takes 1–3 days with this narrow permission model.
