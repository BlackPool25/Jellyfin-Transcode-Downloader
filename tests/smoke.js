const fs = require('fs');
const { JSDOM } = require('jsdom');

const errors = [];
const notices = [];

const html = `<!DOCTYPE html><html lang="en-us"><head></head><body>
<div class="actionSheet">
<button class="actionSheetMenuItem" data-id="download">Download</button>
</div></body></html>`;

const dom = new JSDOM(html, {
    url: 'http://localhost:8096/web/index.html#/details?id=' + 'a'.repeat(32),
    runScripts: 'outside-only',
    pretendToBeVisual: true,
});
const { window } = dom;

// ---- stubs ----
window.localStorage = (() => {
    const m = new Map();
    return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k), clear: () => m.clear() };
})();
window.URL.createObjectURL = () => 'blob:fake';
window.URL.revokeObjectURL = () => {};
const mediaSource = {
    Id: 'ms1', Bitrate: 8000000, Size: 4000000000, Container: 'mkv',
    MediaStreams: [
        { Index: 0, Type: 'Video', Codec: 'hevc', Width: 1920 },
        { Index: 1, Type: 'Audio', Codec: 'aac', Language: 'jpn', Channels: 2, IsDefault: true, DisplayTitle: 'Japanese AAC Stereo' },
        { Index: 2, Type: 'Audio', Codec: 'aac', Language: 'eng', Channels: 2, DisplayTitle: 'English AAC Stereo' },
        { Index: 3, Type: 'Subtitle', Codec: 'ass', Language: 'eng', DisplayTitle: 'English (Full)', IsDefault: true },
        { Index: 4, Type: 'Subtitle', Codec: 'ass', Language: 'eng', DisplayTitle: 'English Signs' },
    ],
};
const item = {
    Id: 'a'.repeat(32), Type: 'Episode', Name: 'E1', SeriesName: 'Show',
    ParentIndexNumber: 1, IndexNumber: 2, RunTimeTicks: 144000000000,
    ProductionYear: 2017, MediaSources: [mediaSource],
};
window.ApiClient = {
    accessToken: () => 'test-token',
    getCurrentUserId: () => 'user1',
    serverAddress: () => 'http://localhost:8096',
    getItem: async () => JSON.parse(JSON.stringify(item)),
    getItems: async () => ({ Items: [] }),
};
function streamBody() {
    return new ReadableStream({ start(c) { c.enqueue(new Uint8Array([1, 2, 3])); c.close(); } });
}
window.fetch = async (url) => {
    const u = String(url);
    if (u.includes('/TranscodeDownloader/Codecs')) {
        return { ok: true, status: 200, json: async () => ({ VideoCodecs: [{ Codec: 'h264', Encoder: 'h264_vaapi', IsHardware: true, IsSupported: true, IsAllowedByAdmin: true }, { Codec: 'hevc', Encoder: 'hevc_vaapi', IsHardware: true, IsSupported: true, IsAllowedByAdmin: true }, { Codec: 'av1', Encoder: 'libsvtav1', IsHardware: false, IsSupported: true, IsAllowedByAdmin: false }], AudioCodecs: [{ Codec: 'aac', Encoder: 'aac', IsHardware: false, IsSupported: true, IsAllowedByAdmin: true }] }) };
    }
    if (u.includes('/TranscodeDownloader/strings/')) return { ok: false, status: 404 };
    if (u.includes('/stream.')) return { ok: true, status: 200, body: streamBody() };
    if (u.includes('/ActiveEncodings')) return { ok: true, status: 204 };
    return { ok: false, status: 404 };
};
window.addEventListener('error', e => errors.push('window.onerror: ' + (e.message || e.error)));
const origConsoleError = window.console.error;
window.console.error = (...a) => { errors.push('console.error: ' + a.join(' ')); origConsoleError(...a); };

