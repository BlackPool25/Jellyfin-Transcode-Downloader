(() => {
    // ---- Transcode Downloader styles ----
    // Single stylesheet (classes support focus rings, hover states and
    // prefers-reduced-motion — none of which inline cssText can express).
    // Surfaces borrow Jellyfin/ElegantFin language: blurred dark glass,
    // hairline borders, 14-20px radii, cyan accent.
    const QD_CSS = `
    .qd-scrim{position:fixed;inset:0;z-index:10000;display:flex;align-items:flex-end;justify-content:center;
      background:rgba(0,0,0,.66);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);}
    .qd-sheet{background:rgba(28,28,34,.92);backdrop-filter:blur(20px) saturate(1.2);-webkit-backdrop-filter:blur(20px) saturate(1.2);
      border:1px solid rgba(255,255,255,.10);border-bottom:none;border-radius:20px 20px 0 0;
      box-shadow:0 -8px 40px rgba(0,0,0,.5);
      width:100%;max-width:600px;max-height:84dvh;overflow-y:auto;padding:8px 20px calc(20px + env(safe-area-inset-bottom));}
    @media (min-width:640px){.qd-sheet{border-bottom:1px solid rgba(255,255,255,.10);border-radius:20px;margin-bottom:5vh;}}
    .qd-grip{padding:12px 0 8px;cursor:grab;touch-action:none;}
    .qd-grip-bar{width:40px;height:5px;border-radius:3px;background:rgba(255,255,255,.28);margin:0 auto;}
    .qd-close{position:absolute;top:12px;right:12px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.10);
      background:rgba(255,255,255,.05);color:#b8b8c0;font-size:18px;cursor:pointer;line-height:1;}
    .qd-close:hover{color:#fff;background:rgba(255,255,255,.12);}
    .qd-title{font-size:17px;font-weight:700;color:#fff;padding:12px 40px 4px 0;}
    .qd-sub{font-size:13px;color:#b8b8c0;margin-bottom:16px;line-height:1.45;}
    .qd-section-title{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#8e8e96;margin:20px 0 8px;}
    .qd-chip{min-height:44px;padding:10px 18px;border-radius:999px;font-size:14px;font-weight:600;font-family:inherit;
      color:#b8b8c0;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);cursor:pointer;}
    .qd-chip:hover{color:#fff;border-color:rgba(255,255,255,.25);}
    .qd-chip[aria-pressed="true"]{color:#fff;background:rgba(0,164,220,.16);border-color:#00a4dc;}
    .qd-chip:disabled{opacity:.55;cursor:not-allowed;}
    .qd-chip:focus-visible,.qd-btn:focus-visible,.qd-rowbtn:focus-visible,.qd-check input:focus-visible,.qd-close:focus-visible,.qd-select:focus-visible{outline:2px solid #00a4dc;outline-offset:2px;}
    .qd-check{display:flex;align-items:center;gap:12px;min-height:44px;padding:10px 12px;border-radius:12px;font-size:14px;color:#f2f2f5;cursor:pointer;}
    .qd-check:hover{background:rgba(255,255,255,.05);}
    .qd-check input{width:22px;height:22px;accent-color:#00a4dc;flex-shrink:0;}
    .qd-check small{display:block;font-size:13px;color:#b8b8c0;font-weight:400;}
    .qd-note{font-size:13px;color:#8e8e96;margin-top:8px;line-height:1.45;}
    .qd-warn{font-size:13px;color:#e8b44f;background:rgba(232,180,79,.10);border:1px solid rgba(232,180,79,.3);
      border-radius:12px;padding:10px 12px;margin-top:8px;line-height:1.45;}
    .qd-select{width:100%;min-height:44px;padding:12px 40px 12px 14px;border-radius:12px;font-size:14px;color:#f2f2f5;
      background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);}
    .qd-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:52px;padding:12px 16px;
      border-radius:14px;font-size:14px;font-family:inherit;color:#fff;cursor:pointer;background:transparent;border:1px solid rgba(255,255,255,.10);}
    .qd-toggle[aria-pressed="true"]{border-color:#00a4dc;background:rgba(0,164,220,.16);}
    .qd-pill{display:inline-block;font-size:12px;font-weight:700;color:#00a4dc;background:rgba(0,164,220,.16);
      border-radius:999px;padding:2px 10px;margin-left:8px;vertical-align:middle;}
    .qd-onoff{font-size:12px;font-weight:700;border-radius:999px;padding:2px 10px;}
    .qd-onoff.on{color:#fff;background:#00a4dc;}
    .qd-onoff.off{color:#8e8e96;background:rgba(255,255,255,.08);}
    .qd-tier{border:1px solid transparent;border-radius:12px;}
    .qd-tier.qd-tier-selected{background:rgba(0,164,220,.16);border-color:#00a4dc;}
    .qd-btn{display:block;width:100%;min-height:52px;margin:16px 0 0;border-radius:14px;font-size:16px;font-weight:700;
      font-family:inherit;color:#fff;cursor:pointer;
      background:linear-gradient(180deg,#0fb5ef,#0093c4);border:1px solid #00a4dc;box-shadow:0 4px 16px rgba(0,164,220,.35);}
    .qd-btn:active{transform:scale(.98);}
    .qd-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none;}
    .qd-btn-secondary{display:block;width:100%;min-height:48px;margin-top:12px;border-radius:14px;font-size:15px;font-weight:600;
      font-family:inherit;color:#f2f2f5;cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.10);}
    .qd-linkbtn{background:none;border:none;color:#b8b8c0;font-size:14px;cursor:pointer;padding:12px;width:100%;text-align:center;}
    .qd-panel{position:fixed;z-index:9999;background:rgba(28,28,34,.92);backdrop-filter:blur(20px) saturate(1.2);
      -webkit-backdrop-filter:blur(20px) saturate(1.2);border:1px solid rgba(255,255,255,.10);border-radius:16px;
      box-shadow:0 8px 32px rgba(0,0,0,.5);color:#fff;font-size:13px;overflow:hidden;}
    @media (max-width:480px){.qd-panel{left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));}}
    @media (min-width:481px){.qd-panel{right:20px;bottom:20px;width:360px;}}
    .qd-row{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.07);}
    .qd-rowname{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;font-size:14px;color:#f2f2f5;}
    .qd-rowmeta{font-size:12px;color:#8e8e96;margin-bottom:4px;}
    .qd-track{height:6px;background:rgba(255,255,255,.12);border-radius:999px;margin-bottom:4px;display:none;}
    .qd-fill{height:100%;width:0%;background:linear-gradient(90deg,#0fb5ef,#0093c4);border-radius:999px;transition:width .2s;}
    .qd-status{font-size:13px;color:#b8b8c0;}
    .qd-status.failed{color:#f0837b;}
    .qd-status.waiting{color:#8e8e96;}
    .qd-xbtn{width:36px;height:36px;flex-shrink:0;border-radius:50%;border:1px solid rgba(255,255,255,.10);
      background:rgba(255,255,255,.06);color:#fff;font-size:14px;cursor:pointer;}
    .qd-retrybtn{min-height:36px;padding:8px 14px;border-radius:999px;font-size:13px;font-weight:700;font-family:inherit;
      color:#fff;background:rgba(0,164,220,.2);border:1px solid #00a4dc;cursor:pointer;flex-shrink:0;}
    .qd-notice{position:fixed;z-index:9999;background:rgba(28,28,34,.92);backdrop-filter:blur(20px) saturate(1.2);
      -webkit-backdrop-filter:blur(20px) saturate(1.2);border:1px solid rgba(255,255,255,.10);border-radius:14px;
      color:#f2f2f5;font-size:14px;padding:14px 16px;box-shadow:0 8px 32px rgba(0,0,0,.5);}
    @media (max-width:480px){.qd-notice{left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));}}
    @media (min-width:481px){.qd-notice{right:20px;bottom:20px;max-width:400px;}}
    @media (prefers-reduced-motion: reduce){.qd-fill{transition:none;}.qd-sheet,.qd-btn{transition:none !important;}}
    `;

    function injectStyles() {
        if (document.getElementById('qd-styles')) return;
        const el = document.createElement('style');
        el.id = 'qd-styles';
        el.textContent = QD_CSS;
        document.head.appendChild(el);
    }

    // efficiency factor so a given rung means roughly the same picture quality across codecs.
    // maxWidth/maxHeight are sent to the server so a "720p" pick cannot come back at 1080p+.
    // (Archive 2160p/1440p tiers were dropped: they defeat the phone-size goal and risk heavy
    // 4K tone-map jobs on small servers.)
    const QUALITY_TIERS = [
        { resolution: '1080p', bitrate: 6_000_000,  maxWidth: 1920, maxHeight: 1080 },
        { resolution: '1080p', bitrate: 4_000_000,  maxWidth: 1920, maxHeight: 1080 },
        { resolution: '720p',  bitrate: 3_000_000,  maxWidth: 1280, maxHeight: 720 },
        { resolution: '720p',  bitrate: 2_500_000,  maxWidth: 1280, maxHeight: 720 },
        { resolution: '720p',  bitrate: 1_500_000,  maxWidth: 1280, maxHeight: 720 },
        { resolution: '720p',  bitrate: 1_200_000,  maxWidth: 1280, maxHeight: 720 },
        { resolution: '480p',  bitrate:   800_000,  maxWidth: 854,  maxHeight: 480 },
        { resolution: '480p',  bitrate:   500_000,  maxWidth: 854,  maxHeight: 480 },
    ];

    // --- Codecs ---

    // `factor` scales the H.264-calibrated tiers above to a roughly equivalent quality.
    const VIDEO_CODECS = [
        { id: 'h264', label: 'H.264 (AVC)',  tag: 'H264', factor: 1 },
        { id: 'hevc', label: 'HEVC (H.265)', tag: 'HEVC', factor: 0.65 },
        { id: 'av1',  label: 'AV1',          tag: 'AV1',  factor: 0.5 },
    ];

    const AUDIO_CODECS = [
        { id: 'aac',  label: 'AAC',  tag: 'AAC' },
        { id: 'opus', label: 'Opus', tag: 'Opus' },
    ];

    const DEFAULT_VIDEO_CODEC = 'h264';
    const DEFAULT_AUDIO_CODEC = 'aac';
    const DEFAULT_CONTAINER = 'mp4';

    let selectedContainer = DEFAULT_CONTAINER;

    const STORAGE_VIDEO_CODEC = 'transcodeDownloader.videoCodec';
    const STORAGE_AUDIO_CODEC = 'transcodeDownloader.audioCodec';

    let selectedVideoCodec = DEFAULT_VIDEO_CODEC;
    let selectedAudioCodec = DEFAULT_AUDIO_CODEC;

    // { video: { h264: { encoder, hardware, supported, allowed }, … }, audio: { … } }
    let codecCapabilities = null;
    // false while unknown and whenever the capability probe failed — the UI then stays on
    // H.264/AAC and hides the selectors rather than guessing what the server can do.
    let codecCapabilitiesResolved = false;
    let codecCapabilitiesPromise = null;

    function findCodec(catalogue, id) {
        return catalogue.find(codec => codec.id === id) || null;
    }

    function codecTag(catalogue, id) {
        const codec = findCodec(catalogue, id);
        return codec ? codec.tag : String(id).toUpperCase();
    }

    function codecLabel(catalogue, id) {
        const codec = findCodec(catalogue, id);
        return codec ? codec.label : String(id).toUpperCase();
    }

    function videoCodecFactor(id) {
        const codec = findCodec(VIDEO_CODECS, id);
        return codec ? codec.factor : 1;
    }

    // Round a scaled bitrate to a readable step so codec-relative labels stay legible.
    // With factor 1 (H.264) every tier round-trips to its original value.
    function scaleBitrate(baseBitrate, factor) {
        const scaled = baseBitrate * factor;
        if (scaled >= 10_000_000) return Math.round(scaled / 1_000_000) * 1_000_000;
        if (scaled >= 1_000_000) return Math.round(scaled / 100_000) * 100_000;
        return Math.round(scaled / 10_000) * 10_000;
    }

    function formatBitrate(bitrate) {
        if (bitrate >= 1_000_000) return `${Number((bitrate / 1_000_000).toFixed(1))} Mbps`;
        return `${Math.round(bitrate / 1000)} kbps`;
    }

    function formatSize(bytes) {
        if (!bytes || bytes <= 0) return 'unknown size';
        if (bytes >= 1_000_000_000) return `~${(bytes / 1_000_000_000).toFixed(1)} GB`;
        if (bytes >= 1_000_000) return `~${Math.round(bytes / 1_000_000)} MB`;
        return `~${Math.max(1, Math.round(bytes / 1000))} KB`;
    }

    // Jellyfin 12.x rejects the legacy lowercase ?api_key= query param (and dual
    // query+header auth). In-page fetches carry the session token as an Authorization
    // header; only the Android browser-handoff URL — which cannot carry headers —
    // uses ?ApiKey= (capital A, the one 12.x still honours).
    function authHeaders(token) {
        return { 'Authorization': `MediaBrowser Token="${token}"` };
    }

    // Best-effort Apple player detection for the hev1 / Opus-in-MP4 warnings.
    function isApplePlayer() {
        const ua = navigator.userAgent || '';
        if (/iPhone|iPad|iPod/i.test(ua)) return true;
        // Safari on macOS, excluding Chromium-based browsers that also contain "Safari".
        return /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR/i.test(ua);
    }

    // Filenames come from server metadata (titles with /, :, ?, emoji...). Strip what
    // Windows/FAT/exFAT forbid, collapse whitespace, cap length. Never return empty.
    function sanitizeFilename(name, fallback) {
        const cleaned = String(name == null ? '' : name)
            .replace(/[/\\:*?"<>|\x00-\x1f]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 120);
        return cleaned || fallback;
    }

    // --- i18n ---

    // Fallback strings used when strings fetch fails or locale is en-us.
    const FALLBACK_STRINGS = {
        ChooseQuality: 'Choose quality',
        LoadingMediaInfo: 'Loading media info…',
        NoTranscodeOptions: 'No transcode options available.',
        ItemNotTranscodable: 'Transcoded downloads are only available for movies and episodes.',
        Waiting: 'Waiting…',
        DownloadTranscode: 'Download (Transcode…)',
        DownloadFailed: 'Download failed.',
        ChooseVideoCodec: 'Video codec',
        ChooseAudioCodec: 'Audio codec',
        CodecUnsupported: "not supported by this server's FFmpeg",
        CodecDisabledByAdmin: 'disabled by the server administrator',
        SoftwareEncodingHint: 'Software encoding — this can take a long time and the file is held in memory until it finishes.',
        DownloadFailedCodec: 'Download failed — the server could not encode with {codec}.',
        DownloadFailedStatus: 'Download failed (HTTP {status}).',
        BrowserHandoffHint: 'The Jellyfin Android app cannot save downloads itself, so this opens in your browser with the real filename.',
        BrowserHandoffStarted: 'Handed to your browser — check its downloads.',
        BrowserHandoffFailed: 'Could not open your browser.',
        AppleCodecWarning: 'Heads up: Apple players cannot play HEVC videos tagged hev1, and ignore Opus audio in MP4. Pick H.264 + AAC for iPhone/iPad.',
        RetryDownload: 'Retry',
    };

    // Populated by initStrings(); null until loaded.
    let loadedStrings = null;

    function t(key) {
        if (loadedStrings && loadedStrings[key]) return loadedStrings[key];
        return FALLBACK_STRINGS[key] || key;
    }

    // Resolve locale → candidate list with fallback chain: exact → base → en-us
    function resolveLocaleCandidates(locale) {
        const lower = (locale || '').toLowerCase().replace('_', '-');
        const base = lower.split('-')[0];
        const candidates = [];
        if (SUPPORTED_LOCALES.includes(lower)) candidates.push(lower);
        if (base !== lower && SUPPORTED_LOCALES.includes(base)) candidates.push(base);
        if (!candidates.includes('en-us')) candidates.push('en-us');
        return candidates;
    }

    async function fetchStrings(locale) {
        const candidates = resolveLocaleCandidates(locale);
        const base = document.querySelector('script[src*="TranscodeDownloader/ClientScript"]');
        const origin = base
            ? new URL(base.src).origin
            : window.location.origin;
        const basePath = base
            ? new URL(base.src).pathname.replace('/TranscodeDownloader/ClientScript', '')
            : '';

        for (const candidate of candidates) {
            try {
                const res = await fetch(`${origin}${basePath}/TranscodeDownloader/strings/${candidate}.json`);
                if (!res.ok) continue;
                const strings = await res.json();
                return { lang: candidate, strings };
            } catch (_) {
                // try next candidate
            }
        }
        return null;
    }

    // Eagerly load strings; resolves once loaded (or on failure).
    let stringsPromise = null;

    function initStrings() {
        stringsPromise = new Promise((resolve) => {
            function tryLoad(attempt) {
                // globalize sets document.documentElement.lang to the normalized locale
                // (e.g. 'de', 'en-us') during its module init — before any deferred script runs.
                const locale = document.documentElement.lang || null;
                if (locale) {
                    fetchStrings(locale).then(result => {
                        if (result) loadedStrings = result.strings;
                        console.log('[TranscodeDownloader] strings loaded for locale:', locale);
                        resolve();
                    }).catch(() => resolve());
                } else if (attempt < 20) {
                    setTimeout(() => tryLoad(attempt + 1), 250);
                } else {
                    console.warn('[TranscodeDownloader] locale not detected, using fallback strings');
                    resolve();
                }
            }
            tryLoad(0);
        });
    }

    // --- Download queue ---
    // Each entry: { id, filename, estimatedBytes, url, stopUrl, abortController, status: 'waiting'|'active' }
    const downloadQueue = [];
    let queueProcessing = false;

    function randomId() {
        const bytes = new Uint8Array(16);
        (window.crypto || window.msCrypto).getRandomValues(bytes);
        return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    }

    // Jellyfin only deletes a progressive transcode's temp file when it kills the job, and it
    // never kills a job whose ffmpeg already exited (TranscodeManager.PingTimer bails out on
    // HasExited before arming the kill timer). A completed download always ends that way, so the
    // file would sit in the transcode folder until the next server restart. Killing the job
    // explicitly is the only cleanup path — see docs/adr/0004-stop-active-encoding-after-download.md.
    function stopActiveEncoding(entry) {
        if (!entry.stopUrl) return;
        const stopUrl = entry.stopUrl;
        entry.stopUrl = null; // never fire twice for the same job
        try {
            const init = { method: 'DELETE', keepalive: true };
            if (entry.token) init.headers = authHeaders(entry.token);
            fetch(stopUrl, init).catch((err) => {
                console.warn('[TranscodeDownloader] failed to stop server transcode:', err);
            });
        } catch (err) {
            console.warn('[TranscodeDownloader] failed to stop server transcode:', err);
        }
    }

    // A closed tab aborts the fetch, which is enough for a still-running ffmpeg (the server's kill
    // timer takes over) but not for one that already finished — that job needs the same explicit
    // stop as a completed download.
    window.addEventListener('pagehide', () => {
        downloadQueue.forEach(stopActiveEncoding);
    });

    function buildStopUrl(baseUrl, deviceId, playSessionId) {
        return `${baseUrl}/Videos/ActiveEncodings?deviceId=${encodeURIComponent(deviceId)}`
            + `&playSessionId=${encodeURIComponent(playSessionId)}`;
    }

    // --- Deferred transcode cleanup (browser handoff only) ---

    // A download handed to the system browser (see handOffToBrowser) leaves this page with no
    // completion signal, so the ADR-0004 stop cannot be fired when it ends. The job is recorded
    // instead and stopped on a later page load, once it is old enough that ffmpeg has certainly
    // exited — at which point DELETE /Videos/ActiveEncodings only deletes the leftover temp file.
    // The age threshold is what keeps the stop from killing a transcode the browser is still
    // streaming; leaving the file a few hours longer is the cheaper mistake.
    const STORAGE_PENDING_STOPS = 'transcodeDownloader.pendingStops';
    const PENDING_STOP_MIN_AGE_MS = 6 * 60 * 60 * 1000;
    const PENDING_STOP_MAX = 50;

    function readPendingStops() {
        try {
            const raw = window.localStorage.getItem(STORAGE_PENDING_STOPS);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed.filter(e => e && e.baseUrl && e.deviceId && e.playSessionId) : [];
        } catch (_) {
            return [];
        }
    }

    function writePendingStops(entries) {
        try {
            window.localStorage.setItem(STORAGE_PENDING_STOPS, JSON.stringify(entries));
        } catch (_) {
            // localStorage unavailable — the temp file then survives until the server restarts,
            // which is the pre-existing behaviour rather than a new failure.
        }
    }

    // The token is deliberately not stored: it can expire or be revoked between the handoff and
    // the flush, so the stop is rebuilt with whatever token the session holds at that point.
    function rememberPendingStop(baseUrl, deviceId, playSessionId) {
        const entries = readPendingStops();
        entries.push({ baseUrl, deviceId, playSessionId, at: Date.now() });
        writePendingStops(entries.slice(-PENDING_STOP_MAX));
    }

    function flushPendingStops() {
        const entries = readPendingStops();
        const now = Date.now();
        const due = entries.filter(entry => now - (entry.at || 0) >= PENDING_STOP_MIN_AGE_MS);
        if (due.length === 0) return;

        getApiClient(0, 10, (client) => {
            const token = client.accessToken();
            const baseUrl = client.serverAddress() || window.location.origin;
            due.forEach((entry) => {
                const url = buildStopUrl(entry.baseUrl || baseUrl, entry.deviceId, entry.playSessionId);
                fetch(url, { method: 'DELETE', headers: authHeaders(token) }).catch((err) => {
                    console.warn('[TranscodeDownloader] deferred transcode stop failed:', err);
                });
            });
            // Re-read rather than reusing `entries`, so a handoff recorded while the ApiClient
            // was still resolving is not dropped. Due entries go whether or not the requests
            // succeed: a stop that fails now will not start succeeding later, and retrying
            // forever would grow the list without bound.
            writePendingStops(readPendingStops().filter(entry => now - (entry.at || 0) < PENDING_STOP_MIN_AGE_MS));
        }, () => {
            // No ApiClient — leave the entries in place and retry on the next page load.
        });
    }

    // Waiting/failed rows survive a reload: specs (no bytes, no tokens, no file handles)
    // are cheap to keep. On load they restart from zero — labelled honestly, never "resume".
    const STORAGE_QUEUE = 'transcodeDownloader.queue.v1';

    function persistWaitingQueue() {
        try {
            const rows = downloadQueue
                .filter(e => (e.status === 'waiting' || e.status === 'failed') && e.spec)
                .map(e => ({ spec: e.spec }));
            window.localStorage.setItem(STORAGE_QUEUE, JSON.stringify(rows.slice(0, 50)));
        } catch (_) { /* private mode etc: queue just won't persist */ }
    }

    function restoreWaitingQueue() {
        let rows = [];
        try {
            const raw = window.localStorage.getItem(STORAGE_QUEUE);
            rows = raw ? JSON.parse(raw) : [];
        } catch (_) { return; }
        if (!Array.isArray(rows) || rows.length === 0) return;
        for (const row of rows) {
            if (!row || !row.spec || !row.spec.item) continue;
            try {
                const parts = buildDownloadParts(row.spec);
                downloadQueue.push({
                    id: `${row.spec.itemId}-restored-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
                    spec: row.spec,
                    token: null, // refreshed from the live session when processed
                    fileHandle: null, // handles don't survive reloads: Blob fallback
                    filename: parts.filename,
                    estimatedBytes: parts.estimatedBytes,
                    url: parts.url,
                    stopUrl: parts.stopUrl,
                    videoCodec: parts.videoCodec,
                    audioCodec: parts.audioCodec,
                    mimeType: parts.mimeType,
                    codecLabel: parts.codecLabel,
                    receivedBytes: 0,
                    abortController: null,
                    status: 'waiting',
                });
            } catch (err) {
                console.warn('[TranscodeDownloader] dropping unrestorable queue row:', err);
            }
        }
        try { window.localStorage.removeItem(STORAGE_QUEUE); } catch (_) { /* noop */ }
        renderQueue();
        // Restored rows would otherwise sit idle forever — nothing else kicks the pump.
        if (downloadQueue.length > 0 && !queueProcessing) processQueue();
    }

    // Tokens expire; a restored entry has none. Refresh inline before its fetch.
    function ensureEntryToken(entry) {
        if (entry.token) return Promise.resolve();
        return new Promise((resolve) => {
            getApiClient(0, 10, (client) => {
                entry.token = client.accessToken();
                resolve();
            }, () => resolve());
        });
    }

    // A reload mid-download kills the transfer; say so instead of silently dropping it.
    window.addEventListener('beforeunload', (e) => {
        if (downloadQueue.some(en => en.status === 'active')) {
            persistWaitingQueue();
            e.preventDefault();
            e.returnValue = '';
        }
    });

    function enqueue(entry) {
        downloadQueue.push(entry);
        persistWaitingQueue();
        renderQueue();
        if (!queueProcessing) processQueue();
    }

    function removeFromQueue(id) {
        const idx = downloadQueue.findIndex(e => e.id === id);
        if (idx === -1) return;
        const entry = downloadQueue[idx];
        if (entry.status === 'active' && entry.abortController) {
            entry.abortController.abort();
        }
        downloadQueue.splice(idx, 1);
        persistWaitingQueue();
        renderQueue();
        // If we cancelled the active item, processQueue will be called by the fetch .finally
    }

    function retryQueueEntry(id) {
        const entry = downloadQueue.find(e => e.id === id);
        if (!entry || entry.status !== 'failed') return;
        if (entry.kind === 'subtitle') {
            // Sidecars are plain re-fetches of the same URL — no session to rebuild.
            entry.error = null;
        } else {
            if (!entry.spec) return;
            // Fresh session ids: reusing a PlaySessionId can resume a stale server job.
            const parts = buildDownloadParts(entry.spec);
            entry.url = parts.url;
            entry.stopUrl = parts.stopUrl;
            entry.filename = parts.filename;
            entry.estimatedBytes = parts.estimatedBytes;
            entry.error = null;
        }
        entry.receivedBytes = 0;
        entry.status = 'waiting';
        entry.abortController = null;
        persistWaitingQueue();
        renderQueue();
        if (!queueProcessing) processQueue();
    }

    async function downloadSidecar(entry) {
        await ensureEntryToken(entry);
        const init = {};
        if (entry.token) init.headers = authHeaders(entry.token);
        const response = await fetch(entry.url, init);
        if (!response.ok) {
            const httpError = new Error(`HTTP ${response.status}`);
            httpError.status = response.status;
            throw httpError;
        }
        // Batch sidecars stream into the same Series/Season folder as their episode;
        // single-download sidecars are tiny enough for the in-memory path.
        if (entry.dirHandle) {
            const writable = await openBatchFile(entry);
            await saveStreamToDisk(response.body, writable, 0, entry);
            return;
        }
        const buf = await response.arrayBuffer();
        if (!buf.byteLength) throw new Error('Transcode produced no data');
        triggerBlobDownload(new Blob([buf], { type: 'text/plain;charset=utf-8' }), entry.filename);
    }

    async function processQueue() {
        if (queueProcessing) return;
        if (!downloadQueue.some(e => e.status === 'waiting')) return;

        queueProcessing = true;
        for (;;) {
            const entry = downloadQueue.find(e => e.status === 'waiting');
            if (!entry) break;
            // Subtitle sidecars are tiny direct fetches, not transcodes.
            if (entry.kind === 'subtitle') {
                entry.status = 'active';
                renderQueue();
                try {
                    await downloadSidecar(entry);
                } catch (err) {
                    entry.status = 'failed';
                    entry.error = describeFailure(entry, err);
                    entry.abortController = null;
                    persistWaitingQueue();
                    renderQueue();
                    continue;
                }
                const idx = downloadQueue.indexOf(entry);
                if (idx !== -1) downloadQueue.splice(idx, 1);
                persistWaitingQueue();
                renderQueue();
                continue;
            }
            entry.status = 'active';
            entry.abortController = new AbortController();
            renderQueue();

            try {
                await ensureEntryToken(entry);
                const init = { signal: entry.abortController.signal };
                if (entry.token) init.headers = authHeaders(entry.token);
                const response = await fetch(entry.url, init);
                if (!response.ok) {
                    const httpError = new Error(`HTTP ${response.status}`);
                    httpError.status = response.status;
                    throw httpError;
                }
                if (entry.fileHandle || entry.dirHandle) {
                    // Stream straight to disk: no 2x-RAM Blob, phone-safe for 2 GB+ files.
                    const writable = entry.fileHandle
                        ? await entry.fileHandle.createWritable()
                        : await openBatchFile(entry);
                    await saveStreamToDisk(response.body, writable, entry.estimatedBytes, entry);
                    updateEntryProgress(entry, 1, entry.estimatedBytes);
                } else {
                    const blob = await readStream(response.body, entry.estimatedBytes, entry, entry.mimeType);
                    triggerBlobDownload(blob, entry.filename);
                    updateEntryProgress(entry, 1, entry.estimatedBytes);
                }
                await new Promise(r => setTimeout(r, 1000));

                // Success: job done, clean up and drop the row.
                stopActiveEncoding(entry);
                showTransientNotice(`Saved ${entry.filename}`);
                const idx = downloadQueue.indexOf(entry);
                if (idx !== -1) downloadQueue.splice(idx, 1);
            } catch (err) {
                if (err.name === 'AbortError') {
                    // Cancelled by the user: drop the row like before.
                    stopActiveEncoding(entry);
                    const idx = downloadQueue.indexOf(entry);
                    if (idx !== -1) downloadQueue.splice(idx, 1);
                } else {
                    // Failed: stop the server job but KEEP the row with the reason,
                    // so the user can retry instead of re-picking codec and tier.
                    console.error('[TranscodeDownloader] Download failed:', err);
                    stopActiveEncoding(entry);
                    entry.status = 'failed';
                    entry.error = describeFailure(entry, err);
                    entry.abortController = null;
                }
            }
            persistWaitingQueue();
            renderQueue();
        }
        queueProcessing = false;
    }

    // An HTTP status means the server rejected the request outright, which disproves "the
    // encoder failed to start" — so it always wins over the codec heuristic. Only a request the
    // server accepted and then failed to deliver a single byte for points at an encoder that
    // Jellyfin resolves to but FFmpeg does not actually have.
    function describeFailure(entry, err) {
        if (err && err.status) return t('DownloadFailedStatus').replace('{status}', err.status);
        if (!entry.receivedBytes && entry.videoCodec && entry.videoCodec !== DEFAULT_VIDEO_CODEC) {
            return t('DownloadFailedCodec').replace('{codec}', codecLabel(VIDEO_CODECS, entry.videoCodec));
        }
        return t('DownloadFailed');
    }

    // --- Stream reader ---

    async function saveStreamToDisk(body, writable, estimatedBytes, entry) {
        const reader = body.getReader();
        let received = 0;
        try {
            for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                await writable.write(value);
                received += value.byteLength;
                entry.receivedBytes = received;
                updateEntryProgress(entry, estimatedBytes ? received / estimatedBytes : 0, estimatedBytes, received);
            }
            if (received === 0) throw new Error('Transcode produced no data');
            await writable.close();
        } catch (err) {
            try { await writable.abort(); } catch (_) { /* already closed */ }
            throw err;
        } finally {
            try { reader.releaseLock(); } catch (_) { /* noop */ }
        }
    }

    async function readStream(body, estimatedBytes, entry, mimeType) {
        const reader = body.getReader();
        const chunks = [];
        let received = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.byteLength;
            entry.receivedBytes = received;
            updateEntryProgress(entry, received / estimatedBytes, estimatedBytes, received);
        }

        // A transcode that dies on startup can still return 200 and then close the stream
        // immediately. Without this, the user gets a 0-byte .mp4 reported as a success.
        if (received === 0) throw new Error('Transcode produced no data');

        return new Blob(chunks, { type: mimeType || 'video/mp4' });
    }

    // Batch downloads land in Series/Season XX/ folders. The directory handle comes
    // from a single picker gesture; subfolders and files are created on demand.
    async function openBatchFile(entry) {
        let dir = entry.dirHandle;
        for (const part of entry.dirPath || []) {
            dir = await dir.getDirectoryHandle(sanitizeFilename(part, 'Unknown'), { create: true });
        }
        const fh = await dir.getFileHandle(entry.filename, { create: true });
        return fh.createWritable();
    }

    // --- Queue panel UI ---

    function injectQueuePanel() {
        if (document.getElementById('qd-queue-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'qd-queue-panel';
        panel.className = 'qd-panel';
        panel.style.display = 'none';

        const list = document.createElement('div');
        list.id = 'qd-queue-list';
        list.style.cssText = 'max-height:40dvh;overflow-y:auto;';
        panel.appendChild(list);

        document.body.appendChild(panel);
    }

    function renderQueue() {
        const panel = document.getElementById('qd-queue-panel');
        const list = document.getElementById('qd-queue-list');
        if (!panel || !list) return;

        if (downloadQueue.length === 0) {
            panel.style.display = 'none';
            return;
        }

        panel.style.display = 'block';

        // Remove rows for entries that are no longer in the queue
        Array.from(list.children).forEach(row => {
            const entryId = row.dataset.entryId;
            if (!downloadQueue.find(e => e.id === entryId)) row.remove();
        });

        // Add rows for new entries and update status of existing ones
        downloadQueue.forEach((entry, i) => {
            let row = list.querySelector(`[data-entry-id="${entry.id}"]`);

            if (!row) {
                // Build the row for the first time
                row = document.createElement('div');
                row.dataset.entryId = entry.id;
                row.className = 'qd-row';

                const top = document.createElement('div');
                top.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;';

                const name = document.createElement('div');
                name.className = 'qd-rowname';
                name.textContent = entry.filename;

                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = '✕';
                cancelBtn.className = 'qd-xbtn';
                cancelBtn.setAttribute('aria-label', 'Cancel download');
                cancelBtn.addEventListener('click', () => removeFromQueue(entry.id));

                const retryBtn = document.createElement('button');
                retryBtn.textContent = t('RetryDownload');
                retryBtn.className = 'qd-retrybtn';
                retryBtn.style.display = 'none';
                retryBtn.addEventListener('click', () => retryQueueEntry(entry.id));

                top.appendChild(name);
                top.appendChild(retryBtn);
                top.appendChild(cancelBtn);
                row.appendChild(top);

                // Codec + bitrate, so several queued items of the same title stay distinguishable
                if (entry.codecLabel) {
                    const meta = document.createElement('div');
                    meta.className = 'qd-rowmeta';
                    meta.textContent = entry.codecLabel;
                    row.appendChild(meta);
                }

                // Progress bar (always created; hidden for waiting items)
                const track = document.createElement('div');
                track.className = 'qd-track';
                track.style.display = 'none';
                const fill = document.createElement('div');
                fill.id = `qd-fill-${entry.id}`;
                fill.className = 'qd-fill';
                track.appendChild(fill);
                row.appendChild(track);

                const statusEl = document.createElement('div');
                statusEl.id = `qd-status-${entry.id}`;
                statusEl.className = 'qd-status';
                row.appendChild(statusEl);

                // Insert at correct position
                const sibling = list.children[i];
                if (sibling) list.insertBefore(row, sibling);
                else list.appendChild(row);
            }

            // Update active/waiting/failed appearance without touching the fill width
            const track = row.querySelector('.qd-track');
            const statusEl = row.querySelector(`#qd-status-${entry.id}`);
            const retryBtn = row.querySelector('.qd-retrybtn');
            const pos = downloadQueue.findIndex(e => e.id === entry.id);
            const queuePos = pos >= 0 ? ` · ${pos + 1} of ${downloadQueue.length}` : '';
            statusEl.className = 'qd-status ' + (entry.status === 'failed' ? 'failed'
                : entry.status === 'waiting' ? 'waiting' : '');
            if (entry.status === 'active') {
                if (track) track.style.display = 'block';
                if (retryBtn) retryBtn.style.display = 'none';
            } else if (entry.status === 'failed') {
                if (track) track.style.display = 'none';
                if (statusEl) statusEl.textContent = entry.error || t('DownloadFailed');
                if (retryBtn) retryBtn.style.display = '';
            } else {
                if (track) track.style.display = 'none';
                if (statusEl) statusEl.textContent = `${t('Waiting')}${queuePos}`;
                if (retryBtn) retryBtn.style.display = 'none';
            }
        });
    }

    function updateEntryProgress(entry, ratio, estimatedBytes, receivedBytes) {
        const fill = document.getElementById(`qd-fill-${entry.id}`);
        const statusEl = document.getElementById(`qd-status-${entry.id}`);
        if (!fill || !statusEl) return;

        const receivedMB = receivedBytes != null ? (receivedBytes / 1_048_576).toFixed(1) : null;
        if (!estimatedBytes) {
            // Runtime unknown: show bytes only, never NaN%.
            fill.style.width = receivedMB != null ? '100%' : '0%';
            statusEl.textContent = receivedMB != null ? `${receivedMB} MB downloaded` : '';
            return;
        }
        const pct = Math.min(Math.round(ratio * 100), 100);
        fill.style.width = pct + '%';

        const estimatedMB = (estimatedBytes / 1_048_576).toFixed(1);
        statusEl.textContent = receivedMB != null
            ? `${receivedMB} MB / ~${estimatedMB} MB · ${pct}%`
            : `~${estimatedMB} MB · ${pct}%`;
    }

    function updateEntryStatus(entry, text) {
        const statusEl = document.getElementById(`qd-status-${entry.id}`);
        if (statusEl) statusEl.textContent = text;
    }

    // --- Jellyfin Android app (WebView) handoff ---

    // The Jellyfin Android app hosts jellyfin-web in a WebView that registers no
    // DownloadListener — org.jellyfin.mobile has none anywhere, because its own Download button
    // goes through the NativeInterface.downloadFiles bridge, which takes item ids and resolves
    // the URL natively. A WebView with no DownloadListener silently discards every download the
    // page starts, so the blob <a download> click below vanishes: the transcode streams to 100%,
    // no file is written and nothing is logged. NativeShell.openUrl fires an ACTION_VIEW intent
    // and the system browser downloads the URL instead, which is the only path that works inside
    // the app. See issue #33.
    function isAndroidAppWebView() {
        const shell = window.NativeShell;
        if (!shell || typeof shell.openUrl !== 'function') return false;
        // The desktop shell defines NativeShell too and saves blobs perfectly well; NativeInterface
        // is the Android app's own JS bridge, so it is what distinguishes the two.
        if (!window.NativeInterface || typeof window.NativeInterface.openUrl !== 'function') return false;
        return /Android/i.test(navigator.userAgent || '');
    }

    // Handing the URL over ends this page's involvement: the browser owns the transfer, so there
    // is no progress, no cancel and no filename of ours — the file lands under the request path
    // as stream.mp4 because Jellyfin's stream endpoint sends no Content-Disposition.
    function handOffToBrowser(url, baseUrl, deviceId, playSessionId) {
        try {
            window.NativeShell.openUrl(url);
        } catch (err) {
            console.error('[TranscodeDownloader] browser handoff failed:', err);
            showTransientNotice(t('BrowserHandoffFailed'));
            return;
        }
        rememberPendingStop(baseUrl, deviceId, playSessionId);
        showTransientNotice(t('BrowserHandoffStarted'));
    }

    // The queue panel only renders queued entries, and a handoff never becomes one — this is the
    // only feedback the user gets that anything happened at all.
    function showTransientNotice(text) {
        const existing = document.getElementById('qd-notice');
        if (existing) existing.remove();

        const notice = document.createElement('div');
        notice.id = 'qd-notice';
        notice.className = 'qd-notice';
        notice.setAttribute('role', 'status');
        notice.textContent = text;
        document.body.appendChild(notice);
        setTimeout(() => notice.remove(), 8000);
    }

    function triggerBlobDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }

    // --- Item metadata ---

    function extractItemId(hash) {
        const queryStart = hash.indexOf('?');
        if (queryStart === -1) return null;
        const params = new URLSearchParams(hash.slice(queryStart));
        return params.get('id');
    }

    // Item ids are 32 hex digits; menu entries carry a command name in the same attribute
    // (`data-id="download"`), so every candidate has to be shape-checked before it is trusted.
    function isItemId(value) {
        return typeof value === 'string' && /^[0-9a-f]{32}$/i.test(value.replace(/-/g, ''));
    }

    // The item the *next* action sheet will act on, or null when the trigger carried no item.
    let contextMenuItemId = null;

    // An action sheet is not always about the item in the address bar: the episode rows of a
    // season or series page each open one for their own episode, and Jellyfin resolves that
    // item from the closest ancestor carrying data-id (shortcuts.js → getItem). Mirroring that
    // lookup keeps our entry pointed at the same item Jellyfin's own Download entry uses;
    // without it a season page downloads /Videos/{seasonId}/… and the server throws.
    function recordContextMenuTarget(event) {
        const target = event.target;
        const holder = target && typeof target.closest === 'function' ? target.closest('[data-id]') : null;
        const id = holder ? holder.getAttribute('data-id') : null;
        contextMenuItemId = isItemId(id) ? id : null;
    }

    // Consumed on injection: a sheet opened by anything we did not see (so the id would be
    // stale) falls back to the address bar, which is right for detail pages — their More button
    // has no data-id ancestor at all.
    function takeContextMenuItemId() {
        const id = contextMenuItemId;
        contextMenuItemId = null;
        return id;
    }

    function peekContextMenuItemId() {
        return contextMenuItemId;
    }

    function getApiClient(attempt, maxAttempts, callback, onFail) {
        if (window.ApiClient && window.ApiClient.accessToken && window.ApiClient.getCurrentUserId) {
            callback(window.ApiClient);
        } else if (attempt < maxAttempts) {
            setTimeout(() => getApiClient(attempt + 1, maxAttempts, callback, onFail), 500);
        } else {
            console.error('[TranscodeDownloader] ApiClient not available after retries');
            if (onFail) onFail();
        }
    }

    // --- Codec capabilities ---

    // Jellyfin serialises with PascalCase; tolerate camelCase so the contract survives a
    // serializer change without breaking the client.
    function readField(obj, name) {
        if (!obj) return undefined;
        if (obj[name] !== undefined) return obj[name];
        return obj[name.charAt(0).toLowerCase() + name.slice(1)];
    }

    function parseCapabilityList(list) {
        const map = {};
        (list || []).forEach((entry) => {
            const id = readField(entry, 'Codec');
            if (!id) return;
            map[String(id).toLowerCase()] = {
                encoder: readField(entry, 'Encoder') || '',
                hardware: readField(entry, 'IsHardware') === true,
                supported: readField(entry, 'IsSupported') === true,
                allowed: readField(entry, 'IsAllowedByAdmin') === true,
            };
        });
        return map;
    }

    function readStoredCodec(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (_) {
            return null;
        }
    }

    function storeCodec(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (_) {
            // localStorage can be unavailable (private mode, sandboxed iframe) — preference
            // simply won't stick.
        }
    }

    // Why a codec cannot be used, or null when it can.
    function codecBlockReason(kind, id) {
        if (!codecCapabilities) return null;
        const capability = codecCapabilities[kind][id];
        if (!capability) return 'unsupported';
        if (!capability.allowed) return 'admin';
        if (!capability.supported) return 'unsupported';
        return null;
    }

    function codecReasonText(reason) {
        return reason === 'admin' ? t('CodecDisabledByAdmin') : t('CodecUnsupported');
    }

    function isCodecSelectable(kind, id) {
        const catalogue = kind === 'video' ? VIDEO_CODECS : AUDIO_CODECS;
        return !!findCodec(catalogue, id) && codecBlockReason(kind, id) === null;
    }

    function firstSelectableCodec(kind) {
        const catalogue = kind === 'video' ? VIDEO_CODECS : AUDIO_CODECS;
        const codec = catalogue.find(candidate => isCodecSelectable(kind, candidate.id));
        return codec ? codec.id : null;
    }

    // A stored preference is only honoured if the server still offers that codec.
    function resolveCodecPreference(kind, storageKey, fallback) {
        const stored = readStoredCodec(storageKey);
        if (stored && isCodecSelectable(kind, stored)) return stored;
        if (isCodecSelectable(kind, fallback)) return fallback;
        return firstSelectableCodec(kind) || fallback;
    }

    function selectCodec(kind, id) {
        if (kind === 'video') {
            selectedVideoCodec = id;
            storeCodec(STORAGE_VIDEO_CODEC, id);
        } else {
            selectedAudioCodec = id;
            storeCodec(STORAGE_AUDIO_CODEC, id);
        }
    }

    // Fetched lazily on first quality-sheet open. Only a *successful* probe is memoised for
    // the page session: a failed one drops the cached promise so the next sheet retries,
    // rather than hiding the picker until the tab is reloaded.
    function fetchCodecCapabilities() {
        if (codecCapabilitiesPromise) return codecCapabilitiesPromise;

        let probeFailed = false;

        const probe = new Promise((resolve) => {
            const giveUp = (err) => {
                console.warn('[TranscodeDownloader] Codec capabilities unavailable, falling back to H.264/AAC:', err);
                codecCapabilities = null;
                codecCapabilitiesResolved = false;
                selectedVideoCodec = DEFAULT_VIDEO_CODEC;
                selectedAudioCodec = DEFAULT_AUDIO_CODEC;
                probeFailed = true;
                resolve();
            };

            getApiClient(0, 10, async (client) => {
                try {
                    const baseUrl = client.serverAddress() || window.location.origin;
                    const res = await fetch(`${baseUrl}/TranscodeDownloader/Codecs`, {
                        headers: authHeaders(client.accessToken()),
                    });
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const payload = await res.json();

                    codecCapabilities = {
                        video: parseCapabilityList(readField(payload, 'VideoCodecs')),
                        audio: parseCapabilityList(readField(payload, 'AudioCodecs')),
                    };
                    codecCapabilitiesResolved = true;
                    selectedVideoCodec = resolveCodecPreference('video', STORAGE_VIDEO_CODEC, DEFAULT_VIDEO_CODEC);
                    selectedAudioCodec = resolveCodecPreference('audio', STORAGE_AUDIO_CODEC, DEFAULT_AUDIO_CODEC);
                    resolve();
                } catch (err) {
                    giveUp(err);
                }
            }, () => giveUp(new Error('ApiClient unavailable')));
        });

        codecCapabilitiesPromise = probe;

        // Runs as a microtask, so it is ordered after the assignment above even when the
        // probe fails synchronously inside the executor.
        probe.then(() => {
            if (probeFailed && codecCapabilitiesPromise === probe) codecCapabilitiesPromise = null;
        });

        return probe;
    }

    let currentItemId = null;
    let currentItemPromise = null;

    function fetchItemMetadata(itemId) {
        return new Promise((resolve) => {
            getApiClient(0, 10, async (client) => {
                try {
                    const userId = client.getCurrentUserId();
                    resolve(await client.getItem(userId, itemId));
                } catch (err) {
                    console.error('[TranscodeDownloader] Metadata fetch failed:', err);
                    resolve(null);
                }
            }, () => resolve(null));
        });
    }

    // Prefetched for the item on screen; a sheet opened for any other item fetches its own.
    function itemMetadata(itemId) {
        if (itemId === currentItemId && currentItemPromise) return currentItemPromise;
        return fetchItemMetadata(itemId);
    }

    // A season, a series or a song has no video stream to re-encode. Jellyfin's own Download
    // entry sits next to ours in the same sheet for those items, so the sheet alone is no
    // guarantee that /Videos/{id}/stream.mp4 means anything — a season id makes the server
    // throw while it resolves media sources. An absent MediaType is treated as playable so a
    // sparse DTO never blocks a download that used to work.
    function isTranscodable(item) {
        if (!item || item.IsFolder === true) return false;
        return !item.MediaType || item.MediaType === 'Video';
    }

    function onHashChange() {
        const hash = window.location.hash;
        if (!hash.startsWith('#/details')) return;

        const itemId = extractItemId(hash);
        if (!itemId) return;

        currentItemId = itemId;
        currentItemPromise = fetchItemMetadata(itemId);
    }

    // --- Action sheet menu injection ---

    function makeMenuItem(icon, label, onClick) {
        const btn = document.createElement('button');
        btn.setAttribute('is', 'emby-button');
        btn.setAttribute('type', 'button');
        btn.className = 'listItem listItem-button actionSheetMenuItem emby-button';
        btn.setAttribute('data-id', 'qd-' + label.replace(/\s+/g, '-').toLowerCase());

        const iconSpan = document.createElement('span');
        iconSpan.className = `actionsheetMenuItemIcon listItemIcon listItemIcon-transparent material-icons ${icon}`;
        iconSpan.setAttribute('aria-hidden', 'true');

        const body = document.createElement('div');
        body.className = 'listItemBody actionsheetListItemBody';
        const text = document.createElement('div');
        text.className = 'listItemBodyText actionSheetItemText';
        text.textContent = label;
        body.appendChild(text);

        btn.appendChild(iconSpan);
        btn.appendChild(body);
        btn.addEventListener('click', onClick);
        return btn;
    }

    function injectMenuItems(downloadBtn) {
        if (downloadBtn.parentNode.querySelector('[data-id^="qd-"]')) return;

        // Bound now, while the sheet's trigger is still known — by the time the entry is
        // clicked the click target is the entry itself.
        const itemId = takeContextMenuItemId() || extractItemId(window.location.hash);
        if (!itemId) return;

        const transcodeBtn = makeMenuItem('video_settings', t('DownloadTranscode'), () => {
            closeActiveSheet();
            showQualitySheet(itemId);
        });

        downloadBtn.insertAdjacentElement('afterend', transcodeBtn);
    }

    function closeActiveSheet() {
        const backdrop = document.querySelector('.actionSheetScrim, .dialogBackdrop, .mdl-overlay');
        if (backdrop) backdrop.click();
    }

    // --- Codec selector ---

    function makeCodecChip(kind, codec, onSelect) {
        const reason = codecBlockReason(kind, codec.id);
        const selected = (kind === 'video' ? selectedVideoCodec : selectedAudioCodec) === codec.id;

        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'qd-chip';
        chip.setAttribute('data-id', `qd-codec-${kind}-${codec.id}`);
        chip.textContent = codec.label;

        if (reason) {
            chip.disabled = true;
            chip.title = codecReasonText(reason);
        } else {
            chip.setAttribute('aria-pressed', selected ? 'true' : 'false');
            chip.addEventListener('click', () => onSelect(codec.id));
        }

        return chip;
    }

    function buildCodecRow(catalogue, kind, label, onSelect) {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'margin-bottom:16px;';

        const title = document.createElement('div');
        title.className = 'qd-section-title';
        title.style.marginTop = '0';
        title.textContent = label;
        wrap.appendChild(title);

        const chips = document.createElement('div');
        chips.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;';
        catalogue.forEach(codec => chips.appendChild(makeCodecChip(kind, codec, onSelect)));
        wrap.appendChild(chips);

        // Unavailable codecs stay visible with the reason spelled out — a silent absence is
        // impossible for a user to self-diagnose.
        catalogue.forEach((codec) => {
            const reason = codecBlockReason(kind, codec.id);
            if (!reason) return;
            const note = document.createElement('div');
            note.className = 'qd-note';
            note.textContent = `${codec.label} — ${codecReasonText(reason)}`;
            wrap.appendChild(note);
        });

        return wrap;
    }

    // Warn when the selected codec resolves to a software encoder. x264 is the status quo and
    // fast enough; libx265 and especially libsvtav1 can run for hours, and the whole file is
    // held in memory until the transcode finishes.
    function buildSoftwareEncodingHint() {
        if (!codecCapabilities || selectedVideoCodec === DEFAULT_VIDEO_CODEC) return null;
        const capability = codecCapabilities.video[selectedVideoCodec];
        if (!capability || capability.hardware) return null;

        const hint = document.createElement('div');
        hint.className = 'qd-warn';
        hint.style.marginTop = '10px';
        hint.textContent = t('SoftwareEncodingHint');
        return hint;
    }

    function buildCodecSection(onCodecChange) {
        const section = document.createElement('div');
        section.style.cssText = 'margin:0;';

        const render = () => {
            section.textContent = '';
            const onSelect = (kind) => (id) => {
                selectCodec(kind, id);
                render();
                onCodecChange();
            };
            section.appendChild(buildCodecRow(VIDEO_CODECS, 'video', t('ChooseVideoCodec'), onSelect('video')));
            section.appendChild(buildCodecRow(AUDIO_CODECS, 'audio', t('ChooseAudioCodec'), onSelect('audio')));
            const hint = buildSoftwareEncodingHint();
            if (hint) section.appendChild(hint);
        };

        render();
        return section;
    }

    // --- Quality overlay ---


        // Drag handle: pull down to dismiss (mobile bottom-sheet behaviour).
    // (Implemented once in addSheetChrome, above.)
    function addSheetChrome(sheet, scrim) {
        sheet.style.position = 'relative';
        const grip = document.createElement('div');
        grip.className = 'qd-grip';
        const gripBar = document.createElement('div');
        gripBar.className = 'qd-grip-bar';
        grip.appendChild(gripBar);
        sheet.insertBefore(grip, sheet.firstChild);
        let dragStartY = null;
        grip.addEventListener('pointerdown', (e) => {
            dragStartY = e.clientY;
            try { grip.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
            sheet.style.transition = 'none';
        });
        grip.addEventListener('pointermove', (e) => {
            if (dragStartY == null) return;
            sheet.style.transform = `translateY(${Math.max(0, e.clientY - dragStartY)}px)`;
        });
        const endDrag = (e) => {
            if (dragStartY == null) return;
            const dy = e.clientY - dragStartY;
            dragStartY = null;
            sheet.style.transition = 'transform 0.2s ease-out';
            if (dy > 120) scrim.remove();
            else sheet.style.transform = '';
        };
        grip.addEventListener('pointerup', endDrag);
        grip.addEventListener('pointercancel', () => { dragStartY = null; sheet.style.transform = ''; });
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'qd-close';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => scrim.remove());
        sheet.appendChild(closeBtn);
        const escHandler = (e) => {
            if (e.key === 'Escape' && document.contains(scrim)) {
                scrim.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
    async function showQualitySheet(itemId, batchOpt) {
        if (document.getElementById('qd-quality-sheet')) return;

        // Ensure strings are loaded before rendering UI
        if (stringsPromise) await stringsPromise;

        const metadataPromise = itemMetadata(itemId);

        // Runs alongside the metadata fetch; memoised for the rest of the page session.
        const capabilitiesPromise = fetchCodecCapabilities();

        const scrim = document.createElement('div');
        scrim.id = 'qd-quality-sheet';
        scrim.className = 'qd-scrim';
        scrim.addEventListener('click', (e) => { if (e.target === scrim) scrim.remove(); });

        const sheet = document.createElement('div');
        sheet.className = 'qd-sheet';
        sheet.style.position = 'relative';

        const header = document.createElement('div');
        header.className = 'qd-title';
        header.textContent = batchOpt && batchOpt.title
            ? `${batchOpt.title} — ${t('ChooseQuality')}`
            : t('ChooseQuality');
        sheet.appendChild(header);

        addSheetChrome(sheet, scrim);

        const loadingEl = document.createElement('div');
        loadingEl.style.cssText = 'padding:16px 20px;color:#aaa;font-size:14px;';
        loadingEl.textContent = t('LoadingMediaInfo');
        sheet.appendChild(loadingEl);


        scrim.appendChild(sheet);
        document.body.appendChild(scrim);

        const item = await metadataPromise;
        await capabilitiesPromise;
        if (!document.getElementById('qd-quality-sheet')) return;

        loadingEl.remove();

        // A sheet can be opened for an item with nothing to transcode (a season, a series);
        // saying so beats firing a request the server can only fail. A metadata fetch that
        // failed outright is reported as "no options" instead of a wrong claim about the type.
        if (!isTranscodable(item)) {
            const notice = document.createElement('div');
            notice.style.cssText = 'padding:16px 20px;color:#aaa;font-size:14px;';
            notice.textContent = item ? t('ItemNotTranscodable') : t('NoTranscodeOptions');
            sheet.appendChild(notice);
            return;
        }

        resetTrackSelections();
        const mediaSources = (item && item.MediaSources) || [];
        let currentSource = mediaSources[0] || null;

        // Rungs follow the selected media source: multi-version items (4K + 1080p)
        // would otherwise filter tiers against the wrong bitrate.
        const sheetTiers = () => (currentSource && currentSource.Bitrate)
            ? QUALITY_TIERS.filter(tier => tier.bitrate <= currentSource.Bitrate)
            : QUALITY_TIERS;

        // Human-readable track labels. Never leaks "undefined"/"und": prefers the
        // server's DisplayTitle, then language + codec, then a bare track fallback.
        function trackLabel(s) {
            const ch = s.Channels ? ` ${s.Channels}ch` : '';
            if (s.DisplayTitle) return `${s.DisplayTitle}${ch}`;
            if (s.Title) return `${s.Title}${ch}`;
            const lang = s.Language || s.DisplayLanguage || '';
            const hasLang = lang && lang.toLowerCase() !== 'und';
            const codec = s.Codec || '';
            if (hasLang && codec) return `${lang} ${codec}${ch}`;
            if (hasLang) return `${lang}${ch}`;
            if (codec) return `${codec} track${ch}`;
            return `Track ${s.Index}${ch}`;
        }

        function initTrackDefaults(src) {
            const streams = (src && src.MediaStreams) || [];
            const audios = streams.filter(s => s.Type === 'Audio');
            const subs = streams.filter(s => s.Type === 'Subtitle');
            const defAudio = audios.find(s => s.IsDefault) || audios[0] || null;
            selectedAudioChecked = new Set(defAudio ? [defAudio.Index] : []);
            selectedAudioLanguage = (defAudio && (defAudio.Language || defAudio.DisplayLanguage)) || null;
            if (subs.length === 0) {
                selectedSubtitleChecked = new Set();
                selectedSubtitleLanguage = null;
            } else {
                // Burn-in is the default: the only faithful path for styled ASS and
                // image subs (PGS), which dominate anime libraries.
                selectedSubtitleMode = 'burn';
                const defSub = subs.find(s => s.IsDefault)
                    || subs.find(s => (s.Language || '').toLowerCase().startsWith('eng'))
                    || subs[0];
                selectedSubtitleChecked = new Set(defSub ? [defSub.Index] : []);
                selectedSubtitleLanguage = (defSub && (defSub.Language || defSub.DisplayLanguage)) || null;
            }
        }

        function selectRow(labelText, options, currentValue, onPick) {
            const wrap = document.createElement('div');
            const title = document.createElement('div');
            title.className = 'qd-section-title';
            title.style.marginTop = '0';
            title.textContent = labelText;
            wrap.appendChild(title);
            const sel = document.createElement('select');
            sel.className = 'qd-select';
            options.forEach(o => {
                const opt = document.createElement('option');
                opt.value = o.value;
                opt.textContent = o.label;
                if (o.value === currentValue) opt.selected = true;
                sel.appendChild(opt);
            });
            sel.addEventListener('change', () => onPick(sel.value === '' ? null : Number(sel.value)));
            wrap.appendChild(sel);
            return wrap;
        }

        // Generic chip row (container, subtitle mode): single choice.
        function chipRow(labelText, options, currentId, onPick) {
            const wrap = document.createElement('div');
            if (labelText) {
                const title = document.createElement('div');
                title.className = 'qd-section-title';
                title.textContent = labelText;
                wrap.appendChild(title);
            }
            const chips = document.createElement('div');
            chips.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;';
            options.forEach(o => {
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'qd-chip';
                chip.textContent = o.label;
                const active = currentId === o.id;
                chip.setAttribute('aria-pressed', active ? 'true' : 'false');
                chip.addEventListener('click', () => onPick(o.id));
                chips.appendChild(chip);
            });
            wrap.appendChild(chips);
            return wrap;
        }

        // Track list: checkboxes for multi-pick, radios when `single` (burn-in takes
        // exactly one track). Rebuilt on mode toggle so the input type always matches.
        function checkList(labelText, noteText, tracks, checked, onToggle, single) {
            const wrap = document.createElement('div');
            if (labelText) {
                const title = document.createElement('div');
                title.className = 'qd-section-title';
                title.textContent = labelText;
                wrap.appendChild(title);
            }
            tracks.forEach(s => {
                const label = document.createElement('label');
                label.className = 'qd-check';
                const box = document.createElement('input');
                box.type = single ? 'radio' : 'checkbox';
                if (single) box.name = `qd-sub-${labelText || 'x'}`;
                box.checked = checked.has(s.Index);
                box.addEventListener('change', () => onToggle(s.Index, box.checked));
                const span = document.createElement('span');
                span.textContent = trackLabel(s);
                label.appendChild(box);
                label.appendChild(span);
                wrap.appendChild(label);
            });
            if (noteText) {
                const note = document.createElement('div');
                note.className = 'qd-note';
                note.textContent = noteText;
                wrap.appendChild(note);
            }
            return wrap;
        }

        function buildTrackSection() {
            const section = document.createElement('div');
            section.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
            const render = () => {
                section.textContent = '';
                const streams = (currentSource && currentSource.MediaStreams) || [];
                const audios = streams.filter(s => s.Type === 'Audio');
                const subs = streams.filter(s => s.Type === 'Subtitle');

                if (mediaSources.length > 1) {
                    section.appendChild(selectRow('Version', mediaSources.map((ms, i) => ({
                        value: i,
                        label: `${ms.Name || `Version ${i + 1}`}${ms.Size ? ` · ${(ms.Size / 1_000_000).toFixed(0)} MB` : ''}`,
                    })), mediaSources.indexOf(currentSource), (i) => {
                        currentSource = mediaSources[i == null ? 0 : i];
                        selectedMediaSourceId = currentSource.Id;
                        initTrackDefaults(currentSource);
                        render();
                        refreshTiers();
                        updateSourceInfo();
                    }));
                }

                // Container first: it constrains what the server can mux.
                section.appendChild(chipRow('Format', [
                    { id: 'mp4', label: 'MP4 · plays everywhere' },
                    { id: 'mkv', label: 'MKV · styled subs + chapters' },
                ], selectedContainer, (id) => {
                    selectedContainer = id;
                    render();
                    refreshTiers();
                }));

                if (audios.length > 0) {
                    const audioNote = audios.length > 1
                        ? 'First checked goes in the download; the rest queue as extra full files.'
                        : null;
                    section.appendChild(checkList('Audio tracks', audioNote, audios, selectedAudioChecked, (idx, on) => {
                        if (on) selectedAudioChecked.add(idx);
                        else selectedAudioChecked.delete(idx);
                        const primary = primaryChecked(audios, selectedAudioChecked);
                        selectedAudioLanguage = primary ? (primary.Language || primary.DisplayLanguage || null) : null;
                    }));
                }

                if (subs.length > 0) {
                    // Burn-in is a toggle: ON = exactly one track, burned in (radios);
                    // OFF = multi-pick, first checked embedded, rest as .srt sidecars.
                    // No "no subtitles" option — uncheck everything for that.
                    const burnOn = selectedSubtitleMode === 'burn';
                    const toggle = document.createElement('button');
                    toggle.type = 'button';
                    toggle.className = 'qd-toggle';
                    toggle.setAttribute('aria-pressed', burnOn ? 'true' : 'false');
                    const toggleLabel = document.createElement('span');
                    toggleLabel.textContent = 'Burn subtitles into video';
                    const toggleState = document.createElement('span');
                    toggleState.className = 'qd-onoff ' + (burnOn ? 'on' : 'off');
                    toggleState.textContent = burnOn ? 'ON' : 'OFF';
                    toggle.appendChild(toggleLabel);
                    toggle.appendChild(toggleState);
                    toggle.addEventListener('click', () => {
                        selectedSubtitleMode = burnOn ? 'embed' : 'burn';
                        render();
                        refreshTiers();
                    });
                    const subHead = document.createElement('div');
                    subHead.className = 'qd-section-title';
                    subHead.textContent = 'Subtitles';
                    section.appendChild(subHead);
                    section.appendChild(toggle);
                    const note = burnOn
                        ? 'Burn-in takes exactly one track — pick it below.'
                        : 'First checked is embedded in the file; the rest save as .srt sidecars. Uncheck all for no subtitles.';
                    section.appendChild(checkList('', note, subs, selectedSubtitleChecked, (idx, on) => {
                        let next;
                        if (burnOn) {
                            // Radio behaviour: exactly one.
                            next = on ? new Set([idx]) : new Set();
                        } else {
                            next = new Set(selectedSubtitleChecked);
                            if (on) next.add(idx);
                            else next.delete(idx);
                        }
                        selectedSubtitleChecked = next;
                        const primary = primaryChecked(subs, next);
                        selectedSubtitleLanguage = primary
                            ? (primary.Language || primary.DisplayLanguage || null) : null;
                        if (burnOn) render();
                    }, burnOn));
                }
            };
            render();
            return section;
        }

        if (currentSource) {
            selectedMediaSourceId = currentSource.Id;
            initTrackDefaults(currentSource);
        }
        sheet.appendChild(buildTrackSection());

        const durationSeconds = item.RunTimeTicks ? item.RunTimeTicks / 10_000_000 : 0;

        const infoEl = document.createElement('div');
        infoEl.className = 'qd-note';
        infoEl.style.margin = '8px 0 0';
        sheet.appendChild(infoEl);

        function updateSourceInfo() {
            infoEl.className = 'qd-note';
            infoEl.style.margin = '8px 0 0';
            const src = currentSource;
            const sourceMB = src && src.Size ? (src.Size / 1_000_000).toFixed(0) : null;
            infoEl.textContent = sourceMB ? `Original ~${sourceMB} MB on server` : '';
            const vStream = src && (src.MediaStreams || []).find(s => s.Type === 'Video');
            const range = vStream && (vStream.VideoRangeType || vStream.VideoRange);
            if (range && !['sdr', 'unknown'].includes(String(range).toLowerCase())) {
                infoEl.textContent += ` · ${range} source — downloads are tone-mapped to SDR.`;
                infoEl.className = 'qd-warn';
            }
            if (navigator.storage && navigator.storage.estimate) {
                navigator.storage.estimate().then(({ quota }) => {
                    if (!quota) return;
                    const freeGB = (quota / 1_000_000_000).toFixed(0);
                    infoEl.textContent += ` · Free on this device ~${freeGB} GB`;
                    const rungTiers = sheetTiers();
                    const biggest = rungTiers.length
                        ? scaleBitrate(Math.max(...rungTiers.map(x => x.bitrate)), videoCodecFactor(selectedVideoCodec)) * (durationSeconds || 0) / 8
                        : 0;
                    if (biggest > quota) {
                        infoEl.textContent += ' — biggest rung may not fit!';
                        infoEl.style.color = '#d0a24c';
                    }
                }).catch(() => { /* storage estimate unavailable */ });
            }
        }
        updateSourceInfo();

        const tierList = document.createElement('div');

        // Selection lives at sheet scope so codec/container toggles re-render tiers
        // without resetting it (only re-clamped if the scaled rung exceeds source).
        let pendingTier = null; // QUALITY_TIERS object; scaled at download time
        let tierTouched = false;
        const renderTiers = () => {
            tierList.textContent = '';
            const tiers = sheetTiers();
            const factor = videoCodecFactor(selectedVideoCodec);
            // Recommended = best quality at or under the phone sweet spot (4M H.264-equiv),
            // never exceeding the source. One tap for "best size for the quality".
            const cap = Math.min(
                currentSource && currentSource.Bitrate ? currentSource.Bitrate : Infinity,
                4_000_000);
            let recIdx = tiers.length - 1;
            tiers.forEach((t, i) => {
                if (scaleBitrate(t.bitrate, factor) <= cap) recIdx = i;
            });

            for (const [ti, tier] of tiers.entries()) {
                const bitrate = scaleBitrate(tier.bitrate, factor);
                const sizeHint = durationSeconds > 0 ? ` · ${formatSize(bitrate * durationSeconds / 8)}` : '';
                const star = ti === recIdx ? '★ ' : '';
                if (!tierTouched && !pendingTier && ti === recIdx) pendingTier = tier;
                const selected = pendingTier === tier;
                const btn = makeMenuItem('video_settings',
                    `${star}${tier.resolution} · ${formatBitrate(bitrate)}${sizeHint}`, () => {
                    pendingTier = tier;
                    tierTouched = true;
                    renderTiers();
                    refreshSummary();
                });
                btn.classList.add('qd-tier');
                if (selected) btn.classList.add('qd-tier-selected');
                btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
                tierList.appendChild(btn);
            }

            if (tiers.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'qd-note';
                empty.style.textAlign = 'center';
                empty.style.padding = '20px';
                empty.textContent = t('NoTranscodeOptions');
                tierList.appendChild(empty);
            }
        };

        // Apple players refuse hev1-tagged HEVC and ignore Opus-in-MP4. The server still
        // offers those codecs, so warn instead of hiding — the user may be downloading
        // for VLC on the same iPhone.
        const appleWarn = document.createElement('div');
        appleWarn.className = 'qd-warn';
        appleWarn.style.display = 'none';
        appleWarn.textContent = t('AppleCodecWarning');

        const refreshTiers = () => {
            renderTiers();
            const risky = selectedVideoCodec === 'hevc' || selectedAudioCodec === 'opus';
            const showWarn = risky || selectedContainer === 'mkv';
            appleWarn.style.display = showWarn ? '' : 'none';
            if (showWarn) {
                appleWarn.textContent = isApplePlayer()
                    ? t('AppleCodecWarning')
                        + (selectedContainer === 'mkv' ? ' MKV needs VLC or Infuse on Apple devices.' : '')
                    : 'Heads up if this file is for an iPhone/iPad/Apple TV: ' + t('AppleCodecWarning')
                        + (selectedContainer === 'mkv' ? ' MKV needs VLC or Infuse on Apple devices.' : '');
            }
            refreshSummary();
        };

        const summaryEl = document.createElement('div');
        summaryEl.className = 'qd-note';
        summaryEl.style.minHeight = '20px';
        const legendEl = document.createElement('div');
        legendEl.className = 'qd-note';
        legendEl.textContent = '★ best for phones — highest quality at or under ~4 Mbps. Sizes are estimates (±15% VBR).';
        const dlBtn = document.createElement('button');
        dlBtn.type = 'button';
        dlBtn.className = 'qd-btn';
        dlBtn.addEventListener('click', () => doDownload());

        const refreshSummary = () => {
            const count = batchOpt && batchOpt.episodes ? batchOpt.episodes.length : 0;
            dlBtn.textContent = batchOpt ? `Download ${count} episode${count === 1 ? '' : 's'}`
                : batchSeason ? 'Download season'
                : 'Download';
            const hasTiers = sheetTiers().length > 0;
            dlBtn.disabled = !pendingTier || !hasTiers;
            if (!hasTiers) {
                summaryEl.textContent = 'This source is below our smallest rung — no transcode options.';
                return;
            }
            if (!pendingTier) {
                summaryEl.textContent = 'Pick a quality above. ★ = best size-for-quality on phones (±15% VBR estimates).';
                return;
            }
            const bitrate = scaleBitrate(pendingTier.bitrate, videoCodecFactor(selectedVideoCodec));
            const size = durationSeconds > 0 ? formatSize(bitrate * durationSeconds / 8) : 'unknown size';
            let where;
            if (isAndroidAppWebView()) where = 'Opens in your browser to save.';
            else if (batchOpt || batchSeason) where = 'Saves into a folder you pick (Series/Season NN/).';
            else if (typeof window.showSaveFilePicker === 'function') where = 'Saves via file picker.';
            else where = 'Saves via automatic download.';
            summaryEl.textContent =
                `${pendingTier.resolution} · ${formatBitrate(bitrate)} · ${size} · ${where}`;
        };

        const doDownload = () => {
            if (!pendingTier) return;
            const tier = pendingTier;
            const bitrate = scaleBitrate(tier.bitrate, videoCodecFactor(selectedVideoCodec));
            const videoCodec = selectedVideoCodec;
            const audioCodec = selectedAudioCodec;
            scrim.remove();
            if (batchOpt && batchOpt.episodes) {
                startBatchReview(batchOpt.episodes, batchOpt.seriesTitle || '',
                    tier, bitrate, videoCodec, audioCodec);
            } else if (batchSeason) {
                getApiClient(0, 5, async (client) => {
                    const token = client.accessToken();
                    const baseUrl = client.serverAddress() || window.location.origin;
                    let eps = [];
                    try {
                        const res = await client.getItems(client.getCurrentUserId(), {
                            ParentId: item.SeasonId,
                            IncludeItemTypes: 'Episode',
                            Fields: 'MediaSources,ParentIndexNumber,IndexNumber,Name,SeriesName,RunTimeTicks,ProductionYear,Type',
                            SortBy: 'ParentIndexNumber,IndexNumber',
                            SortOrder: 'Ascending',
                            Recursive: true,
                        });
                        eps = (res && res.Items) || [];
                    } catch (err) {
                        console.error('[TranscodeDownloader] season fetch failed:', err);
                        showTransientNotice(t('DownloadFailed'));
                        return;
                    }
                    if (eps.length === 0) {
                        showTransientNotice(t('NoTranscodeOptions'));
                        return;
                    }
                    startBatchReview(eps, item.SeriesName || '', tier, bitrate, videoCodec, audioCodec);
                });
            } else {
                const tracks = resolveEpisodeTracks(item, currentSource,
                    selectedAudioChecked, selectedSubtitleChecked, selectedSubtitleMode);
                const streams = (currentSource && currentSource.MediaStreams) || [];
                const audios = streams.filter(s => s.Type === 'Audio');
                const subs = streams.filter(s => s.Type === 'Subtitle');
                const extraAudios = audios.filter(a =>
                    selectedAudioChecked.has(a.Index) && a.Index !== tracks.audioStreamIndex);
                const extraSubs = subs.filter(s =>
                    selectedSubtitleChecked.has(s.Index) && s.Index !== tracks.subtitleStreamIndex);
                onTranscodeMenuClick(tier, bitrate, item.Id || itemId, item, tracks,
                    { audios: extraAudios, subs: extraSubs });
            }
        };

        // Only offered when the server told us what it can encode; otherwise the flow stays
        // exactly as it was, on H.264/AAC.
        if (codecCapabilitiesResolved) {
            sheet.insertBefore(buildCodecSection(refreshTiers), header);
            sheet.insertBefore(appleWarn, header);
        }

        // Said before the choice, not after: picking a tier in the app leaves for the browser
        // immediately, and a transcode that surprises the user has already cost server time.
        if (isAndroidAppWebView()) {
            const handoffHint = document.createElement('div');
            handoffHint.style.cssText = 'padding:0 20px 8px;font-size:12px;color:#d0a24c;';
            handoffHint.textContent = t('BrowserHandoffHint');
            sheet.appendChild(handoffHint);
        }

        // Season batch: arm with this button, pick a quality, then Download —
        // every episode queues at that tier/codec with the same track languages.
        let batchSeason = false;
        if (item.Type === 'Episode' && item.SeasonId && !isAndroidAppWebView() && !batchOpt) {
            const batchBtn = makeMenuItem('video_library', 'Queue season…', () => {
                batchSeason = true;
                batchBtn.style.opacity = '0.5';
                refreshSummary();
                showTransientNotice('Season batch armed — pick a quality, then Download.');
            });
            sheet.appendChild(batchBtn);
        }

        if (typeof window.showSaveFilePicker !== 'function' && !isAndroidAppWebView()) {
            const memWarn = document.createElement('div');
            memWarn.className = 'qd-warn';
            memWarn.textContent = 'This browser holds the whole file in memory until the download finishes — keep this tab open. 1080p films can exceed 2 GB.';
            sheet.appendChild(memWarn);
        }
        refreshTiers();
        sheet.appendChild(tierList);
        sheet.appendChild(legendEl);
        sheet.appendChild(summaryEl);
        sheet.appendChild(dlBtn);
        refreshSummary();
    }

    // Batch enqueue with proper folders: each episode lands in
    // <chosen dir>/<SeriesName>/Season NN/<file>, mirroring Jellyfin's library layout.
    // One directory picker covers the whole batch; per-episode files stream to disk.
    // Extra subtitle languages, resolved per sheet against the current source.
    function extraSubtitleLangs(subs, primaryLang) {
        const out = [];
        const prim = (primaryLang || '').toLowerCase();
        for (const idx of selectedSubtitleChecked) {
            const s = subs.find(x => x.Index === idx);
            const lang = (s && (s.Language || s.DisplayLanguage) || '').toLowerCase();
            if (lang && lang !== prim && !out.includes(lang)) out.push(lang);
        }
        return out;
    }

    async function enqueueEpisodeBatch(client, token, baseUrl, dirHandle, episodes, tier, bitrate, videoCodec, audioCodec, seriesTitle, extraSubLangs) {
        let queued = 0;
        for (const ep of episodes) {
            const sources = ep.MediaSources || [];
            if (sources.length === 0) continue;
            const src = sources[0];
            const tracks = resolveEpisodeTracks(ep, src);
            // An emptied checklist means NO subtitles — even in burn mode.
            if (selectedSubtitleChecked.size === 0) {
                tracks.subtitleStreamIndex = null;
                tracks.subtitleMethod = null;
            }
            const spec = {
                baseUrl, itemId: ep.Id, tier, bitrate, item: ep, videoCodec, audioCodec,
                container: selectedContainer,
                mediaSourceId: tracks.mediaSourceId,
                audioStreamIndex: tracks.audioStreamIndex,
                subtitleStreamIndex: tracks.subtitleStreamIndex,
                subtitleMethod: tracks.subtitleMethod,
            };
            const parts = buildDownloadParts(spec);
            const seasonNo = Number.isFinite(Number(ep.ParentIndexNumber))
                ? String(ep.ParentIndexNumber).padStart(2, '0') : '??';
            enqueue({
                id: `${ep.Id}-${Date.now()}-${queued}`,
                spec,
                token,
                fileHandle: null,
                dirHandle,
                dirPath: [ep.SeriesName || seriesTitle || 'Unknown series', `Season ${seasonNo}`],
                filename: parts.filename,
                estimatedBytes: parts.estimatedBytes,
                url: parts.url,
                stopUrl: parts.stopUrl,
                videoCodec: parts.videoCodec,
                audioCodec: parts.audioCodec,
                mimeType: parts.mimeType,
                codecLabel: parts.codecLabel,
                receivedBytes: 0,
                abortController: null,
                status: 'waiting',
            });
            queued += 1;
            // Extra subtitle languages ride along as sidecars in the same folder.
            // (Extra audios stay single-download-only: one transcode carries one audio,
            // so multiplying them across a season would explode into N×M full encodes.)
            for (const lang of extraSubLangs || []) {
                const sub = (src.MediaStreams || []).find(s =>
                    s.Type === 'Subtitle' && ((s.Language || s.DisplayLanguage) || '').toLowerCase() === lang);
                if (!sub) continue;
                const subBase = parts.filename.replace(/\.(mp4|mkv)$/i, '');
                enqueue({
                    id: `${ep.Id}-sub${sub.Index}-${Date.now()}-${queued}`,
                    kind: 'subtitle',
                    spec: null,
                    token,
                    fileHandle: null,
                    dirHandle,
                    dirPath: [ep.SeriesName || seriesTitle || 'Unknown series', `Season ${seasonNo}`],
                    filename: `${subBase}.${lang}.srt`,
                    estimatedBytes: 0,
                    url: `${baseUrl}/Videos/${ep.Id}/${src.Id}/Subtitles/${sub.Index}/Stream.srt`,
                    stopUrl: null,
                    receivedBytes: 0,
                    abortController: null,
                    status: 'waiting',
                });
            }
        }
        showTransientNotice(`Queued ${queued} episode${queued === 1 ? '' : 's'}.`);
    }

    // Batch planning: resolve every episode's tracks up front so the user sees
    // exactly what each episode will get — per season — instead of discovering
    // gaps after hours of transcoding. Language choice is global; episodes whose
    // layout differs fall back per-episode and get flagged here.
    function planBatchEpisodes(episodes) {
        const rows = [];
        for (const ep of episodes) {
            const sources = ep.MediaSources || [];
            if (sources.length === 0) {
                rows.push({ ep, ok: false, reason: 'no playable source', audioMismatch: true, subMismatch: true });
                continue;
            }
            const tracks = resolveEpisodeTracks(ep, sources[0], null, null, selectedSubtitleMode);
            let audioLang = null;
            if (tracks.audioStreamIndex != null) {
                const a = sources[0].MediaStreams.find(s => s.Index === tracks.audioStreamIndex);
                audioLang = a ? ((a.Language || a.DisplayLanguage) || 'und') : null;
            }
            let subLang = null;
            if (tracks.subtitleStreamIndex != null) {
                const s = sources[0].MediaStreams.find(x => x.Index === tracks.subtitleStreamIndex);
                subLang = s ? ((s.Language || s.DisplayLanguage) || 'und') : null;
            }
            const wantSub = selectedSubtitleChecked.size > 0;
            const audioMismatch = !!selectedAudioLanguage
                && !!audioLang
                && audioLang.toLowerCase() !== selectedAudioLanguage.toLowerCase();
            const subMismatch = wantSub && (!subLang
                || (!!selectedSubtitleLanguage && subLang.toLowerCase() !== selectedSubtitleLanguage.toLowerCase()));
            rows.push({ ep, ok: true, tracks, audioLang, subLang, audioMismatch, subMismatch });
        }
        return rows;
    }

    function startBatchDownload(episodes, seriesTitle, tier, bitrate, videoCodec, audioCodec) {
        getApiClient(0, 5, async (client) => {
            const token = client.accessToken();
            const baseUrl = client.serverAddress() || window.location.origin;
            const dirHandle = await pickBatchDirectory();
            if (!dirHandle) return;
            const firstSrc = (episodes[0] && episodes[0].MediaSources && episodes[0].MediaSources[0]) || null;
            const firstSubs = firstSrc ? (firstSrc.MediaStreams || []).filter(s => s.Type === 'Subtitle') : [];
            const langs = extraSubtitleLangs(firstSubs, selectedSubtitleLanguage);
            enqueueEpisodeBatch(client, token, baseUrl, dirHandle, episodes, tier, bitrate,
                videoCodec, audioCodec, seriesTitle, langs);
        });
    }

    // Season-grouped mismatch review. Two honest choices, no silent surprises:
    // download everything (fallbacks applied where flagged) or skip the flagged ones.
    function startBatchReview(episodes, seriesTitle, tier, bitrate, videoCodec, audioCodec) {
        const rows = planBatchEpisodes(episodes);
        const playable = rows.filter(r => r.ok);
        if (playable.length === 0) {
            showTransientNotice(t('NoTranscodeOptions'));
            return;
        }
        const bad = rows.filter(r => r.audioMismatch || r.subMismatch);
        if (bad.length === 0) {
            startBatchDownload(playable.map(r => r.ep), seriesTitle, tier, bitrate, videoCodec, audioCodec);
            return;
        }
        const bySeason = {};
        for (const r of rows) {
            const key = r.ep.SeasonName || `Season ${r.ep.ParentIndexNumber || '?'}`;
            (bySeason[key] = bySeason[key] || []).push(r);
        }
        const scrim = document.createElement('div');
        scrim.className = 'qd-scrim';
        scrim.addEventListener('click', (e) => { if (e.target === scrim) scrim.remove(); });
        const sheet = document.createElement('div');
        sheet.className = 'qd-sheet';
        const header = document.createElement('div');
        header.className = 'qd-title';
        header.textContent = 'Check episodes before downloading';
        sheet.appendChild(header);
        const sub = document.createElement('div');
        sub.className = 'qd-sub';
        sub.textContent = 'Some episodes differ from your picks — fallbacks are shown. Choose how to handle them.';
        sheet.appendChild(sub);
        for (const [season, list] of Object.entries(bySeason)) {
            const flagged = list.filter(r => r.audioMismatch || r.subMismatch);
            const h = document.createElement('div');
            h.className = 'qd-section-title';
            h.textContent = `${season} · ${list.length} episodes${flagged.length ? ` · ${flagged.length} flagged` : ''}`;
            sheet.appendChild(h);
            for (const r of flagged.slice(0, 8)) {
                const line = document.createElement('div');
                line.className = 'qd-warn';
                line.style.margin = '4px 0 4px 12px;';
                const epName = `E${r.ep.IndexNumber || '?'} ${r.ep.Name || ''}`.trim();
                const why = [];
                if (r.audioMismatch) why.push(`audio → ${r.audioLang || 'default'}`);
                if (r.subMismatch) why.push(r.subLang ? `subs → ${r.subLang}` : 'no subs');
                line.textContent = `${epName} (${why.join(', ')})`;
                sheet.appendChild(line);
            }
            if (flagged.length > 8) {
                const more = document.createElement('div');
                more.className = 'qd-note';
                more.style.paddingLeft = '12px';
                more.textContent = `…and ${flagged.length - 8} more`;
                sheet.appendChild(more);
            }
        }
        const mkBtn = (label, primary, onClick) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = label;
            b.className = primary ? 'qd-btn' : 'qd-btn-secondary';
            b.addEventListener('click', () => { scrim.remove(); onClick(); });
            sheet.appendChild(b);
            return b;
        };
        mkBtn(`Download all ${playable.length} anyway`, true, () => {
            startBatchDownload(playable.map(r => r.ep), seriesTitle, tier, bitrate, videoCodec, audioCodec);
        });
        mkBtn(`Skip ${bad.length} flagged`, false, () => {
            const good = rows.filter(r => r.ok && !r.audioMismatch && !r.subMismatch).map(r => r.ep);
            if (good.length === 0) {
                showTransientNotice(t('NoTranscodeOptions'));
                return;
            }
            startBatchDownload(good, seriesTitle, tier, bitrate, videoCodec, audioCodec);
        });
        mkBtn('Cancel', false, () => { /* sheet already removed */ });
        addSheetChrome(sheet, scrim);
        scrim.appendChild(sheet);
        document.body.appendChild(scrim);
    }

    async function pickBatchDirectory() {
        if (typeof window.showDirectoryPicker !== 'function') {
            showTransientNotice('This browser cannot pick folders — try Chrome or Edge.');
            return null;
        }
        try {
            return await window.showDirectoryPicker();
        } catch (err) {
            if (!(err && err.name === 'AbortError')) {
                console.warn('[TranscodeDownloader] directory picker failed:', err);
                showTransientNotice(t('DownloadFailed'));
            }
            return null;
        }
    }

    function queueSeasonDir(client, token, baseUrl, seasonId, seriesTitle, tier, bitrate, videoCodec, audioCodec) {
        client.getItems(client.getCurrentUserId(), {
            ParentId: seasonId,
            IncludeItemTypes: 'Episode',
            Fields: 'MediaSources,ParentIndexNumber,IndexNumber,Name,SeriesName,RunTimeTicks,ProductionYear,Type',
            SortBy: 'ParentIndexNumber,IndexNumber',
            SortOrder: 'Ascending',
            Recursive: true,
        }).then(async (res) => {
            const episodes = (res && res.Items) || [];
            if (episodes.length === 0) {
                showTransientNotice(t('NoTranscodeOptions'));
                return;
            }
            const dirHandle = await pickBatchDirectory();
            if (!dirHandle) return;
            enqueueEpisodeBatch(client, token, baseUrl, dirHandle, episodes, tier, bitrate, videoCodec, audioCodec, seriesTitle);
        }).catch((err) => {
            console.error('[TranscodeDownloader] season fetch failed:', err);
            showTransientNotice(t('DownloadFailed'));
        });
    }

    // Series / season entry point: checklist of seasons (with counts), then the
    // normal quality sheet; the picked tier queues every episode of every checked
    // season into Series/Season NN/ folders.
    function openBatchSheet(item) {
        getApiClient(0, 5, async (client) => {
            const userId = client.getCurrentUserId();
            let seasons = [];
            if (item.Type === 'Season') {
                seasons = [{ Id: item.Id, Name: item.Name, IndexNumber: item.IndexNumber }];
            } else {
                try {
                    const res = await client.getItems(userId, {
                        ParentId: item.Id,
                        IncludeItemTypes: 'Season',
                        Fields: 'IndexNumber,Name',
                        SortBy: 'SortName',
                        SortOrder: 'Ascending',
                        Recursive: true,
                    });
                    seasons = (res && res.Items) || [];
                } catch (err) {
                    console.error('[TranscodeDownloader] seasons fetch failed:', err);
                    showTransientNotice(t('DownloadFailed'));
                    return;
                }
            }
            if (seasons.length === 0) {
                showTransientNotice(t('NoTranscodeOptions'));
                return;
            }
            let episodes = [];
            try {
                const res = await client.getItems(userId, {
                    ParentId: item.Id,
                    IncludeItemTypes: 'Episode',
                    Fields: 'MediaSources,ParentIndexNumber,IndexNumber,Name,SeriesName,SeasonId,SeasonName,RunTimeTicks,ProductionYear,Type',
                    SortBy: 'ParentIndexNumber,IndexNumber',
                    SortOrder: 'Ascending',
                    Recursive: true,
                });
                episodes = (res && res.Items) || [];
            } catch (err) {
                console.error('[TranscodeDownloader] episodes fetch failed:', err);
                showTransientNotice(t('DownloadFailed'));
                return;
            }
            const bySeason = {};
            episodes.forEach(ep => {
                const key = ep.SeasonId || (item.Type === 'Season' ? item.Id : 'unknown');
                (bySeason[key] = bySeason[key] || []).push(ep);
            });

            const scrim = document.createElement('div');
            scrim.className = 'qd-scrim';
            scrim.addEventListener('click', (e) => { if (e.target === scrim) scrim.remove(); });
            const sheet = document.createElement('div');
            sheet.className = 'qd-sheet';
            const header = document.createElement('div');
            header.className = 'qd-title';
            header.textContent = item.Type === 'Season' ? `Download season (Transcode…)` : `Download series (Transcode…)`;
            sheet.appendChild(header);
            const sub = document.createElement('div');
            sub.className = 'qd-sub';
            sub.style.marginBottom = '12px';
            sub.textContent = (item.Name || '')
                + ' — batch uses your primary audio + subtitle picks; extra tracks stay single-download only.';
            sheet.appendChild(sub);

            const checked = new Set(seasons.map(s => s.Id));
            seasons.forEach(s => {
                const count = (bySeason[s.Id] || []).length;
                const label = document.createElement('label');
                label.className = 'qd-check';
                const box = document.createElement('input');
                box.type = 'checkbox';
                box.checked = true;
                box.addEventListener('change', () => {
                    if (box.checked) checked.add(s.Id);
                    else checked.delete(s.Id);
                });
                const span = document.createElement('span');
                span.innerHTML = '';
                span.textContent = `${s.Name || 'Season'}`;
                const small = document.createElement('small');
                small.textContent = ` · ${count} episode${count === 1 ? '' : 's'}`;
                span.appendChild(small);
                label.appendChild(box);
                label.appendChild(span);
                sheet.appendChild(label);
            });

            const go = document.createElement('button');
            go.type = 'button';
            go.className = 'qd-btn';
            go.textContent = 'Choose quality…';
            go.addEventListener('click', () => {
                const chosen = episodes.filter(ep =>
                    checked.has(ep.SeasonId || (item.Type === 'Season' ? item.Id : 'unknown')));
                if (chosen.length === 0) {
                    showTransientNotice(t('NoTranscodeOptions'));
                    return;
                }
                scrim.remove();
                // Reuse the normal quality sheet against the first episode; the tier
                // click fans out to the whole selection with folder-organized output.
                showQualitySheet(chosen[0].Id, {
                    title: `${item.Name} · ${chosen.length} episodes`,
                    episodes: chosen,
                    seriesTitle: item.Type === 'Series' ? item.Name : (chosen[0].SeriesName || item.SeriesName),
                });
            });
            sheet.appendChild(go);
            addSheetChrome(sheet, scrim);
            scrim.appendChild(sheet);
            document.body.appendChild(scrim);
        });
    }

    // Current sheet's track choices. Reset on every sheet open; the click handler copies
    // them into the entry spec so retries, restores and season batches reuse them.
    let selectedMediaSourceId = null;
    let selectedSubtitleMode = 'burn'; // 'burn' | 'embed'. No-subtitles = empty checklist.
    // Checklists hold stream Index values; the first checked track (in track order)
    // is the primary that goes into the transcode. The rest become sidecars
    // (subtitles) or extra full downloads (audio).
    let selectedAudioChecked = new Set();
    let selectedSubtitleChecked = new Set();
    let selectedAudioLanguage = null;
    let selectedSubtitleLanguage = null;

    function resetTrackSelections() {
        selectedMediaSourceId = null;
        selectedSubtitleMode = 'burn';
        selectedAudioChecked = new Set();
        selectedSubtitleChecked = new Set();
        selectedAudioLanguage = null;
        selectedSubtitleLanguage = null;
        selectedContainer = DEFAULT_CONTAINER;
    }

    // First checked track in track order = primary. Everything else is an extra.
    function primaryChecked(tracks, checked) {
        const t = tracks.find(s => checked.has(s.Index));
        return t || null;
    }

    // The save picker must open inside the tier-click gesture; browsers reject it from
    // async queue processing later. No picker (Firefox, insecure context) = Blob fallback.
    async function pickSaveFile(suggestedName, container) {
        if (typeof window.showSaveFilePicker !== 'function') return null;
        try {
            const ext = container === 'mkv' ? 'mkv' : 'mp4';
            return await window.showSaveFilePicker({
                suggestedName,
                types: [{
                    description: ext === 'mkv' ? 'MKV video' : 'MP4 video',
                    accept: ext === 'mkv'
                        ? { 'video/x-matroska': ['.mkv'] }
                        : { 'video/mp4': ['.mp4'] },
                }],
            });
        } catch (err) {
            // AbortError = user cancelled the dialog: not a failure, just stop.
            if (err && err.name === 'AbortError') return 'cancelled';
            console.warn('[TranscodeDownloader] save picker unavailable, using in-memory download:', err);
            return null;
        }
    }

    // --- Download actions ---

    // Per-episode track resolution shared by single and season-batch downloads.
    // With explicit checklist sets (single sheet), the first checked track wins and an
    // emptied subtitle list means NO subtitles — explicit user choice beats defaults.
    // With null sets (batch), resolution falls back to matching the picked languages.
    function resolveEpisodeTracks(epItem, src, audioChecked, subChecked, mode) {
        const streams = (src && src.MediaStreams) || [];
        const audios = streams.filter(s => s.Type === 'Audio');
        const subs = streams.filter(s => s.Type === 'Subtitle');
        const subMode = mode || selectedSubtitleMode;
        let audioStreamIndex = null;
        if (audios.length > 0) {
            let t = audioChecked ? primaryChecked(audios, audioChecked) : null;
            if (!t) {
                const lang = (selectedAudioLanguage || '').toLowerCase();
                t = (lang && audios.find(a => (a.Language || '').toLowerCase() === lang))
                    || audios.find(a => a.IsDefault)
                    || audios[0];
            }
            audioStreamIndex = t ? t.Index : null;
        }
        let subtitleStreamIndex = null;
        let subtitleMethod = null;
        if (subs.length > 0 && !(subChecked && subChecked.size === 0)) {
            const t = subChecked
                ? primaryChecked(subs, subChecked)
                : null;
            const picked = t || (function () {
                const lang = (selectedSubtitleLanguage || '').toLowerCase();
                return (lang && subs.find(s => (s.Language || '').toLowerCase() === lang))
                    || subs.find(s => s.IsDefault)
                    || subs[0];
            })();
            if (picked) {
                subtitleStreamIndex = picked.Index;
                subtitleMethod = subMode === 'burn' ? 'Encode' : 'Embed';
            }
        }
        return {
            mediaSourceId: src && src.Id ? src.Id : null,
            audioStreamIndex, subtitleStreamIndex, subtitleMethod,
        };
    }

    // Checked-but-not-primary tracks ride along: extra audios become their own full
    // downloads (one transcode carries exactly one audio), extra subs become tiny
    // .srt sidecars fetched straight from the server (no transcode needed).
    function queueExtraTracks(token, spec, extras) {
        if (!extras) return;
        for (const a of extras.audios || []) {
            const lang = (a.Language || a.DisplayLanguage || 'und').toLowerCase();
            const exSpec = {
                baseUrl: spec.baseUrl, itemId: spec.itemId, tier: spec.tier,
                bitrate: spec.bitrate, item: spec.item, videoCodec: spec.videoCodec,
                audioCodec: spec.audioCodec, container: spec.container,
                nameTag: lang,
                mediaSourceId: spec.mediaSourceId,
                audioStreamIndex: a.Index,
                subtitleStreamIndex: spec.subtitleStreamIndex,
                subtitleMethod: spec.subtitleMethod,
            };
            addToQueue(token, exSpec, null);
        }
        const parts = buildDownloadParts(spec);
        const base = parts.filename.replace(/\.(mp4|mkv)$/i, '');
        for (const s of extras.subs || []) {
            const lang = (s.Language || s.DisplayLanguage || 'und').toLowerCase();
            enqueue({
                id: `${spec.itemId}-sub${s.Index}-${Date.now()}`,
                kind: 'subtitle',
                spec: null,
                token,
                fileHandle: null,
                filename: `${base}.${lang}.srt`,
                estimatedBytes: 0,
                url: `${spec.baseUrl}/Videos/${spec.itemId}/${spec.mediaSourceId}/Subtitles/${s.Index}/Stream.srt`,
                stopUrl: null,
                receivedBytes: 0,
                abortController: null,
                status: 'waiting',
            });
        }
    }

    function onTranscodeMenuClick(tier, bitrate, itemId, item, tracks, extras) {
        if (!item) return;
        // Captured now: the sheet is gone, but the selection must not drift before the
        // ApiClient callback runs. Track choices are baked into the spec at click time.
        const videoCodec = selectedVideoCodec;
        const audioCodec = selectedAudioCodec;
        const spec = {
            baseUrl: null, itemId, tier, bitrate, item, videoCodec, audioCodec,
            container: selectedContainer,
            mediaSourceId: tracks && tracks.mediaSourceId != null ? tracks.mediaSourceId : selectedMediaSourceId,
            audioStreamIndex: tracks ? tracks.audioStreamIndex : null,
            subtitleStreamIndex: tracks ? tracks.subtitleStreamIndex : null,
            subtitleMethod: tracks ? tracks.subtitleMethod : null,
        };
        getApiClient(0, 5, async (client) => {
            const token = client.accessToken();
            const baseUrl = client.serverAddress() || window.location.origin;
            spec.baseUrl = baseUrl;
            const suggestedName = buildDownloadParts(spec).filename;
            const fileHandle = await pickSaveFile(suggestedName, spec.container);
            if (fileHandle === 'cancelled') return;
            addToQueue(token, spec, fileHandle);
            queueExtraTracks(token, spec, extras);
        });
    }

    // Pure builder so a failed entry can be retried with fresh session ids without
    // re-picking codec and tier. Nothing here touches the queue or the network.
    function buildDownloadParts(spec) {
        const { baseUrl, itemId, tier, bitrate, item, videoCodec, audioCodec } = spec;
        const mediaSource = (item.MediaSources || []).find(s => s.Id === spec.mediaSourceId)
            || item.MediaSources[0];
        const mediaSourceId = mediaSource && mediaSource.Id ? mediaSource.Id : itemId;
        const ext = spec.container === 'mkv' ? 'mkv' : 'mp4';
        // Identifies the server-side transcoding job so it can be killed (and its temp file
        // deleted) once the download ends. Both are per-download and synthetic: the pair also
        // seeds the transcode's output filename, so a fresh id keeps a new download from picking
        // up a stale file, and a device id of our own keeps this out of the real playback
        // session's transcoding info in the dashboard.
        const playSessionId = randomId();
        const deviceId = `transcode-downloader-${playSessionId}`;
        // A single codec is sent deliberately: a comma-separated list lets the server silently
        // downgrade while the UI still claims the codec the user picked.
        // MaxWidth/MaxHeight pin the picked rung — VideoBitrate alone lets the server
        // return a higher resolution than the label promises.
        const query = `MediaSourceId=${mediaSourceId}`
            + `&VideoBitrate=${bitrate}&MaxWidth=${tier.maxWidth}&MaxHeight=${tier.maxHeight}`
            + `&VideoCodec=${videoCodec}&AudioCodec=${audioCodec}&MaxAudioChannels=2`
            + (spec.audioStreamIndex != null ? `&AudioStreamIndex=${spec.audioStreamIndex}` : '')
            + (spec.subtitleStreamIndex != null && spec.subtitleMethod
                ? `&SubtitleStreamIndex=${spec.subtitleStreamIndex}&SubtitleMethod=${spec.subtitleMethod}` : '')
            + `&allowVideoStreamCopy=false&allowAudioStreamCopy=false&Static=false`
            + `&PlaySessionId=${playSessionId}&DeviceId=${encodeURIComponent(deviceId)}`;
        const url = `${baseUrl}/Videos/${itemId}/stream.${ext}?${query}`;
        const stopUrl = buildStopUrl(baseUrl, deviceId, playSessionId);

        const videoTag = codecTag(VIDEO_CODECS, videoCodec);
        const audioTag = codecTag(AUDIO_CODECS, audioCodec);
        const suffix = ` [${videoTag} ${formatBitrate(bitrate).replace(' ', '')} ${audioTag}${spec.nameTag ? ' ' + spec.nameTag : ''}]`;

        const pad = (n) => (Number.isFinite(Number(n)) ? String(n).padStart(2, '0') : '??');
        let filename;
        if (item.Type === 'Movie') {
            filename = `${item.Name || 'Unknown movie'} (${item.ProductionYear || '????'})${suffix}.${ext}`;
        } else if (item.Type === 'Episode') {
            filename = `${item.SeriesName || 'Unknown series'} S${pad(item.ParentIndexNumber)}E${pad(item.IndexNumber)} - ${item.Name || 'Unknown episode'}${suffix}.${ext}`;
        } else {
            filename = `download${suffix}.${ext}`;
        }
        filename = sanitizeFilename(filename, `download${suffix}.${ext}`);

        const durationSeconds = item.RunTimeTicks ? item.RunTimeTicks / 10_000_000 : 0;
        const estimatedBytes = durationSeconds > 0 ? (bitrate * durationSeconds) / 8 : 0;

        return {
            url, query, stopUrl, filename, estimatedBytes, deviceId, playSessionId,
            videoCodec, audioCodec, container: ext,
            mimeType: ext === 'mkv' ? 'video/x-matroska' : 'video/mp4',
            codecLabel: `${videoTag} · ${formatBitrate(bitrate)} · ${audioTag} · ${ext.toUpperCase()}`,
        };
    }

    function addToQueue(token, spec, fileHandle) {
        const parts = buildDownloadParts(spec);
        // Nothing below this point applies inside the Android app: there is no queue entry, no
        // progress and no filename of ours once the browser owns the transfer. The handoff goes
        // through the plugin's Download endpoint so the file lands with its real name instead
        // of stream.mp4. It carries ?ApiKey= because a browser intent cannot send headers.
        if (isAndroidAppWebView()) {
            const handoff = `${spec.baseUrl}/TranscodeDownloader/Download/${spec.itemId}`
                + `?${parts.query}&filename=${encodeURIComponent(parts.filename)}`
                + `&container=${parts.container}`
                + `&ApiKey=${encodeURIComponent(token)}`;
            handOffToBrowser(handoff, spec.baseUrl, parts.deviceId, parts.playSessionId);
            return;
        }

        enqueue({
            id: `${spec.itemId}-${Date.now()}`,
            spec,
            token,
            fileHandle: fileHandle || null,
            filename: parts.filename,
            estimatedBytes: parts.estimatedBytes,
            url: parts.url,
            stopUrl: parts.stopUrl,
            videoCodec: parts.videoCodec,
            audioCodec: parts.audioCodec,
            mimeType: parts.mimeType,
            codecLabel: parts.codecLabel,
            receivedBytes: 0,
            abortController: null,
            status: 'waiting',
        });
    }

    // Capture phase, so the trigger is recorded before Jellyfin's own handler opens the sheet.
    document.addEventListener('click', recordContextMenuTarget, true);
    document.addEventListener('contextmenu', recordContextMenuTarget, true);

    const _menuObserver = new MutationObserver(() => {
        if (document.querySelector('[data-id^="qd-"]')) return;
        const downloadBtn = document.querySelector('.actionSheetMenuItem[data-id="download"]');
        if (downloadBtn) {
            injectMenuItems(downloadBtn);
            return;
        }
        // Series and season sheets carry no Download entry of their own — offer a
        // batch entry anchored at the end of the sheet instead.
        const itemId = takeContextMenuItemId() || extractItemId(window.location.hash);
        if (!itemId) return;
        fetchItemMetadata(itemId).then(item => {
            if (!item || document.querySelector('[data-id^="qd-"]')) return;
            if (item.Type !== 'Series' && item.Type !== 'Season') return;
            const sheet = document.querySelector('.actionSheet');
            if (!sheet || !document.contains(sheet)) return;
            const label = item.Type === 'Series' ? 'Download series (Transcode…)' : 'Download season (Transcode…)';
            const btn = makeMenuItem('video_library', label, () => {
                closeActiveSheet();
                openBatchSheet(item);
            });
            btn.setAttribute('data-id', item.Type === 'Series' ? 'qd-series' : 'qd-season');
            sheet.appendChild(btn);
        });
    });
    _menuObserver.observe(document.body, { childList: true, subtree: true });

    console.log('[TranscodeDownloader] plugin loaded');
    window.addEventListener('hashchange', onHashChange);

    if (window.location.hash.startsWith('#/details')) {
        onHashChange();
    }

    injectStyles();
    injectQueuePanel();
    initStrings();
    flushPendingStops();
    restoreWaitingQueue();

    // Re-fetch strings whenever Jellyfin changes the UI language (updates document.documentElement.lang).
    new MutationObserver(() => {
        const locale = document.documentElement.lang;
        if (!locale) return;
        fetchStrings(locale).then(result => {
            if (result) {
                loadedStrings = result.strings;
                console.log('[TranscodeDownloader] strings reloaded for locale:', locale);
            }
        }).catch(() => {});
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
