internal interface ITripRepository
{
    Task<Trip> GetTripByIdAsync(Guid tripId);
    Task<IEnumerable<Trip>> GetTripsByUserIdAsync(Guid userId);
    Task AddTripAsync(Trip trip);
    Task UpdateTripAsync(Trip trip);
    Task DeleteTripAsync(Guid tripId);
}