using Nexa.Domain.Entities;
public interface ISummarySerice
{
    Task<SpendSummary> GetSummaryByUserIdAsync(Guid userId);
    Task UpdateSummaryAsync(SpendSummary summary);
}