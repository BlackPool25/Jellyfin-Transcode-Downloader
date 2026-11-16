const fs = require('fs');
const { JSDOM } = require('jsdom');

const PLUGIN = require('path').join(__dirname, '..', 'web', 'plugin.js');
const results = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));

function makeEnv({ ua, nativeShell, savePicker }) {
    const html = `<!DOCTYPE html><html lang="en-us"><head></head><body>
    <div class="actionSheet"><button class="actionSheetMenuItem" data-id="download">Download</button></div></body></html>`;
    const dom = new JSDOM(html, {
        url: 'http://localhost:8096/web/index.html#/details?id=' + 'b'.repeat(32),
        runScripts: 'outside-only',
        // jsdom userAgent option overrides navigator.userAgent
    }, );
    const { window } = dom;
    if (ua) Object.defineProperty(window.navigator, 'userAgent', { value: ua, configurable: true });
    const errors = [];
    window.addEventListener('error', e => errors.push('onerror: ' + (e.message || e.error)));
    const origCE = window.console.error;
    window.console.error = (...a) => { errors.push('console.error: ' + a.join(' ')); origCE(...a); };
    window.localStorage = (() => {
        const m = new Map();
        return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k), clear: () => m.clear() };
    })();
    window.URL.createObjectURL = () => 'blob:fake';
    window.URL.revokeObjectURL = () => {};
    if (nativeShell) {
        window.__openedUrls = [];
        window.NativeShell = { openUrl: (u) => window.__openedUrls.push(u) };
        window.NativeInterface = { openUrl: (u) => {} };
    }
    if (savePicker) {
        window.__written = [];
        window.showSaveFilePicker = async () => ({
            createWritable: async () => ({
                chunks: [],
                async write(c) { this.chunks.push(c.length || c.byteLength || 0); window.__written.push(c.length || c.byteLength || 0); },
                async close() {}, async abort() {},
            }),
        });
        window.showDirectoryPicker = async () => { throw new DOMException('x', 'AbortError'); };
    }
    const mediaSource = {
        Id: 'ms1', Bitrate: 20000000, Size: 9000000000, Container: 'mkv',
        MediaStreams: [
            { Index: 0, Type: 'Video', Codec: 'hevc', Width: 3840, VideoRangeType: 'HDR10' },
            { Index: 1, Type: 'Audio', Codec: 'truehd', Language: 'eng', Channels: 6, IsDefault: true, DisplayTitle: 'English TrueHD 5.1' },
            { Index: 2, Type: 'Audio', Codec: 'aac', Language: 'jpn', Channels: 2, DisplayTitle: 'Japanese AAC Stereo' },
            { Index: 3, Type: 'Subtitle', Codec: 'pgs', Language: 'eng', DisplayTitle: 'English (PGS)', IsDefault: true },
            { Index: 4, Type: 'Subtitle', Codec: 'ass', Language: 'eng', DisplayTitle: 'English Dialogue' },
        ],
    };
    const item = {
        Id: 'b'.repeat(32), Type: 'Movie', Name: 'Test Film', ProductionYear: 2023,
        RunTimeTicks: 72000000000, MediaSources: [mediaSource],
    };
    window.ApiClient = {
        accessToken: () => 'test-token',
        getCurrentUserId: () => 'user1',
        serverAddress: () => 'http://localhost:8096',
        getItem: async () => JSON.parse(JSON.stringify(item)),
        getItems: async () => ({ Items: [] }),
    };
    window.fetch = async (url, init) => {
        const u = String(url);
        if (u.includes('/TranscodeDownloader/Codecs')) {
            return { ok: true, status: 200, json: async () => ({ VideoCodecs: [
                { Codec: 'h264', Encoder: 'h264_vaapi', IsHardware: true, IsSupported: true, IsAllowedByAdmin: true },
                { Codec: 'hevc', Encoder: 'hevc_vaapi', IsHardware: true, IsSupported: true, IsAllowedByAdmin: true },
                { Codec: 'av1', Encoder: 'libsvtav1', IsHardware: false, IsSupported: true, IsAllowedByAdmin: false },
            ], AudioCodecs: [
                { Codec: 'aac', Encoder: 'aac', IsHardware: false, IsSupported: true, IsAllowedByAdmin: true },
                { Codec: 'opus', Encoder: 'libopus', IsHardware: false, IsSupported: true, IsAllowedByAdmin: true },
            ] }) };
        }
        if (u.includes('/TranscodeDownloader/strings/')) return { ok: false, status: 404 };
        if (u.includes('/stream.') || u.includes('/Subtitles/')) {
            return { ok: true, status: 200, body: new ReadableStream({ start(c) { c.enqueue(new Uint8Array([1, 2, 3])); c.close(); } }) };
        }
        if (u.includes('/ActiveEncodings')) return { ok: true, status: 204 };
        return { ok: false, status: 404 };
    };
    dom.window.eval(fs.readFileSync(PLUGIN, 'utf8'));
    return { window, errors };
}

