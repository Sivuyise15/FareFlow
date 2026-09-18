using Nexa.Domain.Entities;
using Nexa.Infrastructure.Interfaces;
using Dapper;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nexa.Infrastructure.Persistent
{
    internal class UserRepository: IUserRepository
    {
        private readonly string _connectionString;
        public UserRepository(String connectionString)
        {
            _connectionString = connectionString;
        }

        // creating a new postgresql connection using the connection string
        private IDbConnection CreateConnection() => new NpgsqlConnection(_connectionString);

        public async Task<User> GetByIdAsync(string userId)
        {
            string query = "SELECT * FROM Users WHERE Id = @Id";

            if (userId == null)
            {
                throw new ArgumentNullException(nameof(userId));
            }

            if (userId.Length == 0)
            {
                throw new ArgumentException("User ID cannot be empty");
            }

            if (int.TryParse(userId, out int userIdInt) && userIdInt < 0)
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
            }
        }
    }
}
