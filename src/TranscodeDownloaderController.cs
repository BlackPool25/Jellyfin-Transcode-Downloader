using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Controller.MediaEncoding;
using MediaBrowser.Model.Configuration;
using MediaBrowser.Model.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;

namespace Jellyfin.Plugin.TranscodeDownloader
{
    /// <summary>
    /// Serves the embedded Transcode Downloader client script, its string bundles, and the
    /// server's codec capabilities.
    /// The script and strings are anonymous — the browser loads them via a plain script/fetch
    /// with no API token. The codec endpoint exposes server encoding configuration and requires
    /// a login, so <c>[AllowAnonymous]</c> is applied per action rather than to the class: a
    /// class-level <c>[AllowAnonymous]</c> would override the action-level <c>[Authorize]</c>.
    /// </summary>
    [ApiController]
    [Route("TranscodeDownloader")]
    public class TranscodeDownloaderController : ControllerBase
    {
        private const string ResourcePrefix = "Jellyfin.Plugin.TranscodeDownloader.web.";

        private static readonly HashSet<string> SupportedLocales = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "en-us", "de", "fr", "es", "zh-cn", "nl"
        };

        /// <summary>
        /// Video codecs the download UI offers, in display order: the value sent as
        /// <c>VideoCodec</c>, the software encoder Jellyfin falls back to, and the prefix of the
        /// hardware encoder name (<c>{prefix}_{accel}</c>, e.g. <c>hevc_nvenc</c>).
        /// </summary>
        private static readonly (string Codec, string SoftwareEncoder, string HardwarePrefix)[] VideoCodecs =
        {
            ("h264", "libx264", "h264"),
            ("hevc", "libx265", "hevc"),
            ("av1", "libsvtav1", "av1"),
        };

        /// <summary>Audio codecs the download UI offers, in display order.</summary>
        private static readonly string[] AudioCodecs = { "aac", "opus" };

        /// <summary>Guards the one-shot capability log line (0 = not yet logged).</summary>
        private static int _capabilitiesLogged;

        private readonly IMediaEncoder _mediaEncoder;
        private readonly IConfigurationManager _configurationManager;
        private readonly ILogger<TranscodeDownloaderController> _logger;

        public TranscodeDownloaderController(
            IMediaEncoder mediaEncoder,
            IConfigurationManager configurationManager,
            ILogger<TranscodeDownloaderController> logger)
        {
            _mediaEncoder = mediaEncoder;
            _configurationManager = configurationManager;
            _logger = logger;
        }

        /// <summary>
        /// GET /TranscodeDownloader/ClientScript — returns the embedded plugin.js.
        /// </summary>
        [HttpGet("ClientScript")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Produces("application/javascript")]
        public ActionResult GetClientScript()
        {
            var stream = typeof(TranscodeDownloaderController).Assembly
                .GetManifestResourceStream(ResourcePrefix + "plugin.js");

            if (stream is null) return NotFound();

            return File(stream, "application/javascript");
        }

        /// <summary>
        /// GET /TranscodeDownloader/strings/{locale}.json — returns the translation bundle for the given locale.
        /// Supported locales: en-us, de, fr, es, zh-cn, nl.
        /// </summary>
        [HttpGet("strings/{locale}.json")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Produces("application/json")]
        public ActionResult GetStrings(string locale)
        {
            if (!SupportedLocales.Contains(locale)) return NotFound();

            var stream = typeof(TranscodeDownloaderController).Assembly
                .GetManifestResourceStream(ResourcePrefix + "strings." + locale + ".json");

            if (stream is null) return NotFound();

            return File(stream, "application/json");
        }

        /// <summary>
        /// GET /TranscodeDownloader/Codecs — reports which video/audio codecs this server can
        /// actually encode with, and which the administrator permits.
        /// </summary>
        [HttpGet("Codecs")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Produces("application/json")]
        public ActionResult<CodecCapabilitiesDto> GetCodecs()
        {
            var options = _configurationManager.GetEncodingOptions();

            var result = new CodecCapabilitiesDto
            {
                VideoCodecs = VideoCodecs
                    .Select(c => ResolveVideoCodec(c.Codec, c.SoftwareEncoder, c.HardwarePrefix, options))
                    .ToList(),
                AudioCodecs = AudioCodecs.Select(ResolveAudioCodec).ToList(),
            };

            // Logged once per process so support tickets can be diagnosed from the server log.
            if (Interlocked.Exchange(ref _capabilitiesLogged, 1) == 0)
            {
                _logger.LogInformation(
                    "[TranscodeDownloader] Codec capabilities (hwaccel={HardwareAcceleration}, hwEncoding={HardwareEncoding}): {Capabilities}",
                    options.HardwareAccelerationType,
                    options.EnableHardwareEncoding,
                    Describe(result));
            }

            return result;
        }

