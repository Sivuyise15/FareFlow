using Microsoft.AspNetCore.Mvc;
using Nexa.Core.Services;

namespace Nexa.API.Controllers;

[ApiController]
[Route("api/email-accounts")]
public class EmailAccountsController : ControllerBase
{
    private readonly ConnectEmailAccountService _connectService;

    public EmailAccountsController(ConnectEmailAccountService connectService)
    {
        _connectService = connectService;
    }

    [HttpPost("connect")]
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