using Nexa.Domain.Entities;
public interface ISummarySerice
{
    Task<SpendSummary> GetSummaryByUserAsync(EmailAccount emailAccount);
    Task UpdateSummaryAsync(SpendSummary summary);
}