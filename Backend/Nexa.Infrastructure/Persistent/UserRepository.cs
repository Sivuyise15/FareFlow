using Nexa.Domain.Entities;
using Nexa.Domain.Interfaces;
using Dapper;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Nexa.Infrastructure.Persistence
{
    public class UserRepository: IUserRepository
    {
        private readonly string _connectionString;
        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // creating a new postgresql connection using the connection string
        private IDbConnection CreateConnection() => new NpgsqlConnection(_connectionString);

        public async Task<User> GetUserByIdAsync(int userId)
        {
            string query = "SELECT * FROM Users WHERE Id = @Id";

            if (userId == null)
            {
                throw new ArgumentNullException(nameof(userId));
            }
            if (int.TryParse(userId.ToString(), out int userIdInt) && userIdInt < 0)
            {
                throw new ArgumentException("User ID cannot be negative");
            }
            try
            {
                using var connection = CreateConnection();
                return await connection.QuerySingleOrDefaultAsync<User>(query, new { Id = userId });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while fetching the user: {ex.Message}");
                throw;
            }
        }
    }
}
