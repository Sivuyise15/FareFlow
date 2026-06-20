internal interface ISummarySerice
{
    Task<SpendSummary> GetSummaryByUserIdAsync(Guid userId);
    Task UpdateSummaryAsync(SpendSummary summary);
}