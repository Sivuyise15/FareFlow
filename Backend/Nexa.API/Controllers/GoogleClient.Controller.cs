using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Caching.Memory;
using Nexa.API.Services;
using Nexa.Core.Services;

namespace Nexa.API.Controllers;

[ApiController]
[Route("api")]
public class GoogleAuthController : ControllerBase
{
    private static readonly TimeSpan OAuthStateLifetime = TimeSpan.FromMinutes(10);
    private readonly ConnectEmailAccountService _connectService;
    private readonly NexaSessionIssuer _sessionIssuer;
    private readonly IMemoryCache _cache;
    private readonly string? _clientId;
    private readonly string? _googleRedirectUri;

    public GoogleAuthController(
        IConfiguration configuration,
        ConnectEmailAccountService connectService,
        NexaSessionIssuer sessionIssuer,
        IMemoryCache cache)
    {
        _connectService = connectService;
        _sessionIssuer = sessionIssuer;
        _cache = cache;
        _clientId = configuration["Google:ClientId"];
        _googleRedirectUri = configuration["Google:RedirectUri"];
    }

    [AllowAnonymous]
    [HttpGet("auth/google/auth/start")]
    public IActionResult GoogleStart([FromQuery, Required] string redirectUri)
    {
        if (string.IsNullOrWhiteSpace(_clientId))
            return Problem("Google ClientId is not configured.");

        if (string.IsNullOrWhiteSpace(_googleRedirectUri) || !Uri.TryCreate(_googleRedirectUri, UriKind.Absolute, out _))
            return Problem("Google RedirectUri is not configured with an absolute URI.");
        // What I copied to come here below

        var stateBytes = RandomNumberGenerator.GetBytes(32);
        var state = WebEncoders.Base64UrlEncode(stateBytes);
        _cache.Set(StateCacheKey(state), new OAuthAttempt(redirectUri), OAuthStateLifetime);

        var query = new Dictionary<string, string?>
        {
            ["client_id"] = _clientId,
            ["redirect_uri"] = _googleRedirectUri,
            ["response_type"] = "code",
            ["scope"] = "openid email profile https://www.googleapis.com/auth/gmail.readonly",
            ["state"] = state,
            ["access_type"] = "offline",
            ["prompt"] = "consent"
        };

        return Redirect(QueryHelpers.AddQueryString("https://accounts.google.com/o/oauth2/v2/auth", query));
    }

    [AllowAnonymous]
    [HttpGet("auth/google/auth/redirect")]
    public IActionResult GoogleRedirect(
        [FromQuery] string? code,
        [FromQuery] string? state,
        [FromQuery] string? error,
        [FromQuery(Name = "error_description")] string? errorDescription)
    {
        if (string.IsNullOrWhiteSpace(state) ||
            !_cache.TryGetValue<OAuthAttempt>(StateCacheKey(state), out var attempt) ||
            attempt is null)
        {
            return BadRequest("OAuth state is invalid or expired.");
        }

        var appQuery = new Dictionary<string, string?> { ["state"] = state };
        if (!string.IsNullOrWhiteSpace(error))
        {
            _cache.Remove(StateCacheKey(state));
            appQuery["error"] = error;
            appQuery["error_description"] = errorDescription;
        }
        else if (!string.IsNullOrWhiteSpace(code))
        {
            appQuery["code"] = code;
        }
        else
        {
            return BadRequest("Google did not return an authorization code.");
        }

        return Redirect(QueryHelpers.AddQueryString(attempt.RedirectUri, appQuery));
    }

    [AllowAnonymous]
    [HttpPost("auth/google/auth/callback")]
    public async Task<IActionResult> CompleteGoogleSignIn([FromBody] GoogleOAuthCompleteRequest request)
    {
        var stateKey = StateCacheKey(request.State);
        if (!_cache.TryGetValue<OAuthAttempt>(stateKey, out var attempt) || attempt is null)
            return BadRequest("OAuth state is invalid, expired, or already used.");

        _cache.Remove(stateKey);

        if (string.IsNullOrWhiteSpace(_googleRedirectUri))
            return Problem("Google RedirectUri is not configured.");

        var user = await _connectService.ConnectGoogleAccountAsync(request.Code, _googleRedirectUri);
        return Ok(_sessionIssuer.CreateSession(user));
    }

    [Authorize]
    [HttpGet("me/email-connections/google")]
    public async Task<IActionResult> GetGoogleConnection()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var account = await _connectService.GetGoogleAccountAsync(userId);
        return Ok(new GoogleConnectionStatus(account is not null, account?.email_address));
    }

    [Authorize]
    [HttpDelete("me/email-connections/google")]
    public async Task<IActionResult> DisconnectGoogle()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        await _connectService.DisconnectGoogleAccountAsync(userId);
        return NoContent();
    }

    private bool TryGetUserId(out int userId)
    {
        return int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out userId);
    }

    private static string StateCacheKey(string state) => $"google-oauth-state:{state}";

    private sealed record OAuthAttempt(string RedirectUri);
}

public sealed class GoogleOAuthCompleteRequest
{
    [Required]
    public string Code { get; set; } = string.Empty;

    [Required]
    public string State { get; set; } = string.Empty;
}

public sealed record GoogleConnectionStatus(bool Connected, string? EmailAddress);