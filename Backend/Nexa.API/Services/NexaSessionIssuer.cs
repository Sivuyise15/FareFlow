using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Nexa.Domain.Entities;

namespace Nexa.API.Services;

public sealed class NexaSessionIssuer
{
    private readonly string _issuer;
    private readonly string _audience;
    private readonly SigningCredentials _signingCredentials;

    public NexaSessionIssuer(IConfiguration configuration)
    {
        var signingKey = configuration["Jwt:SigningKey"];
        if (string.IsNullOrWhiteSpace(signingKey) || Encoding.UTF8.GetByteCount(signingKey) < 32)
            throw new InvalidOperationException("Jwt:SigningKey must be configured with at least 32 bytes.");

        _issuer = configuration["Jwt:Issuer"] ?? "Nexa.API";
        _audience = configuration["Jwt:Audience"] ?? "Nexa.Mobile";
        _signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
            SecurityAlgorithms.HmacSha256);
    }

    public NexaSession CreateSession(User user)
    {
        var expiresAt = DateTime.UtcNow.AddHours(1);
        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
                new Claim(ClaimTypes.Email, user.email)
            },
            expires: expiresAt,
            signingCredentials: _signingCredentials);

        return new NexaSession(
            new JwtSecurityTokenHandler().WriteToken(token),
            expiresAt,
            new NexaSessionUser(user.id.ToString(), user.email, "google"));
    }
}

public sealed record NexaSession(string AccessToken, DateTime ExpiresAt, NexaSessionUser User);
public sealed record NexaSessionUser(string Id, string Email, string Provider);
