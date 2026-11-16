# Fork Plan — Transcode Downloader for Jellyfin 12.4 + phone-first downloads

Owner context (locked 2026-11-16):
- Server: Jellyfin **12.4.0** (Docker `jellyfin/jellyfin:12.4`), AMD RX 7900 GRE via VA-API
  `/dev/dri/renderD128`, 4 GB container mem, 8 CPUs.
- Library: 1080p HEVC/x264 anime + 2160p BluRay (DV/HDR present). This box already
  sets jpn-audio + eng-sub defaults on anime.
- Goal: phone downloads transcoded to a smaller quality (720p-ish), reliable,
  correct subs/audio, playable on Android + iOS.
- Upstream: `ph15ch/Jellyfin-Transcode-Downloader` @ v1.0.26 (targetAbi 10.11.8.0).
  Known 12.x break: issue #37 (codec picker 401s; fork PR remisharrock#4 unmerged).

Research basis: 7 subagent tracks (code audit, 12.x port, transcode tuning, feature
backlog, failure catalog, format matrix, 12.4 source verification). Key files referenced
below are in `src/` and `web/plugin.js` of this repo.

## Phase 0 — Fork + scaffolding (S)

1. `gh repo fork ph15ch/Jellyfin-Transcode-Downloader --clone=false` (account BlackPool25),
   add upstream remote locally, create branch `12.4-port`.
2. No local dotnet → all builds via `mcr.microsoft.com/dotnet/sdk:10.0` container or
   GitHub Actions (`.github/workflows/build.yml` bumped to 10.0.x in Phase 1).
3. Add `repo/manifest-testing.json` entry discipline: every change ships behind the
   testing manifest first (repo already supports this).

## Phase 1 — Jellyfin 12.4 port (M, blocking everything)

Verified against v12.4 sources (no C# logic changes needed — all touched server APIs
exist with identical signatures):
1. `src/JellyfinTranscodeDownloader.csproj`: `net9.0`→`net10.0`,
   `Jellyfin.{Model,Common,Controller}` `10.11.8`→`12.4.0`.
2. CI workflows: `setup-dotnet 9.0.x`→`10.0.x`; release workflow `targetAbi 12.4.0`.
3. `web/plugin.js` — lowercase `api_key=` → capital `ApiKey=` at exactly 3 sites:
   - ~line 719 `fetchCodecCapabilities()` (`/TranscodeDownloader/Codecs`), and
   - ~line 213 `buildStopUrl()` + ~line 1056 `addToQueue()` stream URL.
   Additionally send `Authorization: MediaBrowser Token="…"` header on the two
   in-page `fetch()`es (Codecs probe, DELETE ActiveEncodings); keep `?ApiKey=` in the
   URL for the Android browser-handoff path that can't carry headers. Never both
   `ApiKey`+`Authorization` together (12.x 401s on dual auth).
4. `repo/manifest.json`: NEW entry `targetAbi 12.4.0.0`; keep old 10.11 entries
   (targetAbi is a minimum — one binary cannot serve both lines).
5. Gate: `dotnet build` clean on .NET 10 SDK + smoke test on this server (endpoints below).

Do NOT mass-adopt remisharrock fork: cherry-pick auth-header pattern only. Its stream
URL still uses lowercase `api_key` (unfixed download path) and it bundles unrelated
features (concurrency config, track selection) — we implement those ourselves in Phase 3.

## Phase 2 — Correctness + hardening (M)

P0 (ship with port):
1. **Filename sanitize** (`plugin.js` filename builder): strip `\/:*?"<>|` + controls,
   NFC-normalize, cap ~120 chars, guard `ProductionYear==null` → `(????)`,
   `ParentIndexNumber/IndexNumber==null` → skip pad (kills `SNaN`/`(undefined)`).
2. **Download integrity gate**: reject zero-byte; compare received vs Content-Length
   when present; moov/`ftyp` presence check; min-size heuristic. Failures stay in queue
   with real reason + Retry (no more silent 3s drop).
3. **Stall watchdog**: no bytes for 90 s → "server still converting / stalled" state,
   offer Cancel/Retry with a FRESH `PlaySessionId` (never reuse across retries).