const src = fs.readFileSync(require('path').join(__dirname, '..', 'web', 'plugin.js'), 'utf8');
try {
    dom.window.eval(src);
    console.log('EVAL OK — plugin loaded, no throw');
} catch (e) {
    console.log('EVAL THREW:', e.message);
    process.exit(2);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
    await sleep(300); // observers + metadata + strings
    // 1. menu entry injected?
    let qd = window.document.querySelector('[data-id^="qd-"]');
    console.log('menu entry injected:', qd ? qd.textContent : 'MISSING');

    // 2. click it -> quality sheet opens without ReferenceError?
    if (qd) qd.click();
    await sleep(600);
    const sheet = window.document.getElementById('qd-quality-sheet');
    console.log('quality sheet open:', !!sheet);
    if (sheet) {
        const tiers = [...[...sheet.querySelectorAll('button')]].filter(b => /★|1080p|720p|480p/.test(b.textContent));
        console.log('tier buttons:', tiers.length, '| first:', tiers[0] ? tiers[0].textContent.trim().slice(0, 40) : 'none');
        const starred = tiers.find(b => b.textContent.includes('★'));
        console.log('starred rung:', starred ? starred.textContent.trim().slice(0, 50) : 'NONE');
        const selCodec = [...sheet.querySelectorAll('.qd-chip[aria-pressed="true"]')].map(c => c.textContent);
        const hevcChip = [...sheet.querySelectorAll('.qd-chip')].find(c => c.textContent.includes('HEVC'));
        console.log('hevc chip:', hevcChip ? `disabled=${hevcChip.disabled} pressed=${hevcChip.getAttribute('aria-pressed')} title=${hevcChip.title}` : 'MISSING');
        console.log('preselected codecs:', selCodec.join(' + ') || 'NONE');
        const dl = [...sheet.querySelectorAll('button')].find(b => /^Download/.test(b.textContent));
        console.log('download button:', dl ? `"${dl.textContent}"` : 'MISSING');
        // 3. transcode download first (queue path), then reopen and take Original (anchor path)
        if (tiers[1]) tiers[1].click();
        await sleep(100);
        const chips = [...sheet.querySelectorAll('.qd-chip')].filter(c => !c.disabled);
        if (chips[0]) chips[0].click();
        await sleep(100);
        if (dl) dl.click();
        await sleep(800);
        let rows = window.document.querySelectorAll('#qd-queue-list > div');
        console.log('phase1 transcode queued, rows:', rows.length);
        const menuAgain = window.document.querySelector('[data-id^="qd-"]');
        if (menuAgain) menuAgain.click();
        await sleep(600);
        const sheet2 = window.document.getElementById('qd-quality-sheet');
        console.log('reopened sheet:', !!sheet2);
        if (sheet2) {
            const origBtn = [...sheet2.querySelectorAll('button')].find(b => /^Original file/.test(b.textContent.trim()));
            console.log('original row:', origBtn ? `"${origBtn.textContent.trim().slice(0,40)}"` : 'MISSING');
            if (origBtn) origBtn.click();
            await sleep(100);
            const dl2 = [...sheet2.querySelectorAll('button')].find(b => /^Download/.test(b.textContent));
            console.log('download button now:', dl2 ? `"${dl2.textContent}"` : 'MISSING');
            console.log('summary now:', sheet2.textContent.includes('no re-encode') ? 'mentions no re-encode' : 'NO original summary');
            if (dl2) dl2.click();
            await sleep(4000);
        }
        rows = window.document.querySelectorAll('#qd-queue-list > div');
        console.log('queue rows at end:', rows.length, '(transcode done+removed, original leaves none)');
        rows.forEach(r => console.log('  leftover row:', r.textContent.slice(0,120)));
    }
    const refErrs = errors.filter(e => /ReferenceError|not defined|is not a function/.test(e));
    console.log('---');
    console.log('ReferenceErrors:', refErrs.length ? refErrs : 'NONE');
    console.log('other errors:', errors.length - refErrs.length);
    errors.slice(0, 5).forEach(e => console.log('  *', e.slice(0, 160)));
    process.exit(refErrs.length ? 1 : 0);
})();

