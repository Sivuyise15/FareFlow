using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface ISummarySerice
{
    Task<SpendSummary> GetSummaryByUserAsync(EmailAccount emailAccount);
    Task UpdateSummaryAsync(SpendSummary summary);
}