4. **`MaxWidth`/`MaxHeight` from picked tier** in stream URL — today only `VideoBitrate`
   is sent, so "720p" can come back 1080p+. (Regressed before; PR #10 added MaxHeight.)
5. **Estimate honesty**: `~size = bitrate×duration/8`, keep `~` (±10–15% VBR), hide on
   missing RunTimeTicks (no `NaN%`), warn when estimate > 1.2× original, block tiers ≥
   source bitrate (strict-`<` today can yield zero tiers on low-bitrate sources).
6. **Auth self-test on load** + single-injection assertion (marker counted once in HTML).

P1:
7. **Stream-to-disk download** (File System Access `pipeTo`, Blob fallback): kills the
   2×-RAM OOM ceiling — the actual blocker for 2 GB phone files.
8. **Queue persistence** (localStorage: itemId+params, re-resolve URLs on load, honest
   "restart" label) + `beforeunload` guard while active.
9. Temp-file hygiene: keep `DELETE /Videos/ActiveEncodings` on done/fail/abort/pagehide;
   document enabling server transcode-cleanup task.

## Phase 3 — Phone-first features (M/L)

1. **Phone ladder** (replace archive tiers): 1080p 6M / 1080p 4M (default) / 720p 2.5M /
   720p 1.5M / 720p ~0.9M / 480p 0.7M (factors 1 / 0.65 / 0.5 validated; anime biases low).
   Hide 2160p/1440p behind "archive" (tone-map + 4 GB-mem risk on this box).
2. **Codec defaults + Apple guard**: default H.264+AAC. Safari/iOS UA + HEVC → force AAC
   + warn `hev1` won't play on Apple (server writes `hev1`; fix needs `-tag:v hvc1`
   server-side or local remux — document). Never default Opus for Apple targets.
3. **Track pickers**: audio (`AudioStreamIndex`) + subtitle mode
   (none / embed `mov_text` / burn-in) + `SubtitleStreamIndex`, populated from
   `MediaSources[0].MediaStreams`. Defaults: anime = burn (faithful ASS), movies =
   embed-or-none. Mandatory for this library (multi-audio jpn/eng + styled ASS).
   Keep `VideoCodec` always set when burn-in (else server stream-copies, no burn — jf#18560).
4. **Media-source picker** when `MediaSources.length > 1` (stop downloading the 4K
   version by accident).
5. **Real filenames on Android handoff**: plugin endpoint that 302s with
   `Content-Disposition: attachment` instead of handing off bare `stream.mp4`.
6. **Pre-download panel**: ~size + original size + `navigator.storage.estimate()` free-space
   check + FAT32/iOS-Files 4 GB warnings.
7. **Season/batch enqueue** (after concurrency knob): whole-season to queue in one tap.
8. Optional server knob passthrough later: simultaneous-download limit (default 1; this
   box: max 1 HDR job at a time under 4 GB).

NON-goals: watch-state sync, native DownloadManager migration, server-side quota
enforcement, pre-transcoded libraries, HDR/tonemap controls (Dashboard territory),
per-user quotas.

## Phase 4 — Verification matrix (gates release)

- Build: `dotnet build` clean, plugin loads (server log `plugin loaded`), no 401s with
  `EnableLegacyAuthorization=false` (confirm in `system.xml`).
- Endpoints: `GET /TranscodeDownloader/ClientScript` 200+tag in `index.html` once;
  `GET /Codecs?ApiKey=` 200; `?api_key=` 401 (proves 12.x path); stream + stop-flow E2E.
- Browsers: Chrome/desktop, Android browser handoff, Safari (Apple-guard triggers).
- Devices: Android VLC (H.264+AAC 720p), iPhone native (H.264+AAC only), iPhone VLC/Infuse.
- Media: 1080p anime w/ ASS (burn-in), dual-audio (track pick), 2160p DV (tone-map warn),
  4 GB+ file (FAT32 warning), season batch.

## Risks

- `targetAbi 12.4.0.0` + .NET 10 rebuild is mandatory — 10.11 binary will not load at all.
- `av1_vaapi` presence on this box's jellyfin-ffmpeg is unconfirmed — probe before
  advertising AV1 (keep `/Codecs` probe as source of truth).
- Job-based resumable downloads (jellyfin-meta #131) are discussion-only; until then,
  dropped connections restart from zero — say so in UI, design status shape to map later.
- Upstream may fix #37 independently — keep fork rebaseable (small focused commits).
