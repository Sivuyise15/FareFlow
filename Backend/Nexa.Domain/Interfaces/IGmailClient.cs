using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface IGmailClient
{
    Task<IEnumerable<RawEmail>> FetchRideReceiptsAsync(string accessToken, DateTime from);
}