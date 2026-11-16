# Headless UI tests

jsdom harnesses that load the real `web/plugin.js` and drive it like a browser.

- `smoke.js` — sheet open → tier pick → codec toggle → download to 100% → queue
  clears → Original flow. Fails on any `ReferenceError`.
- `clients-matrix.js` — 21 assertions across three simulated clients:
  Android app WebView (handoff URL contents), iOS Safari (H.264 default, Apple
  warning, HDR note), desktop Chromium (disk-path download), mobile browser
  (browser-download fallback instead of Blob).

```bash
cd tests && npm install && npm test
```

Requires Node 18+. No browser needed.
