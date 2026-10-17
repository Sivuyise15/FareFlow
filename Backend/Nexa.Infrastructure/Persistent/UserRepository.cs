using Nexa.Domain.Entities;
using Nexa.Domain.Interfaces;
using Dapper;
using Npgsql;
using System;
using Microsoft.Extensions.Configuration;

namespace Nexa.Infrastructure.Persistence
{
    public class UserRepository: IUserRepository
    {
        private readonly string _connectionString;
        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration["ConnectionStrings:DefaultConnection"];
        }

        public async Task<User> FindOrCreateGoogleUserAsync(string googleSubject, string email, string? name, string? surname)
        {
            string query = @"
                INSERT INTO ""Users"" (google_subject, email, name, surname)
                VALUES (@GoogleSubject, @Email, @Name, @Surname)
                ON CONFLICT (google_subject) DO UPDATE
                SET email = EXCLUDED.email,
                    name = COALESCE(EXCLUDED.name, ""Users"".name),
                    surname = COALESCE(EXCLUDED.surname, ""Users"".surname)
                RETURNING *;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QuerySingleAsync<User>(query, new
            {
                GoogleSubject = googleSubject,
                Email = email,
                Name = name,
                Surname = surname
            });
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            string query = "SELECT * FROM \"Users\" WHERE id = @Id";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QuerySingleOrDefaultAsync<User>(query, new { Id = userId });
        }
    }
}