        /// <summary>
        /// GET /TranscodeDownloader/Download/{itemId} — proxies the server's own transcode
        /// stream so the response carries a <c>Content-Disposition</c> filename. Used by the
        /// Android browser handoff (and any direct link), which otherwise lands as
        /// <c>stream.mp4</c> because Jellyfin's stream endpoint sends no filename.
        /// Query params are the stream params (MediaSourceId, VideoBitrate, …, PlaySessionId,
        /// DeviceId) plus <c>filename</c>; <c>ApiKey</c> is accepted for auth and stripped
        /// before proxying to avoid dual-auth rejection on 12.x.
        /// </summary>
        [HttpGet("Download/{itemId}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> DownloadFile(
            string itemId,
            [FromQuery] string? filename,
            CancellationToken cancellationToken)
        {
            var forwarded = new Dictionary<string, StringValues>(StringComparer.OrdinalIgnoreCase);
            foreach (var kv in Request.Query)
            {
                if (kv.Key.Equals("filename", StringComparison.OrdinalIgnoreCase)
                    || kv.Key.Equals("apikey", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                forwarded[kv.Key] = kv.Value;
            }

            // Same box: Jellyfin's HTTP port serves the stream endpoint.
            var port = Request.Host.Port ?? 8096;
            var url = "http://localhost:" + port + "/Videos/" + itemId + "/stream.mp4" + QueryString.Create(forwarded);

            // Deliberately not disposed: the response stream is consumed by FileStreamResult
            // after this method returns. Serial download queue means one live client at a time.
            var http = new HttpClient { Timeout = Timeout.InfiniteTimeSpan };
            if (Request.Headers.TryGetValue("Authorization", out var auth))
            {
                http.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", (string?)auth);
            }

            HttpResponseMessage upstream;
            try
            {
                upstream = await http.GetAsync(url, HttpCompletionOption.ResponseHeadersRead, cancellationToken).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "[TranscodeDownloader] Transcode proxy request failed for item {ItemId}", itemId);
                return StatusCode(StatusCodes.Status502BadGateway);
            }

            if (!upstream.IsSuccessStatusCode)
            {
                upstream.Dispose();
                http.Dispose();
                return StatusCode((int)upstream.StatusCode);
            }

            var stream = await upstream.Content.ReadAsStreamAsync(cancellationToken).ConfigureAwait(false);
            return File(stream, "video/mp4", SanitizeFileName(filename), enableRangeProcessing: true);
        }

        /// <summary>
        /// Filenames arrive from client-side metadata; strip what filesystems forbid.
        /// </summary>
        private static string SanitizeFileName(string? filename)
        {
            if (string.IsNullOrWhiteSpace(filename)) return "download.mp4";
            var name = System.IO.Path.GetFileName(filename.Trim());
            foreach (var c in System.IO.Path.GetInvalidFileNameChars())
            {
                name = name.Replace(c.ToString(), string.Empty);
            }

            name = name.Trim();
            if (name.Length > 120) name = name.Substring(0, 120);
            return string.IsNullOrEmpty(name) ? "download.mp4" : name;
        }

        /// <summary>
        /// Mirrors <c>EncodingHelper.GetH26xOrAv1Encoder</c>: a hardware encoder is used only when
        /// hardware acceleration is configured, hardware encoding is enabled, and FFmpeg has it;
        /// otherwise the software encoder is used. Jellyfin returns that software encoder
        /// *without* probing it, which is why the probe happens here — an unprobed missing encoder
        /// means the request is accepted and the transcode then dies mid-stream.
        /// </summary>
        private CodecCapabilityDto ResolveVideoCodec(string codec, string softwareEncoder, string hardwarePrefix, EncodingOptions options)
        {
            var allowedByAdmin = IsAllowedByAdmin(codec, options);
            var accel = options.HardwareAccelerationType;

            if (accel != HardwareAccelerationType.none && options.EnableHardwareEncoding)
            {
                var hardwareEncoder = hardwarePrefix + "_" + accel.ToString().ToLowerInvariant();
                if (SupportsEncoder(hardwareEncoder))
                {
                    return new CodecCapabilityDto
                    {
                        Codec = codec,
                        Encoder = hardwareEncoder,
                        IsHardware = true,
                        IsSupported = true,
                        IsAllowedByAdmin = allowedByAdmin,
                    };
                }
            }

            return new CodecCapabilityDto
            {
                Codec = codec,
                Encoder = softwareEncoder,
                IsHardware = false,
                IsSupported = SupportsEncoder(softwareEncoder),
                IsAllowedByAdmin = allowedByAdmin,
            };
        }

        /// <summary>
        /// Mirrors <c>EncodingHelper.GetAudioEncoder</c>. There is no administrator toggle for
        /// audio codecs, so availability is purely an FFmpeg question.
        /// </summary>
        private CodecCapabilityDto ResolveAudioCodec(string codec)
        {
            var encoder = codec switch
            {
                "aac" => SupportsEncoder("libfdk_aac") ? "libfdk_aac" : "aac",
                "opus" => "libopus",
                _ => codec,
            };

            return new CodecCapabilityDto
            {
                Codec = codec,
                Encoder = encoder,
                IsHardware = false,
                IsSupported = SupportsEncoder(encoder),
                IsAllowedByAdmin = true,
            };
        }

        /// <summary>
        /// Probes FFmpeg for an encoder. Treats a probe failure (e.g. FFmpeg not yet validated)
        /// as "unavailable" rather than failing the whole request.
        /// </summary>
        private bool SupportsEncoder(string encoder)
        {
            try
            {
                return _mediaEncoder.SupportsEncoder(encoder);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "[TranscodeDownloader] Could not probe FFmpeg encoder {Encoder}", encoder);
                return false;
            }
        }

        private static bool IsAllowedByAdmin(string codec, EncodingOptions options) => codec switch
        {
            "hevc" => options.AllowHevcEncoding,
            "av1" => options.AllowAv1Encoding,
            _ => true,
        };

        private static string Describe(CodecCapabilitiesDto capabilities) => string.Join(
            ", ",
            capabilities.VideoCodecs.Concat(capabilities.AudioCodecs).Select(c => string.Concat(
                c.Codec,
                "=",
                c.Encoder,
                c.IsHardware ? " (hw" : " (sw",
                c.IsSupported ? ", available" : ", missing",
                c.IsAllowedByAdmin ? ")" : ", disabled by admin)")));
    }
}
