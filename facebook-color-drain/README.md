# Anti-Doom: Facebook Color Drain

A minimal Chrome extension that renders facebook.com in full grayscale from the
very first paint — the page never appears in color.

## Install (one time)

1. Open Chrome and go to `chrome://extensions`
2. Turn on **Developer mode** (toggle, top right)
3. Click **Load unpacked** and select this folder (`facebook-color-drain`)

That's it. Visit facebook.com — it should be gray immediately. The extension
touches nothing else: no permissions, no background code, just one CSS rule
scoped to `*.facebook.com`.

## Tweaks

Edit `grayscale.css` and click the reload icon on the extension card in
`chrome://extensions`:

- Partial drain: `filter: grayscale(0.8)`
- Extra punishing: `filter: grayscale(1) brightness(0.7) contrast(0.9)`

To cover more sites (e.g. Instagram), add entries to `matches` in
`manifest.json`, e.g. `"*://*.instagram.com/*"`.