async function settle(env) { await sleep(500); }

(async () => {
    // ---- Profile 1: Android app WebView ----
    {
        const env = makeEnv({
            ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0 Mobile Safari/537.36',
            nativeShell: true,
        });
        const { window, errors } = env;
        await settle(env);
        const qd = window.document.querySelector('[data-id^="qd-"]');
        if (qd) qd.click();
        await sleep(600);
        const sheet = window.document.getElementById('qd-quality-sheet');
        const tiers = sheet ? [...sheet.querySelectorAll('button')].filter(b => /★|1080p|720p|480p/.test(b.textContent)) : [];
        if (tiers[2]) tiers[2].click();
        await sleep(200);
        const dl = sheet ? [...sheet.querySelectorAll('button')].find(b => /^Download/.test(b.textContent)) : null;
        if (dl) dl.click();
        await sleep(800);
        const rows = window.document.querySelectorAll('#qd-queue-list > div').length;
        const opened = window.__openedUrls || [];
        const refErrs = errors.filter(e => /ReferenceError|not defined|is not a function/.test(e));
        results.push(['ANDROID app: handed to browser', opened.length === 1 && /TranscodeDownloader\/Download\//.test(opened[0] || '')]);
        results.push(['ANDROID app: ApiKey in handoff URL', /ApiKey=/.test(opened[0] || '')]);
        results.push(['ANDROID app: real filename in handoff URL', /filename=/.test(opened[0] || '')]);
        const u = opened[0] || '';
        results.push(['ANDROID app: handoff carries container', /container=(mp4|mkv)/.test(u)]);
        results.push(['ANDROID app: handoff carries codec+bitrate', /VideoCodec=(h264|hevc|av1)/.test(u) && /VideoBitrate=\d+/.test(u)]);
        results.push(['ANDROID app: handoff carries audio+subtitle picks', /AudioStreamIndex=\d+/.test(u) && /SubtitleStreamIndex=\d+/.test(u) && /SubtitleMethod=(Encode|Embed)/.test(u)]);
        results.push(['ANDROID app: handoff carries MaxWidth/Height', /MaxWidth=\d+/.test(u) && /MaxHeight=\d+/.test(u)]);
        results.push(['ANDROID app: no queue rows (browser owns it)', rows === 0]);
        results.push(['ANDROID app: zero ReferenceErrors', refErrs.length === 0]);
        if (refErrs.length) console.log('  android refErrs:', refErrs);
    }

    // ---- Profile 2: iOS Safari (no picker, Apple rules) ----
    {
        const env = makeEnv({
            ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
        });
        const { window, errors } = env;
        await settle(env);
        const qd = window.document.querySelector('[data-id^="qd-"]');
        if (qd) qd.click();
        await sleep(600);
        const sheet = window.document.getElementById('qd-quality-sheet');
        const sel = sheet ? [...sheet.querySelectorAll('.qd-chip[aria-pressed="true"]')].map(c => c.textContent) : [];
        const hevcBtn = sheet ? [...sheet.querySelectorAll('.qd-chip')].find(c => c.textContent.includes('HEVC')) : null;
        let appleWarnVisible = false;
        if (hevcBtn) { hevcBtn.click(); await sleep(200); }
        const warns = sheet ? [...sheet.querySelectorAll('.qd-warn')].filter(w => w.style.display !== 'none') : [];
        appleWarnVisible = warns.length > 0;
        // HDR note (4K HDR10 source in fixture)
        const hdrNote = sheet ? sheet.textContent.includes('tone-mapped to SDR') : false;
        const refErrs = errors.filter(e => /ReferenceError|not defined|is not a function/.test(e));
        results.push(['iOS: sheet opens', !!sheet]);
        results.push(['iOS: default codec is H.264 (not HEVC)', sel.some(t => t.includes('H.264')) && !sel.some(t => t.includes('HEVC'))]);
        results.push(['iOS: Apple warning appears on HEVC pick', appleWarnVisible]);
        results.push(['iOS: HDR tone-map note shown', hdrNote]);
        results.push(['iOS: zero ReferenceErrors', refErrs.length === 0]);
        if (refErrs.length) console.log('  ios refErrs:', refErrs);
    }

    // ---- Profile 3: desktop Chromium with save picker (disk path) ----
    {
        const env = makeEnv({
            ua: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
            savePicker: true,
        });
        const { window, errors } = env;
        await settle(env);
        const qd = window.document.querySelector('[data-id^="qd-"]');
        if (qd) qd.click();
        await sleep(600);
        const sheet = window.document.getElementById('qd-quality-sheet');
        const tiers = sheet ? [...sheet.querySelectorAll('button')].filter(b => /★|1080p|720p|480p/.test(b.textContent)) : [];
        // burn-in ON by default with PGS sub picked: method should be Encode
        if (tiers[2]) tiers[2].click();
        await sleep(200);
        const dl = sheet ? [...sheet.querySelectorAll('button')].find(b => /^Download/.test(b.textContent)) : null;
        if (dl) dl.click();
        await sleep(1500);
        const rows = window.document.querySelectorAll('#qd-queue-list > div').length;
        const bytes = (window.__written || []).reduce((a, b) => a + b, 0);
        const refErrs = errors.filter(e => /ReferenceError|not defined|is not a function/.test(e));
        results.push(['PC/Chromium: queue completed and cleared (disk path)', rows === 0]);
        results.push(['PC/Chromium: bytes hit the file handle', bytes > 0]);
        results.push(['PC/Chromium: zero ReferenceErrors', refErrs.length === 0]);
        if (refErrs.length) console.log('  pc refErrs:', refErrs);
    }

    // ---- Profile 4: mobile Chrome browser (no app, no save picker) ----
    {
        const env = makeEnv({
            ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36',
        });
        const { window, errors } = env;
        await settle(env);
        const qd = window.document.querySelector('[data-id^="qd-"]');
        if (qd) qd.click();
        await sleep(600);
        const sheet = window.document.getElementById('qd-quality-sheet');
        const tiers = sheet ? [...sheet.querySelectorAll('button')].filter(b => /1080p|720p|480p/.test(b.textContent)) : [];
        if (tiers[1]) tiers[1].click();
        await sleep(100);
        const dl = sheet ? [...sheet.querySelectorAll('button')].find(b => /^Download/.test(b.textContent)) : null;
        if (dl) dl.click();
        await sleep(800);
        const notice = window.document.getElementById('qd-notice');
        const refErrs = errors.filter(e => /ReferenceError|not defined|is not a function/.test(e));
        results.push(['MOBILE browser: sheet opens', !!sheet]);
        results.push(['MOBILE browser: routes to browser download (notice shown)', !!notice && /notifications/.test(notice.textContent)]);
        results.push(['MOBILE browser: no queue rows (no Blob path)', window.document.querySelectorAll('#qd-queue-list > div').length === 0]);
        results.push(['MOBILE browser: zero ReferenceErrors', refErrs.length === 0]);
        if (refErrs.length) console.log('  mob refErrs:', refErrs);
    }

console.log('--- CLIENT MATRIX ---');
    let pass = 0;
    for (const [name, ok] of results) { console.log((ok ? 'PASS' : 'FAIL') + '  ' + name); if (ok) pass++; }

    console.log(`${pass}/${results.length} passed`);
    process.exit(pass === results.length ? 0 : 1);
})().catch(e => { console.error('HARNESS FAIL:', e); process.exit(2); });
