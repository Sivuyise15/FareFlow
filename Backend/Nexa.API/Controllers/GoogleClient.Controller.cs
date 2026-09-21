using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Nexa.Core.Services;
using System.Security.Cryptography;

namespace Nexa.API.Controllers;

[ApiController]
[Route("api/auth")]
public class EmailAccountsController : ControllerBase
{
    private readonly ConnectEmailAccountService _connectService;
    private readonly string _clientId;
    private readonly string _clientSecret;

    public EmailAccountsController(IConfiguration configuration, ConnectEmailAccountService connectService)
    {
        _connectService = connectService;
        _clientId = configuration["GoogleOAuth:ClientId"];
        _clientSecret = configuration["GoogleOAuth:ClientSecret"];
    }

    [HttpGet("google/start")]
    public async Task<IActionResult> GoogleStart([FromQuery] string redirectUri)
    {

        if (string.IsNullOrWhiteSpace(_clientId))
            return Problem("Google ClientId is not configured.");

        if (string.IsNullOrWhiteSpace(redirectUri))
            return BadRequest("redirectUri is required.");

        // Generate a random state for this OAuth attempt.
        var stateBytes = RandomNumberGenerator.GetBytes(32);
        var state = Convert.ToBase64String(stateBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");

        var query = new Dictionary<string, string?>
        {
            ["client_id"] = _clientId,
            ["redirect_uri"] = redirectUri,
            ["response_type"] = "code",
            ["scope"] =
                "https://www.googleapis.com/auth/gmail.readonly " +
                "https://www.googleapis.com/auth/userinfo.email",
            ["state"] = state,
            ["access_type"] = "offline",
            ["prompt"] = "consent"
        };

        var googleUrl = QueryHelpers.AddQueryString(
            "https://accounts.google.com/o/oauth2/v2/auth",
            query
        );

        return Redirect(googleUrl);
    }

    [HttpPost("google/callback")]
    public async Task<IActionResult> Connect([FromBody] ConnectEmailRequest request)
    {
        await _connectService.ExecuteAsync(
            request.UserId,
            request.AuthCode,
            request.EmailAddress,
            request.Name,
            request.Surname);

        return Ok("Email account connected successfully");
    }
}

public class ConnectEmailRequest
{
    public int UserId { get; set; }
    public string AuthCode { get; set; }
    public string EmailAddress { get; set; }
    public string? Name { get; set; }
    public string? Surname { get; set; }
}